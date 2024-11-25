import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type:mongoose.Schema.Types.ObjectId, //dichiarazione della reference di sotto
            ref:"User",  //è una reference al modello utente
            required: true
        },
        receiverId: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true
        },
        text:{
            type:String,
        },
        image:{
            type: String,
        },
    },{timestamps:true}
);
const Message = mongoose.model("Message", messageSchema)
export default Message;
