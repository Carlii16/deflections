import { IsNumber, IsPositive } from 'class-validator';
import { ScenarioOneBeamInput } from 'server/src/interface/input/scenario-one-beam-input';

export class ScenarioOneBeamInputDto implements ScenarioOneBeamInput {
  @IsNumber()
  @IsPositive()
  beamWidthInM: number;

  @IsNumber()
  @IsPositive()
  beamHeightInM: number;

  @IsNumber()
  @IsPositive()
  beamLengthInM: number;

  @IsNumber()
  @IsPositive()
  beamWeightInM: number;

  @IsNumber()
  @IsPositive()
  deformationLocationInM: number;
}
