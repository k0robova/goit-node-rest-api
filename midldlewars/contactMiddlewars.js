import { Types } from "mongoose";

import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contactModel.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import { catchAsync } from "../helpers/catchAsync.js";

export const checkCreateContactData = catchAsync(async (req, res, next) => {
  const { value, error } = createContactSchema(req.body);

  if (error)
    return res.status(400).json({
      message: error.message,
    });

  const contactExists = await Contact.exists({ email: value.email });

  if (contactExists)
    throw HttpError(409, "Contact with this email already exists");

  const isContactExist = await Contact.exists({ phone: value.phone });
  if (isContactExist)
    throw HttpError(409, "Contact with this number already exists");

  req.body = value;

  next();
});

export const checkContactId = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const isIdValid = Types.ObjectId.isValid(id);

  if (!isIdValid) throw HttpError(404, "Contact not found");

  const contactAlreadyExists = await Contact.exists({ _id: id });
  // const userExists = await User.findById(id).select('_id');

  if (!contactAlreadyExists) throw HttpError(404, "Contact not found");

  next();
});

export const checkUpdateUserData = (req, res, next) => {
  const { value, error } = updateContactSchema(req.body);

  // if (error) throw HttpError(400, "Invalid contact data");
  if (error) throw HttpError(400, error.message);

  req.body = value;

  next();
};
