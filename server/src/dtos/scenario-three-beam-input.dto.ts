import { IsNumber, IsPositive } from 'class-validator';
import { ScenarioThreeBeamInput } from 'server/src/interface/input/scenario-three-beam-input';

export class ScenarioThreeBeamInputDto implements ScenarioThreeBeamInput {
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
