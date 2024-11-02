import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BeforeInsert, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { Interaction } from "./interaction.entity";

@Entity({name: "Sessions"})
export class Session{
    @PrimaryGeneratedColumn()
    sessionID: number;

    @Column({type: "integer"})
    userID: number;

    @ManyToOne(() => User, user => user.sessions)
    @JoinColumn({name: "userFK"})
    user: User;

    @OneToMany(() => Interaction, interaction => interaction.session)
    interactions: Interaction[];

    @Column({type: "varchar"})
    initalDate: string;

    @Column({type: "varchar", nullable: true})
    endDate: string;

    @BeforeInsert()
    setDayOfWeek() {
        const today = new Date();
        this.initalDate = `${today.getFullYear()}-${today.getMonth()}-${today.getDay()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
    }

}