export interface LogoProps {
  textSize: string;
  animationDelay?: number;
}

export interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  placeholder: string;
  onChangeHandler: React.ChangeEventHandler<HTMLInputElement>;
  errorMsg?: string;
}
