import { Client } from "@elastic/elasticsearch";
import { env } from "./env.js";

export const elasticsearchClient = new Client({
  node: env.elasticsearchNode
});
