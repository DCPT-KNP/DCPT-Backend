import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
  async uploadImage(files) {
    console.log(files);
    return 'SUCESS';
  }
}
