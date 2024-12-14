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
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthDataInterface, RabbitQueuesEnum, RightsEnum } from "@ssmovzh/chatterly-common-utils";
import { Request } from "express";
import { AuthDataInject, CustomHeadersEnum, Public } from "~/modules/common";
import { AuthGuard } from "~/modules/auth/auth.guard";
import { PublicService } from "~/public/public.service";
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

@ApiTags("Public")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("public")
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Public()
  @Get("/invoke")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Invoke all microservices (for Heroku)." })
  @ApiOkResponse()
  async invokeAll(): Promise<void> {
    return this.publicService.publishMessage("invoke", {});
  }

  @Post("/sign-up")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new user." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async register(@Body() createUserDto: SignUpDto): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.SIGN_UP, createUserDto);
  }

  @Put("/verify-registration")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify registration." })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async verifyRegistration(@Query() query: any): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.VERIFY_SIGN_UP, {
      email: query.email,
      verification: query.verification
    });
  }

  @Post("/login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Log in the user." })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async login(
    @Req() req: Request,
    @Headers() headers: any,
    @Body()
    loginUserDto: LoginByEmailDto &
      LoginByUsernameDto &
      LoginByPhoneNumberDto & {
        rememberMe: boolean;
      }
  ): Promise<any> {
    if (await this._validateRequestAndHeaders(req, headers)) {
      return this.publicService.publishMessage(RabbitQueuesEnum.LOGIN, {
        ip: req.socket.remoteAddress,
        userAgent: headers[CustomHeadersEnum.USER_AGENT],
        fingerprint: headers[CustomHeadersEnum.X_FINGERPRINT],
        loginUserDto
      });
    }
  }

  @Post("/reset-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Request resetting for a forgotten password." })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async resetPassword(
    @Req() req: Request,
    @Headers() headers: any,
    @Body() forgotPasswordDto: ForgotPasswordDto
  ): Promise<any | HttpStatus> {
    if (await this._validateRequestAndHeaders(req, headers)) {
      return this.publicService.publishMessage(RabbitQueuesEnum.RESET_PASSWORD, {
        ip: req.socket.remoteAddress,
        userAgent: headers[CustomHeadersEnum.USER_AGENT],
        fingerprint: headers[CustomHeadersEnum.X_FINGERPRINT],
        forgotPasswordDto
      });
    }
    return HttpStatus.BAD_REQUEST;
  }

  @Put("/verify-password-reset")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify a password reset operation and create a new password." })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async verifyPasswordReset(@Query() query: any, @Body() verifyPasswordResetDto: VerifyPasswordResetDto): Promise<any | HttpStatus> {
    return this.publicService.publishMessage(RabbitQueuesEnum.VERIFY_PASSWORD_RESET, {
      email: query.email,
      verifyPasswordResetDto
    });
  }

  @Get("/logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify a password reset operation and create a new password." })
  @ApiOkResponse()
  async logout(@AuthDataInject() authData: AuthDataInterface, @Req() req: Request, @Headers() headers: any): Promise<any | HttpStatus> {
    if (await this._validateRequestAndHeaders(req, headers)) {
      return this.publicService.publishMessage(RabbitQueuesEnum.LOG_OUT, {
        accessToken: headers[CustomHeadersEnum.X_ACCESS_TOKEN],
        ip: req.socket.remoteAddress,
        userAgent: headers[CustomHeadersEnum.USER_AGENT],
        fingerprint: headers[CustomHeadersEnum.X_FINGERPRINT],
        refreshToken: headers[CustomHeadersEnum.X_REFRESH_TOKEN],
        userId: authData.clientId
      });
    }
    return HttpStatus.BAD_REQUEST;
  }

  @Put("/email")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Change an email." })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async changeEmail(
    @AuthDataInject() authData: AuthDataInterface,
    @Req() req: Request,
    @Headers() headers: any,
    @Body() changeEmailDto: ChangeEmailDto
  ): Promise<any | HttpStatus> {
    if (await this._validateRequestAndHeaders(req, headers)) {
      return this.publicService.publishMessage(RabbitQueuesEnum.CHANGE_EMAIL, {
        userId: authData.clientId,
        ip: req.socket.remoteAddress,
        userAgent: headers[CustomHeadersEnum.USER_AGENT],
        fingerprint: headers[CustomHeadersEnum.X_FINGERPRINT],
        changeEmailDto
      });
    }
    return HttpStatus.BAD_REQUEST;
  }

  @Put("/username")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Change a username." })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async changeUsername(
    @AuthDataInject() authData: AuthDataInterface,
    @Req() req: Request,
    @Headers() headers: any,
    @Body() changeUsernameDto: ChangeUsernameDto
  ): Promise<any | HttpStatus> {
    if (await this._validateRequestAndHeaders(req, headers)) {
      return this.publicService.publishMessage(RabbitQueuesEnum.CHANGE_USERNAME, {
        userId: authData.clientId,
        ip: req.socket.remoteAddress,
        userAgent: headers[CustomHeadersEnum.USER_AGENT],
        fingerprint: headers[CustomHeadersEnum.X_FINGERPRINT],
        changeUsernameDto
      });
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
    @Headers() headers: any,
    @Body() changePhoneNumberDto: ChangePhoneNumberDto,
    @AuthDataInject() authData: AuthDataInterface
  ): Promise<any | HttpStatus> {
    if (await this._validateRequestAndHeaders(req, headers)) {
      return this.publicService.publishMessage(RabbitQueuesEnum.CHANGE_TEL, {
        userId: authData.clientId,
        ip: req.socket.remoteAddress,
        userAgent: headers[CustomHeadersEnum.USER_AGENT],
        fingerprint: headers[CustomHeadersEnum.X_FINGERPRINT],
        changePhoneNumberDto
      });
    }
    return HttpStatus.BAD_REQUEST;
  }

  @Put("/password")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Change a password." })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async changePassword(
    @AuthDataInject() authData: AuthDataInterface,
    @Req() req: Request,
    @Headers() headers: any,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<any | HttpStatus> {
    if (await this._validateRequestAndHeaders(req, headers)) {
      return this.publicService.publishMessage(RabbitQueuesEnum.CHANGE_PASSWORD, {
        userId: authData.clientId,
        ip: req.socket.remoteAddress,
        userAgent: headers[CustomHeadersEnum.USER_AGENT],
        fingerprint: headers[CustomHeadersEnum.X_FINGERPRINT],
        changePasswordDto
      });
    }
    return HttpStatus.BAD_REQUEST;
  }

  @Post("/verify-change")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Verify a primary data change." })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async verifyPrimaryDataChange(@AuthDataInject() authData: AuthDataInterface, @Query() query: any): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.VERIFY_ACCOUNT_UPDATE, {
      userId: authData.clientId,
      verification: query.verification,
      dataType: query.dataType
    });
  }

  @Put("/optional")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Add or update an optional data (first and last name, birthday)." })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async addOrChangeOptionalData(
    @AuthDataInject() authData: AuthDataInterface,
    @Body() optionalDataDto: AddOrUpdateOptionalDataDto
  ): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.CHANGE_DETAILS, {
      userId: authData.clientId,
      optionalDataDto
    });
  }

  @Put("/photo")
  @UseInterceptors(FileInterceptor("file"))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Add or update a user profile photo." })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async changePhoto(@AuthDataInject() authData: AuthDataInterface, @Body() photo: File): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.CHANGE_PHOTO, { userId: authData.clientId, photo });
  }

  @Get("/refresh-session")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh the public session." })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async refreshAccessToken(
    @AuthDataInject() authData: AuthDataInterface,
    @Req() req: Request,
    @Headers() headers: any
  ): Promise<any | HttpStatus> {
    if (await this._validateRequestAndHeaders(req, headers)) {
      return this.publicService.publishMessage(RabbitQueuesEnum.REFRESH_SESSION, {
        accessToken: headers[CustomHeadersEnum.X_ACCESS_TOKEN],
        ip: req.socket.remoteAddress,
        userAgent: headers[CustomHeadersEnum.USER_AGENT],
        fingerprint: headers[CustomHeadersEnum.X_FINGERPRINT],
        refreshToken: headers[CustomHeadersEnum.X_REFRESH_TOKEN],
        userId: authData.clientId
      });
    }

    return HttpStatus.BAD_REQUEST;
  }

  @Post("/contact")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Handle an appeal." })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async contact(@Body() contactFormDto: ContactFormDto): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.HANDLE_APPEAL, contactFormDto);
  }

  @Get("/token")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Generate a publicService access-token." })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async generateToken(@Req() req: Request, @Headers() headers: any): Promise<any | HttpStatus> {
    if (await this._validateRequestAndHeaders(req, headers)) {
      return this.publicService.publishMessage(RabbitQueuesEnum.GENERATE_CLIENT_TOKEN, {
        ip: req.socket.remoteAddress,
        userAgent: headers[CustomHeadersEnum.USER_AGENT],
        fingerprint: headers[CustomHeadersEnum.X_FINGERPRINT]
      });
    }

    return HttpStatus.BAD_REQUEST;
  }

  @Post("/create-room")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new room." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async createRoom(@AuthDataInject() authData: AuthDataInterface, @Body() roomDto: RoomDto): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.CREATE_ROOM, { roomDto, userId: authData.clientId });
  }

  @Get("/recent-message")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Add a recent message data to the room." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async recentMessage(@Query() query: any): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.ADD_RECENT_MESSAGE, { roomId: query.roomId });
  }

  @Get("/rooms")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all active rooms." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async getAllRooms(): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.GET_ALL_ROOMS, {});
  }

  @Get("/user-rooms")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all rooms where the user is a member." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async getAllUserRooms(@AuthDataInject() authData: AuthDataInterface): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.GET_ALL_USER_ROOMS, { userId: authData.clientId });
  }

  @Get("/room/:name")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Search a room by name." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async findRoomAndUsersByName(@Req() req: Request, @Query() query: any): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.FIND_ROOM_AND_USERS_BY_NAME, {
      name: req.params.name,
      userId: query.userId
    });
  }

  @Put("/room")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Update room data." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async updateRoom(@Query() query: any, @Headers() headers: any, @Body() roomDto: Partial<RoomDto>): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.UPDATE_ROOM, {
      rights: headers[CustomHeadersEnum.X_RIGHTS].split(","),
      userId: query.userId,
      roomId: query.roomId,
      roomDto
    });
  }

  @Put("/room-photo")
  @UseInterceptors(FileInterceptor("file"))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Add or update a room photo." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  async changeRoomPhoto(@Query() query: any, @Headers() headers: any, @Body() photo: File): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.CHANGE_ROOM_PHOTO, {
      rights: headers[CustomHeadersEnum.X_RIGHTS].split(","),
      userId: query.userId,
      roomId: query.roomId,
      photo
    });
  }

  @Delete("/room")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete a room." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  public async deleteRoom(@Query() query: any, @Headers() headers: any): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.DELETE_ROOM, {
      rights: headers[CustomHeadersEnum.X_RIGHTS].split(","),
      roomId: query.roomId,
      userId: query.userId
    });
  }

  @Put("/enter-room")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Enter a public room." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  public async enterPublicRoom(@Query() query: any): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.ENTER_PUBLIC_ROOM, {
      userId: query.userId,
      roomId: query.roomId
    });
  }

  @Put("/user")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Add a new member to the room." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  public async addUserToRoom(@Query() query: any, @Headers() headers: any, @Body() { userRights }): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.ADD_USER, {
      rights: headers[CustomHeadersEnum.X_RIGHTS].split(","),
      userId: query.userId,
      roomId: query.roomId,
      newUserIdentifier: query.newUserIdentifier,
      userRights
    });
  }

  @Delete("/user")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Kick a member from the room." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  public async deleteUserFromRoom(
    @AuthDataInject() authData: AuthDataInterface,
    @Query() query: any,
    @Headers() headers: any
  ): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.DELETE_USER, {
      rights: headers[CustomHeadersEnum.X_RIGHTS].split(","),
      userId: authData.clientId,
      userIdToBeDeleted: query.userId,
      roomId: query.roomId,
      type: query.type
    });
  }

  @Put("/user-rights")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Change the rights of a specific room member." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  public async changeUserRightsInRoom(
    @Query() query: any,
    @Headers() headers: any,
    @Body() { newRights }: { newRights: RightsEnum[] }
  ): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.CHANGE_USER_RIGHTS, {
      rights: headers[CustomHeadersEnum.X_RIGHTS].split(","),
      performerUserId: query.performerUserId,
      targetUserId: query.targetUserId,
      roomId: query.roomId,
      newRights
    });
  }

  @Get("/notifications")
  @HttpCode(HttpStatus.OK)
  public async getUserNotificationsSettings(@Query() query: any): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.GET_NOTIFICATIONS_SETTINGS, {
      userId: query.userId
    });
  }

  @Get("/rights")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get the rights of a specific room member." })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  public async getUserRightsInRoom(@Query() query: any): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.LOAD_RIGHTS, {
      userId: query.userId,
      roomId: query.roomId
    });
  }

  @Put("/notifications")
  @HttpCode(HttpStatus.OK)
  public async changeNotificationSettings(@Query() query: any): Promise<any> {
    return this.publicService.publishMessage(RabbitQueuesEnum.CHANGE_NOTIFICATIONS_SETTINGS, {
      userId: query.userId,
      roomId: query.roomId,
      notifications: query.notifications
    });
  }

  private async _validateRequestAndHeaders(req: Request, headers: any) {
    const fingerprint = headers[CustomHeadersEnum.X_FINGERPRINT];
    const userAgent = headers[CustomHeadersEnum.USER_AGENT];
    const ip = req.socket.remoteAddress;
    return !!fingerprint && !!userAgent && !!ip;
  }
}
