import { Types } from "mongoose";

import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contactModel.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import { catchAsync } from "../helpers/catchAsync.js";

// export const checkUserExists = async (filter) => {
//   const userExists = await User.exists(filter);

//   if (userExists) throw new HttpError(409, "User already exists..");
// };

export const checkCreateContactData = catchAsync(async (req, res, next) => {
  const { value, error } = createContactSchema(req.body);

  if (error)
    return res.status(400).json({
      message: error.message,
    });

  const contactExists = await Contact.exists({ email: value.email });

  if (contactExists)
    throw HttpError(409, "Contact with this email already exists..");

  console.log(contactExists);

  req.body = value;

  next();
});

export const checkContactId = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const isIdValid = Types.ObjectId.isValid(id);

  if (!isIdValid) throw HttpError(404, "User not found");

  const contactAlreadyExists = await Contact.exists({ _id: id });
  // const userExists = await User.findById(id).select('_id');

  if (!contactAlreadyExists) throw HttpError(404, "User not found");

  next();
});

export const checkUpdateUserData = (req, res, next) => {
  const { value, error } = updateContactSchema(req.body);

  if (error) throw HttpError(400, "Invalid user data");

  // await checkUserExists({
  //   email: value.email,
  //   _id: { $ne: req.params.id },
  // });

  req.body = value;

  next();
};
