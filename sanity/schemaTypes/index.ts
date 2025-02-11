import { type SchemaTypeDefinition } from "sanity";
import { user } from "./user";
import { testLink } from "./testLinks";
import { testResult } from "./testResult";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user, testLink, testResult],
};
