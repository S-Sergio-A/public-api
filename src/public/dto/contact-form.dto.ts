import { IsDefined, IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { VALIDATION_ERROR_CODES_CONSTANT, ValidationErrorCodesEnum } from "@ssmovzh/chatterly-common-utils";

export class ContactFormDto {
  @ApiProperty({
    example: "johndoe@example.com",
    description: "The email of the User.",
    uniqueItems: true,
    minLength: 6,
    maxLength: 254
  })
  @IsNotEmpty({ message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.EMPTY_FIELD).msg })
  @IsEmail(null, { message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.INVALID_EMAIL).msg })
  @Length(6, 254, { message: VALIDATION_ERROR_CODES_CONSTANT.get(ValidationErrorCodesEnum.INVALID_EMAIL_LENGTH).msg })
  clientEmail: string;

  @ApiProperty({
    example: "Petro Shrekovenko.",
    description: "Full name of the client.",
    minLength: 2,
    maxLength: 100
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  clientFullName: string;

  @ApiProperty({
    example: "Careers | PR | Support.",
    description: "Subject of the message.",
    minLength: 8,
    maxLength: 200
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(8, 200)
  subject: string;

  @ApiProperty({
    description: "Message of the client.",
    minLength: 8,
    maxLength: 200
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(1, 2000)
  message: string;
}
