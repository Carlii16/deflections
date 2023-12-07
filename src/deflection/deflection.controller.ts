import { Body, Controller, Post } from '@nestjs/common';
import { DeflectionService } from './deflection.service';
import { ScenarioOneBeamInputDto } from 'src/dtos/scenario-one-beam-input.dto.ts';
import { ScenarioOneBeamOutput } from 'src/interface/output/scenario-one-beam-output';

@Controller('deflections')
export class DeflectionController {
  constructor(private readonly deflectionService: DeflectionService) {}

  @Post('scenario-one')
  async calculateScenarioOne(
    @Body() parameters: ScenarioOneBeamInputDto,
  ): Promise<ScenarioOneBeamOutput> {
    return this.deflectionService.calculateScenarioOneBeam(parameters);
  }
}
