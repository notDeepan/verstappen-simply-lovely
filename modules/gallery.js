export function createGallery(openDialog, refreshLayout) {
  const items = [...document.querySelectorAll(".gallery-item")];
  const filters = [...document.querySelectorAll("[data-filter]")];
  const dialog = document.querySelector("#lightbox");
  const image = document.querySelector("#lightbox-image");
  const caption = document.querySelector("#lightbox-caption");
  const events = new AbortController();
  let selected = 0;
  const visible = () => items.filter((item) => !item.hidden);
  function show(index) {
    const list = visible();
    selected = (index + list.length) % list.length;
    const item = list[selected];
    image.src = item.dataset.image;
    image.alt = item.querySelector("img").alt;
    caption.textContent = item.dataset.caption;
  }
  items.forEach((item) =>
    item.addEventListener(
      "click",
      () => {
        show(visible().indexOf(item));
        openDialog(dialog);
      },
      { signal: events.signal },
    ),
  );
  filters.forEach((button) =>
    button.addEventListener(
      "click",
      () => {
        filters.forEach((b) =>
          b.setAttribute("aria-pressed", String(b === button)),
        );
        items.forEach(
          (item) =>
            (item.hidden =
              button.dataset.filter !== "all" &&
              item.dataset.category !== button.dataset.filter),
        );
        document
          .querySelector(".gallery")
          .classList.toggle("filtered", button.dataset.filter !== "all");
        document.querySelector("#gallery-status").textContent =
          `${visible().length} photograph${visible().length === 1 ? "" : "s"} shown`;
        refreshLayout();
      },
      { signal: events.signal },
    ),
  );
  document
    .querySelector("#photo-prev")
    .addEventListener("click", () => show(selected - 1), {
      signal: events.signal,
    });
  document
    .querySelector("#photo-next")
    .addEventListener("click", () => show(selected + 1), {
      signal: events.signal,
    });
  dialog.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        show(selected + (event.key === "ArrowRight" ? 1 : -1));
      }
    },
    { signal: events.signal },
  );
  return () => events.abort();
}
