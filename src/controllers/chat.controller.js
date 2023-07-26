
export const chat = (req, res) => {
  res.render('chat', {
    title: 'Chat-App',
    style: '/css/chat.css',
  });
}