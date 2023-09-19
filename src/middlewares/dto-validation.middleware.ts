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
export const DtoValidationMiddleware = (type: any, skipMissingProperties = false) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const dtoObj = plainToClass(type, req.body);
        validate(dtoObj, { skipMissingProperties }).then(
            (errors: ValidationError[]) => {
                if (errors.length > 0) {
                    const errMsg: any = {};
                    errors.forEach(err => {
                        errMsg[err.property] = [...(Object as any).values(err.constraints)]
                    });

                    res.status(400).json({
                        statusCode: 400,
                        success: false,
                        message: '',
                        error: errMsg
                    });
                } else {
                    req.body = dtoObj;
                    next();
                }
            }
        )
    }
}