// File storage — use your own S3/R2 bucket via AWS SDK
// Configure AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET
export async function uploadFile(key: string, buffer: Buffer, contentType: string): Promise<string> {
  throw new Error("Storage not configured. Set up AWS S3 or Cloudflare R2.");
}
export async function getFileUrl(key: string): Promise<string> {
  throw new Error("Storage not configured. Set up AWS S3 or Cloudflare R2.");
}
