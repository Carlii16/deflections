import { IsNumber, IsPositive } from 'class-validator';
import { ScenarioThreeBeamInput } from 'server/src/interface/input/scenario-three-beam-input';

export class ScenarioThreeBeamInputDto implements ScenarioThreeBeamInput {
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

  @IsNumber()
  @IsPositive()
  mobileForceLocationInM: number;

  @IsNumber()
  @IsPositive()
  force: number;
}
