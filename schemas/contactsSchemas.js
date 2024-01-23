import Joi from "joi";

export const createContactSchema = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(5).max(15).required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    })
    .validate(data);

export const updateContactSchema = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(5).max(15),
      email: Joi.string(),
      phone: Joi.string(),
    })
    .validate(data);
