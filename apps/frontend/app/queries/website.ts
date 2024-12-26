import { Website } from "@/types/website";
import { GetWebsitesSchema } from "../validation/website";
import { toast } from "sonner";

export async function getWebsites(
    input: GetWebsitesSchema
): Promise<{ data: Website[]; count: number; pageCount: number }> {
    try {
        const queryObject = Object.fromEntries(
            Object.entries(input).map(([key, value]) => {
                if (Array.isArray(value)) {
                    return [key, value.join(",")];
                } else if (typeof value === "object" && value !== null) {
                    return [key, JSON.stringify(value)];
                } else {
                    return [key, String(value)];
                }
            })
        );

        const query = new URLSearchParams(queryObject).toString();

        const response = await fetch(`${process.env.NGINX_URL}/api/v1/websites${query ? "?" + query : ""}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching websites", error);
        return { data: [], count: 0, pageCount: 0 };
    }
}
