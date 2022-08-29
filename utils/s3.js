// https://s3.console.aws.amazon.com/s3/buckets/rytrose-personal-website?region=us-east-1&prefix=portfolio-site/&showversions=false
export const buildS3URL = (path) =>
  `https://rytrose-personal-website.s3.amazonaws.com/portfolio-site${path}`;
