import { IsDefined, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class MessageDto {
  @ApiProperty({
    example: "af5d7dd9",
    description: "ID of the messages where the message was sent."
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @ApiProperty({
    example: "13:15 06.07.2021",
    description: "The timestamp of the message."
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  timestamp: string;

  @ApiProperty({
    example: "Я продаю лучшие хергитские гобелены. Не желаете взглянуть?",
    description: "The public's message."
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({
    example: "Up to 5 photos in base64. Maximum size is 100KB.",
    description: "Optional attachment."
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  attachment?: string;

  @ApiProperty({
    example: "13f4fpp913f4fpp9",
    description: "ID of the user."
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  user: string;
}
