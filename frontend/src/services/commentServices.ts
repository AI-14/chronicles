import { api } from "./apiConfig";
import { AddComment, DeleteComment } from "./types";

class CommentServicesAPI {
  static addComment = async ({ blogId, authToken, data }: AddComment) => {
    const response = await api.post(`blogs/blog/${blogId}/commentpost/`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  };

  static getAllComments = async (blogId: string, authToken: string | null) => {
    const response = await api.get(`blogs/blog/${blogId}/comments/all/`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  };

  static getTotalComments = async (blogId: string, authToken: string | null) => {
    const response = await api.get(`blogs/blog/${blogId}/totalcomments/`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  };

  static deleteComment = async ({ blogId, authToken, commentId }: DeleteComment) => {
    const response = await api.delete(`blogs/blog/${blogId}/comment/${commentId}/`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  };
}

export { CommentServicesAPI };
