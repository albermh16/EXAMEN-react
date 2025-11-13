import "./newsletter.css";

export default function NewsLetter() {
  return (
    <section className="footer-newsletter py-4 py-lg-5">
      <div className="container">
        <div className="row justify-content-center align-items-start g-3">
          {/* Quiénes somos links (left) */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="footer-links-box">
              <div className="heading d-flex justify-content-between align-items-center">
                Quiénes somos
                <button
                  aria-label="Quienes somos"
                  className="btn btn-footer d-lg-none"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#footAboutUs"
                  aria-controls="footAboutUs"
                  aria-expanded="false"
                />
              </div>
              <ul
                id="footAboutUs"
                className="collapse d-lg-block list-unstyled mb-0"
              >
                <li>
                  <a href="https://www.hsnstore.com/sobre-nosotros">
                    Quiénes somos
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/garantia-calidad-hsn">
                    Garantía de calidad
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/responsabilidad-social">
                    Responsabilidad social
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/ventajas-hsn">
                    Ventajas por comprar en HSN
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/certificados-materias-primas">
                    Certificados materias primas
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/expertos-hsn">
                    Expertos HSN
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/trabaja-con-nosotros">
                    Trabaja con nosotros
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.hsnstore.com/patrocinios-sponsors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Patrocinios
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter box (center) */}
          <div className="col-12 col-lg-6 v-sep-left v-sep-right">
            <div className="newsletter-box px-3 px-md-4 py-3 rounded-3">
              <form
                className="newsletter-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="text-center text-lg-start mb-2">
                  <p className="newsletter-title mb-1">NEWSLETTER</p>
                  <p className="newsletter-subtitle mb-0">
                    Mantente al día de nuestras Ofertas y Novedades.
                  </p>
                </div>
                <div className="row g-2 align-items-stretch">
                  <div className="col-12 col-sm-9">
                    <label
                      htmlFor="emailNewsletter"
                      className="visually-hidden"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="emailNewsletter"
                      className="form-control newsletter-input"
                      placeholder="Introduce tu email aquí"
                      required
                      autoComplete="email"
                      title="Introduce tu email aquí"
                    />
                  </div>
                  <div className="col-12 col-sm-3 d-grid">
                    <button
                      type="submit"
                      className="btn newsletter-btn fw-bold"
                    >
                      ENVIAR
                    </button>
                  </div>
                  <div className="col-12">
                    <div className="form-check mt-1">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="1"
                        id="pp-newsletter"
                        required
                      />
                      <label
                        className="form-check-label"
                        htmlFor="pp-newsletter"
                      >
                        He leído y acepto la{" "}
                        <a
                          href="https://www.hsnstore.com/politica-de-privacidad#formulario-newsletter"
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                        >
                          Política de privacidad
                        </a>
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Fabricación propia (right) */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="quality-box text-center text-lg-start">
              <div className="quality-heading">Fabricación propia</div>
              <div className="quality-icons d-flex flex-wrap align-items-center gap-3 mt-2 justify-content-center justify-content-lg-start">
                <a
                  aria-label="IFS"
                  target="_blank"
                  title="IFS"
                  rel="noopener"
                  href="https://www.hsnstore.com/media/wysiwyg/analysis/ifs-food-certificate-renewal-hsn-24-25_1.pdf"
                >
                  <img
                    loading="lazy"
                    src="https://www.hsnstore.com/media/wysiwyg/cms-images/sellos-calidad/Ifs_icon.png"
                    alt="IFS"
                    width="60"
                    height="34"
                  />
                </a>
                <a
                  aria-label="HACCP"
                  target="_blank"
                  title="HACCP"
                  rel="noopener"
                  href="https://www.hsnstore.com/media/wysiwyg/analysis/certificate-haccp-hsn-2024-2025_1.pdf"
                >
                  <img
                    loading="lazy"
                    src="https://www.hsnstore.com/media/wysiwyg/cms-images/sellos-calidad/Haccp_icon.png"
                    alt="HACCP"
                    width="60"
                    height="60"
                  />
                </a>
                <a
                  aria-label="GMP"
                  target="_blank"
                  title="GMP"
                  rel="noopener"
                  href="https://www.hsnstore.com/media/wysiwyg/analysis/certificate-gmp-hsn-2024-2025_1.pdf"
                >
                  <img
                    loading="lazy"
                    src="https://www.hsnstore.com/media/wysiwyg/cms-images/sellos-calidad/Gmp_icon.png"
                    alt="GMP"
                    width="60"
                    height="60"
                  />
                </a>
                <img
                  loading="lazy"
                  src="https://www.hsnstore.com/media/wysiwyg/cms-images/sellos-calidad/Iso_icon.png"
                  alt="ISO"
                  width="60"
                  height="50"
                />
              </div>
            </div>
          </div>

          {/* end first row */}
        </div>

        {/* Second row: additional footer links */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 mt-3 g-3 footer-links-row row-sep-top">
          <div className="col">
            <div className="footer-links-box">
              <div className="heading d-flex justify-content-between align-items-center">
                Servicios
                <button
                  aria-label="Servicios y Promos"
                  className="btn btn-footer d-lg-none"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#footServices"
                  aria-controls="footServices"
                  aria-expanded="false"
                />
              </div>
              <ul
                id="footServices"
                className="collapse d-lg-block list-unstyled mb-0"
              >
                <li>
                  <a href="https://www.hsnstore.com/plan-ahorro">
                    Plan ahorro HSN
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/acumula-puntos">
                    Consigue puntos HSN y descuentos en tus compras
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/plan-amigo">
                    Plan amigo HSN
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/clientes-vip">
                    Clientes VIP
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/programa-afiliacion">
                    Programa de afiliación HSN
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/resellers">HSN resellers</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col">
            <div className="footer-links-box border-left-dashed">
              <div className="heading d-flex justify-content-between align-items-center">
                Promociones
                <button
                  aria-label="Condiciones"
                  className="btn btn-footer d-lg-none"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#footPay"
                  aria-controls="footPay"
                  aria-expanded="false"
                />
              </div>
              <ul
                id="footPay"
                className="collapse d-lg-block list-unstyled mb-0"
              >
                <li>
                  <a href="https://www.hsnstore.com/cupones-hsn">
                    Cupones descuento HSN
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/oportunidades">
                    Oportunidades HSN
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/promociones/packs-ahorro/nutricion-deportiva">
                    Packs nutrición deportiva
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/promociones/packs-ahorro/perder-peso">
                    Packs pérdida de peso
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/packs-por-objetivos">
                    Packs por objetivos
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/promociones/black-friday">
                    Black Friday 2025
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/promociones/cyber-monday">
                    Cyber Monday 2025
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col">
            <div className="footer-links-box border-left-dashed">
              <div className="heading d-flex justify-content-between align-items-center">
                Envíos y Ayuda
                <button
                  aria-label="Envíos y Ayuda"
                  className="btn btn-footer d-lg-none"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#footHelp"
                  aria-controls="footHelp"
                  aria-expanded="false"
                />
              </div>
              <ul
                id="footHelp"
                className="collapse d-lg-block list-unstyled mb-0"
              >
                <li>
                  <a href="https://www.hsnstore.com/preguntas-frecuentes-faqs">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/gastos-de-envio#seguimiento-de-pedidos">
                    ¿Dónde está mi pedido?
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/gastos-de-envio">
                    Envíos a España
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/gastos-de-envio#internacionales">
                    Envíos internacionales
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/condiciones-de-contratacion#formas-de-pago">
                    Formas de pago
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/cacitos-hsn">
                    Guía de cacitos HSN
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col">
            <div className="footer-links-box border-left-dashed">
              <div className="heading d-flex justify-content-between align-items-center">
                Condiciones
                <button
                  aria-label="Acceso rápido"
                  className="btn btn-footer d-lg-none"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#footRegister"
                  aria-controls="footRegister"
                  aria-expanded="false"
                />
              </div>
              <ul
                id="footRegister"
                className="collapse d-lg-block list-unstyled mb-0"
              >
                <li>
                  <a href="https://www.hsnstore.com/condiciones-de-contratacion#como-comprar">
                    Cómo comprar
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/politica-de-privacidad">
                    Política de privacidad
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/aviso-legal">Aviso legal</a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/condiciones-de-contratacion">
                    Términos y condiciones
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/politica-de-cookies">
                    Política de cookies
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/condiciones-de-contratacion#devoluciones-cancelaciones">
                    Política de devolución y cancelación
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col">
            <div className="footer-links-box border-left-dashed">
              <div className="heading">Acceso Rápido</div>
              <ul className="list-unstyled mb-0">
                <li>
                  <a href="https://www.hsnstore.com/contacts">
                    Contacta con nosotros
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/customer/account/create/">
                    Crea tu cuenta
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/customer/account/login/">
                    Iniciar sesión
                  </a>
                </li>
                <li>
                  <a href="https://www.hsnstore.com/blog/">Blog HSN</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
