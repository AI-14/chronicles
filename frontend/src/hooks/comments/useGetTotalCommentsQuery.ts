import { useQuery } from "react-query";
import { CommentServicesAPI } from "../../services/commentServices";

export const useGetTotalCommentsQuery = (blogId: string, authToken: string | null, onSuccess?: any, onError?: any) => {
  return useQuery(["get-total-comments", blogId, authToken], () => CommentServicesAPI.getTotalComments(blogId, authToken), {
    onSuccess: onSuccess,
    onError: onError,
  });
};
