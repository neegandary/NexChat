import { Router } from ".pnpm/express@5.1.0/node_modules/express";
import { getAllContacts } from "../controllers/ContactsController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, getAllContacts);

export default contactsRoutes;