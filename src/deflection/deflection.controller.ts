import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DeflectionService } from './deflection.service';

import { ScenarioOneBeamOutput } from 'src/interface/output/scenario-one-beam-output';
import { ScenarioOneBeamInputDto } from 'src/dtos/scenario-one-beam-input.dto';
import { ScenarioTwoBeamInputDto } from 'src/dtos/scenario-two-beam-input.dto';
import { ScenarioTwoBeamOutput } from 'src/interface/output/scenario-two-beam-output';
import { ScenarioThreeBeamInputDto } from 'src/dtos/scenario-three-beam-input.dto';
import { ScenarioThreeBeamOutput } from 'src/interface/output/scenario-three-beam-output';
import { GetBeamOutput } from 'src/interface/output/get-one-beam-output';

@Controller('deflections')
export class DeflectionController {
  constructor(private readonly deflectionService: DeflectionService) {}

  @Post('scenario-one')
  async calculateScenarioOne(
    @Body() parameters: ScenarioOneBeamInputDto,
  ): Promise<ScenarioOneBeamOutput> {
    return this.deflectionService.calculateScenarioOneBeam(parameters);
  }

  @Post('scenario-two')
  async calculateScenarioTwo(
    @Body() parameters: ScenarioTwoBeamInputDto,
  ): Promise<ScenarioTwoBeamOutput> {
    return this.deflectionService.calculateScenarioTwoBeam(parameters);
  }

  @Post('scenario-three')
  async calculateScenarioThree(
    @Body() parameters: ScenarioThreeBeamInputDto,
  ): Promise<ScenarioThreeBeamOutput> {
    return this.deflectionService.calculateScenarioThreeBeam(parameters);
  }

  @Get('view-projects/:id')
  async viewOne(@Param('id') id: number): Promise<GetBeamOutput> {
    return this.deflectionService.viewOne(id);
  }

  @Get('view-projects')
  async viewAll(): Promise<GetBeamOutput[]> {
    return this.deflectionService.viewAll();
  }
}
