import { useEffect, useState } from "react";
import { formatBannerMessage } from "./bannerFormatter.js";

const READ_DELAY_SECONDS = 10;

export function BannerModal({ banner, onClose }) {
  const [secondsLeft, setSecondsLeft] = useState(READ_DELAY_SECONDS);

  useEffect(() => {
    setSecondsLeft(READ_DELAY_SECONDS);

    const intervalId = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          clearInterval(intervalId);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [banner?.id]);

  if (!banner) return null;

  const className = `banner-modal banner-modal--${banner.type}`;
  const canClose = secondsLeft === 0;

  return (
    <div className="banner-modal-backdrop">
      <section className={className}>
        <div className="banner-modal__header">
          <h3>{banner.title}</h3>
        </div>

        <div className="banner-modal__body">
          <p
  dangerouslySetInnerHTML={{
    __html: formatBannerMessage(banner.message),
  }}
/>

          <button
            className="banner-modal__button"
            type="button"
            onClick={onClose}
            disabled={!canClose}
          >
            {canClose ? "Entendido" : `Entendido en ${secondsLeft}s`}
          </button>
        </div>
      </section>
    </div>
  );
}