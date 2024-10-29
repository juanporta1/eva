import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client } from "ssh2";
import net from 'net';
@Injectable()
export class SshTunnelService implements OnModuleInit, OnModuleDestroy{
    localPort:number;
    sshClient: Client;
    constructor(){
        this.sshClient = new Client();
    }
    private sshConfig = {
        host: 'gestion-imdf.ddns.net',
        port: 22,
        username: 'alumno6to',
        password: 'Ismdf.309',
      };
    
    async onModuleInit() {
        
        this.sshClient.on('ready', () => {
            console.log('Conectado al túnel SSH.');
            this.sshClient.forwardOut('127.0.0.1', 0, '127.0.0.1', 3306, (err, stream) => {
              if (err) {
                console.error('Error al crear el túnel:', err);
                return;
              }
      
              console.log('Túnel creado. Asignando puerto local...');
      
              const server = net.createServer((socket) => {
                socket.pipe(stream).pipe(socket);
              });
      
              server.listen(0, '127.0.0.1', () => {
                const addressInfo = server.address() as net.AddressInfo;
                this.localPort = addressInfo.port;
                console.log(`Puerto local asignado: ${this.localPort}`);
              });
            });
          });
      
          this.sshClient.connect(this.sshConfig)
        
    }
    async getDataBasePort(){
        return this.localPort;
    }
    
    async onModuleDestroy() {
        this.sshClient.end();
        console.log('Túnel SSH desconectado.');
    }
}
