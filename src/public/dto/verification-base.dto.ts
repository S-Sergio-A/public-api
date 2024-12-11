import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class VerificationBaseDto {
  @ApiProperty({
    description: "Verification code sent to the user.",
    uniqueItems: true
  })
  @IsUUID()
  verification: string;
}