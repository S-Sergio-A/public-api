import { IsDefined, IsNotEmpty, IsString, IsUUID, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
  @ApiProperty({
    example: "Old secret password.",
    description: "The password of the User.",
    format: "string",
    minLength: 8,
    maxLength: 50
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(8, 50)
  oldPassword: string;

  @ApiProperty({
    example: "New secret password.",
    description: "The password of the User.",
    format: "string",
    minLength: 8,
    maxLength: 50
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(8, 50)
  newPassword: string;

  @ApiProperty({
    description: "Verification code sent to the User.",
    format: "uuid",
    uniqueItems: true
  })
  @IsNotEmpty()
  @IsUUID()
  verification: string;
}
