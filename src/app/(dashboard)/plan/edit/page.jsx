import PlannerFormClient from "@/app/(dashboard)/plan/PlannerFormClient"
import { getPlanById } from "@/repositories/plan.repository"

export default async function EditPlan({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const planId = resolvedSearchParams.id;

    let planObj = null

    if (planId) {
        try {
            const rawObj = await getPlanById(planId)
            planObj = {
                id: rawObj.id,
                title: rawObj.title,
                date: rawObj.date,
                user: rawObj.user?.name,
                id_user: rawObj.user?.id,
                branch: rawObj.branch?.name,
                area: rawObj.branch?.area?.area
            };
        } catch (error) {
            console.error("Failed to load plan", error);
        }
    } else if (resolvedSearchParams.data) {
        try {
            const rawObj = JSON.parse(decodeURIComponent(resolvedSearchParams.data));

            planObj = {
                id: rawObj.id,
                title: rawObj.t,
                date: rawObj.d,
                user: rawObj.u,
                id_user: rawObj.iu,
                branch: rawObj.b,
                area: rawObj.a
            };
        } catch (error) {
            console.error("Failed to read legacy plan data", error);
        }
    }
    return <PlannerFormClient currentPlan={planObj} />;
}