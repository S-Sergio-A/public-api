import { IsNotEmpty, IsPhoneNumber, IsUUID, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { VALIDATION_ERROR_CODES_CONSTANT, VALIDATION_RULES_CONSTANT, ValidationErrorCodesEnum } from "@ssmovzh/chatterly-common-utils";
import { ValidationRulesEnum } from "@ssmovzh/chatterly-common-utils/enums";

export class ChangePhoneNumberDto {
  @ApiProperty({
    example: "+1234567890",
    description: "The old phone number of the User.",
    minLength: +VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.TEL_NUM_MIN_LENGTH).value
  })
  @IsNotEmpty({ message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.EMPTY_FIELD).msg })
  @IsPhoneNumber(null, { message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.INVALID_TEL_NUM).msg })
  @MinLength(+VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.TEL_NUM_MIN_LENGTH).value, {
    message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.INVALID_TEL_NUM_LENGTH).msg
  })
  oldPhoneNumber: string;

  @ApiProperty({
    example: "+1234567890",
    description: "The new phone number of the User.",
    minLength: +VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.TEL_NUM_MIN_LENGTH).value
  })
  @IsNotEmpty({ message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.EMPTY_FIELD).msg })
  @IsPhoneNumber(null, { message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.INVALID_TEL_NUM).msg })
  @MinLength(+VALIDATION_RULES_CONSTANT.get(ValidationRulesEnum.TEL_NUM_MIN_LENGTH).value, {
    message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.INVALID_TEL_NUM_LENGTH).msg
  })
  phoneNumber: string;

  @ApiProperty({
    description: "Verification code sent to the user.",
    uniqueItems: true
  })
  @IsNotEmpty()
  @IsUUID()
  verification: string;
}
