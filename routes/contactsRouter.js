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

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", checkContactId, getOneContact);

contactsRouter.delete("/:id", checkContactId, deleteContact);

contactsRouter.post("/", checkCreateContactData, createContact);

contactsRouter.put("/:id", checkContactId, checkUpdateUserData, updateContact);

contactsRouter.patch(
  "/:id/favorite",
  checkContactId,
  checkUpdateUserData,
  updateContact,
  updateFavoriteSchema,
  updateStatusContact
);

export default contactsRouter;
