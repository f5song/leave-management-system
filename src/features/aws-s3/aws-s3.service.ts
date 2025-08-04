import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { uuidv7 } from 'uuidv7';
import { errorMessage } from '@common/constants/error-message';

@Injectable()
export class AwsS3Service {
    AWS_S3_BUCKET = process.env.S3_BUCKET_NAME;

    s3Client = new S3Client({
        region: 'ap-south-1', // กำหนด region ให้ตรงกับที่ใช้
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
    });

    private async validateFile(file: Express.Multer.File) {
        if (!file) {
            throw new HttpException(
                {
                    code: '1201',
                    message: errorMessage['1201'],
                    statusCode: HttpStatus.BAD_REQUEST,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    private validateFileSize(file: Express.Multer.File) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new HttpException(
                {
                    code: '1202',
                    message: errorMessage['1202'],
                    statusCode: HttpStatus.BAD_REQUEST,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    private validateImageFileType(file: Express.Multer.File) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new HttpException(
                {
                    code: '1203',
                    message: errorMessage['1203'],
                    statusCode: HttpStatus.BAD_REQUEST,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async uploadFile(folderName: string, file: Express.Multer.File) {
        await this.validateFile(file);
        await this.validateImageFileType(file);
        await this.validateFileSize(file);

        const { originalname } = file;
        const fileName = encodeURI(originalname);
        const folder = folderName;

        const key = `${folder}/${uuidv7()}_${fileName}`;

        // อัพโหลดไฟล์
        await this.s3_upload(file.buffer, this.AWS_S3_BUCKET!, key, file.mimetype);

        // สร้าง URL ของไฟล์เอง
        const region = 'ap-south-1'; // ระบุ region ที่ใช้จริง
        const url = `https://${this.AWS_S3_BUCKET}.s3.${region}.amazonaws.com/${encodeURIComponent(key)}`;

        return { url };
    }


    async s3_upload(
        fileBuffer: Buffer,
        bucket: string,
        name: string,
        mimetype: string,
    ) {
        const params = {
            Bucket: bucket,
            Key: name,
            Body: fileBuffer,
            ACL: 'public-read' as ObjectCannedACL,
            ContentType: mimetype,
            ContentDisposition: 'inline',
        };

        try {
            const command = new PutObjectCommand(params);
            const response = await this.s3Client.send(command);
            return response;
        } catch (e) {
            console.error('S3 upload error:', e);
            throw new HttpException(
                {
                    code: '1204',
                    message: 'Failed to upload file to S3',
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}