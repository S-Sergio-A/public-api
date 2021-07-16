import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";
import { Observable } from "rxjs";
import { RequestBodyAndInternalExceptionFilter } from "../exceptions/filters/RequestBodyAndInternal.exception-filter";
import { ChangePhoneNumberValidationPipe } from "../pipes/validation/changePhoneNumber.validation.pipe";
import { ChangePasswordValidationPipe } from "../pipes/validation/changePassword.validation.pipe";
import { ChangeUsernameValidationPipe } from "../pipes/validation/changeUsername.validation.pipe";
import { ValidationExceptionFilter } from "../exceptions/filters/Validation.exception-filter";
import { RegistrationValidationPipe } from "../pipes/validation/registration.validation.pipe";
import { OptionalDataValidationPipe } from "../pipes/validation/optionalData.validation.pipe";
import { ChangeEmailValidationPipe } from "../pipes/validation/changeEmail.validation.pipe";
import { ContactFormValidationPipe } from "../pipes/validation/contactForm.validation.pipe";
import { LoginValidationPipe } from "../pipes/validation/login.validation.pipe";
import { RoomValidationPipe } from "../pipes/validation/room.validation.pipe";
import { LoginByEmailDto, LoginByPhoneNumberDto, LoginByUsernameDto } from "./dto/login.dto";
import { AddOrUpdateOptionalDataDto } from "./dto/add-or-update-optional-data.dto";
import { VerifyPasswordResetDto } from "./dto/verify-password-reset.dto";
import { ChangePhoneNumberDto } from "./dto/update-phone.dto";
import { ChangePasswordDto } from "./dto/update-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ChangeUsernameDto } from "./dto/update-username.dto";
import { ChangeEmailDto } from "./dto/update-email.dto";
import { ContactFormDto } from "./dto/contact-form.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { RoomDto } from "./dto/room.dto";

@UseFilters(new RequestBodyAndInternalExceptionFilter(), new ValidationExceptionFilter())
@Controller("public")
export class PublicController {
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
  @ApiOperation({ summary: "Register public." })
  @ApiCreatedResponse({})
  async register(@Body(new RegistrationValidationPipe()) createUserDto: SignUpDto): Promise<Observable<any>> {
    return this.client.send({ cmd: "register" }, createUserDto);
  }

  @Put("/verify-registration")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify registration." })
  @ApiOkResponse({})
  async verifyRegistration(@Query() query): Promise<Observable<any>> {
    return this.client.send({ cmd: "verify-registration" }, { email: query.email, verification: query.verification });
  }

