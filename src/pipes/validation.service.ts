import { Injectable } from "@nestjs/common";
import validator from "validator";
import { v4 } from "uuid";
import { ValidationErrorCodes } from "../exceptions/errorCodes/ValidationErrorCodes";
import { GlobalErrorCodes } from "../exceptions/errorCodes/GlobalErrorCodes";
import { UserLoginEmailError, UserLoginPhoneNumberError, UserLoginUsernameError } from "./interfaces/log-in.error.interface";
import { EmailSubscriptionError } from "./interfaces/email-subscription.error.interface";
import { AddUpdateOptionalDataError } from "./interfaces/optional-data.error.interface";
import { PasswordChangeError } from "./interfaces/password-change.error.interface";
import { EmailChangeError } from "./interfaces/email-change.error.interface";
import { ContactFormError } from "./interfaces/contact-form.error.interface";
import { PhoneChangeError } from "./interfaces/phone-change.error.interface";
import { UsernameChangeError } from "./interfaces/username-change.interface";
import { InternalFailure } from "./interfaces/internal-failure.interface";
import { UserSignUpError } from "./interfaces/sign-up.error.interface";
import { RoomError } from "./interfaces/room.error.interface";
import { Subjects } from "./enums/contact-subjects";
import { RulesEnum } from "./enums/rules.enum";

const ms = require("ms");

@Injectable()
export class ValidationService {
  async validateRegistration(data) {
    const error: Partial<UserSignUpError & InternalFailure> = {};

    try {
      if (await this._isEmpty(data.email)) {
        error.email = GlobalErrorCodes.EMPTY_ERROR.value;
      } else if (!validator.isEmail(data.email)) {
        error.email = ValidationErrorCodes.INVALID_CREATE_EMAIL.value;
      } else if (!(await this._validateEmailLength(data.email))) {
        error.email = ValidationErrorCodes.INVALID_CREATE_EMAIL_LENGTH.value;
      }

      if (await this._isEmpty(data.username)) {
        error.username = GlobalErrorCodes.EMPTY_ERROR.value;
      } else if (
        !validator.isLength(data.username, {
          min: Number.parseInt(RulesEnum.USERNAME_MIN_LENGTH),
          max: Number.parseInt(RulesEnum.USERNAME_MAX_LENGTH)
        })
      ) {
        error.username = ValidationErrorCodes.INVALID_CREATE_USERNAME_LENGTH.value;
      }

      if (await this._isEmpty(data.password)) {
        error.password = GlobalErrorCodes.EMPTY_ERROR.value;
      } else if (
        !validator.isLength(data.password, {
          min: Number.parseInt(RulesEnum.PASSWORD_MIN_LENGTH),
          max: Number.parseInt(RulesEnum.PASSWORD_MAX_LENGTH)
        })
      ) {
        error.password = ValidationErrorCodes.INVALID_CREATE_PASSWORD_LENGTH.value;
      } else if (!validator.isStrongPassword(data.password)) {
        error.password = ValidationErrorCodes.INVALID_CREATE_PASSWORD.value;
      } else if (await this._isContainingOnlyWhitelistSymbols(data.password)) {
        error.password = ValidationErrorCodes.PASSWORD_RESTRICTED_CHARACTERS.value;
      }

      if (await this._isEmpty(data.passwordVerification)) {
        error.passwordVerification = GlobalErrorCodes.EMPTY_ERROR.value;
      } else if (!validator.equals(data.password, data.passwordVerification)) {
        error.passwordVerification = ValidationErrorCodes.PASSWORDS_DOES_NOT_MATCH.value;
      }

      if (await this._isEmpty(data.phoneNumber)) {
        error.phoneNumber = GlobalErrorCodes.EMPTY_ERROR.value;
      } else if (
        !validator.isLength(data.phoneNumber, {
          min: Number.parseInt(RulesEnum.TEL_NUM_MIN_LENGTH),
          max: Number.parseInt(RulesEnum.TEL_NUM_MAX_LENGTH)
        })
      ) {
        error.phoneNumber = ValidationErrorCodes.INVALID_CREATE_TEL_NUM_LENGTH.value;
      } else if (!validator.isMobilePhone(data.phoneNumber.replace(/\s/g, "").replace(/-/g, ""))) {
        error.phoneNumber = ValidationErrorCodes.INVALID_CREATE_TEL_NUM.value;
      }

      data.isActive = false;
      data.firstName = "";
      data.lastName = "";
      data.birthday = "";
      data.verification = v4();
      data.verificationExpires = Date.now() + ms("4h");
      data.loginAttempts = 0;
      data.isBlocked = false;
      data.blockExpires = 0;
      data.photo = "";
    } catch (e) {
      console.log(e);
      error.internalFailure = e;
    }

    console.log(error);

    return {
      error,
      isValid: await this._isEmpty(error)
    };
  }

