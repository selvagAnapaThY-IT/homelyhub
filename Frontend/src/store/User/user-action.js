import { UserActions } from "./user-slice";
import { axiosInstance } from "../../utils/axios";

// SIGNUP
export const getSignup = (user) => async (dispatch) => {
    try {
        dispatch(UserActions.getSignupRequest());

        const { data } = await axiosInstance.post(
            "/v1/rent/user/signup",
            user
        );

        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        dispatch(UserActions.getSignupDetails(data.user));
    } catch (error) {
        dispatch(
            UserActions.getError(
                error.response?.data?.message || "Signup failed"
            )
        );
    }
};


// LOGIN
export const getLogin = (user) => async (dispatch) => {
    try {
        dispatch(UserActions.getLoginRequest());

        const { data } = await axiosInstance.post(
            "/v1/rent/user/login",
            user
        );

        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        dispatch(UserActions.getLoginDetails(data.user));
    } catch (error) {
        dispatch(
            UserActions.getError(
                error.response?.data?.message || "Login failed"
            )
        );
    }
};


// CURRENT USER
export const currentUser = () => async (dispatch) => {
    try {
        dispatch(UserActions.getCurrentRequest());

        const { data } = await axiosInstance.get(
            "/v1/rent/user/me"
        );

        dispatch(UserActions.getCurrentUser(data.user));
    } catch (error) {
        // Only logout if the server explicitly says 401 (invalid token)
        // Don't logout on network errors or 500s - that clears valid sessions
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            dispatch(UserActions.getLogout());
        }
    }
};

export const CurrentUser = currentUser;


// UPDATE USER
export const updateUser = (updateUserData) => async (dispatch) => {
    try {
        dispatch(UserActions.getUpdateUserRequest());

        await axiosInstance.patch(
            "/v1/rent/user/updateMe",
            updateUserData
        );

        const { data } = await axiosInstance.get(
            "/v1/rent/user/me"
        );

        console.log(data.user);

        dispatch(UserActions.getCurrentUser(data.user));
    } catch (error) {
        dispatch(
            UserActions.getError(
                error.response?.data?.message || "Update failed"
            )
        );
    }
};

export const UpdateUser = updateUser;



// FORGOT PASSWORD
export const forgotPassword = (email) => async (dispatch) => {
    try {
        await axiosInstance.post(
            "/v1/rent/user/forgotPassword",
            { email }
        );
    } catch (error) {
        dispatch(
            UserActions.getError(
                error.response?.data?.message || "Forgot password failed"
            )
        );
    }
};


// RESET PASSWORD
export const resetPassword = (token, repassword) => async (dispatch) => {
    try {
        await axiosInstance.patch(
            `/v1/rent/user/resetPassword/${token}`,
            repassword
        );
    } catch (error) {
        dispatch(
            UserActions.getError(
                error.response?.data?.message || "Reset password failed"
            )
        );
    }
};


// UPDATE PASSWORD
export const updatePassword = (passwords) => async (dispatch) => {
    try {
        dispatch(UserActions.getPasswordRequest());

        await axiosInstance.patch(
            "/v1/rent/user/updateMyPassword",
            passwords
        );

        dispatch(UserActions.getPasswordSuccess(true));
    } catch (error) {
        dispatch(
            UserActions.getError(
                error.response?.data?.message || "Password update failed"
            )
        );
    }
};


// LOGOUT
export const logout = () => async (dispatch) => {
    try {
        await axiosInstance.get("/v1/rent/user/logout");
        localStorage.removeItem("token");
        dispatch(UserActions.getLogout(null));
    } catch (error) {
        localStorage.removeItem("token");
        dispatch(
            UserActions.getError(
                error.response?.data?.message || "Logout failed"
            )
        );
    }
};