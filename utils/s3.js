import { S3Client } from "@aws-sdk/client-s3";

export const BUCKET_NAME = "rytrose-personal-website";
export const PREFIX = "portfolio-site";

export const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.RYTROSE_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.RYTROSE_AWS_SECRET_ACCESS_KEY,
  },
});

// https://s3.console.aws.amazon.com/s3/buckets/rytrose-personal-website?region=us-east-1&prefix=portfolio-site/&showversions=false
export const buildS3URL = (path) =>
  `https://${BUCKET_NAME}.s3.amazonaws.com/${PREFIX}${path}`;
