import { IsNumber, IsPositive } from 'class-validator';
import { ScenarioTwoBeamInput } from 'server/src/interface/input/scenario-two-beam-input';

export class ScenarioTwoBeamInputDto implements ScenarioTwoBeamInput {
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
  beamWidthForMomentOfInertiaInM: number;

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
