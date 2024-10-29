import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource){}

  async onModuleInit() {
      try{
        await this.dataSource.initialize()
        console.log('Base de datos inicializada correctamente')
      }catch(err){
        console.log("Error al iniciar la base de datos: ", err)
      }
  }
}
