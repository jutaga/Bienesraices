(function () {
  // Coordenadas iniciales: centro de Medellín, Colombia
  const lat = document.querySelector("#lat").value || 6.2476;
  const lng = document.querySelector("#lng").value || -75.5658;

  const mapa = L.map("mapa").setView([lat, lng], 16);

  //Utilizar provider y Geocoder
  const geocodeService = L.esri.Geocoding.geocodeService();

  // Las "tiles" son las imágenes del mapa; sin esto el div sigue en blanco
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(mapa);

  // El pin que se puede arrastrar
  let marker = L.marker([lat, lng], { draggable: true, autoPan: true }).addTo(
    mapa,
  );

  //Detectar movimiento del pin
  marker.on("moveend", function (e) {
    marker = e.target;

    const position = marker.getLatLng();
    mapa.panTo(new L.LatLng(position.lat, position.lng));

    //Obtener la Imformacion de la dirección
    geocodeService
      .reverse()
      .latlng(position, 15)
      .run(function (error, result) {
        if (error) return;
        marker.bindPopup(result.address.LongLabel);
        console.log(result);

        //Actualizar los valores de los inputs
        document.getElementById("calle").value = result.address.Address || "";
        document.getElementById("calle-texto").textContent = result.address.Address || "";
        document.getElementById("lat").value = result.latlng.lat || "";
        document.getElementById("lng").value = result.latlng.lng || "";
      });
  });
})();
