import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { BaseController } from 'src/base/base.controller';
import { AbilityFactory } from 'src/ability/ability.factory';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Action } from 'src/ability/types';
import { UpdateUserHandler } from 'src/ability/policies/user/update-user-policy.handler';
import { CheckPolicies } from 'src/ability/decorators/policies.decorator';
import { UserEntity as UserEntityDecorator } from './decorators/user-entity.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly abilityFactory: AbilityFactory,
  ) {
    //super(userService);
  }

  @Post()
  //@CheckAbilities({ action: Action.Create, subject: User })
  create(@Body() createUserDto: RegisterUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  //@CheckAbilities({ action: Action.Read, subject: User })
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  //@CheckAbilities({ action: Action.Read, subject: User })
  get(@Param('id') id: string) {
    return this.userService.get(+id);
  }

  @Put(':id')
  @CheckPolicies(UpdateUserHandler)
  update(
    //@Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UserEntityDecorator() userToUpdate: User,
  ) {
    return this.userService.update(userToUpdate, updateUserDto);
  }

  @Delete(':id')
  //@CheckAbilities({ action: Action.Delete, subject: User })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
