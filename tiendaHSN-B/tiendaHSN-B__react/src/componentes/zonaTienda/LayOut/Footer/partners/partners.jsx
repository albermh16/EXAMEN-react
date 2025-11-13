import "./partners.css";

const logosPagos = [
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_payment_logos/ES-mastercard.jpg",
    alt: "ES-mastercard",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_payment_logos/ES-visa.jpg",
    alt: "ES-visa",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_payment_logos/ES-maestro.jpg",
    alt: "ES-maestro",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_payment_logos/ES-amazon.jpg",
    alt: "ES-amazon",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_payment_logos/ES-redsys.jpg",
    alt: "ES-redsys",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_payment_logos/ES-cashondelivery.jpg",
    alt: "ES-cashondelivery",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_payment_logos/ES-waylet.jpg",
    alt: "ES-waylet",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_payment_logos/ES-banktransfer.jpg",
    alt: "ES-banktransfer",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_payment_logos/ES-applepay.jpg",
    alt: "ES-applepay",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_payment_logos/ES-paypal.jpg",
    alt: "ES-paypal",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_payment_logos/ES-sequra.jpg",
    alt: "ES-sequra",
  },
];

const logosEnvio = [
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_shipping_logos/ES-correos.jpg",
    alt: "ES-correos",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_shipping_logos/ES-correosexpress.jpg",
    alt: "ES-correosexpress",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_shipping_logos/ES-gls.jpg",
    alt: "ES-gls",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_shipping_logos/ES-fedex.jpg",
    alt: "ES-fedex",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_shipping_logos/ES-mrw.jpg",
    alt: "ES-mrw",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_shipping_logos/ES-spring.jpg",
    alt: "ES-spring",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_shipping_logos/ES-ups.jpg",
    alt: "ES-ups",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_shipping_logos/ES-dhl.jpg",
    alt: "ES-dhl",
  },
];

const logosSeguridad = [
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_web_security/DMCA.jpg",
    alt: "DMCA logo",
    href: "//www.dmca.com/Protection/Status.aspx?ID=3093b29b-046d-4b44-9440-d10d2432fd9b",
  },
  {
    src: "https://www.hsnstore.com/skin/frontend/default/hsnreborn/images/footer_web_security/Geotrust.jpg",
    alt: "Geotrust logo",
  },
  {
    src: "https://seal.securetrust.com/seal_image.php?customerId=cd3e6eedb4564f42a12d29422b29d9e5&size=105x54&style=invert",
    alt: "This site is protected by VikingCloud's Trusted Commerce program",
    href: "https://seal.securetrust.com/cert.php?customerId=cd3e6eedb4564f42a12d29422b29d9e5&size=105x54&style=invert",
  },
];

export default function Partners() {
  return (
    <section className="footer-partners py-3 py-md-4">
      <div className="container">
        <div className="row g-3 g-lg-4 payment_methods_row">
          {/* Métodos de pago */}
          <div className="col-12 col-lg-4 footer_payment_methods">
            <p className="footer_bottom_title mb-2">MÉTODOS DE PAGO</p>
            <ul className="footer_payment_list list-unstyled">
              {logosPagos.map((logo) => (
                <li key={logo.alt} className="payment-icon-item">
                  <img loading="lazy" src={logo.src} alt={logo.alt} />
                </li>
              ))}
            </ul>
          </div>

          {/* Métodos de envío */}
          <div className="col-12 col-lg-4 footer_shipping_methods">
            <p className="footer_bottom_title mb-2">MÉTODOS DE ENVÍO</p>
            <ul className="footer_shipping_list list-unstyled">
              {logosEnvio.map((logo) => (
                <li key={logo.alt} className="shipping-icon-item">
                  <img loading="lazy" src={logo.src} alt={logo.alt} />
                </li>
              ))}
            </ul>
          </div>

          {/* Seguridad web */}
          <div className="col-12 col-lg-4 footer_web_security">
            <p className="footer_bottom_title mb-2">SEGURIDAD WEB</p>
            <ul className="footer_security_list list-unstyled">
              {logosSeguridad.map((logo) => (
                <li key={logo.alt}>
                  {logo.href ? (
                    <a
                      href={logo.href}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <img loading="lazy" src={logo.src} alt={logo.alt} />
                    </a>
                  ) : (
                    <img loading="lazy" src={logo.src} alt={logo.alt} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
