import { RouterProvider } from "react-router-dom";
import { useState } from "react";
import AuthInitializer from "./components/AuthInitializer";
import router from "./router";
import { useSelector } from "react-redux";
import SplashScreen from "./components/SplashScreen";
import { Suspense } from "react";

const AppRoutes = () => {
  const isAuthReady = useSelector((state: any) => state.auth.isAuthReady);
  if (!isAuthReady) return null;
  return <RouterProvider router={router} />;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthInitializer>
      <Suspense>
        {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
        <AppRoutes />
      </Suspense>
    </AuthInitializer>
  );
};

export default App;
