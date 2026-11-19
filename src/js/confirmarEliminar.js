// Confirmación antes de eliminar una propiedad (views/propiedades/admin.pug)
// Cada formulario de eliminar tiene data-eliminar y data-titulo.
// En lugar de enviarse directo, abre el modal #confirmar-eliminar.
(function () {
  const modal = document.querySelector("#confirmar-eliminar");
  if (!modal) return;

  const nombre = modal.querySelector("#confirmar-eliminar-nombre");
  const botonConfirmar = modal.querySelector("[data-confirmar]");
  let formularioPendiente = null; // el formulario de la propiedad que se quiere borrar

  // 1. Interceptar el envío y preguntar primero
  document.querySelectorAll("form[data-eliminar]").forEach((formulario) => {
    formulario.addEventListener("submit", (e) => {
      e.preventDefault();
      formularioPendiente = formulario;
      nombre.textContent = formulario.dataset.titulo || "esta propiedad";
      botonConfirmar.disabled = false;
      botonConfirmar.textContent = "Sí, eliminar";
      modal.showModal();
    });
  });

  // 2. Confirmó: ahora sí se envía.
  // formulario.submit() no vuelve a disparar el evento "submit", así que no se abre otra vez el modal
  botonConfirmar.addEventListener("click", () => {
    if (!formularioPendiente) return;
    botonConfirmar.disabled = true;
    botonConfirmar.textContent = "Eliminando…";
    formularioPendiente.submit();
  });

  // 3. Canceló: con el botón, con Escape (lo hace <dialog> solo) o con clic fuera del modal
  modal.querySelector("[data-cancelar]").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });
  modal.addEventListener("close", () => {
    formularioPendiente = null;
  });

  // Aviso de "propiedad eliminada": botón para cerrarlo
  const aviso = document.querySelector("#aviso");
  aviso?.querySelector("[data-cerrar-aviso]")?.addEventListener("click", () => aviso.remove());

  // Quitar ?eliminada=1 de la URL para que el aviso no vuelva a salir al recargar
  if (window.location.search) {
    window.history.replaceState(null, "", window.location.pathname);
  }
})();
