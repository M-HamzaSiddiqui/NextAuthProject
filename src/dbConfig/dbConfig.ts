import mongoose from "mongoose"

export async function connect() {
    try {
        await mongoose.connect(String(process.env.MONGO_URI))
        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log("MongoDB connected")
        })

        connection.on('error', (err) => {
            console.log("MongoDB connection error, please make sure DB is up and running:", err)
            process.exit(1)
        })

    } catch (error) {
        console.log("Something went wrong while connectint to the database")
        console.log(error)
    }
}