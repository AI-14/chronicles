import { useMutation } from "react-query";
import { UserServiceAPI } from "../../services/userServices";

export const useUpdateCredsMutation = (onSuccess?: any, onError?: any) => {
  return useMutation("updatecreds", UserServiceAPI.updateCreds, {
    onSuccess: onSuccess,
    onError: onError,
  });
};
