import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from './decorators/auth.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateBrigadierDto } from 'src/brigadier/dto/create-brigadier.dto';
import { CreateClientDto } from 'src/client/dto/create-client.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() req) {
    return this.authService.loginWithCredentials(req.user);
  }

  @Public()
  @Post('registration')
  async register(@Body() registerUserDto: CreateClientDto) {
    return this.authService.register(registerUserDto);
  }

  @Public()
  @Post('brigadier/registration')
  async registerBrigadier(@Body() registerUserDto: CreateBrigadierDto) {
    return this.authService.registerBrigadier(registerUserDto);
  }

  @Public()
  @Get('activate/:link')
  async activate(@Param('link') activationLink: string) {
    return this.authService.activate(activationLink);
  }

  @Public()
  @Post('reset-password')
  async sendReset(@Body('email') email: string) {
    return this.authService.sendResetPassword(email);
  }

  @Public()
  @Get('reset-password/:login/:link')
  async resetConfirm(@Param('login') login: string, @Param('link') link: string) {
    const isReset = await this.authService.resetConfirm(login, link);
    if (isReset) {
      return 'Success reset';
    }
    return 'Failure reset';
  }
}
