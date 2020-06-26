// import nodemailer from 'nodemailer';
// import mailConfig from '../config/mail';

// interface CreateTransporterDTO {
//   host: string;
//   port: string;
//   secure: boolean;
//   auth: {
//     user: string;
//     pass: string;
//   };
// }

// class Mail {
//   sendMail(message: {}): void {
//     const transporter = nodemailer.createTransport({
//       host: mailConfig.host,
//       port: mailConfig.port,
//       secure: mailConfig.secure,
//       auth: {
//         user: mailConfig.auth.user,
//         pass: mailConfig.auth.pass,
//       },
//     });

//     transporter.sendMail({
//       ...mailConfig.default,
//       ...message,
//     });
//   }
// }

// export default new Mail();
