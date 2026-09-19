import { propertyDetailAction } from "./PropertyDetail-slice";
import { axiosInstance } from "../../utils/axios";

export const getPropertyDetails = (id) => async (dispatch) => {
    try {
        dispatch(propertyDetailAction.getRequest());
        const response = await axiosInstance.get(`/v1/rent/listings/${id}`);
        console.log("Property detail response:", response);

        if (!response || !response.data) {
            throw new Error("Could not fetch property details");
        }

        const data = response.data.data || response.data;
        dispatch(propertyDetailAction.getPropertyDetails(data));
    } catch (error) {
        console.error("Fetch property details error:", error);
        dispatch(
            propertyDetailAction.getErrors(
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Failed to fetch property details"
            )
        );
    }
};