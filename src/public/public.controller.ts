import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseFilters,
  UseInterceptors
} from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { Express, Request } from "express";
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
import { FileInterceptor } from "@nestjs/platform-express";

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

  @Get("/invoke")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Invoke all microservices (for Heroku)." })
  @ApiOkResponse()
  async invokeAll(): Promise<Observable<void>> {
    return this.client.send({ cmd: "invoke" }, {});
  }

  @Post("/sign-up")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register a new user." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async register(@Body(new RegistrationValidationPipe()) createUserDto: SignUpDto): Promise<Observable<any>> {
    return this.client.send({ cmd: "register" }, createUserDto);
  }

  @Put("/verify-registration")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify registration." })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async verifyRegistration(@Query() query): Promise<Observable<any>> {
    return this.client.send({ cmd: "verify-registration" }, { email: query.email, verification: query.verification });
  }

  @Post("/login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Log in the user." })
  @ApiOkResponse()
  @ApiBadRequestResponse()
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
  @ApiOkResponse()
  @ApiBadRequestResponse()
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
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async verifyPasswordReset(@Query() query, @Body() verifyPasswordResetDto: VerifyPasswordResetDto): Promise<Observable<any> | HttpStatus> {
    return this.client.send({ cmd: "verify-password-reset" }, { email: query.email, verifyPasswordResetDto });
  }

  @Get("/logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify a password reset operation and create a new password." })
  @ApiOkResponse()
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
  @ApiOkResponse()
  @ApiBadRequestResponse()
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
  @ApiOkResponse()
  @ApiBadRequestResponse()
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
  @ApiOkResponse()
  @ApiBadRequestResponse()
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
  @ApiOkResponse()
  @ApiBadRequestResponse()
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
  @ApiOkResponse()
  @ApiBadRequestResponse()
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
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async addOrChangeOptionalData(
    @Req() req: Request,
    @Body(new OptionalDataValidationPipe()) optionalDataDto: AddOrUpdateOptionalDataDto
  ): Promise<Observable<any>> {
    return this.client.send({ cmd: "change-optional" }, { userId: req.user.userId, optionalDataDto });
  }

  @Put("/photo")
  @UseInterceptors(FileInterceptor("file"))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Add or update a user profile photo." })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async changePhoto(@Req() req: Request, @Body() photo: Express.Multer.File): Promise<Observable<any>> {
    return this.client.send({ cmd: "change-photo" }, { userId: req.user.userId, photo });
  }

  @Get("/refresh-session")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh the public session." })
  @ApiOkResponse()
  @ApiBadRequestResponse()
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
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async contact(@Body(new ContactFormValidationPipe()) contactFormDto: ContactFormDto): Promise<Observable<any>> {
    return this.client.send({ cmd: "handle-appeal" }, contactFormDto);
  }

  @Get("/token")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Generate a client access-token." })
  @ApiOkResponse()
  @ApiBadRequestResponse()
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
  @ApiOperation({ summary: "Create a new room." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async createRoom(@Req() req: Request, @Body(new RoomValidationPipe()) roomDto: RoomDto): Promise<Observable<any>> {
    return this.client.send({ cmd: "create-room" }, { roomDto, userId: req.user.userId });
  }

  @Get("/recent-message")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Add a recent message data to the room." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async recentMessage(@Query() query): Promise<Observable<any>> {
    return this.client.send({ cmd: "add-recent-message" }, { roomId: query.roomId });
  }

  @Get("/rooms")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all active rooms." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async getAllRooms(): Promise<Observable<any>> {
    return this.client.send({ cmd: "get-all-rooms" }, {});
  }

  @Get("/user-rooms")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all rooms where the user is a member." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async getAllUserRooms(@Req() req: Request): Promise<Observable<any>> {
    return this.client.send({ cmd: "get-all-user-rooms" }, { userId: req.user.userId });
  }

  @Get("/room/:name")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Search a room by name." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async findRoomAndUsersByName(@Req() req: Request, @Query() query): Promise<Observable<any>> {
    return this.client.send({ cmd: "find-room-and-users-by-name" }, { name: req.params.name, userId: query.userId });
  }

  @Put("/room")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Update room data." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async updateRoom(@Query() query, @Headers() headers, @Body() roomDto: Partial<RoomDto>): Promise<Observable<any>> {
    return this.client.send(
      { cmd: "update-room" },
      { rights: headers["rights"].split(","), userId: query.userId, roomId: query.roomId, roomDto }
    );
  }

  @Put("/room-photo")
  @UseInterceptors(FileInterceptor("file"))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Add or update a room photo." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async changeRoomPhoto(@Query() query, @Headers() headers, @Body() photo: Express.Multer.File): Promise<Observable<any>> {
    return this.client.send(
      { cmd: "change-room-photo" },
      { rights: headers["rights"].split(","), userId: query.userId, roomId: query.roomId, photo }
    );
  }

  @Delete("/room")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete a room." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  public async deleteRoom(@Query() query, @Headers() headers): Promise<Observable<any>> {
    return this.client.send({ cmd: "delete-room" }, { rights: headers["rights"].split(","), roomId: query.roomId, userId: query.userId });
  }

  @Put("/enter-room")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Enter a public room." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  public async enterPublicRoom(@Query() query): Promise<Observable<any>> {
    return this.client.send(
      { cmd: "enter-public-room" },
      {
        userId: query.userId,
        roomId: query.roomId
      }
    );
  }

  @Put("/user")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Add a new member to the room." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  public async addUserToRoom(@Query() query, @Headers() headers, @Body() { userRights }): Promise<Observable<any>> {
    return this.client.send(
      { cmd: "add-user" },
      {
        rights: headers["rights"].split(","),
        userId: query.userId,
        roomId: query.roomId,
        newUserIdentifier: query.newUserIdentifier,
        userRights
      }
    );
  }

  @Delete("/user")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Kick a member from the room." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  public async deleteUserFromRoom(@Req() req: Request, @Query() query, @Headers() headers): Promise<Observable<any>> {
    return this.client.send(
      { cmd: "delete-user" },
      {
        rights: headers["rights"].split(","),
        userId: req.user.userId,
        userIdToBeDeleted: query.userId,
        roomId: query.roomId,
        type: query.type
      }
    );
  }

  @Put("/user-rights")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Change the rights of a specific room member." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  public async changeUserRightsInRoom(
    @Query() query,
    @Headers() headers,
    @Body() { newRights }: { newRights: string[] }
  ): Promise<Observable<any>> {
    return this.client.send(
      { cmd: "change-user-rights" },
      {
        rights: headers["rights"].split(","),
        performerUserId: query.performerUserId,
        targetUserId: query.targetUserId,
        roomId: query.roomId,
        newRights
      }
    );
  }

  @Get("/notifications")
  @HttpCode(HttpStatus.OK)
  public async getUserNotificationsSettings(@Query() query): Promise<Observable<any>> {
    return this.client.send(
      { cmd: "get-notifications-settings" },
      {
        userId: query.userId
      }
    );
  }

  @Get("/rights")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get the rights of a specific room member." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  public async getUserRightsInRoom(@Query() query): Promise<Observable<any>> {
    return this.client.send(
      { cmd: "load-rights" },
      {
        userId: query.userId,
        roomId: query.roomId
      }
    );
  }

  @Put("/notifications")
  @HttpCode(HttpStatus.OK)
  public async changeNotificationSettings(@Query() query): Promise<Observable<any>> {
    return this.client.send(
      { cmd: "change-notifications-settings" },
      {
        userId: query.userId,
        roomId: query.roomId,
        notifications: query.notifications
      }
    );
  }

  @Get("/200")
  @HttpCode(HttpStatus.OK)
  public async error200(): Promise<HttpStatus> {
    return HttpStatus.OK;
  }

  @Get("/500")
  @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
  public async error500(): Promise<HttpStatus> {
    new Promise((resolve) => {
      setTimeout(resolve, 10000);
    });
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private async validateRequestAndHeaders(req: Request, headers: any, validateId = true) {
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
