"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function redirectToNewChat(chatId) {
    revalidatePath("/api/chat/");
    redirect(`/chat/${chatId}`);
}
