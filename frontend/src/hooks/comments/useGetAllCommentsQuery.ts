import { useQuery } from "react-query";
import { CommentServicesAPI } from "../../services/commentServices";

export const useGetAllCommentsQuery = (blogId: string, authToken: string | null, onSuccess?: any, onError?: any) => {
  return useQuery(["get-all-comments", blogId, authToken], () => CommentServicesAPI.getAllComments(blogId, authToken), {
    onSuccess: onSuccess,
    onError: onError,
  });
};