  async validateLogin(data) {
    const error: Partial<(UserLoginEmailError & UserLoginUsernameError & UserLoginPhoneNumberError) & InternalFailure> = {};

    try {
      if (data.hasOwnProperty("email")) {
        if (await this._isEmpty(data.email)) {
          error.email = GlobalErrorCodes.EMPTY_ERROR.value;
        }
      } else if (data.hasOwnProperty("username")) {
        if (await this._isEmpty(data.username)) {
          error.username = GlobalErrorCodes.EMPTY_ERROR.value;
        }
      } else if (data.hasOwnProperty("phoneNumber")) {
        if (await this._isEmpty(data.phoneNumber)) {
          error.phoneNumber = GlobalErrorCodes.EMPTY_ERROR.value;
        }
      }

      if (await this._isEmpty(data.password)) {
        error.password = GlobalErrorCodes.EMPTY_ERROR.value;
      }
    } catch (e) {
      console.log(e);
      error.internalFailure = e;
    }

    console.log(error);

    return {
      error,
      isValid: await this._isEmpty(error)
    };
  }

  async validateContactForm(data) {
    const error: Partial<ContactFormError & InternalFailure> = {};

    try {
      if (await this._isEmpty(data.clientFullName)) {
        error.clientFullName = GlobalErrorCodes.EMPTY_ERROR.value;
      }

      if (await this._isEmpty(data.clientEmail)) {
        error.clientEmail = GlobalErrorCodes.EMPTY_ERROR.value;
      } else if (!validator.isEmail(data.clientEmail)) {
        error.clientEmail = ValidationErrorCodes.INVALID_CREATE_EMAIL.value;
      } else if (!(await this._validateEmailLength(data.clientEmail))) {
        error.clientEmail = ValidationErrorCodes.INVALID_CREATE_EMAIL_LENGTH.value;
      }

      if (await this._isEmpty(data.subject)) {
        error.subject = GlobalErrorCodes.EMPTY_ERROR.value;
      } else if (!Subjects.includes(data.subject)) {
        error.subject = ValidationErrorCodes.INVALID_SUBJECT.value;
      }

      if (await this._isEmpty(data.message)) {
        error.message = GlobalErrorCodes.EMPTY_ERROR.value;
      }

      if (await this._isEmpty(data.createdAt)) {
        const date = Date.now();
        const localTime = new Date(date).toLocaleTimeString("ru-RU").substring(0, 5);
        const localDate = new Date(date).toLocaleDateString("ru-RU");

        data.createdAt = `${localTime} ${localDate}`;
      }
    } catch (e) {
      console.log(e);
      error.internalFailure = e;
    }

    console.log(error);

    return {
      error,
      isValid: await this._isEmpty(error)
    };
  }

  async validateEmailChange(data) {
    const error: Partial<EmailChangeError & InternalFailure> = {};

    try {
      if (await this._isEmpty(data.oldEmail)) {
        error.oldEmail = GlobalErrorCodes.EMPTY_ERROR.value;
      }

      if (await this._isEmpty(data.newEmail)) {
        error.newEmail = GlobalErrorCodes.EMPTY_ERROR.value;
      } else if (data.newEmail === data.oldEmail) {
        error.newEmail = ValidationErrorCodes.EMAIL_MATCHES_WITH_THE_PREVIOUS.value;
      } else if (!validator.isEmail(data.newEmail)) {
        error.newEmail = ValidationErrorCodes.INVALID_CREATE_EMAIL.value;
      } else if (!(await this._validateEmailLength(data.newEmail))) {
        error.newEmail = ValidationErrorCodes.INVALID_CREATE_EMAIL_LENGTH.value;
      }

      data.verification = v4();
    } catch (e) {
      console.log(e);
      error.internalFailure = e;
    }

    console.log(error);

    return {
      error,
      isValid: await this._isEmpty(error)
    };
  }

