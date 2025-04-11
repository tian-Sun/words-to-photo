import Replicate from "replicate";

let replicateClient: Replicate;

export const getReplicateClient = () => {
  if (!replicateClient) {
    replicateClient = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }
  return replicateClient;
}
