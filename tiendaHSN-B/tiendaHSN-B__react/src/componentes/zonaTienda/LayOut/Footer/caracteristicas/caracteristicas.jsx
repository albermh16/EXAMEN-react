export default function Caracteristicas() {
  const items = [
    {
      img: "https://www.hsnstore.com/skin/frontend/base/default/images/footer/Entrega.svg",
      alt: "Icono de una mano abierta con la palma hacia arriba sujetando un paquete",
      titulo: "Envíos gratis y rápidos",
      texto: "Envío rapidísimo en 24/48 horas y gratis a partir de 29,99€",
    },
    {
      img: "https://www.hsnstore.com/skin/frontend/base/default/images/footer/Garantia.svg",
      alt: "Icono de una mano con el pulgar hacia arriba dentro de un escudo",
      titulo: "Máxima calidad",
      texto:
        "Desarrollado por nuestro equipo de I+D+I y fabricado en nuestra propia fábrica",
    },
    {
      img: "https://www.hsnstore.com/skin/frontend/base/default/images/footer/Medioambiente.svg",
      alt: "Icono de unas manos rodeando a la tierra",
      titulo: "Sostenibilidad",
      texto:
        "Mejoramos progresivamente los procesos existentes para reducir nuestra huella medioambiental",
    },
    {
      img: "https://www.hsnstore.com/skin/frontend/base/default/images/footer/Materias.svg",
      alt: "Icono de un papel desenrollado con una insignia encima representando un OK",
      titulo: "Materias Primas Premium",
      texto:
        "Utilizamos las mejores materias primas probadas y reconocidas por certificados de calidad",
    },
  ];

  return (
    <section style={{ background: "#f1f1f1" }}>
      <div className="container py-4 py-md-5">
        <div className="row row-cols-2 row-cols-md-4 g-4 text-center align-items-stretch">
          {items.map((it) => (
            <div key={it.titulo} className="col d-flex">
              <div
                className="d-flex flex-column align-items-center justify-content-start text-center h-100 w-100"
                style={{ rowGap: "0.5rem" }}
              >
                <img
                  loading="lazy"
                  src={it.img}
                  width={40}
                  height={40}
                  alt={it.alt}
                  className="mb-1 mb-md-2"
                />
                <h3
                  className="mb-0"
                  style={{
                    color: "#000000",
                    fontFamily: "cursive",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: ".3px",
                    fontSize: "0.95rem",
                  }}
                >
                  {it.titulo}
                </h3>
                <p
                  className="mb-0 px-3"
                  style={{
                    color: "#474747",
                    fontSize: ".825rem",
                    fontWeight: 300,
                    lineHeight: 1.35,
                  }}
                >
                  {it.texto}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
