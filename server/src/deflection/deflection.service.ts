import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Decimal from 'decimal.js';
import { ScenarioOneBeamInputDto } from 'server/src/dtos/scenario-one-beam-input.dto';
import { ScenarioThreeBeamInputDto } from 'server/src/dtos/scenario-three-beam-input.dto';
import { ScenarioTwoBeamInputDto } from 'server/src/dtos/scenario-two-beam-input.dto';
import { DeflectionEntity } from 'server/src/entities/deflection.entity';
import { GetBeamOutput } from 'server/src/interface/output/get-beam-output';
import { ScenarioOneBeamOutput } from 'server/src/interface/output/scenario-one-beam-output';
import { ScenarioThreeBeamOutput } from 'server/src/interface/output/scenario-three-beam-output';
import { ScenarioTwoBeamOutput } from 'server/src/interface/output/scenario-two-beam-output';
import { Repository } from 'typeorm';

@Injectable()
export class DeflectionService {
  private readonly youngsModulus = new Decimal('2.1e11');
  constructor(
    @InjectRepository(DeflectionEntity)
    private readonly deflectionRepository: Repository<DeflectionEntity>,
  ) {}

  async calculateScenarioOneBeam(
    parameters: ScenarioOneBeamInputDto,
  ): Promise<ScenarioOneBeamOutput> {
    const q = new Decimal(parameters.force); // Convert weight to force (N)
    const L = new Decimal(parameters.beamLengthInM); // Beam length in meters (m)
    const E = this.youngsModulus; // Young's modulus in N/m^2 (Pascals)

    // Moment of inertia I = B * H^3 / 12
    const b = new Decimal(parameters.mobileSupportPositionInM); // Beam width in meters (m)
    const H = new Decimal(parameters.beamHeightInM); // Beam height in meters (m)
    const I = b.times(H.pow(3)).div(12); // Moment of inertia in meters^4 (m^4)

    // Deformation location in meters (m)
    const x = new Decimal(parameters.deformationLocationInM); // Deformation location in meters (m)

    // Formula: (q*L^4)/(24*(E*I))*(x/L-2*(x^3)/(L^3)+(x^4)/(L^4))
    const term1 = q.times(L.pow(4)).div(24).div(E.times(I));
    const term2 = x
      .div(L)
      .minus(new Decimal(2).times(x.pow(3)).div(L.pow(3)))
      .plus(x.pow(4).div(L.pow(4)));

    const scenarioOne = term1.times(term2);

    // Create and save the DeflectionEntity with results in meters (m)
    const deflectionEntity = new DeflectionEntity();
    deflectionEntity.force = parameters.force;
    deflectionEntity.beamLengthInM = parameters.beamLengthInM;
    deflectionEntity.beamWidthInM = parameters.mobileSupportPositionInM;
    deflectionEntity.beamHeightInM = parameters.beamHeightInM;
    deflectionEntity.deformationLocationInM = parameters.deformationLocationInM;
    deflectionEntity.deflectionOne = scenarioOne.toNumber(); // Deflection in meters (m)

    // Save the entity in the database
    const savedEntity = await this.deflectionRepository.save(deflectionEntity);

    // Prepare output with results in meters (m)
    const output: ScenarioOneBeamOutput = {
      id: savedEntity.id,
      beamWidthInM: savedEntity.beamWidthInM,
      beamHeightInM: savedEntity.beamHeightInM,
      beamLengthInM: savedEntity.beamLengthInM,
      mobileSupportPositionInM: savedEntity.mobileSupportPositionInM,
      force: savedEntity.force,
      deformationLocationInM: savedEntity.deformationLocationInM,
      deflectionOne: savedEntity.deflectionOne,
    };

    return output;
  }

