import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import validator from "validator";
import { InputField } from "../../../components/InputField";
import { useSignupUserMutation } from "../../../hooks/users/useSignupUserMutation";
import { ErrorMsgsSignup, FormDataSignup } from "../types";
import { SelectImage } from "./SelectImage";

export const SignupForm = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewProfileImage, setPreviewProfileImage] = useState<string | null>(null);
  const [errorMsgs, setErrorMsgs] = useState<ErrorMsgsSignup>({
    usernameError: "",
    emailError: "",
    passwordError: "",
  });
  const [formData, setFormData] = useState<FormDataSignup>({
    username: "",
    email: "",
    password: "",
    profileImageFile: null,
  });

  const navigate = useNavigate();

  const { mutate: signupUser } = useSignupUserMutation(
    (_: any) => {
      setIsLoading(false);
      toast.success("Signup successful", {
        style: { fontSize: "0.7rem" },
      });
      navigate("/login", { replace: true });
    },
    (error: any) => {
      setIsLoading(false);

      if (error.response?.data) {
        toast.error("User already exists");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  );

  useEffect(() => {
    if (formData.profileImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewProfileImage(reader.result as string);
      };
      reader.readAsDataURL(formData.profileImageFile);
    } else {
      setPreviewProfileImage(null);
    }
  }, [formData.profileImageFile]);

  const setImageOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files;
    if (file) {
      setFormData({ ...formData, profileImageFile: file[0] });
    } else {
      setFormData({ ...formData, profileImageFile: null });
    }
  };

  const usernameOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value.length > 15) {
      setErrorMsgs({
        ...errorMsgs,
        usernameError: "Username must be <= 15 characters",
      });
    } else {
      setFormData({ ...formData, username: e.target.value });
      setErrorMsgs({ ...errorMsgs, usernameError: "" });
    }
  };

  const emailOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value.length > 20) {
      setErrorMsgs({
        ...errorMsgs,
        emailError: "Email must be <= 20 characters",
      });
    } else if (e.target.value.length > 0 && !validator.isEmail(e.target.value)) {
      setErrorMsgs({ ...errorMsgs, emailError: "Invalid email" });
    } else {
      setFormData({ ...formData, email: e.target.value });
      setErrorMsgs({ ...errorMsgs, emailError: "" });
    }
  };

  const passwordOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value.length < 6 || e.target.value.length > 12) {
      setErrorMsgs({
        ...errorMsgs,
        passwordError: "Password must be in between 6-12 characters",
      });
    } else {
      setFormData({ ...formData, password: e.target.value });
      setErrorMsgs({ ...errorMsgs, passwordError: "" });
    }
  };

  const signupUserOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (formData.email.length === 0 || formData.username.length === 0 || formData.password.length === 0) {
      toast.error("All fields are mandatory");
    } else if (formData.profileImageFile === null) {
      toast.error("Profile image is mandatory");
    } else if (errorMsgs.emailError.length === 0 && errorMsgs.usernameError.length === 0 && errorMsgs.passwordError.length === 0) {
      setIsLoading(true);

      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("profile_image", formData.profileImageFile!);

      signupUser(data);
    }
  };

  return (
    <form onSubmit={signupUserOnSubmit} className="w-full flex flex-col items-center">
      <SelectImage previewImage={previewProfileImage} onChangeHandler={setImageOnChange} />
      <InputField label="Username" type="text" name="username" placeholder="Enter username" onChangeHandler={usernameOnChange} errorMsg={errorMsgs.usernameError} />
      <InputField label="Email" type="text" name="email" placeholder="Enter email" onChangeHandler={emailOnChange} errorMsg={errorMsgs.emailError} />
      <InputField label="Password" type="password" name="password" placeholder="Enter password" onChangeHandler={passwordOnChange} errorMsg={errorMsgs.passwordError} />

      <button type="submit" className="w-1/2 h-10 mt-4 rounded-full bg-lightpurple hover:bg-darkpurple font-bold">
        {isLoading ? <ClipLoader color="#000000" loading={isLoading} size={15} aria-label="loading-spinner" data-testid="loader" /> : "Sign up"}
      </button>

      <div className="text-[1rem] p-2 flex justify-center items-center gap-2 ">
        <p className="text-[0.9rem]">Already have an account?</p>
        <Link to="/login" className="font-semibold hover:shadow-md hover:shadow-purple-100 rounded-full p-1">
          Login
        </Link>
      </div>
    </form>
  );
};
