import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from '../app.service';
import { EvaService } from '../services/eva/eva.service';
import { DataBaseAccessService } from '../services/dataBaseAccess/data-base-access.service';

type Context = {
    role: "system" | "user" | "assistant",
    content: string
}
@Controller('eva')
export class EvaController {

    constructor(private readonly appService: AppService, private eva: EvaService, private readonly dataBaseAccess: DataBaseAccessService){}
    context: Array<Context> = [{role: "system", content: "Eres Eva de la pelicula Wall-E"}]


    @Get("prompt")
    async getReply(@Query("prompt") prompt: string){
        this.context.push({role: "user", content: prompt})
        const reply = await this.eva.getReply(this.context, 1, 1000)
        const onlyReply: string = reply.content
        this.context.push({role: "assistant", content: onlyReply})
        this.dataBaseAccess.getUsers()
        console.log(this.context)
        return onlyReply;
        };
    }