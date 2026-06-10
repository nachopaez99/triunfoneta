export function ExchangePostCard({ post, stickers, onRequestExchange }) {
  const offeredSticker = stickers.find(
    (sticker) => sticker.id === post.offeredStickerId
  );

  const wantedSticker = stickers.find(
    (sticker) => sticker.id === post.wantedStickerId
  );

  const userOwnsOffered = offeredSticker?.isOwned;
  const userHasOfferedPasted = offeredSticker?.isPasted;
  const userHasWantedRepeated = wantedSticker?.quantity > 1;

  return (
    <article className="exchange-card">
      <header className="exchange-card__header">
        <div className="exchange-avatar">{post.initials}</div>

        <div>
          <h3>{post.userName}</h3>
          <p>{post.department}</p>
        </div>
      </header>

      <div className="exchange-one-to-one">
        <div>
          <h4>Te ofrece</h4>
          <div className="exchange-sticker">
            #{offeredSticker?.number} {offeredSticker?.employeeName}

            {userOwnsOffered && (
              <small className="exchange-warning">
                Ya tenés esta figurita
              </small>
            )}

            {userHasOfferedPasted && (
              <small className="exchange-warning">
                Ya está pegada en tu álbum
              </small>
            )}
          </div>
        </div>

        <div>
          <h4>Busca</h4>
          <div className="exchange-sticker">
            #{wantedSticker?.number} {wantedSticker?.employeeName}

            {!userHasWantedRepeated && (
              <small className="exchange-error">
                No tenés repetida para entregar
              </small>
            )}
          </div>
        </div>
      </div>

      <button
        className="primary-button"
        type="button"
        disabled={!userHasWantedRepeated}
        onClick={() => onRequestExchange(post.id)}
      >
        Solicitar intercambio
      </button>
    </article>
  );
}