export function InfoPage() {
  return (
    <section className="how-to-play-page">
      <header className="page-header">
        <div>
          <h2>¿Cómo juego?</h2>
          <p>Conocé todas las formas de sumar puntos, completar tu álbum e intercambiar figuritas.</p>
        </div>
      </header>

      <div className="how-to-play-grid">
        <article className="how-to-card">
          <span>1</span>
          <h3>Sumá puntos</h3>
          <p>
            Respondé trivias correctamente para ganar puntos. Esos puntos te sirven para comprar sobres.
          </p>
        </article>

        <article className="how-to-card">
          <span>2</span>
          <h3>Comprá sobres</h3>
          <p>
            En la Home podés comprar sobres con tus puntos. Cada sobre trae figuritas aleatorias.
          </p>
        </article>

        <article className="how-to-card">
          <span>3</span>
          <h3>Completá el álbum</h3>
          <p>
            En Mi álbum podés ver las áreas, tus figuritas pegadas y las que todavía te faltan.
          </p>
        </article>

        <article className="how-to-card">
          <span>4</span>
          <h3>Revisá tu mazo</h3>
          <p>
            En el panel de mazo aparecen tus figuritas nuevas y repetidas. Tocá una figurita para verla grande.
          </p>
        </article>

        <article className="how-to-card">
          <span>5</span>
          <h3>Intercambiá repetidas</h3>
          <p>
            Si tenés figuritas repetidas, podés ofrecerlas a otros usuarios y pedir una que necesites.
          </p>
        </article>

        <article className="how-to-card">
          <span>6</span>
          <h3>Jugá al Prode</h3>
          <p>
            Pronosticá resultados de partidos. Si acertás, sumás puntos extra para seguir comprando sobres.
          </p>
        </article>

        <article className="how-to-card">
          <span>7</span>
          <h3>Creá tu figurita</h3>
          <p>
            Desde tu perfil podés cargar tu foto, apodo, puesto, área y dato divertido para que tu figurita aparezca en el álbum.
          </p>
        </article>

        <article className="how-to-card">
          <span>8</span>
          <h3>Objetivo final</h3>
          <p>
            Completá todas las áreas del álbum corporativo y coleccioná las figuritas de tus compañeros.
          </p>
        </article>
      </div>
    </section>
  );
}