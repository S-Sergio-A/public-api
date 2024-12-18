import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RoomDto {
  @IsString()
  @ApiProperty({
    example: "Test room.",
    description: "The name of the room."
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: "This a testing room. Welcome!",
    description: "The description of the room (optional)."
  })
  description?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  @ApiProperty({
    example: "https://via.placeholder.com/60",
    description: "The avatar of the room (optional)."
  })
  photo?: string;

  @IsBoolean()
  @ApiProperty({
    description: "Is a direct message room."
  })
  isUser: boolean;

  @IsBoolean()
  @ApiProperty({
    description: "Is the room private."
  })
  isPrivate: boolean;

  @IsArray()
  @ApiProperty({
    description: "The array of members IDs."
  })
  @IsOptional()
  @IsString({ each: true })
  usersID?: string[] = [];

  @IsArray()
  @ApiProperty({
    description: "The array of messages IDs."
  })
  @IsOptional()
  @IsString({ each: true })
  messagesID?: string[] = [];

  @IsNumber()
  @ApiProperty({
    description: "The quantity of members."
  })
  @IsOptional()
  membersCount?: number;

  @IsString()
  @ApiProperty({
    description: "The date of room creation."
  })
  @IsOptional()
  createdAt?: string = new Date().toISOString();
}
