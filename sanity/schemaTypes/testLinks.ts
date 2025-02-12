interface TestLinkField {
  name: string;
  title: string;
  type: string;
  validation?: (Rule: any) => any;
  to?: Array<{ type: string }>;
  default?: boolean | (() => string);
}

interface TestLinkSchema {
  name: string;
  title: string;
  type: string;
  fields: TestLinkField[];
}

export const testLink = {
  name: "testLink",
  title: "Test Link",
  type: "document",
  fields: [
    {
      name: "linkId",
      title: "Link ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "createdBy",
      title: "Created By",
      type: "reference",
      to: [{ type: "user" }],
    },
    {
      name: "isUsed",
      title: "Is Used",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      default: () => new Date().toISOString(),
    },
  ],
} as TestLinkSchema;
