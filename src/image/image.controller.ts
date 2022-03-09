import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_S3_BUCKET_NAME,
  AWS_SECRET_ACCESS_KEY,
} from 'src/common/config';

const s3 = new AWS.S3();
AWS.config.update({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: AWS_REGION,
});

@Controller('image')
export class ImageController {
  constructor(private readonly _imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerS3({
        s3: s3,
        bucket: AWS_S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: function (req, file, cb) {
          cb(null, `${Date.now()}_${file.originalname}`);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFiles() file: Express.Multer.File) {
    try {
      console.log('file', file);

      return { success: true };
    } catch (e) {
      console.log(e);
      return {
        e,
      };
    }
  }
}
