import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeflectionModule } from './deflection/deflection.module';
import { DeflectionEntity } from './entities/deflection.entity';
import { UserEntity } from './entities/user.entity';
import { UserModule } from './users/user.module';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'sarmale123',
      database: 'test',
      entities: [DeflectionEntity, UserEntity],
      synchronize: true,
    }),
    DeflectionModule,
    UserModule,
    JwtModule.register({
      secret: 'random123',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
