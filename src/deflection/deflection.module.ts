import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeflectionEntity } from 'src/entities/deflection.entity';
import { DeflectionService } from './deflection.service';
import { DeflectionController } from './deflection.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeflectionEntity])],
  providers: [DeflectionService],
  controllers: [DeflectionController],
})
export class DeflectionModule {}