  async calculateScenarioTwoBeam(
    parameters: ScenarioTwoBeamInputDto,
  ): Promise<ScenarioTwoBeamOutput> {
    const P = new Decimal(parameters.force); // Force in Newtons (N)
    const b = new Decimal(parameters.mobileSupportPositionInM); // Beam width in meters (m)
    const L = new Decimal(parameters.beamLengthInM); // Beam length in meters (m)
    const E = this.youngsModulus; // Young's modulus in N/m^2 (Pascals)
    const B = new Decimal(parameters.beamWidthInM);
    // Moment of inertia I = B * H^3 / 12
    const H = new Decimal(parameters.beamHeightInM); // Beam height in meters (m)
    const I = B.times(H.pow(3)).div(12); // Moment of inertia in meters^4 (m^4)

    // Deformation and mobile force location in meters (m)
    const x = new Decimal(parameters.deformationLocationInM); // Deformation location in meters (m)
    const a = new Decimal(parameters.mobileForceLocationInM); // Mobile force location in meters (m)

    let scenarioTwo: Decimal;

    if (x < a) {
      scenarioTwo = P.times(b)
        .times(x)
        .div(6)
        .div(L)
        .div(E.times(I))
        .times(L.pow(2).minus(b.pow(2)).minus(x.pow(2)))
        .times(1000); // Convert to millimeters (mm)
    } else {
      scenarioTwo = P.times(b)
        .div(6)
        .div(L)
        .div(E.times(I))
        .times(
          L.div(b)
            .times(x.minus(a).pow(3))
            .plus(L.pow(2).minus(b.pow(2)).times(x).minus(x.pow(3))),
        )
        .times(1000); // Convert to millimeters (mm)
    }

    // Create and save the DeflectionEntity with results in meters (m)
    const deflectionEntity = new DeflectionEntity();
    deflectionEntity.beamWidthInM = parameters.beamWidthInM;
    deflectionEntity.beamHeightInM = parameters.beamHeightInM;
    deflectionEntity.beamLengthInM = parameters.beamLengthInM;
    deflectionEntity.mobileSupportPositionInM =
      parameters.mobileSupportPositionInM;
    deflectionEntity.deformationLocationInM = parameters.deformationLocationInM;
    deflectionEntity.mobileForceLocationInM = parameters.mobileForceLocationInM;
    deflectionEntity.force = parameters.force;
    deflectionEntity.deflectionTwo = scenarioTwo.toNumber(); // Deflection in millimeters (mm)

    // Save the entity in the database
    const savedEntity = await this.deflectionRepository.save(deflectionEntity);

    // Prepare output with results in meters (m)
    const output: ScenarioTwoBeamOutput = {
      id: savedEntity.id,
      beamWidthInM: savedEntity.beamWidthInM,
      mobileSupportPositionInM: savedEntity.mobileSupportPositionInM,
      beamHeightInM: savedEntity.beamHeightInM,
      beamLengthInM: savedEntity.beamLengthInM,
      deformationLocationInM: savedEntity.deformationLocationInM,
      mobileForceLocationInM: savedEntity.mobileForceLocationInM,
      force: savedEntity.force,
      deflectionTwo: savedEntity.deflectionTwo,
    };

    return output;
  }

