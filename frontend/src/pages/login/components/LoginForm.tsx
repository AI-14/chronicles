import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { InputField } from "../../../components/InputField";
import { useLoginUserMutation } from "../../../hooks/users/useLoginUserMutation";
import { setUserInfoInLocalStorage } from "../../../utils/jwtToken";
import { FormDataLogin } from "../types";

export const LoginForm = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataLogin>({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const { mutate: loginUser } = useLoginUserMutation(
    (data: any) => {
      setIsLoading(false);
      setUserInfoInLocalStorage(data.access);
      navigate("/", { replace: true });
    },
    (error: any) => {
      setIsLoading(false);

      if (error.response.data) {
        toast.error("Invalid credentails");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  );

  const usernameOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, username: e.target.value });
  };

  const passwordOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, password: e.target.value });
  };

  const loginUserOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (formData.username.length === 0 || formData.password.length === 0) {
      toast.error("All fields are mandatory");
    } else {
      setIsLoading(true);
      const data = {
        username: formData.username,
        password: formData.password,
      };

      loginUser(JSON.stringify(data));
    }
  };

  return (
    <form onSubmit={loginUserOnSubmit} className="w-full flex flex-col items-center">
      <InputField label="Username" type="text" name="username" placeholder="Enter username" onChangeHandler={usernameOnChange} />
      <InputField label="Password" type="password" name="password" placeholder="Enter password" onChangeHandler={passwordOnChange} />

      <button type="submit" className="w-1/2 h-10 mt-4 rounded-full bg-lightpurple hover:bg-darkpurple font-bold">
        {isLoading ? <ClipLoader color="#000000" loading={isLoading} size={15} aria-label="loading-spinner" data-testid="loader" /> : "Login"}
      </button>

      <div className="text-[1rem] p-2 flex justify-center items-center gap-2">
        <p className="text-[0.9rem]">Don't have an account?</p>
        <Link to="/signup" className="font-semibold hover:shadow-md hover:shadow-purple-100 rounded-full p-1">
          Sign up
        </Link>
      </div>
    </form>
  );
};
