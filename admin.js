let catalog = [];
let search = "";
let selectedCategory = "Todos";

const catalogList = document.querySelector("#catalog-list");
const form = document.querySelector("#product-form");
const fileInput = document.querySelector("#import-file");
const imageFileInput = document.querySelector("#product-image-file");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadCatalog() {
  const draft = localStorage.getItem("chana-catalog-draft-v3");
  if (draft) {
    const parsedDraft = JSON.parse(draft);
    if (Array.isArray(parsedDraft) && parsedDraft.length) {
      catalog = parsedDraft;
      renderCatalog();
      showToast("Se recuperó el borrador guardado");
      return;
    }
    localStorage.removeItem("chana-catalog-draft-v3");
  }
  try {
    const response = await fetch("./products.json", { cache: "no-store" });
    if (!response.ok) throw new Error("No fue posible cargar products.json");
    catalog = await response.json();
    renderCatalog();
  } catch (error) {
    if (Array.isArray(window.CHANA_CATALOG_BACKUP) && window.CHANA_CATALOG_BACKUP.length) {
      catalog = structuredClone(window.CHANA_CATALOG_BACKUP);
      renderCatalog();
      showToast("Se cargó la copia de respaldo del catálogo");
    } else {
      catalogList.innerHTML = '<p class="catalog-empty">No fue posible cargar el catálogo. Usa “Importar JSON” para comenzar.</p>';
      console.error(error);
    }
  }
}

function saveDraft() {
  localStorage.setItem("chana-catalog-draft-v3", JSON.stringify(catalog));
}

function renderCatalog() {
  const term = search.toLocaleLowerCase("es");
  const categories = [...new Set(catalog.map(product => product.category))].sort();
  if (selectedCategory !== "Todos" && !categories.includes(selectedCategory)) {
    selectedCategory = "Todos";
  }
  const filtered = [...catalog]
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .filter(product => selectedCategory === "Todos" || product.category === selectedCategory)
    .filter(product => `${product.name} ${product.category}`.toLocaleLowerCase("es").includes(term));

  document.querySelector("#product-count").textContent = catalog.length;
  document.querySelector("#category-options").innerHTML =
    categories
      .map(category => `<option value="${escapeHtml(category)}"></option>`).join("");
  document.querySelector("#catalog-category-filter").innerHTML = [
    '<option value="Todos">Todas las categorías</option>',
    ...categories.map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
  ].join("");
  document.querySelector("#catalog-category-filter").value = selectedCategory;

  if (!filtered.length) {
    catalogList.innerHTML = '<p class="catalog-empty">No hay productos que coincidan con la búsqueda.</p>';
    return;
  }

  catalogList.innerHTML = filtered.map(product => `
    <article class="admin-product ${product.active === false ? "inactive" : ""}">
      <div class="product-symbol">
        ${product.image
          ? `<img src="${escapeHtml(product.image)}" alt="" />`
          : `<span>${escapeHtml(product.emoji || "🍽️")}</span>`}
      </div>
      <div class="product-data">
        <b>${escapeHtml(product.name)}</b>
        <span>${escapeHtml(product.category)} · <strong>$${Number(product.price).toFixed(2)}</strong> · Orden ${product.order ?? "-"}</span>
      </div>
      <div class="product-actions">
        <button type="button" data-edit="${product.id}">Editar</button>
        <button type="button" data-toggle="${product.id}">${product.active === false ? "Activar" : "Ocultar"}</button>
        <button class="delete" type="button" data-delete="${product.id}">Eliminar</button>
      </div>
    </article>
  `).join("");
}

function resetForm() {
  form.reset();
  document.querySelector("#product-id").value = "";
  document.querySelector("#product-active").checked = true;
  document.querySelector("#product-order").value = catalog.length + 1;
  document.querySelector("#editor-title").textContent = "Agregar platillo";
  imageFileInput.value = "";
  updateImagePreview("");
  document.querySelector("#product-name").focus();
}

