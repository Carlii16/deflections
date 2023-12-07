import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Decimal from 'decimal.js';
import { ScenarioOneBeamInputDto } from 'src/dtos/scenario-one-beam-input.dto.ts';
import { DeflectionEntity } from 'src/entities/deflection.entity';
import { ScenarioOneBeamOutput } from 'src/interface/output/scenario-one-beam-output';
import { Repository } from 'typeorm';

@Injectable()
export class DeflectionService {
  constructor(
    @InjectRepository(DeflectionEntity)
    private readonly deflectionRepository: Repository<DeflectionEntity>,
  ) {}

  async calculateScenarioOneBeam(
    parameters: ScenarioOneBeamInputDto,
  ): Promise<ScenarioOneBeamOutput> {
    const {
      beamWeightInKg,
      beamLengthInMm,
      beamWidthInMm,
      beamHeightInMm,
      deformationLocationInMm,
    } = parameters;

    const youngsModulus = new Decimal('2.1e11');

    const term1 = new Decimal(beamWeightInKg)
      .times(new Decimal(beamLengthInMm).pow(4))
      .div(24)
      .times(youngsModulus)
      .times(
        new Decimal(beamWidthInMm)
          .times(new Decimal(beamHeightInMm).pow(3))
          .div(12),
      );

    const term2 = new Decimal(deformationLocationInMm)
      .div(beamLengthInMm)
      .minus(
        new Decimal(2)
          .times(new Decimal(deformationLocationInMm).pow(3))
          .div(new Decimal(beamLengthInMm).pow(3)),
      )
      .plus(
        new Decimal(deformationLocationInMm)
          .pow(4)
          .div(new Decimal(beamLengthInMm).pow(4)),
      );

    const scenarioOne = term1.times(term2);

    const deflectionEntity = new DeflectionEntity();
    deflectionEntity.beamWeightInKg = beamWeightInKg;
    deflectionEntity.beamLengthInMm = beamLengthInMm;
    deflectionEntity.beamWidthInMm = beamWidthInMm;
    deflectionEntity.beamHeightInMm = beamHeightInMm;
    deflectionEntity.deformationLocationInMm = deformationLocationInMm;
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
}
