export const Footer = (): JSX.Element => {
  return (
    <div className="border-t-[1.5px] shadow-md shadow-slate-300 w-full h-[2rem] p-6 bg- mt-10">
      <div className="flex items-center justify-center mx-auto max-w-[1080px] h-full">
        <p className="text-sm">Copyright &copy; {new Date().getFullYear()}, Chronicles. All Rights Reserved.</p>
      </div>
    </div>
  );
};
