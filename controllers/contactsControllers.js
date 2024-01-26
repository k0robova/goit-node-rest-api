import HttpError from "../helpers/ HttpError.js";
import {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateOneContact,
} from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const resultAllContacts = await listContacts();
    res.status(200).json(resultAllContacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultOneContact = await getContactById(id);
    if (!resultOneContact) {
      throw HttpError(404, "Not found");
    } else {
      return res.status(200).json(resultOneContact);
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultDeleteContact = await removeContact(id);
    if (!resultDeleteContact) {
      throw HttpError(404, "Not found");
    } else {
      return res.status(200).json(resultDeleteContact);
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { value, error } = createContactSchema(req.body);
  if (error)
    return res.status(400).json({
      message: error.message,
    });
  const { name, email, phone } = value;
  try {
    const contact = await addContact(name, email, phone);
    return res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
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

    const { id } = req.params;
    const contact = await updateOneContact(id, req.body);

    if (!contact) {
      throw HttpError(404, "Not found");
    } else {
      return res.status(200).json(contact);
    }
  } catch (error) {
    next(error);
  }
};
