"use client";
import "../styles/index.scss";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <html lang="en" suppressHydrationWarning={isDev}>
      <head>
        <meta
          name="keywords"
          content="Real estate, Property sale, Property buy"
        />
        <meta
          name="description"
          content="Roomfinder is a beautiful website template designed for Real Estate Agency."
        />
        <meta property="og:site_name" content="Roomfinder" />
        <meta property="og:url" content="https://creativegigstf.com" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Roomfinder - Real Estate React Next js Template"
        />
        <meta name="og:image" content="images/assets/ogg.png" />
        {/* For IE  */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* For Resposive Device */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* For Window Tab Color */}
        {/* Chrome, Firefox OS and Opera */}
        <meta name="theme-color" content="#0D1A1C" />
        {/* Windows Phone */}
        <meta name="msapplication-navbutton-color" content="#0D1A1C" />
        {/* iOS Safari */}
        <meta name="apple-mobile-web-app-status-bar-style" content="#0D1A1C" />
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <div className="main-page-wrapper">
          <Provider store={store}>
            <AuthProvider>
              {children}
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </AuthProvider>
          </Provider>
        </div>
      </body>
    </html>
  );
}
