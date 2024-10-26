import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EvaController } from './eva/eva.controller';
import { EvaService } from './services/eva/eva.service';

@Module({
  imports: [],
  controllers: [AppController, EvaController],
  providers: [AppService, EvaService],
})
export class AppModule {}
