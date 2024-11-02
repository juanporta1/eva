import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EvaController } from './controllers/eva/eva.controller';
import { EvaService } from './services/eva/eva.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbmanagerService } from './services/dbmanager/dbmanager.service';
import { DatabaseController } from './controllers/database/database.controller';
import { Interaction } from './entities/interaction.entity';
import  { Session } from './entities/session.entity';
const dbPassword = process.env.DBPASSWORD;
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '34.42.167.179',
      port: 3306,
      username: 'root',
      password: dbPassword,
      database: 'Eva',
      entities: [User, Interaction,Session],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Interaction,Session]),
  ],
  controllers: [AppController, EvaController, DatabaseController],
  providers: [AppService, EvaService, DbmanagerService],
})
export class AppModule {}
