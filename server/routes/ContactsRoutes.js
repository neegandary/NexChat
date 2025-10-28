import { Router } from "express";
import { getAllContacts } from "../controllers/ContactsController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, getAllContacts);

export default contactsRoutes;