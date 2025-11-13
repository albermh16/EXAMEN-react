import Caracteristicas from "./caracteristicas/caracteristicas";
import Copyright from "./copyright/copyright";
import NewsLetter from "./newsletter-info/newsletter";
import Partners from "./partners/partners";

export default function Footer() {
  return (
    <footer>
      <Caracteristicas />
      <NewsLetter />
      <Partners />
      <Copyright />
    </footer>
  );
}
