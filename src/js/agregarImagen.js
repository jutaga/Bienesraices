import { Dropzone } from "dropzone";

// Dropzone busca solo todos los elementos con clase "dropzone" y les pone
// su configuración por defecto. Lo apagamos para crear el nuestro a mano.
Dropzone.autoDiscover = false;

const formulario = document.querySelector("#imagen");

// Solo se ejecuta en la página que tiene el formulario
if (formulario) {
  const botonPublicar = document.querySelector("#publicar");
  const mensajeError = document.querySelector("#imagen-error");

  // csurf no puede leer el body de un envío con archivos (multipart),
  // así que el token viaja como cabecera
  const token = formulario.querySelector('input[name="_csrf"]').value;

  const mostrarError = (mensaje) => {
    mensajeError.textContent = mensaje;
    mensajeError.classList.toggle("hidden", !mensaje);
  };

  // Al ser un <form>, Dropzone envía a su atributo action:
  // /propiedades/agregar-imagen/:id
  const dropzone = new Dropzone(formulario, {
    paramName: "imagen", // nombre del campo que tiene que leer multer en el servidor
    acceptedFiles: ".png,.jpg,.jpeg",
    maxFilesize: 5, // MB
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false, // no sube hasta que se presione "Publicar propiedad"
    addRemoveLinks: true,
    headers: { "CSRF-Token": token },

    // Textos en español
    dictRemoveFile: "Quitar imagen",
    dictCancelUpload: "Cancelar",
    dictMaxFilesExceeded: "Solo puedes subir una imagen",
    dictInvalidFileType: "Solo se permiten imágenes JPG o PNG",
    dictFileTooBig:
      "La imagen pesa {{filesize}} MB. El máximo es {{maxFilesize}} MB",
    dictResponseError: "Hubo un error al subir la imagen ({{statusCode}})",
  });

  // El botón solo se activa cuando hay una imagen válida esperando
  const actualizarBoton = () => {
    botonPublicar.disabled = dropzone.getQueuedFiles().length === 0;
  };
  actualizarBoton();

  // Si eligen otra imagen, reemplaza a la anterior en lugar de dar error
  dropzone.on("addedfile", () => {
    mostrarError("");
    if (dropzone.files.length > 1) {
      dropzone.removeFile(dropzone.files[0]);
    }
    // Dropzone valida y pone el archivo en la cola justo después de este evento
    setTimeout(actualizarBoton);
  });

  dropzone.on("removedfile", actualizarBoton);

  dropzone.on("error", (archivo, mensaje) => {
    // El mensaje puede ser texto (validación de Dropzone) o la respuesta del servidor
    mostrarError(
      typeof mensaje === "string"
        ? mensaje
        : mensaje.error || "No se pudo subir la imagen",
    );
    dropzone.removeFile(archivo);
    botonPublicar.disabled = true;
  });

  // Subir la imagen al presionar "Publicar propiedad"
  botonPublicar.addEventListener("click", () => {
    if (dropzone.getQueuedFiles().length === 0) {
      mostrarError("Agrega una imagen antes de publicar");
      return;
    }
    botonPublicar.disabled = true;
    dropzone.processQueue();
  });

  // La imagen llegó bien al servidor: mostrar el aviso y luego ir al panel
  dropzone.on("success", () => {
    mostrarError("");
    document.querySelector("#imagen-exito").classList.replace("hidden", "flex");
    document.querySelector("#acciones").classList.add("hidden");

    // Ya está subida: que no se pueda quitar ni agregar otra
    dropzone.disable();
    formulario.querySelectorAll(".dz-remove").forEach((enlace) => enlace.remove());

    // 2.5 segundos para que se alcance a leer el mensaje
    setTimeout(() => {
      window.location.href = "/mis-propiedades";
    }, 2500);
  });
}
