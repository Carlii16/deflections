import { IsNumber, IsPositive } from 'class-validator';
import { ScenarioOneBeamInput } from 'src/interface/input/scenario-one-beam-input';

export class ScenarioOneBeamInputDto implements ScenarioOneBeamInput {
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
}
