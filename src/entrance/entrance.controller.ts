import { Controller, Post, Body, Put, UseFilters, HttpCode, HttpStatus, Req, Get, Res } from '@nestjs/common';
import { Client, ClientProxy, ClientRedis, Transport } from '@nestjs/microservices';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { RequestBodyAndInternalExceptionFilter } from '../exceptions/filters/RequestBodyAndInternal.exception-filter';
import { ValidationExceptionFilter } from '../exceptions/filters/Validation.exception-filter';
import { RegistrationValidationPipe } from '../pipes/validation/registration.validation.pipe';
import { LoginValidationPipe } from '../pipes/validation/login.validation.pipe';
import { LoginByEmailDto, LoginByPhoneNumberDto, LoginByUsernameDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangeEmailValidationPipe } from '../pipes/validation/changeEmail.validation.pipe';
import { UserChangeEmailDto } from './dto/update-email.dto';
import { VerifyUuidDto } from './dto/verify-uuid.dto';
import { ChangePasswordValidationPipe } from '../pipes/validation/changePassword.validation.pipe';
import { UserChangePasswordDto } from './dto/update-password.dto';
import { ChangePhoneNumberValidationPipe } from '../pipes/validation/changePhoneNumber.validation.pipe';
import { UserChangePhoneNumberDto } from './dto/update-phone.dto';
import { OptionalDataValidationPipe } from '../pipes/validation/optionalData.validation.pipe';
import { AddOrUpdateOptionalDataDto } from './dto/add-or-update-optional-data.dto';
import { RoomValidationPipe } from '../pipes/validation/room.validation.pipe';

@UseFilters(new RequestBodyAndInternalExceptionFilter(), new ValidationExceptionFilter())
@Controller('public')
export class EntranceController {
  @Client({
    transport: Transport.REDIS,
    options: {
      url: `redis://${process.env.REDIS_DB_NAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`,
      retryDelay: 3000,
      retryAttempts: 10
    }
  })
  private client: ClientRedis;

