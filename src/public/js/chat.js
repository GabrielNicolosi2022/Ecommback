import getLogger from '../utils/log.utils.js';

const log = getLogger();

const socket = io();

let user;

const form = document.getElementById('message-form');
const chatbox = document.getElementById('chatbox');

Swal.fire({
  title: 'Identifícate',
  input: 'text',
  inputPlaceholder: 'username',
  text: 'Ingresa el usuario para identificarte en el chat',
  inputValidator: (value) => {
    return (
      !value &&
      '¡Necesitas escribir un nombre de usuario para comenzar a chatear'
    );
  },
  allowOutsideClick: false,
  allowEscapeKey: true,
  allowEnterKey: true,
}).then((result) => {
  log.info('result: ', result);
  user = result.value;
  socket.emit('authenticated', user);
});

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  if (chatbox.value.trim().length > 0) {
    socket.emit('message', {
      user: user,
      message: chatbox.value,
    });
    chatbox.value = '';
  }
});

socket.on('messageLogs', (data) => {
  if (!user) return;
  let log = document.getElementById('messageLogs');
  let messages = '';
  data.forEach((message) => {
    messages += `${message.user} dice: ${message.message}<br/>`;
  });
  log.innerHTML = messages;
});

socket.on('newUserConnected', (data) => {
  if (!user) return;
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    title: `${data} se ha unido al chat`,
    icon: 'success',
  });
});
