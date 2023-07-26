// DTO para el usuario que contiene solo la información necesaria
export const userDTO = (user) => ({
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  role: user.role,
});
