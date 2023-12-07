import { Body, Controller, Post } from '@nestjs/common';
import { DeflectionService } from './deflection.service';

import { ScenarioOneBeamOutput } from 'src/interface/output/scenario-one-beam-output';
import { ScenarioOneBeamInputDto } from 'src/dtos/scenario-one-beam-input.dto';
import { ScenarioTwoBeamInputDto } from 'src/dtos/scenario-two-beam-input.dto';
import { ScenarioTwoBeamOutput } from 'src/interface/output/scenario-two-beam-output';

@Controller('deflections')
export class DeflectionController {
  constructor(private readonly deflectionService: DeflectionService) {}

  @Post('scenario-one')
  async calculateScenarioOne(
    @Body() parameters: ScenarioOneBeamInputDto,
  ): Promise<ScenarioOneBeamOutput> {
    return this.deflectionService.calculateScenarioOneBeam(parameters);
  }

  @Post('scenario-Two')
  async calculateScenarioTwo(
    @Body() parameters: ScenarioTwoBeamInputDto,
  ): Promise<ScenarioTwoBeamOutput> {
    return this.deflectionService.calculateScenarioTwoBeam(parameters);
  }
}
