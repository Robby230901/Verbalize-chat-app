import jwt from "jsonwebtoken";
import User from "../models/user.model.js"


export const protectRoute= async (req,res,next)=>{
    try {
        const token = req.cookies.jwt

        if(!token){
            return res.status(401).json({message:"Nessun token attivo"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({message:"Token non valido"})
        }
        
        const user = await User.findById(decoded.userId).select("-password") //per non restituire la password al client
        if(!user){
            return res.status(404).json({message:"Utente non trovato"})
        }
        req.user = user

        next()

    } catch (error) {
        console.log("Errore nell'auth middleware", error.message)
        return res.status(500).json({message:"Errore interno"})
    }
}