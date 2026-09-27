import fs from 'fs';
import path from 'path';
import { config } from '../../config';

export interface IStorageProvider {
  uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string>;
  getDownloadUrl(filePath: string): Promise<string>;
  deleteFile(filePath: string): Promise<boolean>;
}

export class LocalStorageProvider implements IStorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = config.storage.localUploadDir;
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, _mimeType: string): Promise<string> {
    const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const targetPath = path.join(this.uploadDir, safeName);
    await fs.promises.writeFile(targetPath, fileBuffer);
    return `/uploads/${safeName}`;
  }

  async getDownloadUrl(filePath: string): Promise<string> {
    return filePath;
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      const fileName = path.basename(filePath);
      const targetPath = path.join(this.uploadDir, fileName);
      if (fs.existsSync(targetPath)) {
        await fs.promises.unlink(targetPath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

export class S3StorageProvider implements IStorageProvider {
  async uploadFile(fileBuffer: Buffer, fileName: string, _mimeType: string): Promise<string> {
    // S3 / R2 compatible adapter fallback
    console.log(`[StorageProvider:S3] Mock upload of ${fileName} (${fileBuffer.length} bytes) to S3/R2 bucket: ${config.storage.s3.bucket}`);
    return `https://storage.oruvia.science/demo/${Date.now()}_${fileName}`;
  }

  async getDownloadUrl(filePath: string): Promise<string> {
    return filePath;
  }

  async deleteFile(_filePath: string): Promise<boolean> {
    return true;
  }
}

export function getStorageProvider(): IStorageProvider {
  if (config.storage.provider === 's3' || config.storage.provider === 'r2') {
    return new S3StorageProvider();
  }
  return new LocalStorageProvider();
}
