// src/decorators/api-response-success.decorator.ts
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseSuccessOptions } from '../interfaces/api-response-success.interface';

export const ApiResponseSuccess = (options: { type: Type<any> | Function | [Function] }) => {
  return applyDecorators(
    ApiExtraModels(...(Array.isArray(options.type) ? options.type : [options.type])),

    ApiOkResponse({
      description: 'Successful response',
      schema: {
        allOf: [
          {
            type: 'object',
            properties: {
              code: { type: 'number', example: 200 },
              message: { type: 'string', example: 'Success' },
              data: Array.isArray(options.type)
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(options.type[0]) },
                  }
                : { $ref: getSchemaPath(options.type) },
            },
          },
        ],
      },
    })
  );
};
