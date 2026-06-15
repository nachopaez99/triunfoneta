import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getBanners, markBannerAsRead } from "../services/bannerService";
import { BannerModal } from "../components/banner/BannerModal";

const BannerContext = createContext(null);

export function BannerProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentBanner = banners[currentIndex] || null;

  async function loadBanners() {
    try {
      const response = await getBanners();
      setBanners(response.data || response || []);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error cargando banners:", error);
      setBanners([]);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setBanners([]);
      setCurrentIndex(0);
      return;
    }

    loadBanners();
  }, [isAuthenticated]);

  async function handleCloseBanner() {
    if (!currentBanner) return;

    try {
      if (currentBanner.isSingleView) {
        await markBannerAsRead(currentBanner.id);
      }
    } catch (error) {
      console.error("Error marcando banner como leído:", error);
    } finally {
      setCurrentIndex((index) => index + 1);
    }
  }

  return (
    <BannerContext.Provider value={{ banners, reloadBanners: loadBanners }}>
      {children}

      {currentBanner && (
        <BannerModal banner={currentBanner} onClose={handleCloseBanner} />
      )}
    </BannerContext.Provider>
  );
}

export function useBanner() {
  const context = useContext(BannerContext);

  if (!context) {
    throw new Error("useBanner debe usarse dentro de BannerProvider");
  }

  return context;
}