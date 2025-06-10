import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiResponseSuccessOptions } from '../interfaces/api-response-success.interface';

export const ApiResponseSuccess = (response: ApiResponseSuccessOptions) => {
  return applyDecorators(
    ApiResponse({
      status: response.statusCode,
      description: 'success response',
      content: {
        'application/json': {
          example: response.example,
        },
      },
    }),
  );
};
