import { IsDate, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddOrUpdateOptionalDataDto {
  @ApiProperty({
    example: "Petro",
    description: "The first name of the User.",
    format: "string",
    minLength: 1,
    maxLength: 50
  })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({
    example: "Shrekovenko",
    description: "The last name of the User.",
    format: "string",
    minLength: 1,
    maxLength: 50
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    example: "02.10.2002",
    description: "The birthday of the User.",
    format: "date",
    minLength: 10,
    maxLength: 10
  })
  @IsDate()
  @IsOptional()
  birthday: string;
}
