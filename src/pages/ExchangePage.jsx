import { useEffect, useState } from "react";

import { useAlbum } from "../context/AlbumContext";
import { createTrade, getUserCollection } from "../services/tradeService";
import { getUsers } from "../services/userService";
import { StickerStock } from "../components/stock/StickerStock";

export function ExchangePage() {
  /* const { duplicates } = useAlbum(); */

  const [users, setUsers] = useState([]);
  const [selectedOffered, setSelectedOffered] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [targetCollection, setTargetCollection] = useState([]);
  const [selectedRequested, setSelectedRequested] = useState(null);
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { collection } = useAlbum();

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await getUsers();
        setUsers(response.data || []);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
    }

    loadUsers();
  }, []);

  async function handleSelectUser(userId) {
    setSelectedUserId(userId);
    setSelectedRequested(null);
    setTargetCollection([]);

    if (!userId) return;

    try {
      const response = await getUserCollection(userId);
      setTargetCollection(response.data || []);
    } catch (error) {
      console.error("Error cargando colección del usuario:", error);
    }
  }

  async function handleCreateTrade(event) {
    event.preventDefault();

    if (!selectedOffered || !selectedRequested || !selectedUserId) {
      setStatusMessage("Seleccioná una figurita para ofrecer, un usuario y una figurita para pedir.");
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
    employeeName: item.sticker.nickname,
    department: item.sticker.area,
    position: "Figurita",
    quantity: item.quantity,
    isOwned: item.quantity > 0,
    /* isPasted: item.quantity > 0, */
  }));

  
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
                  <strong>{item.sticker.nickname}</strong>
                  <small>{item.sticker.area} · x{item.quantity}</small>
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
            <p className="empty-text">Seleccioná un empleado para ver sus figuritas.</p>
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
                  <strong>{item.sticker.nickname}</strong>
                  <small>{item.sticker.area}</small>
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
      </div>
      <aside>
      <StickerStock stickers={stockStickers} />
      </aside>
    </section>
  );
}