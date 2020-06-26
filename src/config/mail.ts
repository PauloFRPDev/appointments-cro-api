class MailConfig {
  public host = process.env.MAIL_HOST;

  public port = process.env.MAIL_PORT;

  public secure: false;

  public auth = {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  };

  public default = {
    from: 'CRO-RJ <envia@cro-rj.org.br>',
  };
}

export default new MailConfig();
