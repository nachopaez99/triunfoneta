import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes/AppRouter";
import { AlbumProvider } from "./context/AlbumContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AlbumProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AlbumProvider>
    </AuthProvider>
  );
}

export default App;