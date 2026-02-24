import { RouterProvider } from "react-router-dom";
import AuthInitializer from "./components/AuthInitializer";
import router from "./router";
import { useSelector } from "react-redux";

const AppRoutes = () => {
  const isAuthReady = useSelector((state: any) => state.auth.isAuthReady);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

const App = () => {
  return (
    <AuthInitializer>
      <AppRoutes />
    </AuthInitializer>
  );
};

export default App;