  @Post("/login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Log in the public." })
  @ApiCreatedResponse({})
  async login(
    @Req() req: Request,
    @Headers() headers,
    @Body(new LoginValidationPipe()) loginUserDto: LoginByEmailDto & LoginByUsernameDto & LoginByPhoneNumberDto & { rememberMe: boolean }
  ): Promise<Observable<any>> {
    if (await this.validateRequestAndHeaders(req, headers, false)) {
      return this.client.send(
        { cmd: "login" },
        {
          ip: req.socket.remoteAddress,
          userAgent: headers["user-agent"],
          fingerprint: headers["fingerprint"],
          loginUserDto
        }
      );
    }
  }

  @Post("/reset-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Request resetting for a forgotten password." })
  @ApiOkResponse({})
  async resetPassword(
    @Req() req: Request,
    @Headers() headers,
    @Body() forgotPasswordDto: ForgotPasswordDto
  ): Promise<Observable<any> | HttpStatus> {
    if (await this.validateRequestAndHeaders(req, headers, false)) {
      return this.client.send(
        { cmd: "reset-password" },
        {
          ip: req.socket.remoteAddress,
          userAgent: headers["user-agent"],
          fingerprint: headers["fingerprint"],
          forgotPasswordDto
        }
      );
    }
    return HttpStatus.BAD_REQUEST;
  }

  @Put("/verify-password-reset")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify a password reset operation and create a new password." })
  @ApiOkResponse({})
  async verifyPasswordReset(@Query() query, @Body() verifyPasswordResetDto: VerifyPasswordResetDto): Promise<Observable<any> | HttpStatus> {
    return this.client.send({ cmd: "verify-password-reset" }, { email: query.email, verifyPasswordResetDto });
  }

  @Get("/logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify a password reset operation and create a new password." })
  @ApiOkResponse({})
  async logout(@Req() req: Request, @Headers() headers): Promise<Observable<any> | HttpStatus> {
    if (await this.validateRequestAndHeaders(req, headers)) {
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
    return HttpStatus.BAD_REQUEST;
  }

  @Put("/email")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Change an email." })
  @ApiCreatedResponse({})
  async changeEmail(
    @Req() req: Request,
    @Headers() headers,
    @Body(new ChangeEmailValidationPipe()) changeEmailDto: ChangeEmailDto
  ): Promise<Observable<any> | HttpStatus> {
    if (await this.validateRequestAndHeaders(req, headers)) {
      return this.client.send(
        { cmd: "change-email" },
        {
          userId: req.user.userId,
          ip: req.socket.remoteAddress,
          userAgent: headers["user-agent"],
          fingerprint: headers["fingerprint"],
          changeEmailDto
        }
      );
    }
    return HttpStatus.BAD_REQUEST;
  }

  @Put("/username")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Change a username." })
  @ApiCreatedResponse({})
  async changeUsername(
    @Req() req: Request,
    @Headers() headers,
    @Body(new ChangeUsernameValidationPipe()) changeUsernameDto: ChangeUsernameDto
  ): Promise<Observable<any> | HttpStatus> {
    if (await this.validateRequestAndHeaders(req, headers)) {
      return this.client.send(
        { cmd: "change-username" },
        {
          userId: req.user.userId,
          ip: req.socket.remoteAddress,
          userAgent: headers["user-agent"],
          fingerprint: headers["fingerprint"],
          changeUsernameDto
        }
      );
    }

    return HttpStatus.BAD_REQUEST;
  }

  @Put("/phone")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Change a phone number." })
  @ApiCreatedResponse({})
  async changePhoneNumber(
    @Req() req: Request,
    @Headers() headers,
    @Body(new ChangePhoneNumberValidationPipe()) changePhoneNumberDto: ChangePhoneNumberDto
  ): Promise<Observable<any> | HttpStatus> {
    if (await this.validateRequestAndHeaders(req, headers)) {
      return this.client.send(
        { cmd: "change-phone" },
        {
          userId: req.user.userId,
          ip: req.socket.remoteAddress,
          userAgent: headers["user-agent"],
          fingerprint: headers["fingerprint"],
          changePhoneNumberDto
        }
      );
    }
    return HttpStatus.BAD_REQUEST;
  }

  @Put("/password")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Change a password." })
  @ApiCreatedResponse({})
  async changePassword(
    @Req() req: Request,
    @Headers() headers,
    @Body(new ChangePasswordValidationPipe()) changePasswordDto: ChangePasswordDto
  ): Promise<Observable<any> | HttpStatus> {
    if (await this.validateRequestAndHeaders(req, headers)) {
      return this.client.send(
        { cmd: "change-password" },
        {
          userId: req.user.userId,
          ip: req.socket.remoteAddress,
          userAgent: headers["user-agent"],
          fingerprint: headers["fingerprint"],
          changePasswordDto
        }
      );
    }
    return HttpStatus.BAD_REQUEST;
  }

  @Post("/verify-change")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Verify a primary data change." })
  @ApiCreatedResponse({})
  async verifyPrimaryDataChange(@Req() req: Request, @Query() query): Promise<Observable<any>> {
    return this.client.send(
      { cmd: "verify-primary-data-change" },
      {
        userId: req.user.userId,
        verification: query.verification,
        dataType: query.dataType
      }
    );
  }

  @Put("/optional")
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
  @ApiOperation({ summary: "Refresh the public session." })
  @ApiCreatedResponse({})
  async refreshAccessToken(@Req() req: Request, @Headers() headers): Promise<Observable<any> | HttpStatus> {
    if (await this.validateRequestAndHeaders(req, headers)) {
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

    return HttpStatus.BAD_REQUEST;
  }

  @Post("/contact")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Handle an appeal." })
  @ApiCreatedResponse({})
  async contact(@Body(new ContactFormValidationPipe()) contactFormDto: ContactFormDto): Promise<Observable<any>> {
    return this.client.send({ cmd: "handle-appeal" }, contactFormDto);
  }

  @Get("/token")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Generate a client access-token." })
  @ApiCreatedResponse({})
  async generateToken(@Req() req: Request, @Headers() headers): Promise<Observable<any> | HttpStatus> {
    if (await this.validateRequestAndHeaders(req, headers, false)) {
      return this.client.send(
        { cmd: "generate-client-token" },
        { ip: req.socket.remoteAddress, userAgent: headers["user-agent"], fingerprint: headers["fingerprint"] }
      );
    }

    return HttpStatus.BAD_REQUEST;
  }

  @Post("/create-room")
  @HttpCode(HttpStatus.CREATED)
  async createRoom(@Req() req, @Body(new RoomValidationPipe()) roomDto: RoomDto): Promise<Observable<any>> {
    return this.client.send({ cmd: "create-room" }, { roomDto, userId: req.user.userId });
  }

  @Get("/rooms")
  @HttpCode(HttpStatus.OK)
  async getAllRooms(): Promise<Observable<any>> {
    return this.client.send({ cmd: "get-all-rooms" }, {});
  }

  @Get("/user-rooms")
  @HttpCode(HttpStatus.OK)
  async getAllUserRooms(@Req() req): Promise<Observable<any>> {
    return this.client.send({ cmd: "get-all-user-rooms" }, { userId: req.user.userId });
  }

  @Get("/room/:name")
  @HttpCode(HttpStatus.OK)
  async findRoomByName(@Req() req: Request): Promise<Observable<any>> {
    return this.client.send({ cmd: "find-room-by-name" }, { name: req.params.name });
  }

  @Put("/room")
  @HttpCode(HttpStatus.CREATED)
  async updateRoom(@Query() query, @Headers() headers, @Body() roomDto: Partial<RoomDto>): Promise<Observable<any>> {
    return this.client.send({ cmd: "update-room" }, { rights: headers["rights"], roomId: query.roomId, roomDto });
  }

  @Delete("/room/:id")
  @HttpCode(HttpStatus.OK)
  public async deleteRoom(@Req() req: Request, @Headers() headers): Promise<Observable<any>> {
    return this.client.send({ cmd: "delete-room" }, { rights: headers["rights"], roomId: req.params.id });
  }

  @Put("/user")
  @HttpCode(HttpStatus.CREATED)
  public async addUserToRoom(@Query() query, @Headers() headers): Promise<Observable<any>> {
    return this.client.send(
      { cmd: "add-user" },
      {
        rights: headers["rights"],
        userId: query.userId,
        roomId: query.roomId
      }
    );
  }

  @Delete("/user")
  @HttpCode(HttpStatus.OK)
  public async deleteUserFromRoom(@Query() query, @Headers() headers): Promise<Observable<any>> {
    return this.client.send(
      { cmd: "delete-user" },
      {
        rights: headers["rights"],
        userId: query.userId,
        roomId: query.roomId
      }
    );
  }

  @Put("/user-rights")
  @HttpCode(HttpStatus.OK)
  public async changeUserRightsInRoom(
    @Query() query,
    @Headers() headers,
    @Body() { newRights }: { newRights: string[] }
  ): Promise<Observable<any>> {
    return this.client.send(
      { cmd: "change-user-rights" },
      {
        rights: headers["rights"],
        userId: query.userId,
        roomId: query.roomId,
        newRights
      }
    );
  }

  private async validateRequestAndHeaders(req: Request, headers: any, validateId: boolean = true) {
    const userId = req.user?.userId;
    const fingerprint = headers["fingerprint"];
    const userAgent = headers["user-agent"];
    const ip = req.socket.remoteAddress;
    if (!!fingerprint && !!userAgent && !!ip) {
      if (validateId) {
        return !!userId;
      }
      return true;
    }
    return false;
  }
}
