import { useEffect, useMemo, useState } from "react";
import { useAlbum } from "../context/AlbumContext";
import {
  createTrade,
  getUserCollection,
  getMyTrades,
  acceptTrade,
  rejectTrade,
  cancelTrade,
} from "../services/tradeService";
import { getUsers } from "../services/userService";
import { StickerStock } from "../components/stock/StickerStock";

export function ExchangePage() {
  const { collection, refreshAlbumData } = useAlbum();

  const [users, setUsers] = useState([]);
  const [selectedOffered, setSelectedOffered] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [targetCollection, setTargetCollection] = useState([]);
  const [selectedRequested, setSelectedRequested] = useState(null);
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [sentTrades, setSentTrades] = useState([]);
  const [receivedTrades, setReceivedTrades] = useState([]);
  const [tradeActionLoadingId, setTradeActionLoadingId] = useState(null);

  const usersById = useMemo(() => {
    return new Map(users.map((user) => [Number(user.id), user]));
  }, [users]);

  function getStickerName(userSticker) {
  const fullName =
    userSticker?.sticker?.fullName ||
    users.find(
      (user) => Number(user.id) === Number(userSticker?.sticker?.userId)
    )?.fullName;

  return (
    userSticker?.sticker?.nickname ||
    fullName ||
    `Figurita #${userSticker?.sticker?.stickerNumber || userSticker?.stickerId || ""}`
  );
}

  function enrichCollectionWithUserFullName(items) {
    return items.map((item) => {
      const stickerUser = usersById.get(Number(item?.sticker?.userId));

      return {
        ...item,
        sticker: {
          ...item.sticker,
          fullName: item?.sticker?.fullName || stickerUser?.fullName || "",
        },
      };
    });
  }

  async function loadTrades() {
    try {
      const response = await getMyTrades();

      setSentTrades(response.sent || []);
      setReceivedTrades(response.received || []);
    } catch (error) {
      console.error("Error cargando intercambios:", error);
    }
  }

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await getUsers();
        setUsers(response.data || response || []);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
    }

    loadUsers();
    loadTrades();
  }, []);

  async function handleSelectUser(userId) {
    setSelectedUserId(userId);
    setSelectedRequested(null);
    setTargetCollection([]);

    if (!userId) return;

    try {
      const response = await getUserCollection(userId, {
        duplicatesOnly: true,
        page: 1,
        limit: 50,
      });

      const userDuplicates = response.data || [];
      const enrichedUserDuplicates = enrichCollectionWithUserFullName(userDuplicates);

      setTargetCollection(enrichedUserDuplicates);

      if (userDuplicates.length === 0) {
        setStatusMessage(
          "Este empleado no tiene figuritas repetidas disponibles para intercambiar."
        );
      } else {
        setStatusMessage("");
      }
    } catch (error) {
      console.error("Error cargando colección del usuario:", error);
      setStatusMessage("No se pudo cargar la colección del empleado.");
    }
  }

 function getTradeSenderId(trade) {
  return (
    trade?.fromUser?.id ||
    trade?.createdByUser?.id ||
    trade?.user?.id ||
    trade?.fromUserId ||
    trade?.createdByUserId ||
    trade?.userId
  );
}

