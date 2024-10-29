import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client } from 'ssh2';
import { createConnection, Connection } from 'mysql2';
import net from 'net';
import { resolve } from 'path';
@Injectable()
export class DataBaseAccessService implements OnModuleDestroy, OnModuleInit {
  private dbConnection: Connection;
  private sshConfig = {
    host: 'gestion-imdf.ddns.net',
    port: 22,
    username: 'alumno6to',
    password: 'Ismdf.309',
  };
  async query(sql, params = []) {
    if (!this.dbConnection) {
      console.log('No se a conectado correctamente a la base de datos');
    }
    return new Promise((resolve, reject) => {
      this.dbConnection.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

 
  async onModuleInit() {
    console.log('Modulo Iniciado');
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

        server.listen(0, '127.0.0.1', () => {
          const addressInfo = server.address();
          const localPort = (addressInfo as net.AddressInfo).port;
          console.log(`Puerto local asignado: ${localPort}`);

          this.dbConnection = createConnection({
            host: '127.0.0.1',
            port: localPort,
            user: 'jporta553',
            password: '553Porta',
            database: 'jporta553',
          });

          this.dbConnection.connect((error) => {
            if (error) {
              console.error('Error al conectar a la base de datos:', error);
            } else {
              console.log('Conexión exitosa a la base de datos.');
              resolve();
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
  async createUser(name, account, password) {
    await this.query("INSERT INTO Users (name, account, password) VALUES (?. ?, ?)", [name, account,password])
  }
  async onModuleDestroy() {
    console.log('Modulo Destruido');
  }
}
