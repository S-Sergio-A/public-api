import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Post, Put, Req, UseFilters } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";
import { Observable } from "rxjs";
import { RequestBodyAndInternalExceptionFilter } from "../exceptions/filters/RequestBodyAndInternal.exception-filter";
import { ChangePhoneNumberValidationPipe } from "../pipes/validation/changePhoneNumber.validation.pipe";
import { ChangePasswordValidationPipe } from "../pipes/validation/changePassword.validation.pipe";
import { ValidationExceptionFilter } from "../exceptions/filters/Validation.exception-filter";
import { RegistrationValidationPipe } from "../pipes/validation/registration.validation.pipe";
import { OptionalDataValidationPipe } from "../pipes/validation/optionalData.validation.pipe";
import { ChangeEmailValidationPipe } from "../pipes/validation/changeEmail.validation.pipe";
import { ContactFormValidationPipe } from "../pipes/validation/contact-form.validation.pipe";
import { LoginValidationPipe } from "../pipes/validation/login.validation.pipe";
import { RoomValidationPipe } from "../pipes/validation/room.validation.pipe";
import { LoginByEmailDto, LoginByPhoneNumberDto, LoginByUsernameDto } from "./dto/login.dto";
import { AddOrUpdateOptionalDataDto } from "./dto/add-or-update-optional-data.dto";
import { UserChangePhoneNumberDto } from "./dto/update-phone.dto";
import { UserChangePasswordDto } from "./dto/update-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { UserChangeEmailDto } from "./dto/update-email.dto";
import { ContactFormDto } from "./dto/contact-form.dto";
import { VerifyUuidDto } from "./dto/verify-uuid.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { RoomDto } from "./dto/room.dto";

