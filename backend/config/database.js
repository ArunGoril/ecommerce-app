import mongoose from "mongoose";

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URL).then((data) => {
        console.log(`mongoDB connected with server ${data.connection.host}`)
    })
    // removed the catch block because we have handled the error in server.js
}

export default connectDatabase