import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client"; // Corretto, importa dal pacchetto client

const BASE_URL = import.meta.env.MODE == "development" ? "http://localhost:5000" : "/"

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [], 
  socket: null, // Mantieni il socket nello stato per gestirlo facilmente

  // Funzione per il controllo dell'autenticazione
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Errore nel checkauth ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Funzione di signup
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account creato!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Funzione di login
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Log in effettuato!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Funzione di logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Log out effettuato");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Funzione per aggiornare il profilo (con l'immagine)
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });  //impostiamo lo stato di aggiornamento del profilo a vero
    try {
      const res = await axiosInstance.put("/auth/update-profile", data); //facciamo una richiesta e indietro ci torna una risposta
      set({ authUser: res.data }); //upload dello stato
      toast.success("Profilo aggiornato con successo!");
    } catch (error) {
      console.log("Errore nell'aggiornamento del profilo:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false }); //una volta terminato il processo di caricamento dell'immagine, impostiamo lo stato di caricamento a falso
    }
  },

  // Connessione del socket solo se l'utente è autenticato
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return; // Non connette se già connesso
    const socket = io(BASE_URL, {
      query:{
        userId : authUser._id,
      }
    }); // Creazione del nuovo socket
    socket.connect();
    set({ socket: socket }); // Salva il socket nello stato
    socket.on("getOnlineUsers", (userIds) =>{
    set({onlineUsers : userIds}); //update dell'array onlineUsers
    })
  },

  // Disconnessione del socket
  disconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();
  },
}));

