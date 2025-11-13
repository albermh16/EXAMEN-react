import "./copyright.css";

export default function Copyright() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-copyright footer-tall">
      <div className="container">
        {/* Row: Logo | Copy | Social icons */}
        <div className="row align-items-center gy-3 copyright_row">
          <div className="col-12">
            <div className="row align-items-center footer_copyright_container g-3">
              {/* Logo */}
              <div className="foot-logo col-12 col-sm-6 col-lg-3 text-sm-start text-center">
                <img
                  src="https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/hsnWhite.svg"
                  alt="HSNstore.com"
                  className="footer-logo"
                  loading="lazy"
                />
              </div>

              {/* Copy text */}
              <div className="foot-copy col-12 col-sm-6 col-lg-6 text-center fw-bolder">
                Copyright © {year} HSN Store. Todos los derechos reservados
              </div>

              {/* Social icons */}
              <div className="foot-icons col-12 col-lg-3 d-flex justify-content-center justify-content-lg-end align-items-center gap-2">
                <a
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.instagram.com/hsnstore_es/"
                  title="Instagram"
                  className="social-link"
                >
                  <i className="bi bi-instagram" aria-hidden="true" />
                  <span className="visually-hidden">Instagram</span>
                </a>

                <a
                  aria-label="TikTok"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.tiktok.com/@hsnstore?lang=es"
                  title="TikTok"
                  className="social-link"
                >
                  <i className="bi bi-tiktok" aria-hidden="true" />
                  <span className="visually-hidden">TikTok</span>
                </a>

                <a
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.youtube.com/user/hsnstoretv"
                  title="YouTube"
                  className="social-link"
                >
                  <i className="bi bi-youtube" aria-hidden="true" />
                  <span className="visually-hidden">YouTube</span>
                </a>

                <a
                  aria-label="Telegram"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://t.me/+-J-cHIEqcJ0yNjc0"
                  title="Telegram"
                  className="social-link"
                >
                  <i className="bi bi-telegram" aria-hidden="true" />
                  <span className="visually-hidden">Telegram</span>
                </a>

                <a
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.linkedin.com/company/hsnstore"
                  title="LinkedIn"
                  className="social-link"
                >
                  <i className="bi bi-linkedin" aria-hidden="true" />
                  <span className="visually-hidden">LinkedIn</span>
                </a>

                <a
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.facebook.com/HSNstore"
                  title="Facebook"
                  className="social-link"
                >
                  <i className="bi bi-facebook" aria-hidden="true" />
                  <span className="visually-hidden">Facebook</span>
                </a>

                <a
                  aria-label="Pinterest"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.pinterest.es/hsnstore/"
                  title="Pinterest"
                  className="social-link"
                >
                  <i className="bi bi-pinterest" aria-hidden="true" />
                  <span className="visually-hidden">Pinterest</span>
                </a>

                <a
                  aria-label="X (Twitter)"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://twitter.com/hsnstore"
                  title="X (Twitter)"
                  className="social-link"
                >
                  <i className="bi bi-twitter-x" aria-hidden="true" />
                  <span className="visually-hidden">X (Twitter)</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Row: Health register numbers */}
        <div className="row mt-3 mt-md-2">
          <div className="footer_health_register small text-white-50 d-flex flex-wrap">
            <div className="col-12 col-lg-4 text-center text-lg-start left">
              N.º de Registro Sanitario: 26.11001/GR
            </div>
            <div className="col-12 col-lg-4 text-center my-2 my-lg-0 center">
              N.º de Registro Sanitario: 40.048706/GR
            </div>
            <div className="col-12 col-lg-4 text-center text-lg-end right">
              N.º de Registro Sanitario: 26.017818/O
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
