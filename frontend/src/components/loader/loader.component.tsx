import ReactLoader from "react-loader-spinner";
import "./loader.styles.css";

const Loader = ({ show }: { show?: boolean }) => (
  <div className={`overlay ${show ? "" : "overlay-hide"}`}>
    <ReactLoader type="ThreeDots" color="#c01532" height={100} width={100} />
  </div>
);

export default Loader;
