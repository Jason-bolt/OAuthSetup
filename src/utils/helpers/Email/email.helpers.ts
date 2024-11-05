import nodemailer, { Transporter } from "nodemailer";
import ENVS from "../../../config/envs";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { accountCreated } from "./templates/auth.templates";
import formData from "form-data";
import Mailgun from "mailgun.js";
import { IMailgunClient } from "mailgun.js/Interfaces";

export default class EmailHelper {
  private static _transporter: Transporter;
  private static instance: EmailHelper;
  private static _mailgun: Mailgun;
  private static _mg: IMailgunClient;
  init() {
    EmailHelper._transporter = nodemailer.createTransport({
      host: ENVS.EMAIL_HOST,
      port: ENVS.EMAIL_PORT,
      auth: {
        user: ENVS.EMAIL_AUTH_USER,
        pass: ENVS.EMAIL_AUTH_PASSWORD,
      },
    } as SMTPTransport.Options); // Explicitly specifying the type here
    EmailHelper._mailgun = new Mailgun(formData);
    EmailHelper._mg = EmailHelper._mailgun.client({
      username: "api",
      key: ENVS.MAILGUN_API_KEY as string,
    });
  }

  async sendRegisterEmail({
    email,
    firstName,
    lastName,
  }: {
    email: string;
    firstName: string;
    lastName: string;
  }) {
    await EmailHelper.sendEmail({
      to: email,
      subject: "Account Created!",
      html: accountCreated(email, firstName, lastName),
    });
  }

  private static async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    await EmailHelper._mg.messages.create(
      "sandbox4d8dbd3c6e4a481480a282b1a61770b7.mailgun.org",
      {
        from: ENVS.EMAIL_FROM,
        to: [to],
        subject: subject,
        html: html,
      },
    );
    // await EmailHelper._transporter.sendMail({
    //   from: ENVS.EMAIL_FROM, // sender address
    //   to, // list of receivers
    //   subject, // Subject line
    //   html, // html body
    // });
  }

  getInstance() {
    if (!EmailHelper.instance) {
      EmailHelper.instance = new EmailHelper();
    }
    return EmailHelper.instance;
  }
}
