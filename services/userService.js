import bcryptjs from "bcryptjs";

import { subscriptionTypes } from "../constants.js";
import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contactModel.js";
import { User } from "../models/userModel.js";
import { signToken } from "./jwtService.js";

export const getAllContactsDB = async (idOwner, query) => {
  const contacts = await Contact.find(idOwner);
  return { contacts, total: contacts.length };
  // !2
  // const { _id: owner } = idOwner;

  // const contacts = await Contact.find();
  // const { page = 1, limit = 10, favorite } = query;
  // const skip = (page - 1) * limit;

  // const filter = favorite ? { owner, favorite } : { owner };

  // const contacts = await Contact.find(filter, "", { skip, limit });
  // !3
  // const contactQuery = Contact.find();

  // const page = query.page ? +query.page : 1;
  // const limit = query.limit ? +query.limit : 5;
  // const contactsToSkip = (page - 1) * limit;

  // contactQuery.skip(contactsToSkip).limit(limit);

  // const contacts = await contactQuery;
  // const filter = favorite ? { owner, favorite } : { owner };

  // const contacts = await Contact.find(filter, "", { skip, limit });

  // return { contacts, total: contacts.length };
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

// ! FAVORITE

// export const getFavoriteContacs = async ( )=>{ const favoriteContacts = await Contact.find({favorite: true}) return favoriteContacts}

// export const updateStatusContactDB = async () => {};

// AUTH SERVER :
export const registerUserDB = async (userData) => {
  const { password } = userData;
  const hassedPassword = await bcryptjs.hash(password, 10);

  const newUser = await User.create({ ...userData, password: hassedPassword });

  newUser.password = undefined;

  // const token = signToken(newUser.id);
  // return { user: newUser, token };
  return { user: newUser };
};

export const loginUserDB = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw HttpError(401, "Not autorized. Email or password is wrong");

  const isPasswordValid = await bcryptjs.compare(password, user.password);

  if (!isPasswordValid)
    throw HttpError(401, "Not autorized. Email or password is wrong");

  user.password = undefined;

  const token = signToken(user.id);
  await User.findByIdAndUpdate(user._id, { token });
  return { user, token };
};

export const logoutUserDB = async (id, token) => {
  const user = await User.findByIdAndUpdate(id, token);
  return user;
};
