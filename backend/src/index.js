import express from "express"; 
import dotenv from "dotenv";
import authRoutes from "../src/routes/auth.routes.js"
import messageRoutes from "../src/routes/message.route.js" //framework routes middlewares ecc...
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";


dotenv.config()

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser())
app.use(cors(
    {origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes)

if(process.env.NODE_ENV =="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req,res)=>{
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html")) //entry point dell'app
})
}



server.listen(5000,()=>{
    console.log("server in ascolto sulla porta: " + PORT);
    connectDB()
})