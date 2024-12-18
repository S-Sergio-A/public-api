import { IsDate, IsOptional, IsString, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { VALIDATION_ERROR_CODES, ValidationErrorCodesEnum } from "@ssmovzh/chatterly-common-utils";

export class AddOrUpdateOptionalDataDto {
  @ApiProperty({
    example: "John",
    description: "First name of the user."
  })
  @IsString({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_FIRST_NAME).msg })
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    example: "Doe",
    description: "Last name of the user."
  })
  @IsString({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_LAST_NAME).msg })
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: "01.01.1987",
    description: "Birthday of the user."
  })
  @IsString({ message: VALIDATION_ERROR_CODES.get(ValidationErrorCodesEnum.INVALID_BIRTHDAY).msg })
  @IsOptional()
  birthday?: string;

  @ApiProperty({
    example: "https://via.placeholder.com/60",
    description: "URL to the photo of the user."
  })
  @IsUrl()
  @IsOptional()
  photo?: string;
}
