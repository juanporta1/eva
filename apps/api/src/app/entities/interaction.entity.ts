import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({name: "Interactions"})
export class Interaction{

    @PrimaryGeneratedColumn()
    interactionID: number;

    @ManyToOne(() => User, user => user.interactions)
    @JoinColumn({name: "userFK"})
    user: User;

    @Column({type:"int"})
    userID: number;

    @Column({type: "text"})
    userPrompt: string;

    @Column({type: "text"})
    evaReply: string;

    @Column({type: "varchar", default: ""})
    datetime: string;

    @Column({type: "varchar"})
    dayOfWeek: string;

    @BeforeInsert()
    setDayOfWeek() {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();
        this.dayOfWeek = daysOfWeek[today.getDay()];
        this.datetime = `${today.getFullYear()}-${today.getMonth()}-${today.getDay()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
    }

}