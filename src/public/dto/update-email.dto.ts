import { IsDefined, IsEmail, IsNotEmpty, IsUUID, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangeEmailDto {
  @ApiProperty({
    example: "oldpetroshrekovenko@gmail.com",
    description: "The old email of the User.",
    format: "email",
    uniqueItems: true,
    minLength: 6,
    maxLength: 254
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  oldEmail: string;

  @ApiProperty({
    example: "newpetroshrekovenko@gmail.com",
    description: "The new email of the User.",
    format: "email",
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
    description: 'Verification code sent to the User.',
    format: "uuid",
    uniqueItems: true
  })
  @IsNotEmpty()
  @IsUUID()
  verification: string;
}
