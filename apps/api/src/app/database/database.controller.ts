import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDTO } from '../dataTransferObject/createUser.dto';
import { DbmanagerService } from '../services/dbmanager/dbmanager.service';
import { GetOneUser } from '../dataTransferObject/getOneUser.dto';
@Controller('database')
export class DatabaseController {

    constructor(private readonly dbManager: DbmanagerService){}

    @Post("createUser")
    async createUser(@Body() newUser: CreateUserDTO){
        return  await this.dbManager.createUser(newUser);;
    }

    @Get("getUser")
    async getUserByIdOrName(@Query() filter: GetOneUser){
        return await this.dbManager.getUserByIdOrName(filter);
    }

}
