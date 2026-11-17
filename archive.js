const archiveGrid = document.querySelector("#archive-grid");
const count = document.querySelector("#archive-count");
const filters = document.querySelectorAll(".filter-button");

const renderArchive = (filter = "all") => {
  const visiblePhotos = archivePhotos.filter((photo) => filter === "all" || photo.tags.includes(filter));
  count.textContent = `(${visiblePhotos.length})`;
  archiveGrid.innerHTML = visiblePhotos.map((photo, index) => `
    <figure class="archive-card ${photo.tags.join(" ")}">
      <img src="assets/archive/${photo.file}" alt="Archive frame ${index + 1}" loading="lazy" />
      <figcaption><span>${String(index + 1).padStart(2, "0")}</span><small>${photo.file}</small></figcaption>
    </figure>
  `).join("");
};

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderArchive(button.dataset.filter);
  });
});

renderArchive();
