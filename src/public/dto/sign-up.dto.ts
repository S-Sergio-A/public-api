import { IsDefined, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto {
  @ApiProperty({
    example: "petroshrekovenko@gmail.com",
    description: "The email of the User.",
    format: "email",
    uniqueItems: true,
    minLength: 6,
    maxLength: 254
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  @Length(6, 254)
  readonly email: string;

  @ApiProperty({
    example: "PetroShrekovenko.",
    description: "The username of the User.",
    format: "string",
    minLength: 4,
    maxLength: 30
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(4, 30)
  readonly username: string;

  @ApiProperty({
    example: "Secret password.",
    description: "The password of the User.",
    format: "string",
    minLength: 8,
    maxLength: 200
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(8, 200)
  password: string;

  @ApiProperty({
    example: "Secret password.",
    description: "The password verification of the User.",
    format: "string",
    minLength: 8,
    maxLength: 200
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(8, 200)
  passwordVerification: string;

  @ApiProperty({
    example: "+380501224456",
    description: "The mobile phone number of the User.",
    format: "string",
    minLength: 12,
    maxLength: 20
  })
  @IsDefined()
  @IsNotEmpty()
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;
}