function editProduct(id) {
  const product = catalog.find(item => item.id === id);
  if (!product) return;
  document.querySelector("#product-id").value = product.id;
  document.querySelector("#product-name").value = product.name;
  document.querySelector("#product-category").value = product.category;
  document.querySelector("#product-price").value = product.price;
  document.querySelector("#product-emoji").value = product.emoji || "";
  document.querySelector("#product-order").value = product.order ?? "";
  document.querySelector("#product-image").value = product.image || "";
  updateImagePreview(product.image || "");
  document.querySelector("#product-description").value = product.description;
  document.querySelector("#product-active").checked = product.active !== false;
  document.querySelector("#editor-title").textContent = "Editar platillo";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateImagePreview(source) {
  const preview = document.querySelector("#image-preview");
  const previewImage = document.querySelector("#image-preview-img");
  preview.hidden = !source;
  if (source) previewImage.src = source;
  else previewImage.removeAttribute("src");
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("El archivo no es una imagen válida"));
      image.onload = () => {
        const maxWidth = 900;
        const maxHeight = 700;
        const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", 0.78));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function selectProductImage(file) {
  if (!file || !file.type.startsWith("image/")) {
    showToast("Selecciona una imagen válida");
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    showToast("La imagen no debe superar 10 MB");
    return;
  }
  try {
    showToast("Preparando imagen...");
    const dataUrl = await compressImage(file);
    document.querySelector("#product-image").value = dataUrl;
    updateImagePreview(dataUrl);
    showToast("Imagen agregada al producto");
  } catch (error) {
    showToast("No fue posible procesar la imagen");
    console.error(error);
  }
}

function submitProduct(event) {
  event.preventDefault();
  const currentId = Number(document.querySelector("#product-id").value);
  const product = {
    id: currentId || Math.max(0, ...catalog.map(item => Number(item.id) || 0)) + 1,
    name: document.querySelector("#product-name").value.trim(),
    category: document.querySelector("#product-category").value.trim(),
    price: Number(document.querySelector("#product-price").value),
    emoji: document.querySelector("#product-emoji").value.trim() || "🍽️",
    image: document.querySelector("#product-image").value.trim(),
    description: document.querySelector("#product-description").value.trim(),
    active: document.querySelector("#product-active").checked,
    order: Number(document.querySelector("#product-order").value) || catalog.length + 1
  };

  if (currentId) {
    catalog = catalog.map(item => item.id === currentId ? product : item);
    showToast("Producto actualizado");
  } else {
    catalog.push(product);
    showToast("Producto agregado");
  }
  saveDraft();
  renderCatalog();
  resetForm();
}

function toggleProduct(id) {
  catalog = catalog.map(product =>
    product.id === id ? { ...product, active: product.active === false } : product
  );
  saveDraft();
  renderCatalog();
}

function deleteProduct(id) {
  const product = catalog.find(item => item.id === id);
  if (!product || !window.confirm(`¿Eliminar "${product.name}" del catálogo?`)) return;
  catalog = catalog.filter(item => item.id !== id);
  saveDraft();
  renderCatalog();
  showToast("Producto eliminado");
}

function downloadCatalog() {
  if (!catalog.length) {
    showToast("No se descargó: el catálogo está vacío");
    return;
  }
  const ordered = [...catalog].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const blob = new Blob([JSON.stringify(ordered, null, 2) + "\n"], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "products.json";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast("Catálogo descargado");
}

async function importCatalog(file) {
  try {
    const imported = JSON.parse(await file.text());
    if (!Array.isArray(imported) || !imported.length) throw new Error("El catálogo está vacío");
    catalog = imported;
    saveDraft();
    renderCatalog();
    resetForm();
    showToast("Catálogo importado");
  } catch (error) {
    showToast("El archivo JSON no es válido");
    console.error(error);
  }
}

function restoreCatalog() {
  if (!Array.isArray(window.CHANA_CATALOG_BACKUP) || !window.CHANA_CATALOG_BACKUP.length) {
    showToast("No hay una copia de respaldo disponible");
    return;
  }
  catalog = structuredClone(window.CHANA_CATALOG_BACKUP);
  saveDraft();
  renderCatalog();
  resetForm();
  showToast("Catálogo original restaurado");
}

function showToast(message) {
  const toast = document.querySelector("#admin-toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

form.addEventListener("submit", submitProduct);
document.querySelector("#reset-form").addEventListener("click", resetForm);
document.querySelector("#download-button").addEventListener("click", downloadCatalog);
document.querySelector("#restore-button").addEventListener("click", restoreCatalog);
document.querySelector("#import-button").addEventListener("click", () => fileInput.click());
document.querySelector("#browse-image").addEventListener("click", () => imageFileInput.click());
imageFileInput.addEventListener("change", event => {
  if (event.target.files[0]) selectProductImage(event.target.files[0]);
});
document.querySelector("#remove-image").addEventListener("click", () => {
  document.querySelector("#product-image").value = "";
  imageFileInput.value = "";
  updateImagePreview("");
});
document.querySelector("#product-image").addEventListener("input", event => {
  updateImagePreview(event.target.value.trim());
});
fileInput.addEventListener("change", event => {
  if (event.target.files[0]) importCatalog(event.target.files[0]);
  event.target.value = "";
});
document.querySelector("#admin-search").addEventListener("input", event => {
  search = event.target.value.trim();
  renderCatalog();
});
document.querySelector("#catalog-category-filter").addEventListener("change", event => {
  selectedCategory = event.target.value;
  renderCatalog();
});
catalogList.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit]");
  const toggleButton = event.target.closest("[data-toggle]");
  const deleteButton = event.target.closest("[data-delete]");
  if (editButton) editProduct(Number(editButton.dataset.edit));
  if (toggleButton) toggleProduct(Number(toggleButton.dataset.toggle));
  if (deleteButton) deleteProduct(Number(deleteButton.dataset.delete));
});

loadCatalog().then(resetForm);
