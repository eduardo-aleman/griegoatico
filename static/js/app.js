/* /js/app.js (versión final corregida) */

document.addEventListener("DOMContentLoaded", () => {
  const openModalButtons = document.querySelectorAll("[data-modal-target]");
  const closeModalButtons = document.querySelectorAll(".modal-close");
  const downloadButton = document.getElementById("download-button");
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  document.body.appendChild(overlay);

  let keyboard = null;
  let activeInput = null;

  // ----------- Lógica del Teclado Virtual -----------

  function initKeyboard() {
    const Keyboard = window.SimpleKeyboard.default;
    if (keyboard) return;

    keyboard = new Keyboard({
      onChange: input => {
        if (activeInput) {
          activeInput.value = input;
        }
      },
      // SOLUCIÓN PARA LA TECLA MAYÚS
      onKeyPress: button => {
        if (button === "{shift}") handleShift();
      },
      mergeDiacritics: true,
      layoutName: "default",
      theme: "hg-theme-default hg-layout-default hg-layout-greek",
      layout: {
        'default': [
          '´ ` ~ ʼ ʽ ͅ ¨',
          'α β γ δ ε ζ η θ ι κ λ μ',
          'ν ξ ο π ρ σ/ς τ υ φ χ ψ ω',
          '{shift} {space} {backspace}'
        ],
        'shift': [
          '´ ` ~ ʼ ʽ ͅ ¨',
          'Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ',
          'Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω',
          '{shift} {space} {backspace}'
        ]
      },
      buttonAttributes: [
        { attribute: 'data-value', value: '\u0301', buttons: '´' },
        { attribute: 'aria-label', value: 'Agudo (Oxia)', buttons: '´' },
        { attribute: 'data-value', value: '\u0300', buttons: '`' },
        { attribute: 'aria-label', value: 'Grave (Varia)', buttons: '`' },
        { attribute: 'data-value', value: '\u0342', buttons: '~' },
        { attribute: 'aria-label', value: 'Circunflejo (Perispomeni)', buttons: '~' },
        { attribute: 'data-value', value: '\u0313', buttons: 'ʼ' },
        { attribute: 'aria-label', value: 'Espíritu Suave (Psili)', buttons: 'ʼ' },
        { attribute: 'data-value', value: '\u0314', buttons: 'ʽ' },
        { attribute: 'aria-label', value: 'Espíritu Áspero (Dasia)', buttons: 'ʽ' },
        { attribute: 'data-value', value: '\u0345', buttons: 'ͅ' },
        { attribute: 'aria-label', value: 'Iota Suscrita', buttons: 'ͅ' },
        { attribute: 'data-value', value: '\u0308', buttons: '¨' },
        { attribute: 'aria-label', value: 'Diéresis', buttons: '¨' },
      ],
      display: {
        '{shift}': 'MAYÚSCULA',
        '{space}': 'Espacio',
        '{backspace}': 'Borrar'
      }
    });
  }
  
  // Función para manejar el cambio de mayúsculas/minúsculas
  const handleShift = () => {
    const currentLayout = keyboard.options.layoutName;
    const shiftToggle = currentLayout === "default" ? "shift" : "default";
    keyboard.setOptions({
      layoutName: shiftToggle
    });
  };


  function showKeyboard() {
    const vk = document.getElementById("virtual-keyboard");
    if (vk) vk.style.display = "block";
  }

  function hideKeyboard() {
    const vk = document.getElementById("virtual-keyboard");
    if (vk) vk.style.display = "none";
    if (keyboard) keyboard.clearInput();
    activeInput = null;
  }

  // ----------- Lógica de los Modales -----------

  function openModal(modal) {
    if (modal == null) return;
    modal.classList.add("active");
    overlay.classList.add("active");
    initKeyboard();
  }

  function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove("active");
    overlay.classList.remove("active");
    hideKeyboard();
  }

  openModalButtons.forEach(button => {
    button.addEventListener("click", () => {
      const modal = document.querySelector("#" + button.dataset.modalTarget);
      openModal(modal);
    });
  });

  overlay.addEventListener("click", () => {
    const modals = document.querySelectorAll(".modal.active");
    modals.forEach(modal => closeModal(modal));
  });

  closeModalButtons.forEach(button => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");
      closeModal(modal);
    });
  });

  // ----------- Sincronización del Teclado y Descarga -----------

  // SOLUCIÓN PARA EL BUG DEL CONTENIDO BORRADO
  document.addEventListener('input', (event) => {
    if (event.target.classList.contains('greek-input') && keyboard && activeInput === event.target) {
      keyboard.setInput(event.target.value);
    }
  });
  
  // SOLUCIÓN PARA EL BOTÓN DE DESCARGA
  if (downloadButton) {
    downloadButton.addEventListener("click", () => {
      let content = `Respuestas de los Ejercicios - ${document.title}\n`;
      content += "==================================================\n\n";

      const modals = document.querySelectorAll(".modal");
      modals.forEach(modal => {
        const question = modal.querySelector(".modal-question").textContent.trim();
        const answer = modal.querySelector(".greek-input").value.trim();
        content += `Pregunta: ${question}\n`;
        content += `Respuesta: ${answer || "(Sin respuesta)"}\n\n--------------------------------------------------\n\n`;
      });

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "respuestas_griego.txt";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  document.addEventListener("focusin", (event) => {
    if (event.target.classList.contains("greek-input")) {
      activeInput = event.target;
      const modalContent = activeInput.closest('.modal-content');
      const keyboardContainer = document.getElementById('virtual-keyboard');
      if (modalContent && keyboardContainer) {
        modalContent.appendChild(keyboardContainer);
      }
      showKeyboard();
      if (keyboard) keyboard.setInput(activeInput.value || "");
    }
  });
});