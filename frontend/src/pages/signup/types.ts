export interface ErrorMsgsSignup {
  usernameError: string;
  emailError: string;
  passwordError: string;
}

export interface FormDataSignup {
  username: string;
  email: string;
  password: string;
  profileImageFile: File | null;
}

export interface SelecImageProps {
  previewImage: string | null;
  onChangeHandler: React.ChangeEventHandler<HTMLInputElement>;
}
