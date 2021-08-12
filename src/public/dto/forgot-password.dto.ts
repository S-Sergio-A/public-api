import { IsNotEmpty, IsEmail, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordDto {
  @ApiProperty({
    example: "petroshrekovenko@gmail.com",
    description: "Email of the user.",
    uniqueItems: true,
    minLength: 6,
    maxLength: 254
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(6, 254)
  readonly email: string;
}
