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
        productCount
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
        product
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

// create new review or update the review
export const createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId)

    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString())

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating,
                    rev.comment = comment
            }
        })
    } else {
        product.reviews.push(review)
        product.noOfReviews = product.reviews.length
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true
    })
})

// Get all review of a product
export const getProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id)

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// Delete review
export const deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId)

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())

    let sum = 0;
    reviews.forEach((rev) => {
        sum += rev.rating;
    });

    const ratings = sum / reviews.length;

    const noOfReviews = reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        noOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})