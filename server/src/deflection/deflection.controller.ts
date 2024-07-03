import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DeflectionService } from './deflection.service';

import { ScenarioOneBeamOutput } from 'server/src/interface/output/scenario-one-beam-output';
import { ScenarioOneBeamInputDto } from 'server/src/dtos/scenario-one-beam-input.dto';
import { ScenarioTwoBeamInputDto } from 'server/src/dtos/scenario-two-beam-input.dto';
import { ScenarioTwoBeamOutput } from 'server/src/interface/output/scenario-two-beam-output';
import { ScenarioThreeBeamInputDto } from 'server/src/dtos/scenario-three-beam-input.dto';
import { ScenarioThreeBeamOutput } from 'server/src/interface/output/scenario-three-beam-output';
import { GetBeamOutput } from 'server/src/interface/output/get-beam-output';
import { AuthGuard } from 'server/src/guards/auth.guard';

@Controller('deflections')
@UseGuards(AuthGuard)
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
