import { IsDefined, IsNotEmpty, IsString, IsUUID, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyPasswordResetDto {
  @ApiProperty({
    description: 'Verification code assigned to public when "forgot password" request received.',
    uniqueItems: true
  })
  @IsNotEmpty()
  @IsUUID()
  readonly verification: string;

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
    description: "Password verification of the user.",
    minLength: 8,
    maxLength: 50
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(8, 50)
  newPasswordVerification: string;
}
