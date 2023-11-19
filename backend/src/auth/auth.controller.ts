import { Controller, Post, Body, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { isPublic } from './skipAuth';

@Controller('auth')
@isPublic()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async create(@Body() createAuthDto: CreateAuthDto) {
    console.log(createAuthDto);
    const token = await this.authService.signIn(createAuthDto);

    if (!token) {
      throw new UnauthorizedException();
    }

    return token;
  }
}
