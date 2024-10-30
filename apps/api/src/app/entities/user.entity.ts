import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
@Entity({ name: "Users"})
export class User {
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    userName: string;
    @Column({ unique: true })
    accountName: string;
    @Column()
    password: string;
    @Column({type: 'text', default: 'No se tiene contexto.'})
    userContext: string;
    @Column({ type: "datetime", default: () => 'CURRENT_TIMESTAMP' })
    lastUpdate: Date;
}