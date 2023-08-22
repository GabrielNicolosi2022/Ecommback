import transporter from '../config/mails.js';
import config from '../config/config.js';

const sendRecoverPassword = (email, token) => {
  const url =
    config.url.baseUrl + config.url.recoverPassword + `?token=${token}`;

  const button = `<a href="${url}" style="background-color: #007bff; border: none; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px;">Recuperar contraseña</a>`;

  const mailBody = `
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <h1>Por favor haga clic en el siguiente botón para recuperar la contraseña</h1>
        <hr />
        ${button}
      </td>
    </tr>
  </table>
  <p>Si, por cualquier motivo, no ves el botón anterior, <a href="${url}">haz clic en este enlace</a>.</p>
`;

  const mailOptions = {
    from: 'noreply@miempresa.com',
    to: email,
    subject: 'Recuperación de contraseña',
    html: mailBody,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error: ', err.message);
      return;
    }

    console.log('Mail enviado: ', info);
  });
};

export { sendRecoverPassword };
