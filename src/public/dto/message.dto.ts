import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class MessageDto {
  @ApiProperty({
    example: "af5d7dd9",
    description: "ID of the room where the message was sent."
  })
  @IsString()
  roomId: string;

  @ApiProperty({
    example: "13:15 06.07.2021",
    description: "The timestamp of the message."
  })
  @IsString()
  timestamp: string;

  @ApiProperty({
    example: "Some message.",
    description: "The public's message."
  })
  @IsString()
  text: string;

  @ApiProperty({
    example: "13f4fpp913f4fpp9",
    description: "ID of the user."
  })
  @IsString()
  user: string;

  @ApiProperty({
    example: "Up to 5 photos in base64. Maximum size is 100KB.",
    description: "Optional attachment."
  })
  @IsOptional()
  @IsString()
  attachment?: string;
}
