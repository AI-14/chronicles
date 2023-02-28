import { api } from "./apiConfig";
import { SaveBlog } from "./types";

class ReadinglistServicesAPI {
  static saveBlog = async ({ blogId, authToken }: SaveBlog) => {
    let data = JSON.stringify({});
    const response = await api.post(`blogs/blog/${blogId}/readinglist/save/`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  };

  static whetherUserSavedBlog = async (blogId: string, authToken: string | null) => {
    const response = await api.get(`blogs/blog/${blogId}/reader/exists/`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  };

  static getSavedBlogs = async (authToken: string | null) => {
    const response = await api.get("blogs/readinglist/all/", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  };
}

export { ReadinglistServicesAPI };
