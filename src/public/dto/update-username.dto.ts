import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { VALIDATION_ERROR_CODES_CONSTANT, VALIDATION_RULES_CONSTANT, ValidationErrorCodesEnum } from "@ssmovzh/chatterly-common-utils";
import { ValidationRulesEnum } from "@ssmovzh/chatterly-common-utils/enums";

export class ChangeUsernameDto {
  @ApiProperty({
    example: "johnDoe123",
    description: "The old username of the User.",
    minLength: +VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.USERNAME_MIN_LENGTH).value,
    maxLength: +VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.USERNAME_MIN_LENGTH).value
  })
  @IsNotEmpty({ message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.INVALID_USERNAME).msg })
  @IsString({ message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.INVALID_USERNAME).msg })
  @Length(
    +VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.USERNAME_MIN_LENGTH).value,
    +VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.USERNAME_MAX_LENGTH).value,
    { message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.INVALID_USERNAME_LENGTH).msg }
  )
  oldUsername: string;

  @ApiProperty({
    example: "johnDoe123",
    description: "The newusername of the User.",
    minLength: +VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.USERNAME_MIN_LENGTH).value,
    maxLength: +VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.USERNAME_MIN_LENGTH).value
  })
  @IsNotEmpty({ message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.INVALID_USERNAME).msg })
  @IsString({ message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.INVALID_USERNAME).msg })
  @Length(
    +VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.USERNAME_MIN_LENGTH).value,
    +VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.USERNAME_MAX_LENGTH).value,
    { message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.INVALID_USERNAME_LENGTH).msg }
  )
  newUsername: string;

  @ApiProperty({
    description: "Verification code sent to the user.",
    uniqueItems: true
  })
  @IsNotEmpty()
  @IsUUID()
  verification: string;
}
