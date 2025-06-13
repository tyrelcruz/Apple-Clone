import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/articles",
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch all articles
export const fetchArticles = () => API.get("/");

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
