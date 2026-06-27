import { getDashboardBranch, getDashboardArea } from "@/repositories/dashboard.repository";

export const dashboardBranchService = async (month, year) => {
    return await getDashboardBranch(month, year);
};

export const dashboardAreaService = async (month, year) => {
    return await getDashboardArea(month, year);
};