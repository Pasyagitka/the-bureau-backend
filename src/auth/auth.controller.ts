import { Body, Controller, Get, HttpCode, Param, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateBrigadierDto } from '../brigadier/dto/create-brigadier.dto';
import { CreateClientDto } from '../client/dto/create-client.dto';
import { ApiResponses } from '../common/decorators/api-responses.decorator';
import { ApiAuth } from '../common/decorators/auth.decorator';
import { ErrorMessageResponseDto } from '../common/dto/error-message-response.dto';
import { MessageResponseDto } from '../common/dto/message-response.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/auth.decorator';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserInfoResponseDto } from './dto/user-info-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ChangePasswordDto } from '../user/dto/change-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //TODO add email account confirmation
  @ApiResponses({
    200: LoginResponseDto,
    500: ErrorMessageResponseDto,
  })
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.loginWithCredentials(req.user);
  }

  @ApiResponses({
    200: RegisterResponseDto,
    400: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @HttpCode(200)
  @Public()
  @Post('registration')
  async register(@Body() registerUserDto: CreateClientDto) {
    return this.authService.register(registerUserDto);
  }

  @ApiResponses({
    200: RegisterResponseDto,
    400: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @HttpCode(200)
  @Public()
  @Post('brigadier/registration')
  async registerBrigadier(@Body() registerUserDto: CreateBrigadierDto) {
    return this.authService.registerBrigadier(registerUserDto);
  }

  @ApiResponses({
    200: MessageResponseDto,
    400: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Public()
  @Get('activate/:link')
  async activate(@Param('link') activationLink: string) {
    return this.authService.activate(activationLink);
  }

  @ApiResponses({
    200: MessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @HttpCode(200)
  @Public()
  @Post('reset-password')
  async sendReset(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.sendResetPassword(resetPasswordDto.email);
  }

  @ApiResponses({
    200: MessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Public()
  @Get('reset-password/:login/:link')
  async resetConfirm(@Param('login') login: string, @Param('link') link: string) {
    const isReset = await this.authService.resetConfirm(login, link);
    if (isReset) {
      return 'Success reset';
    }
    return 'Failure reset';
  }

  @ApiResponses({
    200: MessageResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiAuth()
  @Patch('change-password')
  async changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto) {
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ')[1];
      const decoded = await this.authService.getUser(authorization);
      const res = await this.authService.changePassword(decoded.id, changePasswordDto);
      return new MessageResponseDto('Пароль успешно изменен');
    }
  }

  @ApiResponses({
    200: MessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @ApiAuth()
  @Get('userinfo')
  async getUser(@Req() req) {
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ')[1];
      const decoded = await this.authService.getUser(authorization);
      return new UserInfoResponseDto(decoded);
    }
  }
}
