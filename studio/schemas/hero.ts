export default {
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      required: true,
    },

    {
      name: "callToAction",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          required: true,
        },
        {
          name: "url",
          title: "URL",
          type: "url",
          required: true,
        },
      ],
    },

    {
      name: "mainImage",
      title: "Main Image",
      type: "image",
      required: true,
    },
    {
      name: "release",
      title: "Release",
      type: "reference",
      to: [
        {
          type: "release",
        },
      ],
    },
  ],
};
