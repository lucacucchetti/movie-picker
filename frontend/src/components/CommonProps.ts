import { Dispatch, SetStateAction } from "react";

export interface CommonProps {
  isAuthenticated: boolean;
  userHasAuthenticated: Dispatch<SetStateAction<boolean>>;
}
