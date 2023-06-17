import Product from "../models/productModel.js"
import ErrorHandler from "../utils/errorhandler.js"
import catchAsyncError from "../middleware/catchAsyncError.js"
import ApiFeatures from "../utils/apiFeatures.js"

// Create Product -- Admin
export const createProduct = catchAsyncError(async (req, res, next) => {
    req.body.user = req.user.id
    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
})

// Get All Product
export const getAllProduct = catchAsyncError(async (req, res) => {
    const resultPerPage = 5
    const productCount = await Product.countDocuments()

    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage)
    // console.log(apiFeature.query)
    const products = await apiFeature.query
    
    res.status(200).json({
        success: true,
        products,
    })
})

// Get Product Details
export const getProductDetails = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).send({
        success: true,
        product,
        productCount
    })
})

// Update product -- Admin
export const updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
})

// Delete Product
export const deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    // await product.remove()
    // remove function is throwing some error that's findByIdAndDelete is used insteed of findById

    res.status(200).send({
        success: true,
        message: "Product Deleted Successfully"
    })
})