import { useMutation } from "react-query";
import { UserServiceAPI } from "../../services/userServices";

export const useDeleteUserMutation = (onSuccess?: any, onError?: any) => {
  return useMutation("delete-user", UserServiceAPI.deleteUser, {
    onSuccess: onSuccess,
    onError: onError
  });
};
