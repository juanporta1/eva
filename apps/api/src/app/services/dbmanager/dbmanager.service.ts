import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm'
import { CreateUserDTO } from '../../dataTransferObject/createUser.dto';
import { GetOneUser } from '../../dataTransferObject/getOneUser.dto';
import { CreateInteractionDTO } from '../../dataTransferObject/createInteraction.dto';
import { Interaction } from '../../entities/interaction.entity';
import { Session } from '../../entities/session.entity';


@Injectable()
export class DbmanagerService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>, @InjectRepository(Interaction) private interactionRepository: Repository<Interaction>, @InjectRepository(Session) private sessionRepository: Repository<Session>){}

    private async setTodayDate() {
        const today = new Date();
        return `${today.getFullYear()}-${today.getMonth()}-${today.getDay()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
    }


    async createUser(user: CreateUserDTO){
        const newUser = this.userRepository.create(user)
        return await this.userRepository.save(newUser)
    }

    async createInteraction(interaction: CreateInteractionDTO){
        const session = await this.getSession(interaction.sessionID)
        if (session instanceof HttpException) return new HttpException("Session not found",404) 
        const user = await this.userRepository.findOneBy({userID: session.userID})
        
        if(!user) return new HttpException("User not found",404)
        interaction.sessionID = session.sessionID
        const newInteraction = this.interactionRepository.create(interaction);

        newInteraction.session = session;
        return await this.interactionRepository.save(newInteraction);
    }

    async openSession(userID){
        const user = await this.userRepository.findOneBy({userID: userID});
        if(!user) return new HttpException("User not found",404);
        const newSession = await this.sessionRepository.create({userID: userID, user: user});
        return await this.sessionRepository.save(newSession);
    }

    async closeSession(id ?: number){
        if (id){
            const session = await this.sessionRepository.findOneBy({sessionID: id});
            if (session.endDate) return new HttpException("This Session alredy has a endDate",403)
            return await this.sessionRepository.update({sessionID: id}, {
                endDate: await this.setTodayDate()
            })
        }
        
    }

    async getSession(id: number){
        const session = await this.sessionRepository.findOneBy({sessionID: id})
        if(!session) return new HttpException("Session not found",404);
        return session;
    }

    async getOneUser(filter: GetOneUser): Promise<User>{
       const queryBuilder = this.userRepository.createQueryBuilder("user")
       if (filter.id){
        await queryBuilder.orWhere("user.userID = :id", {id : filter.id})
       }
       if (filter.account){
        await queryBuilder.orWhere("user.accountName = :accountName", {accountName : filter.account})
       }
       return queryBuilder.getOne(); 
    }

    async getInteractions(filter: GetOneUser): Promise<User[] | HttpException>{
        let userInteractions: User[] | HttpException; 
        if (filter.id){
         userInteractions = await this.userRepository.find({
            where: {
                userID: filter.id
            },
            relations:{
                sessions: {
                    interactions: true
                }
            }
         }) 

        }
        else if (filter.account){
        userInteractions = await this.userRepository.find({
                where: {
                    accountName: filter.account
                },
                relations:{
                    sessions: {
                        interactions: true
                    }
                }
             }) 
        }
        if (!userInteractions) return new HttpException("User not found",404);
        return userInteractions; 
     }

    async getOneInteraction(id: number): Promise<Interaction | HttpException>{
        const interaction = await this.interactionRepository.findOne({
            where:{
                interactionID: id
            },
            relations: ["session"]
        });
        if(!interaction) return new HttpException("Interaction not found",404);
        
        return interaction;
    }
    
}
