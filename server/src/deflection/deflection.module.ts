import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeflectionEntity } from 'server/src/entities/deflection.entity';
import { DeflectionService } from './deflection.service';
import { DeflectionController } from './deflection.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([DeflectionEntity])],
  providers: [DeflectionService, JwtService],
  controllers: [DeflectionController],
})
export class DeflectionModule {}
