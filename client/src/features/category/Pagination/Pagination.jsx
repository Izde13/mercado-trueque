import "./Pagination.css";

export default function Pagination({ page = 1, totalPages = 1, onChange }) {
  const siblingCount = 1; // cuántos vecinos a cada lado del actual

  const buildRange = () => {
    const range = [];
    const start = Math.max(1, page - siblingCount);
    const end = Math.min(totalPages, page + siblingCount);

    if (start > 1) {
      range.push(1);
      if (start > 2) range.push("dots-l");
    }

    for (let p = start; p <= end; p++) range.push(p);

    if (end < totalPages) {
      if (end < totalPages - 1) range.push("dots-r");
      range.push(totalPages);
    }
    return range;
  };

  const pages = buildRange();

  const go = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    onChange?.(p);
  };

  return (
    <nav className="pager" aria-label="Paginación">
      <button
        className="pager-btn"
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
      >
        ‹ Anterior
      </button>

      <ol className="pager-list">
        {pages.map((p) =>
          typeof p === "number" ? (
            <li key={p}>
              <button
                className={`page ${p === page ? "is-active" : ""}`}
                aria-current={p === page ? "page" : undefined}
                onClick={() => go(p)}
              >
                {p}
              </button>
            </li>
          ) : (
            <li key={p} className="ellipsis" aria-hidden="true">
              …
            </li>
          )
        )}
      </ol>

      <button
        className="pager-btn"
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
      >
        Siguiente ›
      </button>
    </nav>
  );
}