  async validateUsernameChange(data) {
    const error: Partial<UsernameChangeError & InternalFailure> = {};

    try {
      if (await this._isEmpty(data.oldUsername)) {
        error.oldUsername = GlobalErrorCodes.EMPTY_ERROR.value;
      }

      if (await this._isEmpty(data.newUsername)) {
        error.newUsername = GlobalErrorCodes.EMPTY_ERROR.value;
      } else if (data.newUsername === data.oldUsername) {
        error.newUsername = ValidationErrorCodes.USERNAME_MATCHES_WITH_THE_PREVIOUS.value;
      } else if (
        !validator.isLength(data.newUsername, {
          min: Number.parseInt(RulesEnum.USERNAME_MIN_LENGTH),
          max: Number.parseInt(RulesEnum.USERNAME_MAX_LENGTH)
        })
      ) {
        error.newUsername = ValidationErrorCodes.INVALID_CREATE_USERNAME_LENGTH.value;
      }

      data.verification = v4();
    } catch (e) {
      console.log(e);
      error.internalFailure = e;
    }

    console.log(error);

    return {
      error,
      isValid: await this._isEmpty(error)
    };
  }

  async validatePhoneNumberChange(data) {
    const error: Partial<PhoneChangeError & InternalFailure> = {};

    try {
      if (await this._isEmpty(data.oldPhoneNumber)) {
        error.oldPhoneNumber = GlobalErrorCodes.EMPTY_ERROR.value;
      }

      if (await this._isEmpty(data.newPhoneNumber)) {
        error.newPhoneNumber = GlobalErrorCodes.EMPTY_ERROR.value;
      } else if (data.newPhoneNumber === data.oldPhoneNumber) {
        error.newPhoneNumber = ValidationErrorCodes.PHONE_MATCHES_WITH_THE_PREVIOUS.value;
      } else if (
        !validator.isLength(data.newPhoneNumber, {
          min: Number.parseInt(RulesEnum.TEL_NUM_MIN_LENGTH),
          max: Number.parseInt(RulesEnum.TEL_NUM_MAX_LENGTH)
        })
      ) {
        error.newPhoneNumber = ValidationErrorCodes.INVALID_CREATE_TEL_NUM_LENGTH.value;
      } else if (!validator.isMobilePhone(data.newPhoneNumber.replace(/\s/g, "").replace(/-/g, ""))) {
        error.newPhoneNumber = ValidationErrorCodes.INVALID_CREATE_TEL_NUM.value;
      }

      data.verification = v4();
    } catch (e) {
      console.log(e);
      error.internalFailure = e;
    }

    console.log(error);

    return {
      error,
      isValid: await this._isEmpty(error)
    };
  }

  async validatePasswordChange(data) {
    const error: Partial<PasswordChangeError & InternalFailure> = {};

    try {
      if (await this._isEmpty(data.oldPassword)) {
        error.oldPassword = GlobalErrorCodes.EMPTY_ERROR.value;
      }

      if (await this._isEmpty(data.newPassword)) {
        error.newPassword = GlobalErrorCodes.EMPTY_ERROR.value;
      } else if (data.newPassword === data.oldPassword) {
        error.newPassword = ValidationErrorCodes.PASSWORD_MATCHES_WITH_THE_PREVIOUS.value;
      } else if (
        !validator.isLength(data.newPassword, {
          min: Number.parseInt(RulesEnum.PASSWORD_MIN_LENGTH),
          max: Number.parseInt(RulesEnum.PASSWORD_MAX_LENGTH)
        })
      ) {
        error.newPassword = ValidationErrorCodes.INVALID_CREATE_PASSWORD_LENGTH.value;
      } else if (!validator.isStrongPassword(data.newPassword)) {
        error.newPassword = ValidationErrorCodes.INVALID_CREATE_PASSWORD.value;
      } else if (await this._isContainingOnlyWhitelistSymbols(data.newPassword)) {
        error.newPassword = ValidationErrorCodes.PASSWORD_RESTRICTED_CHARACTERS.value;
      }

      data.verification = v4();
    } catch (e) {
      console.log(e);
      error.internalFailure = e;
    }

    console.log(error);

    return {
      error,
      isValid: await this._isEmpty(error)
    };
  }

