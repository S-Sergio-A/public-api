import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { VALIDATION_ERROR_CODES, ValidationErrorCodesEnum } from "@ssmovzh/chatterly-common-utils";

export class ForgotPasswordDto {
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
}
