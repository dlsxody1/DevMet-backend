import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { Auth } from './entity/auth.entity';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport/dist';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { TokenDTO } from './dto/token.dto';
import { Token } from './entity/token.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() authDTO: AuthDTO): Promise<Auth> {
    // console.log('hihi', authDTO);
    return this.authService.saveUser(authDTO);
  }

  @Post()
  signUp(@Body() authDTO: AuthDTO): Promise<Auth> {
    // console.log('hihi', authDTO);
    return this.authService.saveUser(authDTO);
  }

  @Get('/test')
  @UseGuards(AuthGuard())
  onTest(@GetUser() user: Auth) {
    return console.log(user, test);
  }
}