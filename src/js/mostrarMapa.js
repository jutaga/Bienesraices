// Mapa de solo lectura en el detalle de la propiedad (views/propiedades/mostrar.pug)
// Lee la ubicación de los data-* del div #mapa-detalle y pone un pin fijo.
(function () {
  const contenedor = document.querySelector("#mapa-detalle");
  if (!contenedor) return;

  const lat = Number(contenedor.dataset.lat);
  const lng = Number(contenedor.dataset.lng);
  const titulo = contenedor.dataset.titulo || "";

  // Sin coordenadas válidas no hay nada que dibujar
  if (!lat || !lng) {
    contenedor.textContent = "Ubicación no disponible";
    contenedor.classList.add("flex", "items-center", "justify-center", "text-bosque-900/50");
    return;
  }

  const mapa = L.map(contenedor, {
    scrollWheelZoom: false, // que la rueda del mouse haga scroll en la página, no zoom en el mapa
  }).setView([lat, lng], 16);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(mapa);

  // Pin fijo (no se puede arrastrar) con el título al hacer clic
  L.marker([lat, lng]).addTo(mapa).bindPopup(titulo);
})();
