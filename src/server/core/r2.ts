import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export class R2Service {
  async upload(screenshotBuffer: Buffer): Promise<string> {
    const key = `${randomUUID()}.png`;

    await R2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: screenshotBuffer,
        ContentType: "image/png",
      })
    );

    const publicUrl = `${process.env.R2_PUBLIC_URL!}/${key}`;
    return publicUrl;
  }
}
