import { fakerES as faker } from '@faker-js/faker';

export const generateUser = () => {
/*   const generateRole = () => {
    const roles = ['user', 'admin'];
    const randomIndex = faker.string.numeric({ min: 0, max: roles.length - 1 });
    return roles[randomIndex];
  };
 */
  return {
    id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email({firstName, lastName}),
    age: faker.number.int({ min: 18, max: 80 }),
    password: faker.internet.password({ length: 60 }),
    role: faker.helpers.arrayElement(['user', 'admin']),
    cart: faker.database.mongodbObjectId(),
    orders: faker.database.mongodbObjectId(),
  };
};
