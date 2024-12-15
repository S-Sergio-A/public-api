import { IsNotEmpty, IsPhoneNumber, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { VALIDATION_ERROR_CODES, VALIDATION_RULES, ValidationErrorCodesEnum } from "@ssmovzh/chatterly-common-utils";
import { ValidationRulesEnum } from "@ssmovzh/chatterly-common-utils";
import { VerificationBaseDto } from "~/public/dto/verification-base.dto";
import { NotMatch } from "~/modules/common";

export class ChangePhoneNumberDto extends VerificationBaseDto {
  @ApiProperty({
    example: "+1234567890",
    description: "The old phone number of the user.",
    minLength: +VALIDATION_RULES.get(ValidationRulesEnum.TEL_NUM_MIN_LENGTH).value
  })
  @IsNotEmpty({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.EMPTY_FIELD).msg })
  @IsPhoneNumber(null, { message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_TEL_NUM).msg })
  @MinLength(+VALIDATION_RULES.get(ValidationRulesEnum.TEL_NUM_MIN_LENGTH).value, {
    message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_TEL_NUM_LENGTH).msg
  })
  oldPhoneNumber: string;

  @ApiProperty({
    example: "+1234567890",
    description: "The new phone number of the user.",
    minLength: +VALIDATION_RULES.get(ValidationRulesEnum.TEL_NUM_MIN_LENGTH).value
  })
  @IsNotEmpty({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.EMPTY_FIELD).msg })
  @IsPhoneNumber(null, { message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_TEL_NUM).msg })
  @MinLength(+VALIDATION_RULES.get(ValidationRulesEnum.TEL_NUM_MIN_LENGTH).value, {
    message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_TEL_NUM_LENGTH).msg
  })
  @NotMatch("oldPhoneNumber", { message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.TEL_MATCHES_WITH_THE_PREVIOUS).msg })
  newPhoneNumber: string;
}
