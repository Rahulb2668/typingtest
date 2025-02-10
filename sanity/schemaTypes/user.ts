import { defineField, defineType } from "sanity";

export const user = defineType({
  name: "user",
  title: "User",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "password",
      title: "Password",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string", // Use string instead of enum
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Suspended", value: "suspended" },
        ],
      },
      initialValue: "active", // Use initialValue instead of default
      validation: (Rule) => Rule.required(),
    }),
  ],
});
