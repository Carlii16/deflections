import { IsNumber, IsPositive } from 'class-validator';
import { ScenarioOneBeamInput } from 'src/interface/input/scenario-one-beam-input';

export class ScenarioTwoBeamInputDto implements ScenarioOneBeamInput {
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
