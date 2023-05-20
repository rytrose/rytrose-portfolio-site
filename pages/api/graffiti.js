import yaml from "js-yaml";
import { compressToUTF16, decompressFromUTF16 } from "lz-string";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET_NAME, PREFIX, s3Client } from "../../utils/s3";
import { readStreamToString } from "../../utils/stream";

export const config = {
  api: {
    responseLimit: false,
  },
};

let state;

const getCurrentState = async () => {
  if (state) {
    return state;
  }

  try {
    const { Body } = await s3Client.send(
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: PREFIX + "/graffiti.yaml.enc",
      })
    );
    const encYamlString = await readStreamToString(Body);
    const state = yaml.load(decompressFromUTF16(encYamlString));
    if (state) {
      return state;
    }
  } catch (e) {
    console.error(e);
  }

  return {
    current: {
      t: 0,
      d: "",
    },
    history: [],
  };
};

const updateState = async (state) => {
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: PREFIX + "/graffiti.yaml.enc",
        Body: compressToUTF16(yaml.dump(state)),
      })
    );
  } catch (e) {
    console.error(e);
  }
};

const GET = async (res) => {
  try {
    state = await getCurrentState();
    res.status(200).send(state.current.d);
  } catch (e) {
    console.error(e);
    res.status(500).send(`unable to get graffiti: ${e}`);
  }
};

const POST = async (req, res) => {
  state = await getCurrentState();
  state.history.push({ t: state.current.t, d: state.current.d });
  state.current.t = Date.now();
  state.current.d = req.body;
  await updateState(state);
  res.status(200).send();
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    await POST(req, res);
    return;
  } else if (req.method === "GET") {
    await GET(res);
    return;
  } else {
    res.status(404).send("not found");
    return;
  }
};

export default handler;
