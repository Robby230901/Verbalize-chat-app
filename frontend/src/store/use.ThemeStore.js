import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("verbalize-theme") || "aqua", //funzione per manipolare il local storage 
  setTheme: (theme) => {
    localStorage.setItem("verbalize-theme", theme);
    set({theme});
  } 
}));
