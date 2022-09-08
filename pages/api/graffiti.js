import yaml from "js-yaml";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET_NAME, PREFIX, s3Client } from "../../utils/s3";
import { readStreamToString } from "../../utils/stream";

/*
idea: sonified graffiti wall
- visitor gets certain amount of "paint"
- visitor can apply paint to canvas
- paint gets sonified
  - visitor can isolate their sonified paintings
- consider: https://github.com/fabricjs/fabric.js
  - esp. for serialization
  - resizable canvas: https://jsfiddle.net/robsch/g8x9mjvt/
*/

export const config = {
  runtime: "experimental-edge",
};

const GET = async () => {
  try {
    const { Body } = await s3Client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: PREFIX + "/graffiti.yaml",
      })
    );
    const yamlString = await readStreamToString(Body);
    const data = yaml.load(yamlString);
    return new Response(data, {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response(
      {
        error: `unable to get graffiti: ${e}`,
      },
      {
        status: 500,
      }
    );
  }
};

const POST = async (req) => {
  console.log("POST");
  return new Response(
    {
      method: "POST",
    },
    {
      status: 200,
    }
  );
};

const handler = async (req) => {
  if (req.method === "POST") {
    return await POST(req);
  } else if (req.method === "GET") {
    return await GET(req);
  } else {
    return new Response(
      {
        error: "not found",
      },
      {
        status: 404,
      }
    );
  }
};

export default handler;
