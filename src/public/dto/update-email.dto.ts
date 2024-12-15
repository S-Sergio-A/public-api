import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { VALIDATION_ERROR_CODES, ValidationErrorCodesEnum } from "@ssmovzh/chatterly-common-utils";
import { VerificationBaseDto } from "~/public/dto/verification-base.dto";
import { NotMatch } from "~/modules/common";

export class ChangeEmailDto extends VerificationBaseDto {
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
  oldEmail: string;

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
  @NotMatch("oldEmail", { message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.EMAIL_MATCHES_WITH_THE_PREVIOUS).msg })
  newEmail: string;
}
