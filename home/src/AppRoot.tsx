'use client';

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { AppProps } from "next/app";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function AppRoot({ Component, pageProps }: AppProps) {
  const getLayout = (Component as any).getLayout || ((page: any) => <Sidebar>{page}</Sidebar>);

  return (
    <Provider store={store}>
      {getLayout(<Component {...pageProps} />)}
    </Provider>
  );
}
