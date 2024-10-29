import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EvaController } from './eva/eva.controller';
import { EvaService } from './services/eva/eva.service';
import { DataBaseAccessService } from './services/dataBaseAccess/data-base-access.service';
import { SshTunnelService } from './services/sshTunnel/ssh-tunnel.service';
import { TypeOrmModule } from "@nestjs/typeorm"
import { createTypeOrmOptions } from './services/sshTunnel/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    inject: [SshTunnelService],
    useFactory: async (sshTunnelService: SshTunnelService) =>
      await createTypeOrmOptions(sshTunnelService)
  })],
  controllers: [AppController, EvaController],
  providers: [AppService, EvaService, DataBaseAccessService, SshTunnelService],
})
export class AppModule {}
