import { fakerES as faker } from "@faker-js/faker";


export const generateProducts = () => { 


    return {
      id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(2),
      description: faker.lorem.paragraph(1),
      code: faker.string.alphanumeric(10),
      price: faker.commerce.price(),
      status: faker.datatype.boolean(),
      stock: faker.string.numeric(3),
      category: faker.commerce.department(),
      thumbnails: faker.image.url(),
    };
}