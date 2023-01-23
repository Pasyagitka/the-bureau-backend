import { Body, Controller, Delete, Get, Param, Patch, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from '../ability/decorators/abilities.decorator';
import { Action } from '../ability/types';
import { ApiResponses } from '../common/decorators/api-responses.decorator';
import { ApiAuth } from '../common/decorators/auth.decorator';
import { ErrorMessageResponseDto } from '../common/dto/error-message-response.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiAuth()
@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponses({
    200: [UserResponseDto],
    500: ErrorMessageResponseDto,
  })
  @Get()
  @CheckAbilities({ action: Action.Read, subject: User })
  async getAll() {
    return (await this.userService.getAll()).map((i) => new UserResponseDto(i));
  }

  @ApiResponses({
    200: UserResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: User })
  async get(@Param('id') id: string) {
    return new UserResponseDto(await this.userService.get(+id));
  }

  @ApiResponses({
    200: UserResponseDto,
    400: ErrorMessageResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: User })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    return new UserResponseDto(await this.userService.update(+id, updateUserDto, req.user));
  }

  @ApiResponses({
    200: UserResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch('activate/:id')
  @CheckAbilities({ action: Action.ManageAccess, subject: User })
  async activateUser(@Param('id') id: string) {
    return new UserResponseDto(await this.userService.activateUser(+id));
  }

  @ApiResponses({
    200: UserResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Patch('deactivate/:id')
  @CheckAbilities({ action: Action.ManageAccess, subject: User })
  async deactivateUser(@Param('id') id: string) {
    return new UserResponseDto(await this.userService.deactivateUser(+id));
  }

  @ApiResponses({
    200: UserResponseDto,
    404: ErrorMessageResponseDto,
    500: ErrorMessageResponseDto,
  })
  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: User })
  async remove(@Param('id') id: string, @Req() req) {
    return new UserResponseDto(await this.userService.remove(+id, req.user));
  }
}
