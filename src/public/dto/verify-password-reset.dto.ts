import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { VALIDATION_ERROR_CODES_CONSTANT, VALIDATION_RULES_CONSTANT, ValidationErrorCodesEnum } from "@ssmovzh/chatterly-common-utils";
import { ValidationRulesEnum } from "@ssmovzh/chatterly-common-utils/enums";
import { IsStrongPassword } from "~/modules/common/decorators/is-strong-password.decorator";
import { Match } from "~/modules/common";

export class VerifyPasswordResetDto {
  @ApiProperty({
    description: 'Verification code assigned to public when "forgot password" request received.',
    uniqueItems: true
  })
  @IsNotEmpty()
  @IsUUID()
  verification: string;

  @ApiProperty({
    description: "The new password of the User.",
    minLength: +VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.PASSWORD_MIN_LENGTH).value,
    maxLength: +VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.PASSWORD_MAX_LENGTH).value
  })
  @IsNotEmpty({ message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.INVALID_PASSWORD).msg })
  @IsString({ message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.INVALID_PASSWORD).msg })
  @Length(
    +VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.PASSWORD_MIN_LENGTH).value,
    +VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.PASSWORD_MAX_LENGTH).value,
    { message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.INVALID_PASSWORD_LENGTH).msg }
  )
  @IsStrongPassword({ message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.WEAK_PASSWORD).msg })
  newPassword: string;

  @ApiProperty({
    description: "The password verification of the User.",
    minLength: +VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.PASSWORD_MIN_LENGTH).value,
    maxLength: +VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.PASSWORD_MAX_LENGTH).value
  })
  @Match("newPassword", { message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.PASSWORDS_DOES_NOT_MATCH).msg })
  newPasswordVerification: string;
}
