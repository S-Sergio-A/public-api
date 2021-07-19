export class ValidationErrorCodes {
  static readonly INVALID_CREATE_FIRST_NAME = new ValidationErrorCodes(
    "INVALID_CREATE_FIRST_NAME",
    900,
    "This first name doesn't match the rules."
  );
  static readonly INVALID_CREATE_LAST_NAME = new ValidationErrorCodes(
    "INVALID_CREATE_LAST_NAME",
    901,
    "This last name doesn't match the rules."
  );
  static readonly INVALID_CREATE_BIRTHDAY = new ValidationErrorCodes(
    "INVALID_CREATE_BIRTHDAY",
    902,
    "This birthday doesn't match the rules."
  );
  static readonly INVALID_CREATE_PHOTO = new ValidationErrorCodes(
    "INVALID_CREATE_PHOTO",
    903,
    "This photo URL doesn't match the rules."
  );
  static readonly INVALID_CREATE_EMAIL = new ValidationErrorCodes("INVALID_CREATE_EMAIL", 904, "This email doesn't match the rules.");
  static readonly INVALID_CREATE_USERNAME = new ValidationErrorCodes(
    "INVALID_CREATE_USERNAME",
    905,
    "This username doesn't match the rules."
  );
  static readonly INVALID_CREATE_TEL_NUM = new ValidationErrorCodes(
    "INVALID_CREATE_TEL_NUM",
    906,
    "This mobile mobile phone number doesn't match the rules."
  );
  static readonly INVALID_CREATE_PASSWORD = new ValidationErrorCodes(
    "INVALID_CREATE_PASSWORD",
    907,
    "This password doesn't match the rules."
  );

  static readonly INVALID_SUBJECT = new ValidationErrorCodes("INVALID_SUBJECT", 913, "Incorrect subject.");

  static readonly INVALID_CREATE_EMAIL_LENGTH = new ValidationErrorCodes(
    "INVALID_CREATE_EMAIL_LENGTH",
    920,
    "This email length doesn't match the rules."
  );
  static readonly INVALID_CREATE_PASSWORD_LENGTH = new ValidationErrorCodes(
    "INVALID_CREATE_PASSWORD_LENGTH",
    921,
    "This password length doesn't match the rules."
  );
  static readonly INVALID_CREATE_USERNAME_LENGTH = new ValidationErrorCodes(
    "INVALID_CREATE_USERNAME_LENGTH",
    922,
    "This username length doesn't match the rules."
  );
  static readonly INVALID_CREATE_TEL_NUM_LENGTH = new ValidationErrorCodes(
    "INVALID_CREATE_TEL_NUM_LENGTH",
    923,
    "This mobile phone number length doesn't match the rules."
  );

  static readonly PASSWORD_RESTRICTED_CHARACTERS = new ValidationErrorCodes(
    "PASSWORD_RESTRICTED_CHARACTERS",
    936,
    "This password includes restricted characters."
  );

  static readonly PASSWORDS_DOES_NOT_MATCH = new ValidationErrorCodes(
    "PASSWORDS_DOES_NOT_MATCH",
    944,
    "The password doesn't match with password verification."
  );

  static readonly EMAIL_MATCHES_WITH_THE_PREVIOUS = new ValidationErrorCodes(
    "EMAIL_MATCHES_WITH_THE_PREVIOUS",
    960,
    "This email matches with your previous one."
  );
  static readonly USERNAME_MATCHES_WITH_THE_PREVIOUS = new ValidationErrorCodes(
    "USERNAME_MATCHES_WITH_THE_PREVIOUS",
    961,
    "This username matches with your previous one."
  );
  static readonly PHONE_MATCHES_WITH_THE_PREVIOUS = new ValidationErrorCodes(
    "PHONE_MATCHES_WITH_THE_PREVIOUS",
    962,
    "This mobile phone number matches with your previous one."
  );
  static readonly PASSWORD_MATCHES_WITH_THE_PREVIOUS = new ValidationErrorCodes(
    "PASSWORD_MATCHES_WITH_THE_PREVIOUS",
    963,
    "This password matches with your previous one."
  );

  private constructor(private readonly key: string, public readonly code: number, public readonly value: string) {}

  toString() {
    return this.key;
  }
}
