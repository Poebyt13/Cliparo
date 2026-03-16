import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

/**
 * Client Cloudflare R2 (compatibile S3).
 *
 * Env richieste:
 *  - R2_ACCOUNT_ID — ID account Cloudflare
 *  - R2_ACCESS_KEY_ID — Access Key per R2
 *  - R2_SECRET_ACCESS_KEY — Secret Key per R2
 *  - R2_BUCKET_NAME — nome del bucket
 *  - R2_PUBLIC_URL — URL pubblico del bucket (es. https://cdn.example.com)
 */

const isConfigured =
  process.env.R2_ACCOUNT_ID &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_BUCKET_NAME;

const s3Client = isConfigured
  ? new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

/**
 * Carica un file su R2 e restituisce l'URL pubblico.
 * @param {Buffer} buffer — contenuto del file
 * @param {string} key — nome/path del file nel bucket (es. "avatars/123.jpg")
 * @param {string} contentType — MIME type (es. "image/jpeg")
 * @returns {string} URL pubblico del file
 */
export async function uploadToR2(buffer, key, contentType) {
  if (!s3Client) {
    throw new Error("Cloudflare R2 non configurato. Verifica le variabili env R2_*.");
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  // Restituisce URL pubblico
  const publicUrl = process.env.R2_PUBLIC_URL || `https://${process.env.R2_BUCKET_NAME}.r2.dev`;
  return `${publicUrl}/${key}`;
}

/**
 * Elimina un file da R2.
 * @param {string} key — nome/path del file nel bucket
 */
export async function deleteFromR2(key) {
  if (!s3Client) return;

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    })
  );
}

/**
 * Estrae la key R2 da un URL pubblico completo.
 * Es: "https://cdn.example.com/avatars/123.jpg" → "avatars/123.jpg"
 * Restituisce null se l'URL non è di R2.
 */
export function getR2KeyFromUrl(url) {
  if (!url) return null;
  const publicUrl = process.env.R2_PUBLIC_URL || `https://${process.env.R2_BUCKET_NAME}.r2.dev`;
  if (!url.startsWith(publicUrl)) return null;
  return url.replace(`${publicUrl}/`, "");
}
