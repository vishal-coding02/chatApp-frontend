import { RouterProvider } from "react-router-dom";
import AuthInitializer from "./components/AuthInitializer";
import router from "./router";

const App = () => {
  return (
    <AuthInitializer>
      <RouterProvider router={router} />
    </AuthInitializer>
  );
};

export default App;