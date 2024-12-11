import { IsArray, IsBoolean, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";
import { Types } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export class RoomDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "Test room.",
    description: "The name of the room."
  })
  name: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: "This a testing room. Welcome!",
    description: "The description of the room (optional)."
  })
  description?: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @IsOptional()
  @ApiProperty({
    example: "https/via.placeholder.com/60",
    description: "The photo of the room (optional)."
  })
  photo?: string;

  @IsDefined()
  @IsNotEmpty()
  @IsBoolean()
  isUser: boolean;

  @IsDefined()
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: "Is the room private."
  })
  isPrivate: boolean;

  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: "The array of members IDs."
  })
  usersID: Types.ObjectId[];

  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: "The array of messages IDs."
  })
  messagesID: Types.ObjectId[];

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: "The quantity of members."
  })
  membersCount: number;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "The date of room creation."
  })
  createdAt: string;
}
