import { db } from "@/server/db";

export const createContext = () => {
  return {
    db,
  };
};
