import { IsDefined, IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ContactFormDto {
  @ApiProperty({
    example: "petroshrekovenko@gmail.com",
    description: "Email of the client.",
    uniqueItems: true,
    minLength: 6,
    maxLength: 254
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  @Length(6, 254)
  readonly clientEmail: string;

  @ApiProperty({
    example: "Petro Shrekovenko.",
    description: "Full name of the client.",
    minLength: 2,
    maxLength: 100
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  readonly clientFullName: string;

  @ApiProperty({
    example: "Careers | PR | Support.",
    description: "Subject of the message.",
    minLength: 8,
    maxLength: 200
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(8, 200)
  readonly subject: string;

  @ApiProperty({
    description: "Message of the client.",
    minLength: 8,
    maxLength: 200
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(1, 2000)
  readonly message: string;
}
