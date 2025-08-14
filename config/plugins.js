module.exports = ({ env }) => ({
  // ... Éventuelles autres clefs
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        uploadStream: {
          timeout: 1000 * 60 * 3,
        },
        delete: {},
      },
    },
  },
  // ... Éventuelles autres clefs
});
