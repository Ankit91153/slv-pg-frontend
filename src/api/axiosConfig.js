import axios from "axios";
import { Alert } from "react-native";

const API_BASE_URL = "http://10.0.2.2:3000/api/v1"; // Change to your API URL

// Navigation reference for redirects
let navigationRef = null;
let storeRef = null;

export const setNavigationRef = (ref) => {
  navigationRef = ref;
};

export const setStoreRef = (store) => {
  storeRef = store;
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Log request
    console.log("📤 API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
    });

    // Add token to headers if available from Redux store
    if (storeRef) {
      const state = storeRef.getState();
      const token = state.auth?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with centralized error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ API Success:", {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const errorData = error.response?.data;

    // Log error details
    console.log("❌ API Error:", {
      status,
      url: error.config?.url,
      data: errorData,
    });

    // Format error message
    let errorMessage = "An error occurred";
    if (errorData?.errors && Array.isArray(errorData.errors)) {
      errorMessage = errorData.errors.join("\n");
    } else if (errorData?.message) {
      errorMessage = errorData.message;
    } else if (errorData?.error) {
      errorMessage = errorData.error;
    }

    // Handle different status codes
    switch (status) {
      case 400:
        // Bad Request - Validation errors
        Alert.alert("Validation Error", errorMessage);
        break;

      case 401:
        // Unauthorized - Redirect to login
        Alert.alert("Session Expired", "Please login again", [
          {
            text: "OK",
            onPress: () => {
              // Clear auth state from Redux
              if (storeRef) {
                const { logout } = require("../store/slices/authSlice");
                storeRef.dispatch(logout());
              }
              
              // Navigate to login
              if (navigationRef) {
                navigationRef.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                });
              }
            },
          },
        ]);
        break;

      case 403:
        // Forbidden
        Alert.alert("Access Denied", errorMessage);
        break;

      case 404:
        // Not Found
        Alert.alert("Not Found", errorMessage || "Resource not found");
        break;

      case 409:
        // Conflict
        Alert.alert("Conflict", errorMessage);
        break;

      case 422:
        // Unprocessable Entity
        Alert.alert("Validation Error", errorMessage);
        break;

      case 429:
        // Too Many Requests
        Alert.alert("Too Many Requests", "Please try again later");
        break;

      case 500:
        // Internal Server Error
        Alert.alert("Server Error", "Something went wrong. Please try again later");
        break;

      case 502:
      case 503:
      case 504:
        // Bad Gateway, Service Unavailable, Gateway Timeout
        Alert.alert("Service Unavailable", "Server is temporarily unavailable");
        break;

      default:
        // Unknown error
        if (error.message === "Network Error") {
          Alert.alert("Network Error", "Please check your internet connection");
        } else {
          Alert.alert("Error", errorMessage);
        }
        break;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
