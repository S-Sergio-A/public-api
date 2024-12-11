import { IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  VALIDATION_ERROR_CODES_CONSTANT,
  VALIDATION_RULES_CONSTANT,
  ValidationErrorCodesEnum
} from "@ssmovzh/chatterly-common-utils";
import { ValidationRulesEnum } from "@ssmovzh/chatterly-common-utils/enums";
import { VerificationBaseDto } from "~/public/dto/verification-base.dto";
import { NotMatch } from "~/modules/common";

export class ChangeUsernameDto extends VerificationBaseDto {
  @ApiProperty({
    example: "johnDoe123",
    description: "The old username of the user.",
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
    description: "The newusername of the user.",
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
  @NotMatch("oldUsername", { message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.USERNAME_MATCHES_WITH_THE_PREVIOUS).msg })
  newUsername: string
}
