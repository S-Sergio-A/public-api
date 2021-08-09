import { PipeTransform, ArgumentMetadata, BadRequestException, Injectable } from "@nestjs/common";
import { ValidationService } from "../validation.service";
import { ValidationException } from "../../exceptions/Validation.exception";

@Injectable()
export class ChangeUsernameValidationPipe implements PipeTransform {
  async transform(value, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException("No data submitted");
    }

    if (!metadata.metatype) {
      return value;
    }

    const { error, isValid } = await ValidationService.prototype.validateUsernameChange(value);

    if (isValid) {
      return value;
    } else {
      throw new ValidationException(error);
    }
  }
}
