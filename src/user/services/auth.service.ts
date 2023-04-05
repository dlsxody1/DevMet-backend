import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthCreateDto } from '../dto/create-auth.dto';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwetService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCreateDto): Promise<void> {
    const user = await this.userRepository.findOneBy({
      username: authCredentialsDto.username,
    });

    if (user) throw new UnauthorizedException('이미 있는 아이디입니다.');

    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCreateDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.userRepository.findOneBy({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      // jwt 발급 (secret + payload가 필요함 secret은 모듈에서 설정했으니 payload만 설정)
      const payload = { username };
      const accessToken = await this.jwetService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }
}
