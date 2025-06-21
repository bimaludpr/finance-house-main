// pages/_app.tsx
import "../styles/globals.css"
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import dynamic from "next/dynamic";

const AppWithStore = dynamic(() => import("@/AppRoot"), { ssr: false });

export default AppWithStore;
