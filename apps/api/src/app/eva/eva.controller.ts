import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { AppService } from '../app.service';
import { EvaService } from '../services/eva/eva.service';
import { DbmanagerService } from '../services/dbmanager/dbmanager.service';

@Controller('eva')
export class EvaController {

    constructor(private readonly appService: AppService, private readonly eva: EvaService, private readonly database: DbmanagerService){}
    @Get("getReply")
    async getReply(@Query("prompt") prompt: string, @Query("id") sessionID: number){
        const session = await this.database.getSession(sessionID);
        if (session instanceof HttpException) return new HttpException("Session not found", 404)
        return await this.eva.getReply(session, prompt)
    };



    }
    

    
