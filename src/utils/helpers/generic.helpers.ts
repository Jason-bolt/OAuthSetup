import crypto from "crypto";
import * as jwt from "jsonwebtoken";
import db from "../../config/database";
import ENVS from "../../config/envs";
import bcrypt from "bcrypt";

type FieldValidation = {
  type: "string" | "number";
  required: boolean;
};

export class GenericHelper {
  static generateId(length = 6, prefix = "", suffix = ""): string {
    const randomNumber = GenericHelper.generateRandomNumber(length);
    return `${prefix ? prefix + "-" : ""}${randomNumber}${suffix ? "-" + suffix : ""}`;
  }

  static calcPages(total: number, limit: number): number {
    const displayPage = Math.floor(total / limit);
    return total % limit ? displayPage + 1 : displayPage;
  }

  static async paginatedData(
    resourceQuery: string,
    countQuery: string,
    page: number,
    limit: number,
    queryParams: Record<string, string | number>,
  ): Promise<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
    currentPage: number;
    totalCount: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;

    // where queryParams is an array or an object
    if (Array.isArray(queryParams)) {
      queryParams.push(offset, limit);
    } else {
      queryParams.offset = offset;
      queryParams.limit = limit;

      resourceQuery += ` OFFSET $/offset/ LIMIT $/limit/;`;
    }
    const fetchCount = db.oneOrNone(countQuery, queryParams);
    const fetchData = db.manyOrNone(resourceQuery, queryParams);

    const [{ count }, data] = await Promise.all([fetchCount, fetchData]);
    const totalCount: number = count;
    const totalPages: number = GenericHelper.calcPages(totalCount, limit);

    return {
      data,
      currentPage: page,
      totalCount,
      totalPages,
    };
  }

  static capitalizeFirstLetter(word: string) {
    if (word.length === 0) {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  static generateRandomSixDigitNumber() {
    const randomBytes = crypto.randomBytes(3); // 3 bytes = 6 hexadecimal digits

    const randomNumber = parseInt(randomBytes.toString("hex"), 16);
    const sixDigitNumber = String(randomNumber).padEnd(6, "0");
    return parseInt(sixDigitNumber.slice(0, 6));
  }

  static generateToken(
    data: object,
    expiresIn: string = `${ENVS.TOKEN_EXPIRY}`,
  ) {
    return jwt.sign(data, `${ENVS.TOKEN_SECRET}`, {
      expiresIn,
    });
  }

  static decryptJwt(jwtString: string) {
    return jwt.verify(jwtString, ENVS.TOKEN_SECRET as string);
  }

  static generateRandomNumber(length: number = 6) {
    if (length <= 0) {
      throw new Error("Length must be greater than 0");
    }

    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static hashString(string: string) {
    return bcrypt.hashSync(string, 10);
  }

  static compareHash(string: string, hash: string) {
    return bcrypt.compareSync(string, hash);
  }

  static isValidPassword(password: string): boolean {
    // Check if the password meets the criteria
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Return true only if all conditions are met
    return (
      hasMinLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  }

  static verifyFields(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestFields: Record<string, any>,
    fieldDefinitions: Record<string, FieldValidation>,
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [field, { type, required }] of Object.entries(
      fieldDefinitions,
    )) {
      const value = requestFields[field];

      if (required && (value === undefined || value === null)) {
        errors.push(`Field '${field}' is required but missing.`);
        continue;
      }

      if (value !== undefined && value !== null && typeof value !== type) {
        errors.push(
          `Field '${field}' must be of type '${type}', but got '${typeof value}'.`,
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
