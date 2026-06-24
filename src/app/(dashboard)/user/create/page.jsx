
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { getAllRole } from "@/repositories/role.repository"; 
import UserFormClient from "@/app/(dashboard)/user/UserFormClient";
import { getAllBranches } from "@/repositories/branch.repository";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) redirect("/dashboard?error=unauthorized");


    const roles = await getAllRole();
    const branches = await getAllBranches()


    return <UserFormClient dbRoles={roles} dbBranches={branches}  />;
  } catch (error) {
   if (error.message === "NEXT_REDIRECT" || error.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    redirect("/login");
  }
}