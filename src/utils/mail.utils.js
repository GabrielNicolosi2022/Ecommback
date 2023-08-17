import transporter from '../config/mails.js';
import config from '../config/config.js';

const sendRecoverPassword = (email, token) => {
  const url =
    config.url.baseUrl + config.url.recoverPassword + `?token=${token}`;
  console.log('passwordrecover url: ' + url);
  const button = `<a href=${url}>
                        <button>Recuperar contraseña</button>
                    </a>`;
  const mailOptions = {
    from: 'noreply@miempresa.com',
    to: email,
    subject: 'Recuperación de contraseña',
    html: `
            <h1>Por favor haga click en el siguiente botón para recuperar la contraseña</h1>
            <hr>
            ${button}
        `,
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
