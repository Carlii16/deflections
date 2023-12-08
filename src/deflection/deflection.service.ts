import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Decimal from 'decimal.js';
import { ScenarioOneBeamInputDto } from 'src/dtos/scenario-one-beam-input.dto';
import { ScenarioThreeBeamInputDto } from 'src/dtos/scenario-three-beam-input.dto';
import { ScenarioTwoBeamInputDto } from 'src/dtos/scenario-two-beam-input.dto';
import { DeflectionEntity } from 'src/entities/deflection.entity';
import { ScenarioOneBeamOutput } from 'src/interface/output/scenario-one-beam-output';
import { ScenarioThreeBeamOutput } from 'src/interface/output/scenario-three-beam-output';
import { ScenarioTwoBeamOutput } from 'src/interface/output/scenario-two-beam-output';
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
    const term1 = new Decimal(parameters.beamWeightInKg)
      .times(new Decimal(parameters.beamLengthInMm).pow(4))
      .div(24)
      .times(this.youngsModulus)
      .times(
        new Decimal(parameters.beamWidthInMm)
          .times(new Decimal(parameters.beamHeightInMm).pow(3))
          .div(12),
      );

    const term2 = new Decimal(parameters.deformationLocationInMm)
      .div(parameters.beamLengthInMm)
      .minus(
        new Decimal(2)
          .times(new Decimal(parameters.deformationLocationInMm).pow(3))
          .div(new Decimal(parameters.beamLengthInMm).pow(3)),
      )
      .plus(
        new Decimal(parameters.deformationLocationInMm)
          .pow(4)
          .div(new Decimal(parameters.beamLengthInMm).pow(4)),
      );

    const scenarioOne = term1.times(term2);

    const deflectionEntity = new DeflectionEntity();
    deflectionEntity.beamWeightInKg = parameters.beamWeightInKg;
    deflectionEntity.beamLengthInMm = parameters.beamLengthInMm;
    deflectionEntity.beamWidthInMm = parameters.beamWidthInMm;
    deflectionEntity.beamHeightInMm = parameters.beamHeightInMm;
    deflectionEntity.deformationLocationInMm =
      parameters.deformationLocationInMm;
    deflectionEntity.deflectionOne = scenarioOne.toNumber();

    const savedEntity = await this.deflectionRepository.save(deflectionEntity);

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
    let scenarioTwo: Decimal;

    const commonPart = new Decimal(parameters.force)
      .times(parameters.beamWidthInMm)
      .times(parameters.deformationLocationInMm)
      .div(6)
      .times(parameters.beamLengthInMm)
      .times(this.youngsModulus)
      .times(parameters.beamWidthInMm)
      .times(new Decimal(parameters.beamHeightInMm).pow(3))
      .div(12);

    if (
      new Decimal(0).lessThan(parameters.deformationLocationInMm) &&
      new Decimal(parameters.deformationLocationInMm).lessThan(
        parameters.mobileForceLocationInMm,
      )
    ) {
      scenarioTwo = new Decimal(parameters.force)
        .times(parameters.beamWidthInMm)
        .times(parameters.deformationLocationInMm)
        .div(6)
        .times(parameters.beamLengthInMm)
        .times(this.youngsModulus)
        .times(parameters.beamWidthInMm)
        .times(new Decimal(parameters.beamHeightInMm).pow(3))
        .div(12)
        .times(
          new Decimal(parameters.beamLengthInMm)
            .pow(2)
            .minus(
              new Decimal(
                parameters.beamLengthInMm - parameters.mobileForceLocationInMm,
              ).pow(2),
            )
            .minus(new Decimal(parameters.deformationLocationInMm).pow(2)),
        );
    } else if (
      new Decimal(parameters.mobileForceLocationInMm).lessThan(
        parameters.deformationLocationInMm,
      ) &&
      new Decimal(parameters.deformationLocationInMm).lessThan(
        parameters.beamLengthInMm,
      )
    ) {
      scenarioTwo = new Decimal(parameters.force)
        .times(parameters.beamWidthInMm)
        .div(6)
        .times(parameters.beamLengthInMm)
        .times(
          new Decimal(parameters.force)
            .times(parameters.beamWidthInMm)
            .times(parameters.deformationLocationInMm)
            .div(6)
            .times(parameters.beamLengthInMm)
            .times(this.youngsModulus)
            .times(parameters.beamWidthInMm)
            .times(new Decimal(parameters.beamHeightInMm).pow(3))
            .div(12),
        )
        .times(
          new Decimal(parameters.beamLengthInMm)
            .div(
              new Decimal(parameters.beamLengthInMm).minus(
                parameters.mobileForceLocationInMm,
              ),
            )
            .times(
              new Decimal(
                parameters.deformationLocationInMm -
                  parameters.mobileForceLocationInMm,
              ).pow(3),
            )
            .plus(
              new Decimal(parameters.beamLengthInMm)
                .pow(2)
                .minus(
                  new Decimal(
                    parameters.beamLengthInMm -
                      parameters.mobileForceLocationInMm,
                  ).pow(2),
                )
                .times(parameters.deformationLocationInMm)
                .minus(new Decimal(parameters.deformationLocationInMm).pow(3)),
            ),
        );
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
    const scenarioOneResult = await this.calculateScenarioOneBeam(parameters);
    const scenarioTwoResult = await this.calculateScenarioTwoBeam(parameters);

    const scenarioThreeResult = new Decimal(
      scenarioOneResult.deflectionOne || 0,
    ).plus(scenarioTwoResult.deflectionTwo || 0);

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
}
