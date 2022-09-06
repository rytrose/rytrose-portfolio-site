export const readStreamToString = (stream) => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    const reader = stream.getReader();
    const readChunk = () => {
      reader
        .read()
        .then(({ value, done }) => {
          if (!!value) {
            chunks.push(Buffer.from(value));
            readChunk();
          }
          if (done) resolve(Buffer.concat(chunks).toString("utf8"));
        })
        .catch((err) => reject(err));
    };
    readChunk();
  });
};
