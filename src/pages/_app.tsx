import App, { AppProps } from "next/app";
import "styles/global.css";

const MyApp: React.FC<AppProps> = (props) => {
  return <props.Component {...props.pageProps} />;
};

export default MyApp;
