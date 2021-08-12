import { IsDefined, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto {
  @ApiProperty({
    example: "petroshrekovenko@gmail.com",
    description: "The email of the User.",
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
    example: "PetroShrekovenko",
    description: "The username of the User.",
    minLength: 4,
    maxLength: 30
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(4, 30)
  readonly username: string;

  @ApiProperty({
    description: "The password of the User.",
    minLength: 8,
    maxLength: 200
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(8, 200)
  password: string;

  @ApiProperty({
    description: "The password verification of the User.",
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
    minLength: 12,
    maxLength: 20
  })
  @IsDefined()
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;
}
