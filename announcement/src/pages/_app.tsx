// pages/_app.tsx
import { Suspense, lazy } from "react";
import App, { AppProps, AppContext } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import { store } from "src/redux/store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

// getInitialProps typing
MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default MyApp;
