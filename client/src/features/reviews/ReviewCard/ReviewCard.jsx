import "./ReviewCard.css";

export default function ReviewCard() {
  return (
    <figure className="tm" role="group" aria-label="Testimonio de cliente">
      <figcaption className="tm-head">
        <span className="tm-name">Sarah M.</span>
        <span className="tm-verified" title="Cuenta verificada" aria-label="Cuenta verificada">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M7 12.5l3 3 7-7" />
          </svg>
        </span>
      </figcaption>

      <blockquote className="tm-quote">
        I&apos;m blown away by the quality and style of the clothes I received from Shop.co.
        From casual wear to elegant dresses, every piece I&apos;ve bought has exceeded my expectations.
      </blockquote>
    </figure>
  );
}
