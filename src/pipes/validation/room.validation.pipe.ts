import { PipeTransform, ArgumentMetadata, BadRequestException, Injectable } from "@nestjs/common";
import { ValidationException } from "../../exceptions/Validation.exception";
import { ValidationService } from "../validation.service";

@Injectable()
export class RoomValidationPipe implements PipeTransform {
  async transform(value, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException("No data submitted");
    }

    if (!metadata.metatype) {
      return value;
    }

    const { error, isValid } = await ValidationService.prototype.validateRoom(value);

    if (isValid) {
      return value;
    } else {
      throw new ValidationException(error);
    }
  }
}
