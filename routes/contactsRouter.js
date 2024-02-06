import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import {
  checkContactId,
  checkCreateContactData,
  checkUpdateUserData,
} from "../midldlewars/contactMiddlewars.js";
import { updateFavoriteSchema } from "../schemas/contactsSchemas.js";
import { authenticate } from "../midldlewars/authMiddlewars.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, checkContactId, getOneContact);

contactsRouter.delete("/:id", authenticate, checkContactId, deleteContact);

contactsRouter.post("/", authenticate, checkCreateContactData, createContact);

contactsRouter.put(
  "/:id",
  authenticate,
  checkContactId,
  checkUpdateUserData,
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  checkContactId,
  checkUpdateUserData,
  updateContact,
  updateFavoriteSchema,
  updateStatusContact
);

export default contactsRouter;
