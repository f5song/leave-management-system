
// aws-s3.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from './aws-s3.service';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller()
export class AwsS3Controller {
    constructor(private readonly awsS3Service: AwsS3Service) { }

    @Post('upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.awsS3Service.uploadFile('leave-management-system', file);
    }

}
