const archiveGrid = document.querySelector("#archive-grid");
const count = document.querySelector("#archive-count");
const selectionCount = document.querySelector("#selection-count");
const slotAssignments = document.querySelector("#slot-assignments");
const clearSelection = document.querySelector("#clear-selection");
const filters = document.querySelectorAll(".filter-button");
const selectedPhotos = new Set(JSON.parse(localStorage.getItem("capturedbydkd-selection") || "[]"));
const assignments = JSON.parse(localStorage.getItem("capturedbydkd-slot-assignments") || "{}");
const slots = [
  ["hero", "Hero"],
  ["heat", "Heat index"],
  ["soft", "Soft focus / hard night"],
  ["company", "In good company"],
  ["checkout", "Late checkout"],
  ["approach", "Approach image"],
];

const renderArchive = (filter = "all") => {
  const visiblePhotos = archivePhotos.filter((photo) => filter === "all" || photo.tags.includes(filter));
  count.textContent = `(${visiblePhotos.length})`;
  archiveGrid.innerHTML = visiblePhotos.map((photo, index) => `
    <figure class="archive-card ${photo.tags.join(" ")} ${selectedPhotos.has(photo.file) ? "is-selected" : ""}">
      <img src="assets/archive/${photo.file}" alt="Archive frame ${index + 1}" loading="lazy" />
      <figcaption><span>${String(index + 1).padStart(2, "0")}</span><small>${photo.file}</small><select aria-label="Assign ${photo.file} to a homepage slot" data-assign-file="${photo.file}"><option value="">Assign to…</option>${slots.map(([value, label]) => `<option value="${value}" ${assignments[value] === photo.file ? "selected" : ""}>${label}</option>`).join("")}</select></figcaption>
    </figure>
  `).join("");
  const assignedCount = Object.values(assignments).filter(Boolean).length;
  selectionCount.textContent = `${assignedCount} assigned`;
  slotAssignments.innerHTML = slots.map(([value, label]) => `<span>${label}: <b>${assignments[value] || "not chosen"}</b></span>`).join("");
  archiveGrid.querySelectorAll("[data-assign-file]").forEach((select) => {
    select.addEventListener("change", () => {
      const file = select.dataset.assignFile;
      const slot = select.value;
      if (slot) {
        Object.keys(assignments).forEach((key) => {
          if (assignments[key] === file) delete assignments[key];
        });
        assignments[slot] = file;
      } else {
        Object.keys(assignments).forEach((key) => {
          if (assignments[key] === file) delete assignments[key];
        });
      }
      localStorage.setItem("capturedbydkd-slot-assignments", JSON.stringify(assignments));
      renderArchive(filter);
    });
  });
};

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderArchive(button.dataset.filter);
  });
});

clearSelection.addEventListener("click", () => {
  selectedPhotos.clear();
  Object.keys(assignments).forEach((key) => delete assignments[key]);
  localStorage.removeItem("capturedbydkd-selection");
  localStorage.removeItem("capturedbydkd-slot-assignments");
  renderArchive(document.querySelector(".filter-button.is-active").dataset.filter);
});

renderArchive();
