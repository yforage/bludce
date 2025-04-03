import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient(
  `${import.meta.env.VITE_SUPABASE_URL}/graphql/v1`,
  {
    headers: {
      apiKey: `${import.meta.env.VITE_SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
  },
);
