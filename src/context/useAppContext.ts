import { User } from "@supabase/supabase-js";
import { useOutletContext } from "react-router-dom";

export interface IUserContext {
  user: User | null;
  isMobile: boolean;
}

export const useAppContext = () => useOutletContext<IUserContext>();
