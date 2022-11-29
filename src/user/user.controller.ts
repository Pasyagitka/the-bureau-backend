import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CheckAbilities } from 'src/ability/decorators/abilities.decorator';
import { Action } from 'src/ability/types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: User })
  create(@Body() createUserDto: RegisterUserDto) {
    return this.userService.create(createUserDto);
  }

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

  @Put(':id')
  @CheckAbilities({ action: Action.Update, subject: User })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    return this.userService.update(+id, updateUserDto, req.user);
  }

  @Delete(':id')
  @CheckAbilities({ action: Action.Delete, subject: User })
  remove(@Param('id') id: string, @Req() req) {
    return this.userService.remove(+id, req.user);
  }
}
