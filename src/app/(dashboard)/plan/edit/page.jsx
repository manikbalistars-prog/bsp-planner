import PlannerFormClient from "@/app/(dashboard)/plan/PlannerFormClient"

export default async function EditPlan({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const dataRaw = resolvedSearchParams.data;

    let planObj = null

    if (dataRaw) {
        try {
            const rawObj = JSON.parse(decodeURIComponent(dataRaw));

            planObj = {
                id: rawObj.id,
                title: rawObj.t,
                date: rawObj.d,
                user: rawObj.u,
                id_user:rawObj.iu,
                branch: rawObj.b,
                area: rawObj.a
            };
        } catch (error) {
            toast.error("Failed to read data", { description: error });
        }
    }
    return <PlannerFormClient currentPlan={planObj} />;
}