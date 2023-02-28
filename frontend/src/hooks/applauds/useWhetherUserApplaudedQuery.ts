import { useQuery } from "react-query";
import { ApplaudServicesAPI } from "../../services/applaudServices";

export const useWhetherUserApplaudedQuery = (blogId: string, authToken: string | null, onSuccess?: any, onError?: any) => {
  return useQuery(["whether-user-applauded", blogId, authToken], () => ApplaudServicesAPI.whetherUserApplauded(blogId, authToken), {
    onSuccess: onSuccess,
    onError: onError,
  });
};
