/**
 * Mailyn Cordero - Professional Developer Portfolio Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Terminal Typing Effect
    // ----------------------------------------------------
    const typedTextSpan = document.getElementById('typed-text');
    const textArray = [
        "Junior Backend Developer", 
        "Python & SQL Enthusiast", 
        "Linux & Git Specialist", 
        "Problem Solver"
    ];
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const newTextDelay = 2000; // Delay between texts
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingSpeed + 500);
        }
    }

    // Start the typing effect
    if (typedTextSpan) {
        setTimeout(type, 1000);
    }

    // ----------------------------------------------------
    // 2. Navigation & Mobile Menu
    // ----------------------------------------------------
    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Toggle Mobile Menu
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close Menu on Link Click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    // ----------------------------------------------------
    // 3. Scroll Highlighting Active Link
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section');
    
    function highlightActiveSection() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']')?.classList.add('active');
            } else {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']')?.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection);

    // ----------------------------------------------------
    // 4. Copy-to-Clipboard Email Feature
    // ----------------------------------------------------
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailAddressElement = document.getElementById('email-address');
    const copyTooltip = document.getElementById('copy-tooltip');

    if (copyEmailBtn && emailAddressElement && copyTooltip) {
        copyEmailBtn.addEventListener('click', () => {
            const emailText = emailAddressElement.textContent.trim();
            
            // Clipboard API
            navigator.clipboard.writeText(emailText).then(() => {
                // Show tooltip
                copyTooltip.classList.add('show');
                copyEmailBtn.innerHTML = '<i class="fa-solid fa-check" style="color: var(--accent-green)"></i>';
                
                // Hide tooltip after 2.5 seconds
                setTimeout(() => {
                    copyTooltip.classList.remove('show');
                    copyEmailBtn.innerHTML = '<i class="fa-solid fa-copy"></i>';
                }, 2500);
            }).catch(err => {
                console.error('Error al copiar el texto: ', err);
            });
        });
    }

    // ----------------------------------------------------
    // 5. Contact Form – Real Email via Formspree
    // ----------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formStatus  = document.getElementById('form-status');
    const submitBtn   = document.getElementById('form-submit-btn');

    // Formspree endpoint
    const FORMSPREE_URL = 'https://formspree.io/f/xzdlajqn';

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Client-side validation
            const nameVal    = document.getElementById('form-name').value.trim();
            const emailVal   = document.getElementById('form-email').value.trim();
            const messageVal = document.getElementById('form-message').value.trim();

            if (!nameVal || !emailVal || !messageVal) {
                formStatus.className = 'form-status error';
                formStatus.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Por favor, completa todos los campos.';
                return;
            }

            // Email format check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailVal)) {
                formStatus.className = 'form-status error';
                formStatus.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Por favor, ingresa un correo válido.';
                return;
            }

            // Loading state
            formStatus.className = 'form-status';
            formStatus.textContent = '';
            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'Enviando...';
            submitBtn.querySelector('i').className = 'fa-solid fa-spinner fa-spin';

            try {
                const response = await fetch(FORMSPREE_URL, {
                    method:  'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept':       'application/json'
                    },
                    body: JSON.stringify({
                        name:    nameVal,
                        email:   emailVal,
                        message: messageVal
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    // ✅ Formspree returns HTTP 200 on success
                    formStatus.className = 'form-status success';
                    formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.';
                    contactForm.reset();
                } else {
                    // ❌ Formspree returned an error (e.g. 422 validation)
                    console.error('Formspree error:', result);
                    const errMsg = result.errors
                        ? result.errors.map(e => e.message).join(', ')
                        : 'Error desconocido';
                    formStatus.className = 'form-status error';
                    formStatus.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${errMsg}. Intenta de nuevo o escríbeme directamente.`;
                }
            } catch (err) {
                // 🌐 Network / fetch error
                console.error('Fetch error:', err);
                formStatus.className = 'form-status error';
                formStatus.innerHTML = '<i class="fa-solid fa-wifi"></i> Error de conexión. Verifica tu internet e intenta de nuevo.';
            } finally {
                // Always re-enable the button
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = 'Enviar Mensaje';
                submitBtn.querySelector('i').className = 'fa-solid fa-paper-plane';

                // Auto-clear status after 6 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }, 6000);
            }
        });
    }
});

// ----------------------------------------------------
// 6. Interactive Terminal Widget Logic (Global Context)
// ----------------------------------------------------
function runTerminalCommand(commandText) {
    const terminalBody = document.getElementById('terminal-body');
    const userInput = document.getElementById('terminal-user-input');
    if (!terminalBody) return;

    // Clean inputs
    const cleanCmd = commandText.trim().toLowerCase();
    
    // Create new line echoing user command
    const echoLine = document.createElement('div');
    echoLine.className = 'terminal-line';
    echoLine.innerHTML = `<span class="terminal-prompt">mailyn@portfolio:~$</span> <span class="terminal-cmd">${commandText}</span>`;
    
    // Insert echoLine before the input line
    const inputLineElement = terminalBody.querySelector('.input-line');
    terminalBody.insertBefore(echoLine, inputLineElement);

    // Create output element
    const outputElement = document.createElement('div');
    outputElement.className = 'terminal-output';

    // Command interpreter
    switch (cleanCmd) {
        case 'clear':
            // Remove previous outputs and lines
            const lines = terminalBody.querySelectorAll('.terminal-line:not(.input-line)');
            const outputs = terminalBody.querySelectorAll('.terminal-output');
            lines.forEach(l => l.remove());
            outputs.forEach(o => o.remove());
            if (userInput) userInput.value = '';
            return; // Exit directly
            
        case 'help':
        case '?':
            outputElement.className += ' help-output';
            outputElement.innerHTML = `
Comandos disponibles:
  <button class="term-btn-link" onclick="runTerminalCommand('skills')">skills</button>    - Muestra habilidades técnicas principales
  <button class="term-btn-link" onclick="runTerminalCommand('projects')">projects</button>  - Muestra proyectos de desarrollo
  <button class="term-btn-link" onclick="runTerminalCommand('contact')">contact</button>   - Muestra datos de contacto directos
  <button class="term-btn-link" onclick="runTerminalCommand('clear')">clear</button>     - Limpia la terminal
            `;
            break;
            
        case 'skills':
            outputElement.innerHTML = `
<strong class="text-success">[ Habilidades Principales ]</strong>
• <strong>Python</strong>: Paradigma POO, Scripts automatizados, Estructuración
• <strong>SQL</strong>: Bases de datos relacionales, Consultas complejas, MySQL
• <strong>Git / GitHub</strong>: Ramas, Resolución de conflictos (Merging), Control de versiones
• <strong>Linux</strong>: Operaciones en consola CLI, Bash scripting
• <strong>Metodologías</strong>: Scrum, Flujos ágiles en equipo
            `;
            break;
            
        case 'projects':
            outputElement.innerHTML = `
<strong class="text-success">[ Proyectos Recientes ]</strong>
1. <strong>Inventory Management System</strong> (Python, CRUD, Git)
   - Sistema de inventario modular backend. Enfoque en lógica pura.
   - Enlace: <a href="https://github.com" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">Ver código en GitHub</a>

2. <strong>Esquemas SQL & Triggers</strong> (MySQL, Optimización)
   - Diseños académicos enfocados en consistencia e integridad.
            `;
            break;
            
        case 'contact':
            outputElement.innerHTML = `
<strong class="text-success">[ Datos de Contacto ]</strong>
• <strong>Email</strong>: elenacordero18@hotmail.com
• <strong>LinkedIn</strong>: linkedin.com/in/mailyndev
• <strong>Ubicación</strong>: San Ramón, Alajuela, Costa Rica
            `;
            break;
            
        default:
            outputElement.innerHTML = `<span style="color: var(--accent-red)">Comando no encontrado: "${commandText}". Escribe 'help' para ver los comandos.</span>`;
            break;
    }

    // Insert output before input line
    terminalBody.insertBefore(outputElement, inputLineElement);

    // Clear input field
    if (userInput) {
        userInput.value = '';
    }

    // Auto-scroll to bottom of the terminal
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Attach event listener for physical input typing
document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('terminal-user-input');
    if (userInput) {
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = userInput.value;
                if (cmd.trim() !== '') {
                    runTerminalCommand(cmd);
                }
            }
        });
    }
});
