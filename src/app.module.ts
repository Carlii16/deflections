import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeflectionModule } from './deflection/deflection.module';
import { DeflectionEntity } from './entities/deflection.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'sarmale123',
      database: 'test',
      entities: [DeflectionEntity],
      synchronize: true,
    }),
    DeflectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
