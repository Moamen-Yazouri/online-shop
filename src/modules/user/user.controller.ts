import { Body, Controller, Delete, Get, Param, Patch,  Query } from '@nestjs/common';
import { UserService } from './user.service';
import type { IPaginationQuery } from 'src/@types';
import type { UpdateUserDTO } from './dto/user.dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { updateUserValidationSchema } from './validation/user.validationSchema';
import { PaginationSchema } from './validation/queryValidationSchema';


@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll(@Query(new ZodValidationPipe(PaginationSchema)) query: IPaginationQuery) {

    return this.userService.findAll(query);

  }

  @Get(':id')
  findOne(@Param('id') id: bigint) {

    return this.userService.findById(id);

  }

  @Patch(':id')
  update(@Param('id') id: bigint, @Body(new ZodValidationPipe(updateUserValidationSchema)) updateUserDto: UpdateUserDTO) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: bigint) {
    const deleted = this.userService.delete(id);
    return Boolean(deleted);
  }
}