import express from "express"
import { getAllProduct, createProduct, updateProduct, deleteProduct, getProductDetails } from "../controllers/productController.js"
import {isAuthenticatedUser, authorizeRoles} from "../middleware/auth.js"

const router = express.Router()

router.route("/products").get(getAllProduct)

router.route("/products/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct)

router.route("/product/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
    .get(getProductDetails)

export default router