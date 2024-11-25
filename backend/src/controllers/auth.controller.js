import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup = async (req,res) =>{
    const{fullName, email, password} = req.body
  try {
    if(!email || !fullName || !password ){
        return res.status(400).json({message:"I campi non devono essere vuoti"})
    }
    if (password.length < 6){
        return res.status(400).json({message:"Digitare almeno 6 caratteri"});
    }

    const user = await User.findOne({email})
    if(user) return res.status(400).json({message:"email già esistente"});
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser = new User({
        fullName:fullName,
        email:email,
        password:hashedPassword

    })

    if(newUser){
    generateToken(newUser._id, res)
    await newUser.save();

    res.status(201).json({
        _id:newUser._id, 
        fullName: newUser.fullName,
        email:newUser.email,
        profilePic: newUser.profilePic,

    })
    } else {
        res.status(500).json({message:"Dati utente non validi"})
    }

    
  } catch (error) {
    console.log("errore nel controller di signup", error.message)
    res.status(500).json({message:"Errore interno del server"})
  }
}
export const login = async(req,res) =>{
    const{email,password}  =req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Credenziali non valide"})
        }
        const isPasswordcorrect= await bcrypt.compare(password, user.password)
        if(!isPasswordcorrect){
        return res.status(400).json({message:"Credenziali non valide"})
        } 

        generateToken(user._id, res)

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic: user.profilePic,
    })
}  catch (error) {
        console.log("errore nel controller login", error.massage);
        return res.status(500).json({message:"Errore interno del server"});
}
}

export const logout = (req,res) =>{
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message:"Log out eseguito"})
    } catch (error) {
        console.log("errore nel controller login", error.massage);
        return res.status(500).json({message:"Errore interno del server"});
        
    }
}


export const updatedProfile = async(req,res) =>{
    try {
        const {profilePic} = req.body;
       const userId = req.user._id;
       if(!profilePic){
        res.status(400).json({message:"L'immagine è richiesta!"})
       }
      const UploadResponse = await cloudinary.uploader.upload(profilePic)
      const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:UploadResponse.secure_url}, {new:true})
      res.status(200).json(updatedUser)
    } catch (error) {
        console.log("errore nella parte di update immagine", error)
    }
}


export const checkAuth = (req,res)=>{
try {
    res.status(200).json(req.user)
} catch (error) {
    console.log("error in checkauth controller", error.message)
    res.status(500).json({message:"Errore interno del server"})
    
}
}