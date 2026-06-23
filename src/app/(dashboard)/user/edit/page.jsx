
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { getAllRole } from "@/repositories/role.repository";
import { getAllBranches } from "@/repositories/branch.repository";
import { findUserById } from "@/repositories/user.repository";
import UserFormClient from "@/app/(dashboard)/user/UserFormClient";
export default async function Page({ searchParams }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) redirect("/login");

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.isAdmin) redirect("/dashboard?error=unauthorized");


        const params = await searchParams;
        const userId = params.id;


        if (!userId) {
            redirect("/user");
        }

        const [roles, branches, userData] = await Promise.all([
            getAllRole(),
            getAllBranches(),
            findUserById(userId),
        ]);

        if (!userData) {
            redirect("/user");
        }

        return (
            <UserFormClient
                dbRoles={roles}
                dbBranches={branches}
                currentUser={userData}
            />
        );
    } catch (error) {
        if (error.message === "NEXT_REDIRECT" || error.digest?.includes("NEXT_REDIRECT")) {
            throw error;
        }
        redirect("/user");
    }
}