import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlobServiceClient } from '@azure/storage-blob';

@Injectable()
export class MediaService {
  private blobServiceClient: BlobServiceClient;

  constructor(private prisma: PrismaService) {
    // Initialize Azure Blob Storage client
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (connectionString) {
      this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    }
  }

  async uploadFile(file: Express.Multer.File, containerName: string = 'media') {
    if (!this.blobServiceClient) {
      throw new Error('Azure Storage not configured');
    }

    const containerClient = this.blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists({ access: 'blob' });

    const blobName = `${Date.now()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype,
      },
    });

    const url = blockBlobClient.url;

    // Save to database
    const media = await this.prisma.media.create({
      data: { url, type: 'SNEAKER' as any },
    });

    return { id: media.id, url };
  }

  async getMedia(id: number) {
    return this.prisma.media.findUnique({
      where: { id },
    });
  }

  async deleteMedia(id: number) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });
    if (!media) return;

    // Delete from Azure if configured
    if (this.blobServiceClient) {
      const url = new URL(media.url);
      const blobName = url.pathname.split('/').pop();
      const containerClient = this.blobServiceClient.getContainerClient('media');
      const blockBlobClient = containerClient.getBlockBlobClient(blobName!);
      await blockBlobClient.deleteIfExists();
    }

    return this.prisma.media.delete({
      where: { id },
    });
  }
}