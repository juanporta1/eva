import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm'
import { CreateUserDTO } from '../../dataTransferObject/createUser.dto';
import { GetOneUser } from '../../dataTransferObject/getOneUser.dto';

@Injectable()
export class DbmanagerService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>){}

    async createUser(user: CreateUserDTO){
        const newUser = this.userRepository.create(user)
        return await this.userRepository.save(newUser)
    }

    async getUserByIdOrName(filter: GetOneUser): Promise<User[]>{
       const queryBuilder = this.userRepository.createQueryBuilder("user")
       if (filter.userID){
        await queryBuilder.orWhere("user.userID = :id", {id : filter.userID})
       }
       if (filter.accountName){
        await queryBuilder.orWhere("user.accountName = :accountName", {accountName : filter.accountName})
       }
       return queryBuilder.getMany(); 
    }
}
