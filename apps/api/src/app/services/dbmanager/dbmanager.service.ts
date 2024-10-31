import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm'
import { CreateUserDTO } from '../../dataTransferObject/createUser.dto';
import { GetOneUser } from '../../dataTransferObject/getOneUser.dto';
import { CreateInteractionDTO } from '../../dataTransferObject/createInteraction.dto';
import { Interaction } from '../../entities/interaction.entity';

@Injectable()
export class DbmanagerService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>, @InjectRepository(Interaction) private interactionRepository: Repository<Interaction>){}

    async createUser(user: CreateUserDTO){
        const newUser = this.userRepository.create(user)
        return await this.userRepository.save(newUser)
    }
    async createInteraction(interaction: CreateInteractionDTO){
        const user = await this.userRepository.findOneBy({userID: interaction.userID})
        if(!user) return new HttpException("User not found",404)
        
        const newInteraction = this.interactionRepository.create(interaction);
        newInteraction.user = user;
        return await this.interactionRepository.save(newInteraction);
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

    async getInteractions(filter: GetOneUser): Promise<Interaction[] | HttpException>{
        let userInteractions;
        if (filter.id){
         userInteractions = await this.userRepository.find({
            where: {
                userID: filter.id
            },
            relations:["interactions"]
         }) 
        }
        else if (filter.account){
        userInteractions = await this.userRepository.find({
                where: {
                    accountName: filter.account
                },
                relations:["interactions"]
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
            relations: ["user"]
        });
        if(!interaction) return new HttpException("Interaction not found",404);
        
        return interaction;
    }
    
}
