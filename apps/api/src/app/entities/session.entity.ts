import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BeforeInsert } from "typeorm";
import { User } from "./user.entity";

@Entity({name: "Sessions"})
export class Session{
    @PrimaryGeneratedColumn()
    sessionID: number;

    @Column({type: "integer"})
    userID: number;

    @ManyToOne(() => User, user => user.userID)
    @JoinColumn({name: "userFK"})
    user: User;

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