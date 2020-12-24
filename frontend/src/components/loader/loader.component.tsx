import ReactLoader from "react-loader-spinner";
import "./loader.styles.css";

const Loader = () => (
  <div className={"overlay"}>
    <ReactLoader type="ThreeDots" color="#c01532" height={100} width={100} />
  </div>
);

export default Loader;
