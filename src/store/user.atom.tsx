import { IUserResponse } from "@/app/dto/login.dto";
import { atom } from "jotai";

export const userAtom = atom<IUserResponse | null>(null);
