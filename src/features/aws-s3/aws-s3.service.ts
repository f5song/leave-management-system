import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { uuidv7 } from 'uuidv7';
import { errorMessage } from '@common/constants/error-message';

@Injectable()
export class AwsS3Service {
    AWS_S3_BUCKET = process.env.S3_BUCKET_NAME;
    s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    private async validateFile(file: Express.Multer.File) {
        if (!file) {
            throw new HttpException({
                code: '1201',
                message: errorMessage['1201'],
                statusCode: HttpStatus.BAD_REQUEST,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    private validateFileSize(file: Express.Multer.File) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new HttpException({
                code: '1202',
                message: errorMessage['1202'],
                statusCode: HttpStatus.BAD_REQUEST,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    private validateImageFileType(file: Express.Multer.File) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new HttpException({
                code: '1203',
                message: errorMessage['1203'],
                statusCode: HttpStatus.BAD_REQUEST,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async uploadFile(folderName, file) {
        await this.validateFile(file);
        await this.validateImageFileType(file);
        await this.validateFileSize(file);

        console.log(file);
        const { originalname } = file;
        const fileName = encodeURI(originalname);
        const folder = folderName;

        const name = `${folder}/${uuidv7()}_${fileName}`;

        return await this.s3_upload(
            file.buffer,
            this.AWS_S3_BUCKET,
            name,
            file.mimetype,
        );
    }

    async s3_upload(file: Express.Multer.File, bucket: string, name: string, mimetype: string) {
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
            ACL: 'public-read',
            ContentType: mimetype,
            ContentDisposition: 'inline',
            CreateBucketConfiguration: {
                LocationConstraint: 'ap-south-1',
            },
        };

        try {
            let s3Response = await this.s3.upload(params).promise();
            return s3Response;
        } catch (e) {
            console.log(e);
        }
    }
}