import { createSupabaseClient } from "./supabase";

export async function saveHistory(content: string) {
  const supabase = createSupabaseClient();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error("Chưa đăng nhập");
  }

  const { error } = await supabase.from("history").insert({
    content,
    user_id: userData.user.id,
  });

  if (error) {
    console.error("Lỗi lưu lịch sử:", error.message);
  }
}
