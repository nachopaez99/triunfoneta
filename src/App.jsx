import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes/AppRouter";
import { AlbumProvider } from "./context/AlbumContext";
import { AuthProvider } from "./context/AuthContext";
import { BannerProvider } from "./context/BannerContext";

function App() {
  return (
    <AuthProvider>
      <AlbumProvider>
        <BrowserRouter>
          <BannerProvider>
            <AppRouter />
          </BannerProvider>
        </BrowserRouter>
      </AlbumProvider>
    </AuthProvider>
  );
}

export default App;