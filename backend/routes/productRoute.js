import express from "express"
import { getAllProduct, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview } from "../controllers/productController.js"
import {isAuthenticatedUser, authorizeRoles} from "../middleware/auth.js"

const router = express.Router()

router.route("/products").get(getAllProduct)

router.route("/admin/products/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct)

router.route("/admin/product/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
    
router.route("/product/:id").get(getProductDetails)

router.route("/review").put(isAuthenticatedUser, createProductReview)

router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser ,deleteReview)

export default router