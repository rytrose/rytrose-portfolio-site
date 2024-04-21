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

// In-memory state
let state;

const defaultState = () => {
  return {
    current: {
      t: 0,
      d: "",
    },
    history: [],
  };
};

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
    const loadedState = yaml.load(decompressFromUTF16(encYamlString));
    if (loadedState) {
      return loadedState;
    }
  } catch (e) {
    console.error(e);
  }

  return defaultState();
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
  const adminKey = req.headers["x-admin-key"];
  if (
    adminKey === process.env.RYTROSE_ADMIN_KEY &&
    req.query.clear === "true"
  ) {
    console.log("clearing state");
    state = defaultState();
    await updateState(state);
    res.status(200).send();
    return;
  }

  const d = req.body;
  if (d.length === 0) {
    res.status(400).send();
    return;
  }

  state = await getCurrentState();
  state.history.push({ t: state.current.t, d: state.current.d });
  state.current.t = Date.now();
  state.current.d = d;
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
