import { api } from "./apiConfig";
import { ApplaudBlog } from "./types";

class ApplaudServicesAPI {
  static applaudBlog = async ({ blogId, authToken }: ApplaudBlog) => {
    let data = JSON.stringify({});
    const response = await api.post(`blogs/blog/${blogId}/applaud/`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  };

  static whetherUserApplauded = async (blogId: string, authToken: string | null) => {
    const response = await api.get(`blogs/blog/${blogId}/applauder/exists/`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  };
}

export { ApplaudServicesAPI };
