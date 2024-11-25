import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import {useAuthStore} from "../store/use.AuthStore"

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while fetching users.");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while fetching messages.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
  
    if (!selectedUser) {
      toast.error("No user selected to send the message.");
      return;
    }
  
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      console.log("Message sent response:", res);  // Log per vedere la risposta dal server
  
      if (res.data) {
        // Aggiungi il nuovo messaggio alla lista dei messaggi
        set({ messages: [...messages, res.data] });
        return res.data;  // Restituisci il messaggio
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "An error occurred while sending the message.");
    }
  },
  //
  subscribeToMessages: ()=>{
const{selectedUser} = get()
if(!selectedUser) return;
const socket = useAuthStore.getState().socket;



socket.on("newMessage", (newMessage)=>{
  const isMessageSentFromSelectedUser = newMessage.senderId !== selectedUser._id //se l'utente corrisponde all'utente selezionato, fa l'update dei messaggi
  if(isMessageSentFromSelectedUser) return; //ritorna una funzione vuota, quindi non invia alla chat non selezionata
  set({
    messages: [...get().messages, newMessage],
  });
});
  },
  unsubscribeFromMessages: () => {
const socket = useAuthStore.getState().socket;
socket.off("newMessage");
  },
  

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
