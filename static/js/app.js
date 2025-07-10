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

    // Objeto para mapear la tecla de función a su código Unicode combinatorio.
    const DIACRITICS_MAP = {
      '{acute}': '\u0301', '{grave}': '\u0300', '{circumflex}': '\u0342',
      '{psili}': '\u0313', '{dasia}': '\u0314', '{iota}': '\u0345',
      '{dieresis}': '\u0308'
    };
    const diacriticButtons = Object.keys(DIACRITICS_MAP);

    keyboard = new Keyboard({
      onChange: input => {
        if (!activeInput) return;

        const correctedInput = input
          .replace(/σ(?=[\s.,;·?!]|$)/g, 'ς')
          .replace(/ς(?=[^\s.,;·?!])/g, 'σ');

        activeInput.value = correctedInput;
        
        if (keyboard.getInput() !== correctedInput) {
          keyboard.setInput(correctedInput, { preventOnChange: true });
        }
      },
      
      onKeyPress: button => {
        if (button === "{shift}") {
          handleShift();
          return;
        }

        if (diacriticButtons.includes(button)) {
          let currentInput = keyboard.getInput();
          if (currentInput.length === 0) return;

          const combined = currentInput + DIACRITICS_MAP[button];
          const normalized = combined.normalize('NFC');
          
          keyboard.setInput(normalized);
        }
      },

      mergeDiacritics: false, 
      
      layoutName: "default",
      theme: "hg-theme-default hg-layout-default hg-layout-greek",
      
      // MEJORA: Los diacríticos ahora son teclas de función para evitar la doble inserción.
      layout: {
        'default': [
          '{acute} {grave} {circumflex} {psili} {dasia} {iota} {dieresis}',
          'α β γ δ ε ζ η θ ι κ λ μ',
          'ν ξ ο π ρ σ τ υ φ χ ψ ω',
          '{shift} {space} {backspace}'
        ],
        'shift': [
          '{acute} {grave} {circumflex} {psili} {dasia} {iota} {dieresis}',
          'Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ',
          'Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω',
          '{shift} {space} {backspace}'
        ]
      },
      
      // MEJORA: Se define cómo se deben mostrar las nuevas teclas de función.
      display: {
        '{shift}': 'MAYÚSCULA',
        '{space}': 'Espacio',
        '{backspace}': 'Borrar',
        '{acute}': '´',
        '{grave}': '`',
        '{circumflex}': '~',
        '{psili}': 'ʼ',
        '{dasia}': 'ʽ',
        '{iota}': 'ͅ',
        '{dieresis}': '¨'
      }
    });
  }

  const handleShift = () => {
    const currentLayout = keyboard.options.layoutName;
    const shiftToggle = currentLayout === "default" ? "shift" : "default";
    keyboard.setOptions({ layoutName: shiftToggle });
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

  // ----------- Lógica de Modales, Descarga y Sincronización (sin cambios) -----------

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

  document.addEventListener('input', (event) => {
    if (event.target.classList.contains('greek-input') && keyboard && activeInput === event.target) {
      keyboard.setInput(event.target.value);
    }
  });

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