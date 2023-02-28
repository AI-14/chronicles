import { useQuery } from "react-query";
import { UserServiceAPI } from "../../services/userServices";

export const useGetUserDataQuery = (authToken: string | null, onError: any) => {
  return useQuery(["user-data", authToken], () => UserServiceAPI.getUserInfo(authToken), {
    onError: onError,
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
  });
};
