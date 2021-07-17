import { IsDefined, IsNotEmpty, IsOptional, IsPhoneNumber, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePhoneNumberDto {
  @ApiProperty({
    example: "+380501224456, or +380 (050) 122-44-56.",
    description: "The old mobile phone number of the User.",
    format: "string",
    minLength: 12,
    maxLength: 20
  })
  @IsDefined()
  @IsNotEmpty()
  @IsPhoneNumber()
  @IsOptional()
  readonly oldPhoneNumber: string;

  @ApiProperty({
    example: "+380501224456, or +380 (050) 122-44-56.",
    description: "The new mobile phone number of the User.",
    format: "string",
    minLength: 12,
    maxLength: 20
  })
  @IsDefined()
  @IsNotEmpty()
  @IsPhoneNumber()
  @IsOptional()
  readonly newPhoneNumber: string;

  @ApiProperty({
    description: "Verification code sent to the User.",
    format: "uuid",
    uniqueItems: true
  })
  @IsNotEmpty()
  @IsUUID()
  verification: string;
}
