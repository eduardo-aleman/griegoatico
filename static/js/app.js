// static/js/app.js - VERSIÓN FINAL CON CORRECCIÓN DE ERROR
document.addEventListener("DOMContentLoaded", () => {
    
    // PRUEBA DE VERSIÓN: Revisa la consola de tu navegador para ver este mensaje.
    console.log("--- Cargando app.js v5 ---");

    // --- INICIO DE LA CORRECCIÓN ---
    const keyboardContainer = document.getElementById("virtual-keyboard");
    // Si el contenedor del teclado no existe en esta página, no hagas nada más.
    if (!keyboardContainer) {
        return; 
    }
    // --- FIN DE LA CORRECCIÓN ---

    if (!window.SimpleKeyboard) { return; }

    const Keyboard = window.SimpleKeyboard.default;
    
    // Pasamos la variable 'keyboardContainer' que ya hemos definido
    const keyboard = new Keyboard(keyboardContainer, {
        onChange: input => onChange(input),
        onKeyPress: button => onKeyPress(button),
        layout: {
            'default': [
                'ς ε ρ τ υ θ ι ο π',
                'α σ δ φ γ η ξ κ λ',
                'ζ χ ψ ω β ν μ',
                '{shift} {space} {diacritics} {backspace}'
            ],
            'shift': [
                'Ε Ρ Τ Υ Θ Ι Ο Π',
                'Α Σ Δ Φ Γ Η Ξ Κ Λ',
                'Ζ Χ Ψ Ω Β Ν Μ',
                '{shift} {space} {diacritics} {backspace}'
            ],
            'diacritics': [
                'ά έ ή ί ό ύ ώ', 'ᾶ ῆ ῖ ῦ ῶ', 'ὰ ὲ ὴ ὶ ὸ ὺ ὼ',
                'ἄ ἔ ἤ ἴ ὄ ὔ ὤ', 'ἅ ἕ ἥ ἵ ὅ ὕ ὥ', 'ἆ ἦ ἶ ὖ ὦ', 'ἇ ἧ ἷ ὗ ὧ',
                '· ; , . ᾽ ῾ ῀ ´ ` ͅ', '{default} {space} {backspace}'
            ]
        },
        display: {
            '{shift}': 'MAYÚS',
            '{space}': 'ESPACIO',
            '{backspace}': 'BORRAR',
            '{diacritics}': 'Á Έ ῏',
            '{default}': 'α β γ'
        }
    });

    let activeInput = null;
    const inputs = document.querySelectorAll('.greek-input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', (event) => {
            activeInput = event.target;
        });

        input.addEventListener('input', (event) => {
            keyboard.setInput(event.target.value);
        });
    });

    function onChange(input) { if (activeInput) { activeInput.value = input; } }

    function onKeyPress(button) {
        if (button === "{shift}") {
            const shiftToggle = keyboard.options.layoutName === "default" ? "shift" : "default";
            keyboard.setOptions({ layoutName: shiftToggle });
            return;
        }

        if (button === "{diacritics}" || button === "{default}") {
            const newLayout = keyboard.options.layoutName.includes("diacritics") ? "default" : "diacritics";
            keyboard.setOptions({ layoutName: newLayout });
            return;
        }
        
        if (keyboard.options.layoutName === "shift") {
            keyboard.setOptions({ layoutName: "default" });
        }
    }

    const downloadBtn = document.getElementById('download-button');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            let fullText = `Respuestas para la lección: ${document.querySelector('.lesson h2').innerText}\n\n`;
            document.querySelectorAll('.exercise').forEach((exercise, index) => {
                const q = exercise.querySelector('label').innerText;
                const a = exercise.querySelector('textarea').value;
                fullText += `--- Pregunta ${index + 1} ---\n${q}\nRespuesta: ${a || '(Sin respuesta)'}\n\n`;
            });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(new Blob([fullText], { type: 'text/plain;charset=utf-8' }));
            link.download = 'mis_respuestas_griego.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});