import { api } from "./apiConfig";
import { DeleteBlog, EditBlog, PostBlog } from "./types";

class BlogServicesAPI {
  static postBlog = async ({ data, authToken }: PostBlog) => {
    const response = await api.post("blogs/blogpost/", data, {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  };

  static editBlog = async ({ blogId, data, authToken }: EditBlog) => {
    const response = await api.put(`blogs/blog/${blogId}/`, data, {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  };

  static deleteBlog = async ({ blogId, authToken }: DeleteBlog) => {
    const response = await api.delete(`blogs/blog/${blogId}/`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  };

  static getBlog = async (blogId: string, authToken: string | null) => {
    const response = await api.get(`blogs/blog/${blogId}/`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  };

  static getUserBlogs = async (status: string, authToken: string | null) => {
    const response = await api.get(`blogs/userblogs/?status=${status}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  };

  static getAllBlogs = async (category: string | null, page: number) => {
    let url: string = "";
    if (category === "all") {
      url = `blogs/all/?page=${page}`;
    } else {
      url = `blogs/all/?category=${category}&page=${page}`;
    }

    const response = await api.get(url);
    return response.data;
  };

  static searchBlog = async (title: string, authToken: string | null) => {
    const response = await api.get(`blogs/search/?title=${title}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  };
}

export { BlogServicesAPI };