  async validateOptionalDataChange(data) {
    const error: Partial<AddUpdateOptionalDataError & InternalFailure> = {};

    try {
      if (data.hasOwnProperty("firstName")) {
        if (await this._isEmpty(data.firstName)) {
          error.firstName = GlobalErrorCodes.EMPTY_ERROR.value;
        } else if (!(await this._isNameOrSurname(data.firstName))) {
          error.firstName = ValidationErrorCodes.INVALID_CREATE_FIRST_NAME.value;
        }
      }
      if (data.hasOwnProperty("lastName")) {
        if (await this._isEmpty(data.lastName)) {
          error.lastName = GlobalErrorCodes.EMPTY_ERROR.value;
        } else if (!(await this._isNameOrSurname(data.lastName))) {
          error.lastName = ValidationErrorCodes.INVALID_CREATE_LAST_NAME.value;
        }
      }
      if (data.hasOwnProperty("birthday")) {
        if (await this._isEmpty(data.birthday)) {
          error.birthday = GlobalErrorCodes.EMPTY_ERROR.value;
        } else if (!validator.isDate(data.birthday)) {
          error.birthday = ValidationErrorCodes.INVALID_CREATE_BIRTHDAY.value;
        }
      }
      if (data.hasOwnProperty("photo")) {
        if (await this._isEmpty(data.photo)) {
          error.photo = GlobalErrorCodes.EMPTY_ERROR.value;
        } else if (!validator.isURL(data.photo)) {
          error.photo = ValidationErrorCodes.INVALID_CREATE_PHOTO.value;
        }
      }
    } catch (e) {
      console.log(e);
      error.internalFailure = e;
    }

    console.log(error);

    return {
      error,
      isValid: await this._isEmpty(error)
    };
  }

  async validateEmail(email) {
    const error: Partial<EmailSubscriptionError & InternalFailure> = {};

    try {
      if (await this._isEmpty(email)) {
        error.email = GlobalErrorCodes.EMPTY_ERROR.value;
      } else if (!validator.isEmail(email)) {
        error.email = ValidationErrorCodes.INVALID_CREATE_EMAIL.value;
      } else if (!(await this._validateEmailLength(email))) {
        error.email = ValidationErrorCodes.INVALID_CREATE_EMAIL_LENGTH.value;
      }
    } catch (e) {
      console.log(e);
      error.internalFailure = e;
    }

    console.log(error);

    return {
      error,
      isValid: await this._isEmpty(error)
    };
  }

  async validateRoom(data) {
    const error: Partial<RoomError & InternalFailure> = {};

    try {
      if (!data.membersCount) {
        data.membersCount = data.usersID ? data.usersID.length : 1;
      }

      if (await this._isEmpty(data.name)) {
        error.name = GlobalErrorCodes.EMPTY_ERROR.value;
      }

      if (await this._isEmpty(data.isUser)) {
        error.isUser = GlobalErrorCodes.EMPTY_ERROR.value;
      }

      if (await this._isEmpty(data.isPrivate)) {
        if (data.isUser) {
          data.isPrivate = true;
        } else {
          error.isPrivate = GlobalErrorCodes.EMPTY_ERROR.value;
        }
      }

      if (await this._isEmpty(data.createdAt)) {
        const date = Date.now();
        const localTime = new Date(date).toLocaleTimeString("ru-RU").substring(0, 5);
        const localDate = new Date(date).toLocaleDateString("ru-RU");

        data.createdAt = `${localTime} ${localDate}`;
      }
    } catch (e) {
      console.log(e);
      error.internalFailure = e;
    }

    console.log(error);

    return {
      error,
      isValid: await this._isEmpty(error)
    };
  }

  private async _isNameOrSurname(str) {
    return !!str.match(new RegExp(RulesEnum.FIRST_AND_LAST_NAME_WHITELIST_SYMBOLS));
  }

  private async _validateEmailLength(email) {
    const splits = email.split("@");
    if (splits[0] && splits[1]) {
      return (
        splits[0].length < Number.parseInt(RulesEnum.EMAIL_LOCAL_PART_MAX_LENGTH) + 1 &&
        splits[0].length > Number.parseInt(RulesEnum.EMAIL_LOCAL_OR_DOMAIN_PART_MIN_LENGTH) - 1 &&
        splits[1].length < Number.parseInt(RulesEnum.EMAIL_DOMAIN_PART_MAX_LENGTH) + 1 &&
        splits[0].length > Number.parseInt(RulesEnum.EMAIL_LOCAL_OR_DOMAIN_PART_MIN_LENGTH) - 1
      );
    } else {
      return false;
    }
  }

  private async _isContainingOnlyWhitelistSymbols(str) {
    return !!str.match(new RegExp(RulesEnum.PASSWORD_WHITELIST_SYMBOLS));
  }

  private async _isEmpty(obj) {
    if (obj !== undefined && obj !== null) {
      const isString = typeof obj === "string" || obj instanceof String;
      if ((typeof obj === "number" || obj instanceof Number) && obj !== 0) {
        return false;
      }
      return (
        obj === "" ||
        obj === 0 ||
        (Object.keys(obj).length === 0 && obj.constructor === Object) ||
        obj.length === 0 ||
        (isString && obj.trim().length === 0)
      );
    } else {
      return "type is undefined or null";
    }
  }
}
