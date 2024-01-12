import { useNavigate, Routes, Route } from "react-router-dom";
import { lightTheme, Provider } from "@adobe/react-spectrum";
import CatalogPage from "./components/CatalogPage";
import NotFoundPage from "./components/NotFoundPage";

function App() {
  const navigate = useNavigate();

  return (
    <Provider theme={lightTheme} colorScheme="light" router={{ navigate }}>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </Provider>
  );
}

export default App;
