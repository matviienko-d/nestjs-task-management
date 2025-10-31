import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersRepository } from "../users.repository";
import { User } from "../user.entity";
import { JwtPayload } from "./jwt.interfaces";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersRepository: UsersRepository) {
        super({
            secretOrKey: 'topSecret51',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload;
        const user: User | null = await this.usersRepository.findOne({ where: { username } });

        if (!user) {
            throw new UnauthorizedException('Invalid token');
        }

        return user;
    }
}