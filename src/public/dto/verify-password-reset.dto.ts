import { IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { VALIDATION_ERROR_CODES, VALIDATION_RULES, ValidationErrorCodesEnum } from "@ssmovzh/chatterly-common-utils";
import { ValidationRulesEnum } from "@ssmovzh/chatterly-common-utils";
import { IsStrongPassword } from "~/modules/common/decorators/is-strong-password.decorator";
import { Match } from "~/modules/common";
import { VerificationBaseDto } from "~/public/dto/verification-base.dto";

export class VerifyPasswordResetDto extends VerificationBaseDto {
  @ApiProperty({
    description: "The new password of the user.",
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
  newPassword: string;

  @ApiProperty({
    description: "The password verification of the user.",
    minLength: +VALIDATION_RULES.get(ValidationRulesEnum.PASSWORD_MIN_LENGTH).value,
    maxLength: +VALIDATION_RULES.get(ValidationRulesEnum.PASSWORD_MAX_LENGTH).value
  })
  @Match("newPassword", { message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.PASSWORDS_DOES_NOT_MATCH).msg })
  newPasswordVerification: string;
}
