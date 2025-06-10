import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { ApiResponseErrorOptions } from '../interfaces/api-response-error.interface';

function buildExamplesForStatusCode(
  statusCode: number,
  errors: ApiResponseErrorOptions[],
) {
  const filtered = errors.filter((e) => e.statusCode === statusCode);
  if (filtered.length === 0) return null;

  return filtered.reduce((examples, error) => {
    examples[error.code] = {
      type: 'object',
      value: {
        code: error.code,
        message: error.message,
      },
    };
    return examples;
  }, {});
}

export const ApiResponseError = (errors: ApiResponseErrorOptions[]) => {
  const decorators = [];

  for (const statusCode of Object.values(HttpStatus)) {
    const examples = buildExamplesForStatusCode(Number(statusCode), errors);
    if (!examples) continue;

    decorators.push(
      ApiResponse({
        status: Number(statusCode),
        description: 'error response',
        content: {
          'application/json': {
            examples,
          },
        },
      }),
    );
  }

  return applyDecorators(...decorators);
};
