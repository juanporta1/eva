import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany } from "typeorm";
import { Session } from "./session.entity";

@Entity({ name: "Users"})
export class User {
    @PrimaryGeneratedColumn()
    userID:number;
    @Column()
    userName: string;
    @Column({ unique: true })
    accountName: string;
    @Column()
    password: string;
    @Column({type: 'text', nullable: true})
    userContext: string;

    @BeforeInsert()
    setContextDefaultValue(){
        this.userContext = 'No se tiene nignún contexto sobre este usuario.';
    }

    @Column({ type: "datetime", default: () => 'CURRENT_TIMESTAMP' })
    lastUpdate: Date;

    @OneToMany(() => Session, session => session.user)
    sessions: Session[];
}