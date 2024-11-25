import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");//mostra tutti gli utenti tranne quello selezionato e rimuove il campo password, in modo tale da non mandarlo come campo

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
    try {
      const { text, image } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user._id;
  
      // Controlla se ci sono dati nel messaggio (testo o immagine)
      if (!text.trim() && !image) {
        return res.status(400).json({ message: "Message content is required" });
      }
  
      let imageUrl = null;
      if (image) {
        // Upload base64 image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image, { 
          folder: "chat_images", // Organizza le immagini in una cartella separata
          allowed_formats: ["jpg", "jpeg", "png", "gif"], // Limita i formati supportati
        });
  
        imageUrl = uploadResponse.secure_url; // Ottieni il link sicuro dell'immagine
      }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }


    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Errore in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
