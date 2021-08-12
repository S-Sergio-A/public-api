import { IsDefined, IsNotEmpty, IsString, IsUUID, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
  @ApiProperty({
    description: "Old password of the user.",
    minLength: 8,
    maxLength: 50
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(8, 50)
  oldPassword: string;

  @ApiProperty({
    description: "New password of the user.",
    minLength: 8,
    maxLength: 50
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(8, 50)
  newPassword: string;

  @ApiProperty({
    description: "Verification code sent to the user.",
    uniqueItems: true
  })
  @IsNotEmpty()
  @IsUUID()
  verification: string;
}
