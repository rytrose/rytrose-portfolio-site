const { getPlaiceholder } = require("plaiceholder");

const path = process.argv[2];

if (!path) {
  console.error("please provide a path as an argument");
  process.exit(1);
}

try {
  getPlaiceholder(
    `https://rytrose-personal-website.s3.amazonaws.com/portfolio-site${path}`
  ).then(({ base64 }) => console.log("placeholder:", base64));
} catch (err) {
  console.error(`failed to generate placeholder: ${err}`);
  process.exit(1);
}