  async onApplicationBootstrap(): Promise<void> {
    await this.client.connect();
  }

  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register entrance.' })
  @ApiCreatedResponse({})
  async register(@Body(new RegistrationValidationPipe()) createUserDto: SignUpDto) {
    return await this.client.send({ cmd: 'register' }, createUserDto);
    // return await this.userService.register(createUserDto);
  }
  //
  // @Post('/login')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Log in the entrance.' })
  // @ApiCreatedResponse({})
  // async login(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Body(new LoginValidationPipe()) loginUserDto: LoginByEmailDto & LoginByUsernameDto & LoginByPhoneNumberDto
  // ) {
  //   return await this.userService.login(req, res, loginUserDto);
  // }
  //
  // @Post('/forgot-password')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Request resetting for a forgotten password.' })
  // @ApiOkResponse({})
  // async forgotPassword(@Req() req: Request, @Body() forgotPasswordDto: ForgotPasswordDto) {
  //   return await this.userService.forgotPassword(req, forgotPasswordDto);
  // }
  //
  // @Put('/forgot-password-verify')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Verify a password reset operation and create a new password.' })
  // @ApiOkResponse({})
  // async forgotPasswordVerify(@Req() req: Request, @Body() verifyUuidDto: VerifyUuidDto) {
  //   return await this.userService.forgotPasswordVerify(req, verifyUuidDto);
  // }
  //
  // @Put('/email/:id')
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({ summary: 'Change an email.' })
  // @ApiCreatedResponse({})
  // async changeEmail(@Req() req: Request, @Body(new ChangeEmailValidationPipe()) changeEmailDto: UserChangeEmailDto) {
  //   return await this.userService.changeEmail(req, changeEmailDto);
  // }
  //
  // @Put('/password/:id')
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({ summary: 'Change a password.' })
  // @ApiCreatedResponse({})
  // async changePassword(@Req() req: Request, @Body(new ChangePasswordValidationPipe()) changePasswordDto: UserChangePasswordDto) {
  //   return await this.userService.changePassword(req, changePasswordDto);
  // }
  //
  // @Put('/phone/:id')
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({ summary: 'Change a password.' })
  // @ApiCreatedResponse({})
  // async changePhoneNumber(
  //   @Req() req: Request,
  //   @Body(new ChangePhoneNumberValidationPipe()) changePhoneNumberDto: UserChangePhoneNumberDto
  // ) {
  //   return await this.userService.changePhoneNumber(req, changePhoneNumberDto);
  // }
  //
  // @Put('/optional/:id')
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({ summary: 'Add or update an optional data (first and last name, birthday, mobile phone number).' })
  // @ApiCreatedResponse({})
  // async addOrChangeOptionalData(@Req() req: Request, @Body(new OptionalDataValidationPipe()) optionalDataDto: AddOrUpdateOptionalDataDto) {
  //   return await this.userService.addOrChangeOptionalData(req, optionalDataDto);
  // }
  //
  // @Get('/refresh-session')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Refresh the entrance session.' })
  // @ApiCreatedResponse({})
  // async refreshAccessToken(@Req() req: Request, @Res() res: Response) {
  //   return await this.userService.refreshSession(req, res);
  // }
  //
  // // @MessagePattern({ cmd: 'create-room' })
  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // async createRoom(@Body(new RoomValidationPipe()) roomDto: RoomDto) {
  //   return await this.roomsService.createRoom(roomDto);
  // }
  //
  // // @MessagePattern({ cmd: 'get-all-rooms' })
  // @Get()
  // @HttpCode(HttpStatus.OK)
  // async getAllRooms(): Promise<RoomDocument[]> {
  //   return await this.roomsService.getAllRooms();
  // }
  //
  // // @MessagePattern({ cmd: 'find-room-by-name' })
  // @Get('/room/:name')
  // @HttpCode(HttpStatus.OK)
  // async findRoomByName(@Req() req: Request): Promise<RoomDocument[]> {
  //   return await this.roomsService.findRoomByName(req);
  // }
  //
  // // @MessagePattern({ cmd: 'update-room' })
  // @Put('/room/:id')
  // @HttpCode(HttpStatus.CREATED)
  // async updateRoom(@Req() req: Request, @Body() roomDto: Partial<RoomDto>) {
  //   return await this.roomsService.updateRoom(req, roomDto);
  // }
  //
  // // @MessagePattern({ cmd: 'delete-room' })
  // @Delete('/room/:id')
  // @HttpCode(HttpStatus.OK)
  // public async deleteRoom(@Req() req: Request) {
  //   return await this.roomsService.deleteRoom(req);
  // }
  //
  // // @MessagePattern({ cmd: "add-message-reference" })
  // @Put('/message')
  // @HttpCode(HttpStatus.CREATED)
  // public async addMessageReferenceToRoom(@Req() req: Request, @Body() { messageId, roomId }: { messageId: string; roomId: string }) {
  //   return await this.roomsService.addMessageReferenceToRoom(req, messageId, roomId);
  // }
  //
  // // @MessagePattern({ cmd: "delete-message-reference" })
  // @Delete('/message')
  // @HttpCode(HttpStatus.OK)
  // public async deleteMessageReferenceFromRoom(@Req() req: Request, @Body() { messageId, roomId }: { messageId: string; roomId: string }) {
  //   return await this.roomsService.deleteMessageFromRoom(req, messageId, roomId);
  // }
  //
  // // @MessagePattern({ cmd: "add-user" })
  // @Put('/user')
  // @HttpCode(HttpStatus.CREATED)
  // public async addUserToRoom(@Req() req: Request, @Body() { userId, roomId }: { userId: string; roomId: string }) {
  //   return await this.roomsService.addUserToRoom(req, userId, roomId);
  // }
  //
  // // @MessagePattern({ cmd: "delete-user" })
  // @Delete('/user')
  // @HttpCode(HttpStatus.OK)
  // public async deleteUserFromRoom(@Req() req: Request, @Body() { userId, roomId }: { userId: string; roomId: string }) {
  //   return await this.roomsService.deleteUserFromRoom(req, userId, roomId);
  // }
  //
  // // @MessagePattern({ cmd: "change-user-rights" })
  // @Put('/user-rights')
  // @HttpCode(HttpStatus.OK)
  // public async changeUserRightsInRoom(
  //   @Req() req: Request,
  //   @Body() { userId, roomId, newRights }: { userId: string; roomId: string; newRights: string[] }
  // ) {
  //   return await this.roomsService.changeUserRightsInRoom(req, userId, roomId, newRights);
  // }
  // @Post('/contact')
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({ summary: 'Handle an appeal.' })
  // @ApiCreatedResponse({})
  // async contact(@Req() req: Request, @Body(new ContactFormValidationPipe()) contactFormDto: ContactFormDto) {
  //   return await this.clientService.contact(req, contactFormDto);
  // }
  //
  // @Get('/token')
  // @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({ summary: 'Generate a client access-token.' })
  // @ApiCreatedResponse({})
  // async generateToken(@Req() req: Request, @Res() res: Response) {
  //   return await this.clientService.generateToken(req, res);
  // }
  // @Post('/verify-email')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Send verification mail.' })
  // @ApiCreatedResponse({})
  // async validateEmail(@Req() req: Request, @Body(new EmailVerificationRequestValidationPipe()) verifyEmailDto: VerifyEmailDto) {
  //   return await this.emailService.validateEmail(verifyEmailDto);
  // }
}
