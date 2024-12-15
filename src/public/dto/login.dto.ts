import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { VALIDATION_ERROR_CODES, VALIDATION_RULES, ValidationErrorCodesEnum } from "@ssmovzh/chatterly-common-utils";
import { ValidationRulesEnum } from "@ssmovzh/chatterly-common-utils";
import { IsStrongPassword } from "~/modules/common/decorators/is-strong-password.decorator";

export class LoginByEmailDto {
  @ApiProperty({
    example: "johndoe@example.com",
    description: "The email of the user.",
    uniqueItems: true,
    minLength: 6,
    maxLength: 254
  })
  @IsNotEmpty({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.EMPTY_FIELD).msg })
  @IsEmail(null, { message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_EMAIL).msg })
  @Length(6, 254, { message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_EMAIL_LENGTH).msg })
  email: string;

  @ApiProperty({
    description: "The password of the user.",
    minLength: +VALIDATION_RULES.get(ValidationRulesEnum.PASSWORD_MIN_LENGTH).value,
    maxLength: +VALIDATION_RULES.get(ValidationRulesEnum.PASSWORD_MAX_LENGTH).value
  })
  @IsNotEmpty({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_PASSWORD).msg })
  @IsString({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_PASSWORD).msg })
  @Length(
    +VALIDATION_RULES.get(ValidationRulesEnum.PASSWORD_MIN_LENGTH).value,
    +VALIDATION_RULES.get(ValidationRulesEnum.PASSWORD_MAX_LENGTH).value,
    { message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_PASSWORD_LENGTH).msg }
  )
  @IsStrongPassword({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.WEAK_PASSWORD).msg })
  password: string;
}

export class LoginByUsernameDto {
  @ApiProperty({
    example: "johnDoe123",
    description: "The username of the user.",
    minLength: +VALIDATION_RULES.get(ValidationRulesEnum.USERNAME_MIN_LENGTH).value,
    maxLength: +VALIDATION_RULES.get(ValidationRulesEnum.USERNAME_MIN_LENGTH).value
  })
  @IsNotEmpty({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_USERNAME).msg })
  @IsString({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_USERNAME).msg })
  @Length(
    +VALIDATION_RULES.get(ValidationRulesEnum.USERNAME_MIN_LENGTH).value,
    +VALIDATION_RULES.get(ValidationRulesEnum.USERNAME_MAX_LENGTH).value,
    { message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_USERNAME_LENGTH).msg }
  )
  username: string;

  @ApiProperty({
    description: "The password of the user.",
    minLength: +VALIDATION_RULES.get(ValidationRulesEnum.PASSWORD_MIN_LENGTH).value,
    maxLength: +VALIDATION_RULES.get(ValidationRulesEnum.PASSWORD_MAX_LENGTH).value
  })
  @IsNotEmpty({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_PASSWORD).msg })
  @IsString({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_PASSWORD).msg })
  @Length(
    +VALIDATION_RULES.get(ValidationRulesEnum.PASSWORD_MIN_LENGTH).value,
    +VALIDATION_RULES.get(ValidationRulesEnum.PASSWORD_MAX_LENGTH).value,
    { message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_PASSWORD_LENGTH).msg }
  )
  @IsStrongPassword({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.WEAK_PASSWORD).msg })
  password: string;
}

export class LoginByPhoneNumberDto {
  @ApiProperty({
    example: "+1234567890",
    description: "The phone number of the user.",
    minLength: +VALIDATION_RULES.get(ValidationRulesEnum.TEL_NUM_MIN_LENGTH).value
  })
  @IsNotEmpty({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.EMPTY_FIELD).msg })
  @IsPhoneNumber(null, { message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_TEL_NUM).msg })
  @MinLength(+VALIDATION_RULES.get(ValidationRulesEnum.TEL_NUM_MIN_LENGTH).value, {
    message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_TEL_NUM_LENGTH).msg
  })
  phoneNumber: string;

  @ApiProperty({
    description: "The password of the user.",
    minLength: +VALIDATION_RULES.get(ValidationRulesEnum.PASSWORD_MIN_LENGTH).value,
    maxLength: +VALIDATION_RULES.get(ValidationRulesEnum.PASSWORD_MAX_LENGTH).value
  })
  @IsNotEmpty({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_PASSWORD).msg })
  @IsString({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_PASSWORD).msg })
  @Length(
    +VALIDATION_RULES.get(ValidationRulesEnum.PASSWORD_MIN_LENGTH).value,
    +VALIDATION_RULES.get(ValidationRulesEnum.PASSWORD_MAX_LENGTH).value,
    { message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_PASSWORD_LENGTH).msg }
  )
  @IsStrongPassword({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.WEAK_PASSWORD).msg })
  password: string;
}
