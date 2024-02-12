import Joi from "joi";

export const createContactSchema = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(5).max(25).required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      favorite: Joi.boolean(),
    })
    .validate(data);

export const updateContactSchema = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().min(5).max(30),
      email: Joi.string(),
      phone: Joi.string(),
      favorite: Joi.boolean(),
    })
    .validate(data);

export const updateFavoriteSchema = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      favorite: Joi.boolean().required(),
    })
    .validate(data);

// auth Joi Schemas:
export const registerUserSchema = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string().required(),
      password: Joi.string().min(6).required(),
      subscription: Joi.string().valid("starter", "pro", "business"),
    })
    .validate(data);

export const loginUserSchema = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string().required(),
      password: Joi.string().min(6).required(),
    })
    .validate(data);

export const updateSubscriptionSchema = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      subscription: Joi.string().valid("starter", "pro", "business").required(),
    })
    .validate(data);
