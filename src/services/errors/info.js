export const generateUserErrorInfo = (user) => {
  return `One or more properties were incomplete or not valid.
    List of required properties:
    *first_name  : needs to be a String, received ${user.first_name}
    *last_name   : needs to be a String, received ${user.last_name}
    *email       : needs to be a String, received ${user.email}
    *age         : needs to be a Number, received ${user.age}
    *password    : needs to be a String, received ${user.password}
    *role        : needs to be a String, received ${user.role}`;
};

export const createProductPropsErrorInfo = (productData) => {
  return `One or more properties were incomplete or not valid.
    List of required properties:
    *title       : needs to be a String,  received ${productData.title}
    *description : needs to be a String,  received ${productData.description}
    *code        : needs to be a String,  received ${productData.code}
    *price       : needs to be a Number,  received ${productData.price}
    *status      : needs to be a Boolean, received ${productData.status}
    *stock       : needs to be a Number,  received ${productData.stock}
    *category    : needs to be a String,  received ${productData.category}`
};



