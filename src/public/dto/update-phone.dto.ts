import { IsDefined, IsNotEmpty, IsOptional, IsPhoneNumber, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePhoneNumberDto {
  @ApiProperty({
    description: "Old mobile phone number of the user.",
    minLength: 12,
    maxLength: 20
  })
  @IsDefined()
  @IsNotEmpty()
  @IsPhoneNumber()
  @IsOptional()
  readonly oldPhoneNumber: string;

  @ApiProperty({
    description: "New mobile phone number of the user.",
    minLength: 12,
    maxLength: 20
  })
  @IsDefined()
  @IsNotEmpty()
  @IsPhoneNumber()
  @IsOptional()
  readonly newPhoneNumber: string;

  @ApiProperty({
    description: "Verification code sent to the user.",
    uniqueItems: true
  })
  @IsNotEmpty()
  @IsUUID()
  verification: string;
}