async function isOfferedStickerStillAvailable(trade) {
  const senderId = getTradeSenderId(trade);

  if (!senderId || !trade?.offeredUserSticker) {
    return true;
  }

  const response = await getUserCollection(senderId, {
    duplicatesOnly: true,
    page: 1,
    limit: 1000,
  });

  const senderDuplicates = response.data || response || [];

  return senderDuplicates.some((item) => {
    return (
      Number(item.id) === Number(trade.offeredUserSticker.id) ||
      Number(item?.sticker?.id) === Number(trade.offeredUserSticker?.sticker?.id)
    );
  });
} 

 async function handleAcceptTrade(tradeId) {
  const trade = receivedTrades.find((item) => item.id === tradeId);

  if (!trade) return;

  const requestedStickerId = trade?.requestedUserSticker?.sticker?.id;

  const availableSticker = collection.find(
    (item) =>
      Number(item?.sticker?.id) === Number(requestedStickerId) &&
      Number(item?.quantity || 0) > 1
  );

  if (!availableSticker) {
    alert("Esa figurita ya no está disponible para intercambio.");
    await loadTrades();
    return;
  }

  setTradeActionLoadingId(tradeId);

  try {
    const offeredStillAvailable = await isOfferedStickerStillAvailable(trade);

    if (!offeredStillAvailable) {
      alert(
        "La figurita que te ofrecieron ya no está disponible. El intercambio no pudo completarse."
      );

      await loadTrades();
      return;
    }

    await acceptTrade(tradeId);
    await refreshAlbumData();
    await loadTrades();

    setStatusMessage("Intercambio aceptado correctamente.");
  } catch (error) {
    console.error("Error aceptando intercambio:", error);

    alert(
      error.message ||
        "No se pudo aceptar el intercambio. Es posible que alguna figurita ya no esté disponible."
    );

    await loadTrades();
  } finally {
    setTradeActionLoadingId(null);
  }
}

  async function handleRejectTrade(tradeId) {
    setTradeActionLoadingId(tradeId);

    try {
      await rejectTrade(tradeId);
      await loadTrades();

      setStatusMessage("Intercambio rechazado.");
    } catch (error) {
      console.error("Error rechazando intercambio:", error);
      setStatusMessage(error.message || "No se pudo rechazar el intercambio.");
    } finally {
      setTradeActionLoadingId(null);
    }
  }

  async function handleCancelTrade(tradeId) {
    setTradeActionLoadingId(tradeId);

    try {
      await cancelTrade(tradeId);
      await loadTrades();

      setStatusMessage("Intercambio cancelado.");
    } catch (error) {
      console.error("Error cancelando intercambio:", error);
      setStatusMessage(error.message || "No se pudo cancelar el intercambio.");
    } finally {
      setTradeActionLoadingId(null);
    }
  }

  async function handleCreateTrade(event) {
    event.preventDefault();

    if (!selectedOffered || !selectedRequested || !selectedUserId) {
      setStatusMessage(
        "Seleccioná una figurita para ofrecer, un usuario y una figurita para pedir."
      );
      return;
    }

    setLoading(true);
    setStatusMessage("");

    try {
      await createTrade({
        offeredUserStickerId: selectedOffered.id,
        toUserId: Number(selectedUserId),
        requestedUserStickerId: selectedRequested.id,
        message,
      });

      await loadTrades();

      setStatusMessage("Oferta de intercambio publicada correctamente.");
      setSelectedOffered(null);
      setSelectedRequested(null);
      setSelectedUserId("");
      setTargetCollection([]);
      setMessage("");
    } catch (error) {
      console.error("Error creando intercambio:", error);
      setStatusMessage("No se pudo publicar la oferta.");
    } finally {
      setLoading(false);
    }
  }

  const duplicateStickers = collection.filter((item) => item.quantity > 1);

  const stockStickers = collection.map((item) => ({
    id: item.sticker.id,
    number: item.sticker.stickerNumber,
    employeeName: getStickerName(item),
    department: item.sticker.area,
    quantity: item.quantity,
    isOwned: item.quantity > 0,
  }));

  function getRequestedStickerStatus(item) {
  const alreadyOwned = collection.some(
    (ownedItem) =>
      Number(ownedItem?.sticker?.id) === Number(item?.sticker?.id) &&
      Number(ownedItem?.quantity || 0) > 0
  );

  return alreadyOwned ? "Ya la tenés" : "Te falta";
}

  return (
    <section className="exchange-page">
      <div className="exchange-main">
        <header className="page-header">
          <div>
            <h2>Zona de intercambio</h2>
            <p>Ofrecé una figurita repetida y pedí una que necesites.</p>
          </div>
        </header>

        <form className="exchange-list" onSubmit={handleCreateTrade}>
          <h3>Crear oferta de intercambio</h3>

          <h4>1. Elegí una repetida para ofrecer</h4>

          {duplicateStickers.length === 0 ? (
            <p className="empty-text">No tenés repetidas disponibles.</p>
          ) : (
            <div className="my-repeated-grid">
              {duplicateStickers.map((item) => (
                <button
                  type="button"
                  className={
                    selectedOffered?.id === item.id
                      ? "repeated-card repeated-card--selected"
                      : "repeated-card"
                  }
                  key={item.id}
                  onClick={() => setSelectedOffered(item)}
                >
                  <span>#{item.sticker.stickerNumber}</span>
                  <strong>{getStickerName(item)}</strong>
                  <small>{item.sticker.area} · x{item.quantity-1}</small>
                </button>
              ))}
            </div>
          )}

          <h4>2. Elegí el empleado con quien querés intercambiar</h4>

          <select
            value={selectedUserId}
            onChange={(event) => handleSelectUser(event.target.value)}
          >
            <option value="">Seleccionar empleado</option>
            {users.map((user) => (
              <option value={user.id} key={user.id}>
                {user.fullName}
              </option>
            ))}
          </select>

          <h4>3. Elegí la figurita que querés pedir</h4>

          {targetCollection.length === 0 ? (
            <p className="empty-text">
              {selectedUserId
                ? "Este empleado no tiene figuritas repetidas disponibles para pedir."
                : "Seleccioná un empleado para ver sus repetidas."}
            </p>
          ) : (
            <div className="my-repeated-grid">
              {targetCollection.map((item) => (
                <button
                  type="button"
                  className={
                    selectedRequested?.id === item.id
                      ? "repeated-card repeated-card--selected"
                      : "repeated-card"
                  }
                  key={item.id}
                  onClick={() => setSelectedRequested(item)}
                >
                  <span>#{item.sticker.stickerNumber}</span>
                  <strong>{getStickerName(item)}</strong>
                  <small>
  {item.sticker.area} · x{item.quantity -1} · <p className={getRequestedStickerStatus(item) == "Ya la tenés"? "repeated-card-request-ylt" : "repeated-card-request-nlt"}> {getRequestedStickerStatus(item)}</p>
</small>
                </button>
              ))}
            </div>
          )}

          <label htmlFor="trade-message">Mensaje opcional</label>
          <textarea
            id="trade-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="¿Hacemos el cambio?"
          />

          {statusMessage && <p className="exchange-requested">{statusMessage}</p>}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Publicando..." : "Publicar oferta"}
          </button>
        </form>

        <section className="exchange-list">
          <h3>Mis intercambios</h3>

          <h4>Recibidos</h4>

          {receivedTrades.length === 0 ? (
            <p className="empty-text">No tenés intercambios recibidos.</p>
          ) : (
            <div className="my-repeated-grid">
              {receivedTrades.map((trade) => (
                <article className="repeated-card" key={trade.id}>
                  <span>Figurita # {trade.offeredUserSticker.stickerId}</span>


                  <span>
                    De:{" "}
                    {trade.fromUser?.fullName ||
                      trade.createdByUser?.fullName ||
                      trade.user?.fullName ||
                      "Usuario"}
                  </span>

                  <strong>
                    Te ofrecen: {getStickerName(trade.offeredUserSticker)} · <p className={getRequestedStickerStatus(trade.offeredUserSticker) == "Ya la tenés"? "repeated-card-request-ylt" : "repeated-card-request-nlt"}> {getRequestedStickerStatus(trade.offeredUserSticker)}</p>
                  </strong>

                  <small>
                    Piden: {getStickerName(trade.requestedUserSticker)}
                  </small>

                  {trade.message && <p>{trade.message}</p>}

                  <small>Estado: {trade.status}</small>

                  {trade.status?.toLowerCase() === "pending" && (
                    <div className="exchange-actions">
                      <button
                        className="exchange-btn exchange-btn--success"
                        type="button"
                        disabled={tradeActionLoadingId === trade.id}
                        onClick={() => handleAcceptTrade(trade.id)}
                      >
                        Aceptar
                      </button>

                      <button
                        className="exchange-btn exchange-btn--danger"
                        type="button"
                        disabled={tradeActionLoadingId === trade.id}
                        onClick={() => handleRejectTrade(trade.id)}
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          <h4>Enviados</h4>

          {sentTrades.length === 0 ? (
            <p className="empty-text">No tenés intercambios enviados.</p>
          ) : (
            <div className="my-repeated-grid">
              {sentTrades.map((trade) => (
                <article className="repeated-card" key={trade.id}>
                  <strong>
                    Ofrecés: {getStickerName(trade.offeredUserSticker)}
                  </strong>

                  <small>
                    Pedís: {getStickerName(trade.requestedUserSticker)}
                  </small>

                  <small>Para: {trade.toUser?.fullName || "Usuario"}</small>

                  <small>Estado: {trade.status}</small>

                  {trade.status?.toLowerCase() === "pending" && (
                    <button
                      className="exchange-btn exchange-btn--danger"
                      type="button"
                      disabled={tradeActionLoadingId === trade.id}
                      onClick={() => handleCancelTrade(trade.id)}
                    >
                      Cancelar
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <div>
        <StickerStock stickers={stockStickers} />
      </div>
    </section>
  );
}