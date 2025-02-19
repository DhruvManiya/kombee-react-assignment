import { IUser } from "@/app/dto/user.dto";
import { atom } from "jotai";

export const userManagement = atom<IUser[]>([]);
