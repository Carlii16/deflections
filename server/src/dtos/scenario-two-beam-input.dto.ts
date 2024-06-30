import { IsNumber, IsPositive } from 'class-validator';
import { ScenarioTwoBeamInput } from 'server/src/interface/input/scenario-two-beam-input';

export class ScenarioTwoBeamInputDto implements ScenarioTwoBeamInput {
  @IsNumber()
  @IsPositive()
  beamWidthInMm: number;

  @IsNumber()
  @IsPositive()
  beamHeightInMm: number;

  @IsNumber()
  @IsPositive()
  beamLengthInMm: number;

  @IsNumber()
  @IsPositive()
  beamWeightInKg: number;

  @IsNumber()
  @IsPositive()
  deformationLocationInMm: number;

  @IsNumber()
  @IsPositive()
  mobileForceLocationInMm: number;

  @IsNumber()
  @IsPositive()
  force: number;
}
