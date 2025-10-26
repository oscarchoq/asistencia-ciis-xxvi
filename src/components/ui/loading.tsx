import { HashLoader } from "react-spinners";

const Loading = () => {

  return (
    <div className="fixed gap-2 items-center justify-center bg-background/20 z-50 flex inset-0 transition-opacity duration-500 opacity-100">
      <HashLoader color={"#000000"} speedMultiplier={2} />
    </div>
  );
};

export default Loading;