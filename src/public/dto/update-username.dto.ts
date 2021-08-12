import { IsDefined, IsNotEmpty, IsString, IsUUID, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangeUsernameDto {
  @ApiProperty({
    example: "PetroShrekovenkoOld",
    description: "Old username.",
    uniqueItems: true,
    minLength: 4,
    maxLength: 30
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(4, 30)
  readonly oldUsername: string;

  @ApiProperty({
    example: "PetroShrekovenkoNew",
    description: "New username.",
    uniqueItems: true,
    minLength: 4,
    maxLength: 30
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(4, 30)
  readonly newUsername: string;

  @ApiProperty({
    description: "Verification code sent to the user.",
    uniqueItems: true
  })
  @IsNotEmpty()
  @IsUUID()
  verification: string;
}
