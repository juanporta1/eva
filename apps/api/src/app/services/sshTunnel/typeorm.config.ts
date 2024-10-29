import { DataSourceOptions } from 'typeorm';
import { SshTunnelService } from './ssh-tunnel.service';

export const createTypeOrmOptions = async (
  dbAccessService: SshTunnelService,
): Promise<DataSourceOptions> => {
  const port = await dbAccessService.getDataBasePort();

  return {
    type: 'mysql',
    host: '127.0.0.1',
    port: port,
    username: 'jporta553',
    password: '553Porta',
    database: 'jporta553',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, // Solo para desarrollo; eliminar en producción.
  };
};