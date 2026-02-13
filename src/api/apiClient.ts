
import axios, { type AxiosRequestConfig } from "axios";

// Get the API base URL from localStorage
function getBaseUrl(): string {
  const savedUrl = localStorage.getItem("serverAddress");
  return savedUrl && savedUrl.trim() !== "" ? savedUrl : ""; // return empty string if not set
}

// Create axios instance
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor to dynamically update baseURL before every request
apiClient.interceptors.request.use((config) => {
  const baseURL = getBaseUrl();
  if (!baseURL) {
    console.warn("API base URL is not set.");
  }
  config.baseURL = baseURL; // always use latest saved URL
  return config;
});

// Generic request wrapper
async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const baseURL = getBaseUrl();
  if (!baseURL) {
    throw new Error("API base URL is not set. Cannot make request.");
  }

  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("API Error:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Axios Error:", error.message);
      }
    } else {
      console.error("Unexpected Error:", error);
    }
    throw error;
  }
}

export { request };
export default apiClient;
