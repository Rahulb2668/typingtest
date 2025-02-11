export const testResult = {
  name: "testResult",
  title: "Test Result",
  type: "document",
  preview: {
    select: {
      title: "participant.firstName",
      subtitle: "wpm",
    },
    prepare(selection: { title: string; subtitle: string }) {
      const { title, subtitle } = selection;
      return {
        title: title || "Untitled",
        subtitle: `WPM: ${subtitle}`,
      };
    },
  },
  fields: [
    {
      name: "testLink",
      title: "Test Link",
      type: "reference",
      to: [{ type: "testLink" }],
    },
    {
      name: "participant",
      title: "Participant",
      type: "object",
      fields: [
        { name: "email", type: "string" },
        { name: "firstName", type: "string" },
      ],
    },
    {
      name: "wpm",
      title: "Words Per Minute",
      type: "number",
    },
    {
      name: "accuracy",
      title: "Accuracy",
      type: "number",
    },
    {
      name: "completedAt",
      title: "Completed At",
      type: "datetime",
      default: () => new Date().toISOString(),
    },
  ],
};
