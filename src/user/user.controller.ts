import { Body, Controller, Delete, Get, Param, Patch, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Action } from 'src/ability/types';
import { ApiAuth } from 'src/common/decorators/auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiAuth()
@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @CheckAbilities({ action: Action.Read, subject: User })
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  @CheckAbilities({ action: Action.Read, subject: User })
  get(@Param('id') id: string) {
    return this.userService.get(+id);
  }

  @Patch(':id')
  @CheckAbilities({ action: Action.Update, subject: User })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.userService.update(+id, updateUserDto, req.user);
  }

  @Patch('activate/:id')
  @CheckAbilities({ action: Action.ManageAccess, subject: User })
  activateUser(@Param('id') id: string) {
    return this.userService.activateUser(+id);
  }

  @Patch('deactivate/:id')
  @CheckAbilities({ action: Action.ManageAccess, subject: User })
  deactivateUser(@Param('id') id: string) {
    return this.userService.deactivateUser(+id);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: User })
  remove(@Param('id') id: string, @Req() req) {
    return this.userService.remove(+id, req.user);
  }
}
