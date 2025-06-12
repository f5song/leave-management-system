import { Controller, Get, Post, Body, Param, Put, Delete, Patch, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.users.dto';
import { UserResponseDto } from './respones/users.respones.dto';
import { UpdateUserDto } from './dto/update.users.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { RolesPermission } from '../../common/decorators/roles-permission.decorator';
import { EPermission } from '@src/common/constants/permission.enum';
import { ERole } from '@src/common/constants/roles.enum';
import { ValidateParamUserId } from './dto/users.validate';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApiResponseError } from '../../common/decorators/api-response-error.decorator';
import { errorMessage } from '@src/common/constants/error-message';
import { HttpStatus } from '@nestjs/common';
import { ApiResponseSuccess } from '../../common/decorators/api-response-success.decorator';
import { ResponseObject } from '@src/common/dto/common-response.dto';

@ApiTags('Users')
@Controller('users')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)

export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiResponseError([
      {
        code: '0701',
        message: errorMessage['0701'],
        statusCode: HttpStatus.NOT_FOUND,
      },
      {
        code: '0702',
        message: errorMessage['0702'],
        statusCode: HttpStatus.BAD_REQUEST,
      },
      {
        code: '0703',
        message: errorMessage['0703'],
        statusCode: HttpStatus.BAD_REQUEST,
      },
      {
        code: '0704',
        message: errorMessage['0704'],
        statusCode: HttpStatus.BAD_REQUEST,
      },
      {
        code: '0705',
        message: errorMessage['0705'],
        statusCode: HttpStatus.BAD_REQUEST,
      },
      {
        code: '0706',
        message: errorMessage['0706'],
        statusCode: HttpStatus.BAD_REQUEST,
      },
      {
        code: HttpStatus.INTERNAL_SERVER_ERROR + '',
        message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      }
    ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.CREATE_USER] })
  async createUser(@Body() userData: CreateUserDto): Promise<ResponseObject<UserResponseDto>> {
    const userEntity = await this.userService.createUser(userData);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.userService.toUserResponseDto(userEntity),
    };
  }

  @Get(':id')
  @ApiResponseSuccess({
    type: [UserResponseDto],
    },
  )
  
  @ApiResponseError([
    {
      code: '0701',
      message: errorMessage['0701'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0702',
      message: errorMessage['0702'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0703',
      message: errorMessage['0703'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0704',
      message: errorMessage['0704'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0705',
      message: errorMessage['0705'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0706',
      message: errorMessage['0706'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @ApiBearerAuth('access-token')
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_USER] })
  async getUserById(@Param() param: ValidateParamUserId): Promise<ResponseObject<UserResponseDto>> {
    const userEntity = await this.userService.getUserById(param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: userEntity,
    };
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [UserResponseDto] })
  @ApiResponseError([
    {
      code: '0701',
      message: errorMessage['0701'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0702',
      message: errorMessage['0702'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0703',
      message: errorMessage['0703'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0704',
      message: errorMessage['0704'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0705',
      message: errorMessage['0705'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0706',
      message: errorMessage['0706'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_USER] })
  async getAllUsers(): Promise<ResponseObject<UserResponseDto[]>> {
    const userEntities = await this.userService.getAllUsers();
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: userEntities,
    };
  }

  @Put(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiResponseError([
    {
      code: '0701',
      message: errorMessage['0701'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0702',
      message: errorMessage['0702'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0703',
      message: errorMessage['0703'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0704',
      message: errorMessage['0704'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0705',
      message: errorMessage['0705'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0706',
      message: errorMessage['0706'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.UPDATE_USER] })
  async updateUser(@Param() param: ValidateParamUserId, @Body() updateData: UpdateUserDto): Promise<ResponseObject<UserResponseDto>> {
    const updatedUser = await this.userService.updateUser(param.id, updateData);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: updatedUser,
    };
  }

  // @Patch(':id')
  // @ApiBearerAuth('access-token')
  // @ApiOkResponse({ type: UserResponseDto })
  // @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.UPDATE_USER] })
  // async patchUser(
  //   @Param('id') id: string,
  //   @Body() updateData: UpdateUserDto
  // ): Promise<UserResponseDto> {
  //   const updatedUser = await this.userService.patchUser(id, updateData);
  //   return this.userService.toUserResponseDto(updatedUser);
  // }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserResponseDto })
  @ApiResponseError([
    {
      code: '0701',
      message: errorMessage['0701'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0702',
      message: errorMessage['0702'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0703',
      message: errorMessage['0703'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0704',
      message: errorMessage['0704'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0705',
      message: errorMessage['0705'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0706',
      message: errorMessage['0706'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.DELETE_USER] })
  async deleteUser(@Param() param: ValidateParamUserId): Promise<ResponseObject<UserResponseDto>> {
    const deletedUser = await this.userService.deleteUser(param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: deletedUser,
    };
  }
}
