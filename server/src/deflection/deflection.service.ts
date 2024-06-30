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
    const q = new Decimal(parameters.beamWeightInKg).times(9.81); // Convert weight to force
    const L = new Decimal(parameters.beamLengthInMm).div(1000); // Convert mm to meters
    const E = this.youngsModulus;
    const I = new Decimal(parameters.beamWidthInMm)
      .times(new Decimal(parameters.beamHeightInMm).pow(3))
      .div(12)
      .div(1e12); // Convert mm^4 to meters^4

    const x = new Decimal(parameters.deformationLocationInMm).div(1000); // Convert mm to meters

    const term1 = q.times(L.pow(4)).div(24).div(E.times(I));
    const term2 = x
      .div(L)
      .minus(new Decimal(2).times(x.pow(3)).div(L.pow(3)))
      .plus(x.pow(4).div(L.pow(4)));

    const scenarioOne = term1.times(term2);

    const deflectionEntity = new DeflectionEntity();
    deflectionEntity.beamWeightInKg = parameters.beamWeightInKg;
    deflectionEntity.beamLengthInMm = parameters.beamLengthInMm;
    deflectionEntity.beamWidthInMm = parameters.beamWidthInMm;
    deflectionEntity.beamHeightInMm = parameters.beamHeightInMm;
    deflectionEntity.deformationLocationInMm =
      parameters.deformationLocationInMm;
    deflectionEntity.deflectionOne = scenarioOne.toNumber();

    // Log the entity before saving
    console.log('Deflection entity before saving:', deflectionEntity);

    const savedEntity = await this.deflectionRepository.save(deflectionEntity);

    // Log the saved entity
    console.log('Saved deflection entity:', savedEntity);

    const output: ScenarioOneBeamOutput = {
      id: savedEntity.id,
      beamWidthInMm: savedEntity.beamWidthInMm,
      beamHeightInMm: savedEntity.beamHeightInMm,
      beamLengthInMm: savedEntity.beamLengthInMm,
      beamWeightInKg: savedEntity.beamWeightInKg,
      deformationLocationInMm: savedEntity.deformationLocationInMm,
      deflectionOne: savedEntity.deflectionOne,
    };

    return output;
  }

  async calculateScenarioTwoBeam(
    parameters: ScenarioTwoBeamInputDto,
  ): Promise<ScenarioTwoBeamOutput> {
    const P = new Decimal(parameters.force); // Force in N
    const b = new Decimal(parameters.beamWidthInMm).div(1000); // Convert mm to meters
    const L = new Decimal(parameters.beamLengthInMm).div(1000); // Convert mm to meters
    const E = this.youngsModulus;
    const I = new Decimal(parameters.beamWidthInMm)
      .times(new Decimal(parameters.beamHeightInMm).pow(3))
      .div(12)
      .div(1e12); // Convert mm^4 to meters^4

    const x = new Decimal(parameters.deformationLocationInMm).div(1000); // Convert mm to meters
    const a = new Decimal(parameters.mobileForceLocationInMm).div(1000); // Convert mm to meters

    let scenarioTwo: Decimal;

    if (x.greaterThan(0) && x.lessThan(a)) {
      scenarioTwo = P.times(b)
        .times(x)
        .div(6)
        .div(L)
        .div(E.times(I))
        .times(L.pow(2).minus(b.pow(2)).minus(x.pow(2)));
    } else if (x.greaterThan(a) && x.lessThan(L)) {
      scenarioTwo = P.times(b)
        .times(x)
        .div(6)
        .div(L)
        .div(E.times(I))
        .times(
          L.div(b)
            .times(x.minus(a).pow(3))
            .plus(L.pow(2).minus(b.pow(2)).times(x).minus(x.pow(3))),
        );
    } else {
      scenarioTwo = new Decimal(0);
    }

    const deflectionEntity = new DeflectionEntity();
    deflectionEntity.beamWeightInKg = parameters.beamWeightInKg;
    deflectionEntity.beamLengthInMm = parameters.beamLengthInMm;
    deflectionEntity.beamWidthInMm = parameters.beamWidthInMm;
    deflectionEntity.beamHeightInMm = parameters.beamHeightInMm;
    deflectionEntity.deformationLocationInMm =
      parameters.deformationLocationInMm;
    deflectionEntity.mobileForceLocationInMm =
      parameters.mobileForceLocationInMm;
    deflectionEntity.force = parameters.force;
    deflectionEntity.deflectionTwo = scenarioTwo.toNumber();

    const savedEntity = await this.deflectionRepository.save(deflectionEntity);

    const output: ScenarioTwoBeamOutput = {
      id: savedEntity.id,
      beamWidthInMm: savedEntity.beamWidthInMm,
      beamHeightInMm: savedEntity.beamHeightInMm,
      beamLengthInMm: savedEntity.beamLengthInMm,
      beamWeightInKg: savedEntity.beamWeightInKg,
      deformationLocationInMm: savedEntity.deformationLocationInMm,
      mobileForceLocationInMm: savedEntity.mobileForceLocationInMm,
      force: savedEntity.force,
      deflectionTwo: savedEntity.deflectionTwo,
    };

    return output;
  }

  async calculateScenarioThreeBeam(
    parameters: ScenarioThreeBeamInputDto,
  ): Promise<ScenarioThreeBeamOutput> {
    const q = new Decimal(parameters.beamWeightInKg).times(9.81); // Convert weight to force
    const L = new Decimal(parameters.beamLengthInMm).div(1000); // Convert mm to meters
    const E = this.youngsModulus;
    const I = new Decimal(parameters.beamWidthInMm)
      .times(new Decimal(parameters.beamHeightInMm).pow(3))
      .div(12)
      .div(1e12); // Convert mm^4 to meters^4

    const x = new Decimal(parameters.deformationLocationInMm).div(1000); // Convert mm to meters
    const a = new Decimal(parameters.mobileForceLocationInMm).div(1000); // Convert mm to meters
    const P = new Decimal(parameters.force); // Force in N
    const b = new Decimal(parameters.beamWidthInMm).div(1000); // Convert mm to meters

    const term1 = q.times(L.pow(4)).div(24).div(E.times(I));
    const term2 = x
      .div(L)
      .minus(new Decimal(2).times(x.pow(3)).div(L.pow(3)))
      .plus(x.pow(4).div(L.pow(4)));

    const scenarioOne = term1.times(term2);

    let scenarioTwo: Decimal;

    if (x.greaterThan(0) && x.lessThan(a)) {
      scenarioTwo = P.times(b)
        .times(x)
        .div(6)
        .div(L)
        .div(E.times(I))
        .times(L.pow(2).minus(b.pow(2)).minus(x.pow(2)));
    } else if (x.greaterThan(a) && x.lessThan(L)) {
      scenarioTwo = P.times(b)
        .times(x)
        .div(6)
        .div(L)
        .div(E.times(I))
        .times(
          L.div(b)
            .times(x.minus(a).pow(3))
            .plus(L.pow(2).minus(b.pow(2)).times(x).minus(x.pow(3))),
        );
    } else {
      scenarioTwo = new Decimal(0);
    }

    const scenarioThreeResult = scenarioOne.plus(scenarioTwo);

    const deflectionEntity = new DeflectionEntity();
    deflectionEntity.beamWidthInMm = parameters.beamWidthInMm;
    deflectionEntity.beamHeightInMm = parameters.beamHeightInMm;
    deflectionEntity.beamLengthInMm = parameters.beamLengthInMm;
    deflectionEntity.beamWeightInKg = parameters.beamWeightInKg;
    deflectionEntity.mobileForceLocationInMm =
      parameters.mobileForceLocationInMm;
    deflectionEntity.force = parameters.force;
    deflectionEntity.deformationLocationInMm =
      parameters.deformationLocationInMm;
    deflectionEntity.deflectionThree = scenarioThreeResult.toNumber();

    const savedEntity = await this.deflectionRepository.save(deflectionEntity);

    const output: ScenarioThreeBeamOutput = {
      id: savedEntity.id,
      beamWidthInMm: savedEntity.beamWidthInMm,
      beamHeightInMm: savedEntity.beamHeightInMm,
      beamLengthInMm: savedEntity.beamLengthInMm,
      beamWeightInKg: savedEntity.beamWeightInKg,
      mobileForceLocationInMm: savedEntity.mobileForceLocationInMm,
      force: savedEntity.force,
      deformationLocationInMm: savedEntity.deformationLocationInMm,
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
        'deflection.beamWeightInKg',
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
      beamWidthInMm: entity.beamWidthInMm,
      beamHeightInMm: entity.beamHeightInMm,
      beamLengthInMm: entity.beamLengthInMm,
      beamWeightInKg: entity.beamWeightInKg,
      mobileForceLocationInMm: entity.mobileForceLocationInMm,
      force: entity.force,
      deformationLocationInMm: entity.deformationLocationInMm,
      deflectionOne: entity.deflectionOne,
      deflectionTwo: entity.deflectionTwo,
      deflectionThree: entity.deflectionThree,
    }));

    return result;
  }
}
