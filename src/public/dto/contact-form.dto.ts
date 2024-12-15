import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ContactSubjectsEnum, VALIDATION_ERROR_CODES, ValidationErrorCodesEnum } from "@ssmovzh/chatterly-common-utils";

export class ContactFormDto {
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
  clientEmail: string;

  @ApiProperty({
    example: "John Doe",
    description: "Full name of the client."
  })
  @IsNotEmpty()
  @IsString()
  clientFullName: string;

  @ApiProperty({
    example: Object.values(ContactSubjectsEnum).join(" | "),
    description: "Subject of the message."
  })
  @IsEnum(ContactSubjectsEnum)
  @IsString()
  subject: string;

  @ApiProperty({
    description: "Message of the client."
  })
  @IsString()
  @Length(1, 2000)
  message: string;
}
