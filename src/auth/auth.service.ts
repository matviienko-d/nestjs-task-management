import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
    constructor(private readonly usersRepository: UsersRepository) {}

    signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.usersRepository.createUser(authCredentialsDto);
    }
    
    signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.usersRepository.signIn(authCredentialsDto);
    }
}
