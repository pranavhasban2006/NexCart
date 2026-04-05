import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("userToken");
        if (token && token !== "null" && token !== "undefined") {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401s
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized! Redirecting to login...");
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
