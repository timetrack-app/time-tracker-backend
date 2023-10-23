export type MailOptions = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type SendEmailFunc = (opt: MailOptions) => Promise<void>;
