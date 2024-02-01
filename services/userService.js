import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contactModel.js";

export const getAllContactsDB = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getOneContactDB = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export const createContactDB = async (contactData) => {
  const newContact = await Contact.create(contactData);
  return newContact;
};

export const deleteContactDB = async (contactId) => {
  const resultDeleteContact = await Contact.findByIdAndDelete(contactId);
  return resultDeleteContact;
};

export const updateContactDB = async (contactId, contactData) => {
  const contact = await Contact.findByIdAndUpdate(contactId, contactData, {
    new: true,
  });
  return contact;
};

export const updateStatusContactDB = async () => {};
