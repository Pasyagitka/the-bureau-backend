import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Public } from './auth.decorator';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log(req);
    return this.authService.loginWithCredentials(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Post('registration')
  async register(@Body() registerUserDto: RegisterDto) {
    return this.authService.register(registerUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get('activate/:link')
  async activate(@Param('link') activationLink: string) {
    return this.authService.activate(activationLink);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Post('reset-password')
  async sendReset(@Body('email') email: string) {
    return this.authService.sendResetPassword(email);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get('reset-password/:login/:link')
  async resetConfirm(
    @Param('login') login: string,
    @Param('link') link: string,
  ) {
    const isReset = await this.authService.resetConfirm(login, link);
    // if (isReset) {
    //   return 'Success reset';
    // }
    return 'Failure reset';
  }
}
