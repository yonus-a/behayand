import type { Service } from "./service";

export interface Profile {
  id: number;
  name: string;
  lastName: string;
  nationality: "iranian" | "foriegner";
  nationalId: string;
  email?: string | null;
  gender: "male" | "female" | null;
  imageUrl: string;
  birthDate: Date | null;
  placeOfBirth?: string | null;
  relationShipStatus?: "single" | "married" | "divorced" | "widowed" | null;
  balance: number;
  phoneNumber: string;
  referral?: Referral;
}

export type UserRoleKey = "user" | "employee" | "business" | "support";

export interface RoleDetail {
  label: string;
  key: UserRoleKey;
}

export interface Referral {
  id: number;
  date: Date;
  priority: "high" | "medium" | "low";
  service: Service;
}
