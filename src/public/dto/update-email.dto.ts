import { IsDefined, IsEmail, IsNotEmpty, IsUUID, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangeEmailDto {
  @ApiProperty({
    example: "oldpetroshrekovenko@mail.com",
    description: "Old email of the user.",
    uniqueItems: true,
    minLength: 6,
    maxLength: 254
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  oldEmail: string;

  @ApiProperty({
    example: "newpetroshrekovenko@mail.com",
    description: "New email of the user.",
    uniqueItems: true,
    minLength: 6,
    maxLength: 254
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  @Length(6, 254)
  newEmail: string;

  @ApiProperty({
    description: "Verification code sent to the user.",
    format: "uuid",
    uniqueItems: true
  })
  @IsNotEmpty()
  @IsUUID()
  verification: string;
}
