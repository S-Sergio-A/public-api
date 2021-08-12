import { IsDate, IsOptional, IsString, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddOrUpdateOptionalDataDto {
  @ApiProperty({
    example: "Petro",
    description: "First name of the user.",
    minLength: 1,
    maxLength: 50
  })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({
    example: "Shrekovenko",
    description: "Last name of the user.",
    minLength: 1,
    maxLength: 50
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    example: "02.10.2002",
    description: "Birthday of the user.",
    minLength: 10,
    maxLength: 10
  })
  @IsDate()
  @IsOptional()
  birthday: string;

  @ApiProperty({
    example: "https://somestock/som-cool-photo.jpg",
    description: "URL to the photo of the user."
  })
  @IsUrl()
  @IsOptional()
  photo: string;
}
