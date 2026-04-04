"use server";
import { auth, signOut } from "@/auth";

export async function getProfileData() {
  const session = await auth();
  if(!session){
    throw new Error(401, "Unauthorized");
  }
  return session?.user;
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/login" });
};

