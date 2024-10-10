import axios from 'axios';

// Base API URL for DEV.to
const API_URL = process.env.REACT_APP_API_BASE_URL;

// Define a type for the article fetch parameters
interface ArticleParams {
  page?: number;
  per_page?: number;
  tag?: string;
  tags?: string;
  tags_exclude?: string;
  username?: string;
  state?: 'fresh' | 'rising' | 'all';
  top?: number;
  collection_id?: number;
}

// Fetch articles with optional query parameters
export const getArticles = async (params: ArticleParams = {}) => {
  try {
    const response = await axios.get(`${API_URL}/articles`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

// Fetch a specific article by its ID
export const getArticleById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching article with ID ${id}:`, error);
    return null;
  }
};

// Fetch available tags
export const getTags = async () => {
  try {
    const response = await axios.get(`${API_URL}/tags`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};
