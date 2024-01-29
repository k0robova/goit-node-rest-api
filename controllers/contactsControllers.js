import mongoose from "mongoose";

import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import { Contact } from "../models/contactModel.js";
import { catchAsync } from "../helpers/catchAsync.js";
import {
  createContactDB,
  deleteContactDB,
  getAllContactsDB,
  getOneContactDB,
  updateContactDB,
} from "../services/userService.js";

export const getAllContacts = catchAsync(async (req, res) => {
  const contacts = await getAllContactsDB();
  return res.status(200).json(contacts);
});

export const getOneContact = catchAsync(async (req, res, next) => {
  const contact = await getOneContactDB(req.params.id);
  return res.status(200).json(contact);
});

export const createContact = catchAsync(async (req, res, next) => {
  const newContact = await createContactDB(req.body);
  return res.status(201).json({ contact: newContact });
});

export const deleteContact = catchAsync(async (req, res, next) => {
  const resultDeleteContact = await deleteContactDB(req.params.id);
  if (!resultDeleteContact) {
    throw HttpError(404, "Not found");
  } else {
    return res.status(200).json(resultDeleteContact);
  }
});

export const updateContact = catchAsync(async (req, res, next) => {
  const keys = Object.keys(req.body);

  if (keys.length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }

  const { value, error } = updateContactSchema(req.body);

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  const contact = await updateContactDB(req.params.id, req.body, {
    new: true,
  });

  if (!contact) {
    throw HttpError(404, "Not found");
  } else {
    return res.status(200).json(contact);
  }
});

export const updateStatusContact = async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!contact) {
    throw HttpError(404, "Not found");
  } else {
    return res.status(200).json(contact);
  }
};
