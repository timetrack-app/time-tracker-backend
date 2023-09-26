import { Request, Response, NextFunction } from "express";
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from "class-validator";

/**
 * Validate Dto class
 * Used for request validation in controllers
 *
 * Usage with inversify-express-utils decorator:
 * @httpPost('/login', DtoValidationMiddleware(AuthLoginDto))
 *
 * Error json structure:
 * {
      "statusCode": 400,
      "success": false,
      "message": "",
      "error": {
        "property1": ["error_message_1"],
        "property2": ["error_message_2"],
        // Additional properties and error messages if there are more validation errors
      }
    }
 *
 * @param {*} type
 * @param {boolean} [skipMissingProperties=false]
 * @return {*}
 */

const formatErrors = (errors: ValidationError[]): any => {
  const errorObject: any = {};

  for (const error of errors) {
      if (error.children && error.children.length > 0) {
          // If the property has nested errors, recursively format them
          errorObject[error.property] = formatErrors(error.children);
      } else {
          // Otherwise, use the error message directly
          errorObject[error.property] = [error.constraints];
      }
  }

  const isNumericKey = (key: string): boolean => {
    const numeric = Number(key);
    return !isNaN(numeric) && Number.isInteger(numeric);
  };

  const format = (original: any): any => {
    if (Array.isArray(original)) {
      return original.map((item) => format(item));
    } else if (typeof original === 'object' && original !== null) {
      if (Object.keys(original).every(isNumericKey)) {
        // If all keys are numeric, transform it into an array
        return Object.values(original).map((item) => format(item));
      } else {
        // Otherwise, recursively format the object
        const formattedObject: any = {};
        for (const key in original) {
          if (original.hasOwnProperty(key)) {
            formattedObject[key] = format(original[key]);
          }
        }
        return formattedObject;
      }
    } else {
      return original;
    }
  };

  return format(errorObject);
};

export const DtoValidationMiddleware = (type: any, skipMissingProperties = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
      const dtoObj = plainToClass(type, req.body);

      validate(dtoObj, { skipMissingProperties }).then(
          (errors: ValidationError[]) => {
            console.log(JSON.stringify(errors, null, 2));
              if (errors.length > 0) {
                  const errorResponse = formatErrors(errors);
                  res.status(400).json({
                      statusCode: 400,
                      success: false,
                      message: '',
                      error: errorResponse,
                  });
              } else {
                  req.body = dtoObj;
                  next();
              }
          }
      );
  };
};
