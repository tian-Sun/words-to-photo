import {S3} from "aws-sdk";

export const storageDomain = process.env.STORAGE_DOMAIN
export const storageURL = "https://" + storageDomain
export const r2Bucket = process.env.R2_BUCKET
export const r2AccountId = process.env.R2_ACCOUNT_ID
export const r2Endpoint = process.env.R2_ENDPOINT
export const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID
export const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY


export const R2 = new S3({
  endpoint: r2Endpoint,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
});
