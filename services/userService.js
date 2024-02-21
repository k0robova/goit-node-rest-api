import dotenv from "dotenv";
dotenv.config();
import bcryptjs from "bcryptjs";
import gravatar from "gravatar";
import { nanoid } from "nanoid";

import { subscriptionTypes } from "../constants.js";
import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contactModel.js";
import { User } from "../models/userModel.js";
import { signToken } from "./jwtService.js";
import { sendEmail } from "../helpers/sendEmail.js";

const { SECRET_KEY, BASE_URL } = process.env;

export const getAllContactsDB = async (idOwner, pagination) => {
  const contacts = await Contact.find(idOwner, "", pagination);
  return contacts;
};

export const getOneContactDB = async (contactId, owner) => {
  const contact = await Contact.findOne({ _id: contactId, owner });

  if (!contact) {
    throw HttpError(409, "Smth went wrong");
  }
  return contact;
};

export const createContactDB = async (contactData) => {
  const newContact = await Contact.create(contactData);
  return newContact;
};

export const deleteContactDB = async (contactId, owner) => {
  const resultDeleteContact = await Contact.findOneAndDelete({
    _id: contactId,
    owner,
  });

  if (!resultDeleteContact) {
    throw HttpError(409, "Smth went wrong");
  }

  return resultDeleteContact;
};

export const updateContactDB = async (contactId, contactData, owner) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    contactData,
    {
      new: true,
    }
  );

  if (!contact) {
    throw HttpError(409, "Smth went wrong");
  }
  return contact;
};

// AUTH SERVER :
export const registerUserDB = async (userData) => {
  const { password, email } = userData;
  const hassedPassword = await bcryptjs.hash(password, 10);

  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();
  const newUser = await User.create({
    ...userData,
    password: hassedPassword,
    avatarURL,
    verificationToken,
  });

  newUser.password = undefined;

  const verifyEmail = {
    to: email,
    subject: "Verify your email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click here to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  return newUser;
};

export const loginUserDB = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw HttpError(401, "Not autorized. Email or password is wrong");

  if (!user.verify)
    throw HttpError(401, "Email is not verified. Please confirm your email");

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

export const updateSubscriptionDB = async (idOwner, subscriptionInfo) => {
  const updateInfoSub = await User.findByIdAndUpdate(
    idOwner,
    { subscription: subscriptionInfo },
    { new: true }
  );
  console.log(updateInfoSub);
  return updateInfoSub;
};
