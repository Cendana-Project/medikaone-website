import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function Home() {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || cookieStore.get("refreshToken")?.value;

    if (token) {
        redirect("/dashboard");
    } else {
        redirect("/auth/login");
    }
}
