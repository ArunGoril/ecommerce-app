import cookieParser from "cookie-parser"
import express from "express"
const app = express()
import errorMiddleware from "./middleware/error.js"

app.use(express.json())
app.use(cookieParser())

// Route imports
import product from "./routes/productRoute.js"
import user from "./routes/userRoute.js"

app.use("/api/v1", product)
app.use("/api/v1", user)

// Middleware for errors
app.use(errorMiddleware)

export default app