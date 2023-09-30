import transporter from '../config/mails.js';
import config from '../config/config.js';

import { devLog, prodLog } from '../config/customLogger.js';

let log;

config.environment.env === 'production' ? (log = prodLog) : (log = devLog);

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
      log.error('Error: ', err.message);
      return;
    }

    log.info('Mail enviado: ', info);
  });
};

const deleteAccountMail = (email) => {
  const mailBody = `
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <h1>Cuenta Eliminada</h1>
        <hr />
      </td>
    </tr>
  </table>
  <p>Hemos detectado que su cuenta ha permanecido inactiva por mas de 2 días, motivo por el cual ha sido eliminada.</p>
`;

  const mailOptions = {
    from: 'noreply@miempresa.com',
    to: email,
    subject: 'Cuenta eliminada',
    html: mailBody,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      log.error('Error: ', err.message);
      return;
    }

    log.info('Mail enviado: ', info);
  });
};

const deleteProductMail = (email) => {
  const mailBody = `
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <h1>Producto Eliminado</h1>
        <hr />
      </td>
    </tr>
  </table>
  <p>Nos ponemos en contacto con usted para indicarle que un producto de su propiedad ha sido eliminado.</p>
`;

  const mailOptions = {
    from: 'noreply@miempresa.com',
    to: email,
    subject: 'Producto eliminado',
    html: mailBody,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      log.error('Error: ', err.message);
      return;
    }

    log.info('Mail enviado: ', info);
  });
};

const successfulPurchase = (order, email, response) => {
  try {
    const { code, purchase_datetime, amount } = order;
    const { message, processedProducts, remainingProducts } = response;
    let mailBody = `
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <h1>Compra realizada exitosamente</h1>
    <tr>
    <th style="border: 1px solid #000; padding: 8px;">N° de orden</th>
    <th style="border: 1px solid #000; padding: 8px;">Fecha de compra</th>
    <th style="border: 1px solid #000; padding: 8px;">Monto abonado</th>
  </tr>
  <tr>
    <td style="border: 1px solid #000; padding: 8px;">${code}</td>
    <td style="border: 1px solid #000; padding: 8px;">${purchase_datetime}</td>
    <td style="border: 1px solid #000; padding: 8px;">$ ${amount}</td>
  </tr>
  </table>
  <hr />
  `;
    if (processedProducts.length > 0) {
      mailBody += '<h2>Productos procesados:</h2>';
      mailBody +=
        '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
      mailBody += '<tr>';
      mailBody +=
        '<th style="border: 1px solid #000; padding: 8px;">Producto</th>';
      mailBody +=
        '<th style="border: 1px solid #000; padding: 8px;">Precio</th>';
      mailBody += '</tr>';

      processedProducts.forEach((product) => {
        mailBody += '<tr>';
        mailBody += `<td style="border: 1px solid #000; padding: 8px;">${product.product.title}</td>`;
        mailBody += `<td style="border: 1px solid #000; padding: 8px;">$ ${product.product.price}</td>`;
        mailBody += '</tr>';
      });

      mailBody += '</table>';
    }

    if (
      message !== 'Compra realizada exitosamente' &&
      remainingProducts.length > 0
    ) {
      mailBody += '<h2>Productos no procesados:</h2>';
      mailBody +=
        '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
      mailBody += '<tr>';
      mailBody +=
        '<th style="border: 1px solid #000; padding: 8px;">Producto</th>';
      mailBody +=
        '<th style="border: 1px solid #000; padding: 8px;">Precio</th>';
      mailBody += '</tr>';

      remainingProducts.forEach((product) => {
        mailBody += '<tr>';
        mailBody += `<td style="border: 1px solid #000; padding: 8px;">${product.product.title}</td>`;
        mailBody += `<td style="border: 1px solid #000; padding: 8px;">$ ${product.product.price}</td>`;
        mailBody += '</tr>';
      });

      mailBody += '</table>';
    }

    const mailOptions = {
      from: 'noreply@miempresa.com',
      to: email,
      subject: 'Compra realizada',
      html: mailBody,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        log.error('Error: ', err.message);
        return;
      }

      log.info('Mail enviado: ', info);
    });
  } catch (error) {
    log.info('successfulPurchase mail: ', error);
    throw new Error();
  }
};
export {
  sendRecoverPassword,
  deleteAccountMail,
  deleteProductMail,
  successfulPurchase,
};
