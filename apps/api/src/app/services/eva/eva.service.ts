import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import OpenAI from 'openai';
import {Client} from "ssh2"
import mysql from 'mysql';
import net from 'net';
type Message = {
    role: "system" | "user" | "assistant",
    content: string
}
const CHATGPT_KEY = process.env.CHATGPTKEY;

@Injectable()
export class EvaService implements OnModuleDestroy, OnModuleInit {
   private sshClient: Client;
   private dbConnection: mysql.Connection;
   
   constructor(){
      this.sshClient = new Client()
   }
   openai = new OpenAI({apiKey: CHATGPT_KEY});
   
   

   async onModuleInit() {
      console.log("Modulo Iniciado");
      const sshClient = new Client();

      sshClient.on('ready', () => {
      console.log('Conectado al túnel SSH.');
      sshClient.forwardOut('127.0.0.1', 0, '127.0.0.1', 3306, (err, stream) => {
         if (err) {
            console.error('Error al crear el túnel:', err);
            return;
         }
         console.log('Túnel creado. Conectando a la base de datos...');

         const server = net.createServer((socket) => {
            socket.pipe(stream).pipe(socket);
          });
          
          // Escuchar en un puerto asignado dinámicamente
          server.listen(0, '127.0.0.1', () => {
            const addressInfo = server.address();
            const localPort = (addressInfo as net.AddressInfo).port; // Aserción de tipo
            console.log(`Puerto local asignado: ${localPort}`);
          
            // Crear la conexión a la base de datos utilizando el puerto asignado
            const dbConnection = mysql.createConnection({
              host: '127.0.0.1',
              port: localPort, // Usar el puerto dinámico
              user: 'jporta553',
              password: '553Porta',
              database: 'jporta553'
            });
          
            dbConnection.connect((error) => {
              if (error) {
                console.error('Error al conectar a la base de datos:', error);
              } else {
                console.log('Conexión exitosa a la base de datos.');
              }
            });
          });
      });
      });

      sshClient.connect({
      host: 'gestion-imdf.ddns.net',
      port: 22,
      username: 'alumno6to',
      password: 'Ismdf.309',
      });
   }

   async getReply(context: Array<Message>, temperature: number, max_tokens: number){
      try{ 
         
         const reply = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            temperature:temperature,
            max_tokens: max_tokens,
            messages: context
         })
         return reply.choices[0].message;
      } catch(err){
         console.log(err);
         throw err;
      }
   }
   async onModuleDestroy() {
      console.log("Modulo Destruido");
  }

}
