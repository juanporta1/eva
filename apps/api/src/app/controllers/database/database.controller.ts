import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDTO } from '../../dataTransferObject/createUser.dto';
import { DbmanagerService } from '../../services/dbmanager/dbmanager.service';
import { GetOneUser } from '../../dataTransferObject/getOneUser.dto';
import { CreateInteractionDTO } from '../../dataTransferObject/createInteraction.dto';
@Controller('database')
export class DatabaseController {

    constructor(private readonly dbManager: DbmanagerService){}

    @Post("createUser")
    async createUser(@Body() newUser: CreateUserDTO){
        return  await this.dbManager.createUser(newUser);
    }

    @Post("createInteraction")
    async createInteraction(@Body() newInteraction: CreateInteractionDTO){
        return await this.dbManager.createInteraction(newInteraction);
    }
    
    @Post("openSession")
    async openSession(@Body() newSession: {userID: number}){
        return await this.dbManager.openSession(newSession.userID);
    }
    
    @Patch("closeSession")
    async closeSession(@Body() session ?: {sessionID: number}){
        return await this.dbManager.closeSession(session.sessionID);
    }
    @Get("getOneUser")
    async getUserByIdOrName(@Query() filter: GetOneUser){
        return await this.dbManager.getOneUser(filter);
    }

    @Get("getOneInteraction")
    async getUserFromInteraction(@Query("id") id: number){
        return await this.dbManager.getOneInteraction(id);
    }

    @Get("getInteractions")
    async getInteractions(@Query() filter: GetOneUser){
        return await this.dbManager.getInteractions(filter);
    }
}
