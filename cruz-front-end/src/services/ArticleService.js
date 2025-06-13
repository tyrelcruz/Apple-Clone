import axios from "axios";
import constants from "../../constants";

const API = axios.create({
  baseURL: `${constants.HOST}/articles`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    if (error.response?.status === 500) {
      console.error("Server Error Details:", error.response?.data);
    }
    return Promise.reject(error);
  }
);

// Fetch all articles
export const fetchArticles = async () => {
  try {
    const response = await API.get("/");
    return response;
  } catch (error) {
    console.error(
      "Fetch Articles Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Create article
export const createArticle = async (article) => {
  try {
    const formData = new FormData();

    // Append all article fields to formData
    Object.keys(article).forEach((key) => {
      if (key === "image" && article[key] instanceof File) {
        formData.append("image", article[key]);
      } else if (key !== "image") {
        // Don't append image if it's not a File
        formData.append(key, article[key]);
      }
    });

    const response = await API.post("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating article:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create article"
    );
  }
};

// Update article
export const updateArticle = async (id, article) => {
  try {
    const formData = new FormData();

    // Append all article fields to formData
    Object.keys(article).forEach((key) => {
      if (key === "image" && article[key] instanceof File) {
        formData.append("image", article[key]);
      } else if (key !== "image") {
        // Don't append image if it's not a File
        formData.append(key, article[key]);
      }
    });

    const response = await API.put(`/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating article:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update article"
    );
  }
};

// Delete article
export const deleteArticle = async (id) => {
  try {
    const response = await API.delete(`/${id}`);
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete article"
    );
  }
};

// Get single article
export const getArticle = (id) => API.get(`/${id}`);