  async calculateScenarioThreeBeam(
    parameters: ScenarioThreeBeamInputDto,
  ): Promise<ScenarioThreeBeamOutput> {
    const L = new Decimal(parameters.beamLengthInM); // Beam length in meters (m)
    const E = this.youngsModulus; // Young's modulus in N/m^2 (Pascals)
    const B = new Decimal(parameters.beamWidthInM);

    // Moment of inertia I = B * H^3 / 12
    const b = new Decimal(parameters.mobileSupportPositionInM); // Beam width in meters (m)
    const H = new Decimal(parameters.beamHeightInM); // Beam height in meters (m)
    const I = B.times(H.pow(3)).div(12); // Moment of inertia in meters^4 (m^4)

    // Deformation and mobile force location in meters (m)
    const x = new Decimal(parameters.deformationLocationInM); // Deformation location in meters (m)
    const a = new Decimal(parameters.mobileForceLocationInM); // Mobile force location in meters (m)
    const P = new Decimal(parameters.force); // Force in Newtons (N)

    // Scenario One calculation
    const term1 = P.times(L.pow(4)).div(24).div(E.times(I));
    const term2 = x
      .div(L)
      .minus(new Decimal(2).times(x.pow(3)).div(L.pow(3)))
      .plus(x.pow(4).div(L.pow(4)));

    const scenarioOne = term1.times(term2);

    // Scenario Two calculation
    let scenarioTwo: Decimal;

    if (x < a) {
      scenarioTwo = P.times(b)
        .times(x)
        .div(6)
        .div(L)
        .div(E.times(I))
        .times(L.pow(2).minus(b.pow(2)).minus(x.pow(2)))
        .times(1000); // Convert to millimeters (mm)
    } else {
      scenarioTwo = P.times(b)
        .div(6)
        .div(L)
        .div(E.times(I))
        .times(
          L.div(b)
            .times(x.minus(a).pow(3))
            .plus(L.pow(2).minus(b.pow(2)).times(x).minus(x.pow(3))),
        )
        .times(1000); // Convert to millimeters (mm)
    }

    // Combine Scenario One and Scenario Two results
    const scenarioThreeResult = scenarioOne.plus(scenarioTwo);

    // Create and save the DeflectionEntity with results in meters (m)
    const deflectionEntity = new DeflectionEntity();
    deflectionEntity.beamWidthInM = parameters.beamWidthInM;
    deflectionEntity.beamHeightInM = parameters.beamHeightInM;
    deflectionEntity.beamLengthInM = parameters.beamLengthInM;
    deflectionEntity.mobileSupportPositionInM =
      parameters.mobileSupportPositionInM;
    deflectionEntity.mobileForceLocationInM = parameters.mobileForceLocationInM;
    deflectionEntity.force = parameters.force;
    deflectionEntity.deformationLocationInM = parameters.deformationLocationInM;
    deflectionEntity.deflectionThree = scenarioThreeResult.toNumber();

    // Save the entity in the database
    const savedEntity = await this.deflectionRepository.save(deflectionEntity);

    // Prepare output with results in meters (m)
    const output: ScenarioThreeBeamOutput = {
      id: savedEntity.id,
      beamWidthInM: savedEntity.beamWidthInM,
      beamHeightInM: savedEntity.beamHeightInM,
      beamLengthInM: savedEntity.beamLengthInM,
      mobileSupportPositionInM: savedEntity.mobileSupportPositionInM,
      mobileForceLocationInM: savedEntity.mobileForceLocationInM,
      force: savedEntity.force,
      deformationLocationInM: savedEntity.deformationLocationInM,
      deflectionThree: savedEntity.deflectionThree,
    };

    return output;
  }

  async viewOne(id: number): Promise<GetBeamOutput> {
    const queryResult = await this.deflectionRepository
      .createQueryBuilder('deflection')
      .where('deflection.id = :id', { id })
      .getOne();

    return queryResult;
  }

  async viewAll(): Promise<GetBeamOutput[]> {
    const queryResult = await this.deflectionRepository
      .createQueryBuilder('deflection')
      .select([
        'deflection.id',
        'deflection.beamWidthInMm',
        'deflection.beamHeightInMm',
        'deflection.beamLengthInMm',
        'deflection.mobileSupportPositionInM',
        'deflection.mobileForceLocationInMm',
        'deflection.force',
        'deflection.deformationLocationInMm',
        'deflection.deflectionOne',
        'deflection.deflectionTwo',
        'deflection.deflectionThree',
      ])
      .getMany();

    const result: GetBeamOutput[] = queryResult.map((entity) => ({
      id: entity.id,
      beamWidthInM: entity.beamWidthInM,
      beamHeightInM: entity.beamHeightInM,
      beamLengthInM: entity.beamLengthInM,
      mobileSupportPositionInM: entity.mobileSupportPositionInM,
      mobileForceLocationInM: entity.mobileForceLocationInM,
      force: entity.force,
      deformationLocationInM: entity.deformationLocationInM,
      deflectionOne: entity.deflectionOne,
      deflectionTwo: entity.deflectionTwo,
      deflectionThree: entity.deflectionThree,
    }));

    return result;
  }
}
