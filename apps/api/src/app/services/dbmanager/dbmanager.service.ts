import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm'
import { CreateUserDTO } from '../../dataTransferObject/createUser.dto';
 

@Injectable()
export class DbmanagerService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>){}

    async createUser(user: CreateUserDTO){
        const newUser = this.userRepository.create(user)
        return await this.userRepository.save(newUser)
    }

}
