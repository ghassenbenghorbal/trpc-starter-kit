import { create } from "zustand";

export type NavigationState = {
  sidebarIsOpen: boolean;
  sidebarIsHidden: boolean;
  setSidebarIsOpen: (sidebarIsOpen: boolean) => void;
  setSidebarIsHidden: (sidebarIsHidden: boolean) => void;
};

export const useNavigationStore = create<NavigationState>()((set) => ({
  sidebarIsOpen: false,
  sidebarIsHidden: true,
  setSidebarIsOpen: (sidebarIsOpen: boolean) => {
    set({ sidebarIsOpen });
    localStorage.setItem("sidebarIsOpen", sidebarIsOpen.toString());
  },
  setSidebarIsHidden: (sidebarIsHidden: boolean) => {
    set({ sidebarIsHidden, sidebarIsOpen: true});
  },
}));
