import { IsNumber, IsPositive } from 'class-validator';
import { Parameters } from 'src/interface/input/parameters';

export class ParametersDto implements Parameters {
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
  mobileForceLocationInMm: number;

  @IsNumber()
  @IsPositive()
  force: number;

  @IsNumber()
  @IsPositive()
  deformationLocationInMm: number;

  @IsNumber()
  @IsPositive()
  youngModulus: number;

  @IsNumber()
  @IsPositive()
  inertiaMoment: number;

  @IsNumber()
  @IsPositive()
  lengthWithoutForceInMm: number;
}
