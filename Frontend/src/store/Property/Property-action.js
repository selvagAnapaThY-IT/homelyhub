import { propertyAction } from "./Property-slice";
import { axiosInstance } from "../../utils/axios";

export const getAllProperties = () => async (dispatch, getState) => {
    try {
        console.log("API call started");

        dispatch(propertyAction.getRequest());

        // ✅ Search parameters
        const { searchParams } = getState().property;

        console.log("Search Params:", searchParams);

        const response = await axiosInstance.get("/v1/rent/listings", {
            params: { ...searchParams }
        });

        console.log("Response:", response);

        const { data } = response;

        console.log("API Data:", data);

        dispatch(propertyAction.getProperties(data));

    } catch (error) {
        console.error("API Error:", error);

        dispatch(propertyAction.getErrors(error.response?.data?.message || error.message || "Failed to fetch properties"));
    }
};