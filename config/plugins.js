//https://nodemailer.com/message/attachments/

module.exports = ({ env }) => ({
  // ...
  upload: {
    provider: 'cloudinary',
    providerOptions: {
      cloud_name: env('CLOUDINARY_NAME'),
      api_key: env('CLOUDINARY_KEY'),
      api_secret: env('CLOUDINARY_SECRET'),
    },
    actionOptions: {
      upload: {},
      delete: {},
    },
  },
  email_: {
    provider: 'nodemailer',
    providerOptions: {
      host: env('SMTP_HOST', 'smtp.example.com'),
      port: env('SMTP_PORT', 587),
      auth: {
        user: env('SMTP_USERNAME'),
        pass: env('SMTP_PASSWORD'),
      },
      // ... any custom nodemailer options
    },
    settings: {
      defaultFrom:env('EMAIL_DEFAULT_FROM', 'hello@example.com'),
      defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO','hello@example.com'),
    },
  },
  email: {
    provider: 'sendgrid',
    providerOptions: {
      apiKey: env('SENDGRID_API_KEY'),
    },
    settings: {
      defaultFrom: 'nana@neema.co.za',
      defaultReplyTo: 'nana@neema.co.za',
      testAddress: 'nana@neema.co.za',
    },
  },
  // ...
});