@UseFilters(new RequestBodyAndInternalExceptionFilter(), new ValidationExceptionFilter())
@Controller("public")
export class EntranceController {
  client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        url: `redis://${process.env.REDIS_DB_NAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`,
        retryDelay: 3000,
        retryAttempts: 10
      }
    });
  }

  @Post("/sign-up")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register entrance." })
  @ApiCreatedResponse({})
  async register(@Body(new RegistrationValidationPipe()) createUserDto: SignUpDto): Promise<Observable<any>> {
    return this.client.send({ cmd: "register" }, createUserDto);
  }

  @Post("/login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Log in the entrance." })
  @ApiCreatedResponse({})
  async login(
    @Req() req: Request,
    @Headers() headers,
    @Body(new LoginValidationPipe()) loginUserDto: LoginByEmailDto & LoginByUsernameDto & LoginByPhoneNumberDto
  ): Promise<Observable<any>> {
    return this.client.send(
      { cmd: "login" },
      { ip: req.socket.remoteAddress, userAgent: headers["user-agent"], fingerprint: headers["fingerprint"], loginUserDto }
    );
  }

  @Post("/forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Request resetting for a forgotten password." })
  @ApiOkResponse({})
  async forgotPassword(@Req() req: Request, @Headers() headers, @Body() forgotPasswordDto: ForgotPasswordDto): Promise<Observable<any>> {
    return this.client.send(
      { cmd: "forgot-password" },
      { ip: req.socket.remoteAddress, userAgent: headers["user-agent"], fingerprint: headers["fingerprint"], forgotPasswordDto }
    );
  }

  @Put("/forgot-password-verify")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify a password reset operation and create a new password." })
  @ApiOkResponse({})
  async forgotPasswordVerify(@Req() req: Request, @Body() verifyUuidDto: VerifyUuidDto): Promise<Observable<any>> {
    return this.client.send({ cmd: "forgot-password-verify" }, { userId: req.user.userId, verifyUuidDto });
  }

  @Get("/logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify a password reset operation and create a new password." })
  @ApiOkResponse({})
  async logout(@Req() req: Request, @Headers() headers): Promise<Observable<any>> {
    return this.client.send(
      { cmd: "logout" },
      {
        accessToken: headers["access-token"],
        ip: req.socket.remoteAddress,
        userAgent: headers["user-agent"],
        fingerprint: headers["fingerprint"],
        refreshToken: headers["refresh-token"],
        userId: req.user.userId
      }
    );
  }

  @Put("/email/:id")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Change an email." })
  @ApiCreatedResponse({})
  async changeEmail(
    @Req() req: Request,
    @Body(new ChangeEmailValidationPipe()) changeEmailDto: UserChangeEmailDto
  ): Promise<Observable<any>> {
    return this.client.send({ cmd: "change-email" }, { userId: req.user.userId, changeEmailDto });
  }

  @Put("/password/:id")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Change a password." })
  @ApiCreatedResponse({})
  async changePassword(
    @Req() req: Request,
    @Body(new ChangePasswordValidationPipe()) changePasswordDto: UserChangePasswordDto
  ): Promise<Observable<any>> {
    return this.client.send({ cmd: "change-password" }, { userId: req.user.userId, changePasswordDto });
  }

  @Put("/phone/:id")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Change a phone number." })
  @ApiCreatedResponse({})
  async changePhoneNumber(
    @Req() req: Request,
    @Body(new ChangePhoneNumberValidationPipe()) changePhoneNumberDto: UserChangePhoneNumberDto
  ): Promise<Observable<any>> {
    return this.client.send({ cmd: "change-phone" }, { userId: req.user.userId, changePhoneNumberDto });
  }

  @Put("/optional/:id")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Add or update an optional data (first and last name, birthday)." })
  @ApiCreatedResponse({})
  async addOrChangeOptionalData(
    @Req() req: Request,
    @Body(new OptionalDataValidationPipe()) optionalDataDto: AddOrUpdateOptionalDataDto
  ): Promise<Observable<any>> {
    return this.client.send({ cmd: "change-optional" }, { userId: req.user.userId, optionalDataDto });
  }

  @Get("/refresh-session")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh the entrance session." })
  @ApiCreatedResponse({})
  async refreshAccessToken(@Req() req: Request, @Headers() headers): Promise<Observable<any>> {
    return this.client.send(
      { cmd: "refresh-session" },
      {
        accessToken: headers["access-token"],
        ip: req.socket.remoteAddress,
        userAgent: headers["user-agent"],
        fingerprint: headers["fingerprint"],
        refreshToken: headers["refresh-token"],
        userId: req.user.userId
      }
    );
  }
  
  @Post("/contact")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Handle an appeal." })
  @ApiCreatedResponse({})
  async contact(@Body(new ContactFormValidationPipe()) contactFormDto: ContactFormDto): Promise<Observable<any>> {
    return this.client.send({ cmd: "handle-appeal" }, { contactFormDto });
  }
  
  @Get("/token")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Generate a client access-token." })
  @ApiCreatedResponse({})
  async generateToken(@Req() req: Request, @Headers() headers): Promise<Observable<any>> {
    return this.client.send({ cmd: "generate-client-token" }, { ip: req.socket.remoteAddress, userAgent: headers["user-agent"], fingerprint: headers["fingerprint"] });
  }
  
  // TODO микросервисы (перенастроить команды, все сервисы должны просто возвращать что-то,
  //  параметры входа изменить, убрать миддлвэры и пайпы с сервисов, всё только на публичном апи)
  
  @Post("/create-room")
  @HttpCode(HttpStatus.CREATED)
  async createRoom(@Body(new RoomValidationPipe()) roomDto: RoomDto): Promise<Observable<any>> {
    return this.client.send({ cmd: "create-room" }, { roomDto });
  }
  
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllRooms(): Promise<Observable<any>> {
    return this.client.send({ cmd: "get-all-rooms" }, {});
  }
  
  @Get("/room/:name")
  @HttpCode(HttpStatus.OK)
  async findRoomByName(@Req() req: Request): Promise<Observable<any>> {
    return this.client.send({ cmd: "find-room-by-name" }, { req });
  }
  
  @Put("/room/:id")
  @HttpCode(HttpStatus.CREATED)
  async updateRoom(@Req() req: Request, @Body() roomDto: Partial<RoomDto>): Promise<Observable<any>> {
    return this.client.send({ cmd: "update-room" }, { req, roomDto });
  }
  
  @Delete("/room/:id")
  @HttpCode(HttpStatus.OK)
  public async deleteRoom(@Req() req: Request): Promise<Observable<any>> {
    return this.client.send({ cmd: "delete-room" }, { req });
  }
  
  @Put("/message")
  @HttpCode(HttpStatus.CREATED)
  public async addMessageReferenceToRoom(
    @Req() req: Request,
    @Body() { messageId, roomId }: { messageId: string; roomId: string }
  ): Promise<Observable<any>> {
    return this.client.send({ cmd: "add-message-reference" }, { req, messageId, roomId });
  }
  
  @Delete("/message")
  @HttpCode(HttpStatus.OK)
  public async deleteMessageReferenceFromRoom(
    @Req() req: Request,
    @Body() { messageId, roomId }: { messageId: string; roomId: string }
  ): Promise<Observable<any>> {
    return this.client.send({ cmd: "delete-message-reference" }, { req, messageId, roomId });
  }
  
  @Put("/user")
  @HttpCode(HttpStatus.CREATED)
  public async addUserToRoom(
    @Req() req: Request,
    @Body() { userId, roomId }: { userId: string; roomId: string }
  ): Promise<Observable<any>> {
    return this.client.send({ cmd: "add-user" }, { req, userId, roomId });
  }
  
  @Delete("/user")
  @HttpCode(HttpStatus.OK)
  public async deleteUserFromRoom(
    @Req() req: Request,
    @Body() { userId, roomId }: { userId: string; roomId: string }
  ): Promise<Observable<any>> {
    return this.client.send({ cmd: "delete-user" }, { req, userId, roomId });
  }

  @Put("/user-rights")
  @HttpCode(HttpStatus.OK)
  public async changeUserRightsInRoom(
    @Req() req: Request,
    @Body() { userId, roomId, newRights }: { userId: string; roomId: string; newRights: string[] }
  ): Promise<Observable<any>> {
    return this.client.send({ cmd: "change-user-rights" }, { req, userId, roomId, newRights });
  }
}
