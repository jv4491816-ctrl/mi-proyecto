// ========== NAVEGACIÓN ENTRE PÁGINAS ==========
const navLinks = document.querySelectorAll('.nav-link, .back-btn, .feature-card');
const pages = document.querySelectorAll('.page');
const menuToggle = document.getElementById('menuToggle');
const navLinksContainer = document.getElementById('navLinks');

// Función para cambiar de página
function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
    
    history.pushState({page: pageId}, '', `#${pageId}`);
    
    // Cerrar menú en móvil
    if (window.innerWidth <= 768) {
        navLinksContainer.classList.remove('active');
    }
    
    // Inicializar herramientas específicas si es necesario
    if (pageId === 'afinacion-tips') {
        initAfinador();
    } else if (pageId === 'metronomo') {
        initMetronomo();
    }
}

// Event listeners para navegación
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const pageId = this.getAttribute('data-page');
        showPage(pageId);
    });
});

// Menú hamburguesa
menuToggle.addEventListener('click', function() {
    navLinksContainer.classList.toggle('active');
});

// Cargar página basada en hash
const initialPage = window.location.hash.substring(1) || 'index';
showPage(initialPage);

// ========== SISTEMA DE AUTENTICACIÓN MEJORADO ==========
const loginModal = document.getElementById('loginModal');
const modalFormSection = document.getElementById('modalFormSection');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalSignupBtn = document.getElementById('modalSignupBtn');
const modalLoginBtn = document.getElementById('modalLoginBtn');
const studentLoginBtn = document.getElementById('student-login-btn');
const adminLoginBtn = document.getElementById('admin-login-btn');
const logoutBtn = document.getElementById('logout-btn');
const authButtons = document.getElementById('auth-buttons');
const userInfo = document.getElementById('user-info');
const userName = document.getElementById('user-name');
const userRole = document.getElementById('user-role');

let currentFormType = 'login';
let currentUser = null;

// Cargar usuario desde localStorage
function loadUserFromStorage() {
    const savedUser = localStorage.getItem('guitarraFacilUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForUser(currentUser);
    }
}

// Actualizar UI según usuario
function updateUIForUser(user) {
    if (user) {
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        userName.textContent = user.name;
        userRole.textContent = user.role === 'admin' ? 'Administrador' : 'Estudiante';
        
        // Mostrar contenido específico
        const studentElements = document.querySelectorAll('.student-only');
        const adminElements = document.querySelectorAll('.admin-only');
        
        if (user.role === 'admin') {
            studentElements.forEach(el => el.style.display = 'none');
            adminElements.forEach(el => el.style.display = 'block');
            document.getElementById('admin-welcome-name').textContent = user.name;
        } else {
            studentElements.forEach(el => el.style.display = 'block');
            adminElements.forEach(el => el.style.display = 'none');
            document.getElementById('student-welcome-name').textContent = user.name;
        }
    } else {
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
        document.querySelectorAll('.student-only, .admin-only').forEach(el => el.style.display = 'none');
    }
}

// Cargar formulario en el modal
function loadForm(formType) {
    currentFormType = formType;
    
    if (formType === 'login') {
        modalFormSection.innerHTML = `
            <div class="modal-form-header">
                <h2>Bienvenido de vuelta</h2>
                <p>Accede a tu cuenta para continuar tu aprendizaje</p>
            </div>
            
            <form id="modalLoginForm">
                <div class="modal-form-group">
                    <label for="modalUsername">Email o Usuario</label>
                    <div class="modal-input-with-icon" id="modalUsernameContainer">
                        <i class="fas fa-user"></i>
                        <input type="text" id="modalUsername" placeholder="Ingresa tu email o usuario" required>
                    </div>
                    <span class="error-message" id="modalUsernameError"></span>
                </div>
                
                <div class="modal-form-group">
                    <label for="modalPassword">Contraseña</label>
                    <div class="modal-input-with-icon" id="modalPasswordContainer">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="modalPassword" placeholder="Ingresa tu contraseña" required>
                        <button type="button" id="togglePasswordBtn" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--primary-color); cursor: pointer;">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <span class="error-message" id="modalPasswordError"></span>
                </div>
                
                <div class="modal-forgot-password">
                    <a href="#" id="modalForgotPassword">¿Olvidaste tu contraseña?</a>
                </div>
                
                <button type="submit" id="modalSubmitBtn" class="modal-submit-btn">
                    <span>INICIAR SESIÓN</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            </form>
            
            <div class="modal-separator">
                <span>O continúa con</span>
            </div>
            
            <div class="modal-social-login">
                <div class="modal-social-btn google">
                    <i class="fab fa-google"></i>
                </div>
                <div class="modal-social-btn facebook">
                    <i class="fab fa-facebook-f"></i>
                </div>
                <div class="modal-social-btn apple">
                    <i class="fab fa-apple"></i>
                </div>
            </div>
            
            <div class="modal-signup-link">
                ¿No tienes una cuenta? <a href="#" id="modalSwitchToSignup">REGÍSTRATE</a>
            </div>
        `;
    } else {
        modalFormSection.innerHTML = `
            <div class="modal-form-header">
                <h2>Únete a nuestra comunidad</h2>
                <p>Crea tu cuenta para comenzar tu viaje musical</p>
            </div>
            
            <form id="modalSignupForm">
                <div class="modal-form-group">
                    <label for="modalSignupName">Nombre completo</label>
                    <div class="modal-input-with-icon" id="modalSignupNameContainer">
                        <i class="fas fa-user"></i>
                        <input type="text" id="modalSignupName" placeholder="Ingresa tu nombre completo" required>
                    </div>
                    <span class="error-message" id="modalSignupNameError"></span>
                </div>
                
                <div class="modal-form-group">
                    <label for="modalSignupEmail">Email</label>
                    <div class="modal-input-with-icon" id="modalSignupEmailContainer">
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="modalSignupEmail" placeholder="Ingresa tu email" required>
                    </div>
                    <span class="error-message" id="modalSignupEmailError"></span>
                </div>
                
                <div class="modal-form-group">
                    <label for="modalSignupPassword">Contraseña</label>
                    <div class="modal-input-with-icon" id="modalSignupPasswordContainer">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="modalSignupPassword" placeholder="Crea una contraseña segura" required>
                        <button type="button" id="toggleSignupPasswordBtn" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--primary-color); cursor: pointer;">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <span class="error-message" id="modalSignupPasswordError"></span>
                </div>
                
                <button type="submit" id="modalSignupSubmitBtn" class="modal-submit-btn">
                    <span>CREAR CUENTA</span>
                    <i class="fas fa-user-plus"></i>
                </button>
            </form>
            
            <div class="modal-separator">
                <span>O regístrate con</span>
            </div>
            
            <div class="modal-social-login">
                <div class="modal-social-btn google">
                    <i class="fab fa-google"></i>
                </div>
                <div class="modal-social-btn facebook">
                    <i class="fab fa-facebook-f"></i>
                </div>
                <div class="modal-social-btn apple">
                    <i class="fab fa-apple"></i>
                </div>
            </div>
            
            <div class="modal-signup-link">
                ¿Ya tienes una cuenta? <a href="#" id="modalSwitchToLogin">INICIA SESIÓN</a>
            </div>
        `;
    }
    
    // Configurar eventos para el formulario cargado
    setupFormEvents();
}

// Configurar eventos para el formulario
function setupFormEvents() {
    if (currentFormType === 'login') {
        const loginForm = document.getElementById('modalLoginForm');
        const usernameInput = document.getElementById('modalUsername');
        const passwordInput = document.getElementById('modalPassword');
        const togglePasswordBtn = document.getElementById('togglePasswordBtn');
        const submitBtn = document.getElementById('modalSubmitBtn');
        const switchToSignup = document.getElementById('modalSwitchToSignup');
        const forgotPassword = document.getElementById('modalForgotPassword');
        
        // Toggle password visibility
        togglePasswordBtn?.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
        
        // Switch to signup
        switchToSignup?.addEventListener('click', function(e) {
            e.preventDefault();
            loadForm('signup');
        });
        
        // Forgot password
        forgotPassword?.addEventListener('click', function(e) {
            e.preventDefault();
            handleForgotPassword();
        });
        
        // Login form submission
        loginForm?.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    } else {
        const signupForm = document.getElementById('modalSignupForm');
        const passwordInput = document.getElementById('modalSignupPassword');
        const togglePasswordBtn = document.getElementById('toggleSignupPasswordBtn');
        const submitBtn = document.getElementById('modalSignupSubmitBtn');
        const switchToLogin = document.getElementById('modalSwitchToLogin');
        
        // Toggle password visibility
        togglePasswordBtn?.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
        
        // Switch to login
        switchToLogin?.addEventListener('click', function(e) {
            e.preventDefault();
            loadForm('login');
        });
        
        // Signup form submission
        signupForm?.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }
}

// Manejar login
async function handleLogin() {
    const username = document.getElementById('modalUsername')?.value.trim();
    const password = document.getElementById('modalPassword')?.value;
    const submitBtn = document.getElementById('modalSubmitBtn');
    
    // Simular proceso de login
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin loading-spinner"></i> Iniciando sesión...';
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Credenciales de demostración
    const demoCredentials = [
        { username: 'estudiante@demo.com', password: '123456', name: 'Estudiante Demo', role: 'student' },
        { username: 'admin@demo.com', password: 'admin123', name: 'Administrador Demo', role: 'admin' },
        { username: 'usuario', password: '123456', name: 'Usuario Regular', role: 'student' }
    ];
    
    const user = demoCredentials.find(
        cred => (cred.username === username || cred.name.toLowerCase().includes(username.toLowerCase())) && 
               cred.password === password
    );
    
    if (user) {
        // Login exitoso
        currentUser = user;
        localStorage.setItem('guitarraFacilUser', JSON.stringify(user));
        updateUIForUser(user);
        
        submitBtn.classList.remove('error-btn');
        submitBtn.classList.add('success-btn');
        submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Éxito!';
        
        setTimeout(() => {
            closeModal();
            alert(`¡Bienvenido de nuevo, ${user.name}!`);
        }, 500);
    } else {
        // Credenciales incorrectas
        submitBtn.classList.remove('success-btn');
        submitBtn.classList.add('error-btn');
        submitBtn.innerHTML = '<i class="fas fa-times"></i> Error';
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.classList.remove('error-btn');
            submitBtn.innerHTML = '<span>INICIAR SESIÓN</span><i class="fas fa-arrow-right"></i>';
            alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        }, 500);
    }
}

// Manejar registro
async function handleSignup() {
    const name = document.getElementById('modalSignupName').value.trim();
    const email = document.getElementById('modalSignupEmail').value.trim();
    const password = document.getElementById('modalSignupPassword').value;
    const submitBtn = document.getElementById('modalSignupSubmitBtn');
    
    // Simular proceso de registro
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin loading-spinner"></i> Creando cuenta...';
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Registrar nuevo usuario
    currentUser = {
        name: name,
        email: email,
        role: 'student',
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUser));
    updateUIForUser(currentUser);
    
    submitBtn.classList.remove('error-btn');
    submitBtn.classList.add('success-btn');
    submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Cuenta creada!';
    
    setTimeout(() => {
        closeModal();
        alert(`¡Bienvenido a Guitarra Fácil, ${name}! Tu cuenta ha sido creada exitosamente.`);
    }, 500);
}

// Manejar "Olvidé mi contraseña"
function handleForgotPassword() {
    const email = prompt('Por favor, ingresa tu email para recuperar tu contraseña:');
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert(`Se ha enviado un enlace de recuperación a: ${email}\n\n(Esta es una demostración. En una aplicación real se enviaría un email real.)`);
    } else if (email) {
        alert('Por favor, ingresa un email válido.');
    }
}

// Manejar logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('guitarraFacilUser');
    updateUIForUser(null);
    alert('Sesión cerrada exitosamente.');
}

// Abrir modal
function openModal(formType = 'login') {
    loadForm(formType);
    loginModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cerrar modal
function closeModal() {
    loginModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event Listeners
studentLoginBtn?.addEventListener('click', () => openModal('login'));
adminLoginBtn?.addEventListener('click', () => openModal('login'));
modalCloseBtn?.addEventListener('click', closeModal);
modalSignupBtn?.addEventListener('click', () => openModal('signup'));
modalLoginBtn?.addEventListener('click', () => openModal('login'));
logoutBtn?.addEventListener('click', handleLogout);

// Cerrar modal al hacer clic fuera
loginModal?.addEventListener('click', function(e) {
    if (e.target === loginModal) {
        closeModal();
    }
});

// Cargar usuario al iniciar
loadUserFromStorage();

// ========== AFINADOR MEJORADO ==========
// Configuración de cuerdas
const STRINGS = {
    'mi-high': {
        frequency: 329.63,
        note: 'E4',
        name: '1ª Cuerda - MI',
        range: { low: 280, high: 400 }
    },
    'si': {
        frequency: 246.94,
        note: 'B3',
        name: '2ª Cuerda - SI',
        range: { low: 200, high: 320 }
    },
    'sol': {
        frequency: 196.00,
        note: 'G3',
        name: '3ª Cuerda - SOL',
        range: { low: 160, high: 260 }
    },
    're': {
        frequency: 146.83,
        note: 'D3',
        name: '4ª Cuerda - RE',
        range: { low: 120, high: 200 }
    },
    'la': {
        frequency: 110.00,
        note: 'A2',
        name: '5ª Cuerda - LA',
        range: { low: 90, high: 150 }
    },
    'mi-low': {
        frequency: 82.41,
        note: 'E2',
        name: '6ª Cuerda - MI',
        range: { low: 65, high: 120 }
    }
};

// Estado de la aplicación
const state = {
    audioContext: null,
    analyser: null,
    microphone: null,
    isListening: false,
    animationId: null,
    signalStrength: 0,
    frequencyHistory: [],
    lastValidDetection: null,
    currentString: 'mi-high',
    debugInfo: ''
};

// Elementos DOM del afinador
const elementsAfinador = {
    circleIndicator: document.getElementById('circleIndicator'),
    deviationText: document.getElementById('deviationText'),
    frequencyDisplay: document.getElementById('frequencyDisplay'),
    centsDisplay: document.getElementById('centsDisplay'),
    needle: document.getElementById('needle'),
    micToggle: document.getElementById('micToggle'),
    micStatus: document.getElementById('micStatus'),
    statusText: document.getElementById('statusText'),
    qualityLevel: document.getElementById('qualityLevel'),
    qualityValue: document.getElementById('qualityValue'),
    targetFrequency: document.getElementById('targetFrequency')
};

// Inicializar afinador
function initAfinador() {
    if (!elementsAfinador.circleIndicator) return;
    
    setupEventListenersAfinador();
    updateStringDisplayAfinador();
}

// Configurar event listeners del afinador
function setupEventListenersAfinador() {
    // Botón de micrófono
    elementsAfinador.micToggle?.addEventListener('click', toggleMicrophoneAfinador);
    
    // Botones de selección de cuerda
    document.querySelectorAll('.string-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectStringAfinador(this.dataset.string);
        });
    });
}

// Seleccionar cuerda en el afinador
function selectStringAfinador(stringType) {
    state.currentString = stringType;
    state.frequencyHistory = [];
    state.lastValidDetection = null;
    
    // Actualizar botones activos
    document.querySelectorAll('.string-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`.string-btn[data-string="${stringType}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Actualizar display
    updateStringDisplayAfinador();
    resetDisplayAfinador();
}

// Actualizar display según la cuerda seleccionada
function updateStringDisplayAfinador() {
    const string = STRINGS[state.currentString];
    if (elementsAfinador.targetFrequency) {
        elementsAfinador.targetFrequency.innerHTML = 
            `Frecuencia objetivo: <strong>${string.frequency} Hz</strong> (${string.note})`;
    }
    if (elementsAfinador.circleIndicator) {
        elementsAfinador.circleIndicator.textContent = string.note;
    }
    if (elementsAfinador.statusText) {
        elementsAfinador.statusText.textContent = `Seleccionada: ${string.name} - Activa el micrófono`;
    }
}

// Alternar micrófono del afinador
async function toggleMicrophoneAfinador() {
    if (!state.isListening) {
        try {
            await startListeningAfinador();
        } catch (error) {
            console.error('Error al acceder al micrófono:', error);
            alert('No se pudo acceder al micrófono. Asegúrate de permitir el acceso.');
        }
    } else {
        stopListeningAfinador();
    }
}

// Iniciar escucha por micrófono en el afinador
async function startListeningAfinador() {
    try {
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Configurar analizador
        state.analyser = state.audioContext.createAnalyser();
        state.analyser.fftSize = 8192;
        state.analyser.smoothingTimeConstant = 0.5;
        
        // Obtener stream de micrófono
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            }
        });
        
        // Conectar micrófono -> analizador
        state.microphone = state.audioContext.createMediaStreamSource(stream);
        state.microphone.connect(state.analyser);
        
        state.isListening = true;
        if (elementsAfinador.micStatus) {
            elementsAfinador.micStatus.textContent = 'Desactivar Micrófono';
        }
        if (elementsAfinador.micToggle) {
            elementsAfinador.micToggle.classList.add('listening');
        }
        
        const string = STRINGS[state.currentString];
        if (elementsAfinador.statusText) {
            elementsAfinador.statusText.textContent = `🎵 Toca la ${string.name} ahora`;
        }
        
        analyzeAudioAfinador();
        
    } catch (error) {
        console.error('Error en configuración de audio:', error);
        throw error;
    }
}

// Detener escucha por micrófono en el afinador
function stopListeningAfinador() {
    if (state.animationId) {
        cancelAnimationFrame(state.animationId);
        state.animationId = null;
    }
    
    if (state.microphone) {
        state.microphone.disconnect();
        state.microphone = null;
    }
    
    if (state.audioContext) {
        state.audioContext.close();
        state.audioContext = null;
    }
    
    state.isListening = false;
    state.frequencyHistory = [];
    state.lastValidDetection = null;
    if (elementsAfinador.micStatus) {
        elementsAfinador.micStatus.textContent = 'Activar Micrófono';
    }
    if (elementsAfinador.micToggle) {
        elementsAfinador.micToggle.classList.remove('listening');
    }
    
    const string = STRINGS[state.currentString];
    if (elementsAfinador.statusText) {
        elementsAfinador.statusText.textContent = `Micrófono desactivado - ${string.name}`;
    }
    
    resetDisplayAfinador();
}

// Resetear display del afinador
function resetDisplayAfinador() {
    if (elementsAfinador.circleIndicator) {
        elementsAfinador.circleIndicator.className = 'circle-indicator';
    }
    if (elementsAfinador.deviationText) {
        elementsAfinador.deviationText.textContent = 'Activa el micrófono';
    }
    if (elementsAfinador.frequencyDisplay) {
        elementsAfinador.frequencyDisplay.textContent = '-- Hz';
    }
    if (elementsAfinador.centsDisplay) {
        elementsAfinador.centsDisplay.textContent = '-- cents';
    }
    if (elementsAfinador.needle) {
        elementsAfinador.needle.style.transform = 'rotate(0deg)';
    }
    if (elementsAfinador.qualityLevel) {
        elementsAfinador.qualityLevel.style.width = '0%';
    }
    if (elementsAfinador.qualityValue) {
        elementsAfinador.qualityValue.textContent = '0%';
    }
}

// Añadir frecuencia al historial para promedio móvil
function addToFrequencyHistory(frequency) {
    state.frequencyHistory.push(frequency);
    
    if (state.frequencyHistory.length > 8) {
        state.frequencyHistory.shift();
    }
}

// Calcular promedio móvil de frecuencias
function calculateMovingAverage() {
    if (state.frequencyHistory.length === 0) return 0;
    
    const sum = state.frequencyHistory.reduce((a, b) => a + b, 0);
    return sum / state.frequencyHistory.length;
}

// Convertir diferencia de frecuencia a cents
function frequencyToCents(frequency, targetFrequency) {
    return 1200 * Math.log2(frequency / targetFrequency);
}

// Analizar audio en el afinador
function analyzeAudioAfinador() {
    if (!state.isListening) return;

    const bufferLength = state.analyser.fftSize;
    const dataArray = new Float32Array(bufferLength);
    state.analyser.getFloatTimeDomainData(dataArray);
    
    // Detectar frecuencia (simplificado para demostración)
    // En una implementación real usarías un algoritmo como autocorrelación o FFT
    const detection = detectFrequency(dataArray, state.audioContext.sampleRate);
    
    if (detection.valid) {
        state.signalStrength = detection.strength;
        state.lastValidDetection = detection.frequency;
        
        // Añadir al historial y calcular promedio móvil
        addToFrequencyHistory(detection.frequency);
        const smoothedFrequency = calculateMovingAverage();
        
        updateDisplayAfinador(smoothedFrequency);
    }
    
    state.animationId = requestAnimationFrame(analyzeAudioAfinador);
}

// Función simplificada de detección de frecuencia
function detectFrequency(dataArray, sampleRate) {
    // Esta es una versión simplificada para demostración
    // En producción, usarías un algoritmo de detección de pitch real
    
    // Calcular energía de la señal
    let energy = 0;
    for (let i = 0; i < dataArray.length; i++) {
        energy += dataArray[i] * dataArray[i];
    }
    energy = energy / dataArray.length;
    
    if (energy < 0.001) {
        return { valid: false, frequency: 0, strength: energy };
    }
    
    // Para demostración: generar una frecuencia aleatoria cerca del objetivo
    const string = STRINGS[state.currentString];
    const randomOffset = (Math.random() - 0.5) * 20; // ±10 Hz
    const simulatedFrequency = string.frequency + randomOffset;
    const simulatedStrength = Math.min(energy * 10, 1);
    
    return { 
        valid: true, 
        frequency: simulatedFrequency, 
        strength: simulatedStrength 
    };
}

// Actualizar display con la frecuencia detectada
function updateDisplayAfinador(frequency) {
    const string = STRINGS[state.currentString];
    
    // Calcular diferencia en cents
    const cents = frequencyToCents(frequency, string.frequency);
    
    // Redondear a números enteros
    const displayFrequency = Math.round(frequency);
    const displayCents = Math.round(cents);
    
    // Actualizar displays
    if (elementsAfinador.frequencyDisplay) {
        elementsAfinador.frequencyDisplay.textContent = `${displayFrequency} Hz`;
    }
    if (elementsAfinador.centsDisplay) {
        elementsAfinador.centsDisplay.textContent = `${cents > 0 ? '+' : ''}${displayCents} cents`;
    }
    
    // Actualizar calidad de señal
    const qualityPercent = Math.min(state.signalStrength * 100, 100);
    if (elementsAfinador.qualityLevel) {
        elementsAfinador.qualityLevel.style.width = `${qualityPercent}%`;
    }
    if (elementsAfinador.qualityValue) {
        elementsAfinador.qualityValue.textContent = `${Math.round(qualityPercent)}%`;
    }
    
    // Actualizar aguja
    updateNeedleAfinador(cents);
    
    // Actualizar círculo y texto según la desviación
    updateDeviationDisplayAfinador(cents, string);
}

// Actualizar posición de la aguja
function updateNeedleAfinador(cents) {
    if (!elementsAfinador.needle) return;
    
    const maxDisplayCents = 50;
    const limitedCents = Math.max(Math.min(cents, maxDisplayCents), -maxDisplayCents);
    const rotation = (limitedCents / maxDisplayCents) * 90;
    elementsAfinador.needle.style.transform = `rotate(${rotation}deg)`;
}

// Actualizar display de desviación
function updateDeviationDisplayAfinador(cents, string) {
    const absCents = Math.abs(cents);
    let status, colorClass, text;
    
    if (absCents <= 8) {
        status = 'perfect';
        colorClass = 'perfect';
        text = `¡Perfecto!`;
        if (elementsAfinador.statusText) {
            elementsAfinador.statusText.innerHTML = `🎵 <strong>¡${string.note} perfectamente afinado!</strong>`;
        }
    } else if (absCents <= 20) {
        status = 'warning';
        colorClass = cents > 0 ? 'sharp' : 'flat';
        text = cents > 0 ? 'Agudo' : 'Grave';
        if (elementsAfinador.statusText) {
            elementsAfinador.statusText.textContent = cents > 0 ? 
                `🎵 ${string.note} un poco AGUDO - Afloja ligeramente` : 
                `🎵 ${string.note} un poco GRAVE - Aprieta ligeramente`;
        }
    } else {
        status = 'out';
        colorClass = cents > 0 ? 'sharp' : 'flat';
        text = cents > 0 ? 'Muy agudo' : 'Muy grave';
        if (elementsAfinador.statusText) {
            elementsAfinador.statusText.textContent = cents > 0 ? 
                `🎵 ${string.note} muy AGUDO - Afloja la clavija` : 
                `🎵 ${string.note} muy GRAVE - Aprieta la clavija`;
        }
    }
    
    // Aplicar cambios al display
    if (elementsAfinador.circleIndicator) {
        elementsAfinador.circleIndicator.className = `circle-indicator ${colorClass}`;
    }
    if (elementsAfinador.deviationText) {
        elementsAfinador.deviationText.textContent = text;
    }
}

// ========== METRÓNOMO MEJORADO ==========
// Variables del metrónomo
let metronomo = {
    isPlaying: false,
    bpm: 120,
    timeSignatureTop: 4,
    subdivision: 1,
    beatCount: 0,
    timer: null,
    tapTimes: [],
    audioContext: null
};

// Elementos del DOM del metrónomo
const metronomoElements = {
    bpmValue: document.getElementById('bpmValue'),
    currentBpm: document.getElementById('currentBpm'),
    bpmSlider: document.getElementById('bpmSlider'),
    timeTop: document.getElementById('timeTop'),
    startBtn: document.getElementById('startBtn'),
    stopBtn: document.getElementById('stopBtn'),
    tapTempoBtn: document.getElementById('tapTempoBtn'),
    beatDisplay: document.getElementById('beatDisplay'),
    subdivisionButtons: document.getElementById('subdivisionButtons')
};

// Inicializar el metrónomo
function initMetronomo() {
    if (!metronomoElements.bpmValue) return;
    
    // Contexto de audio
    metronomo.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Inicializar display de compás
    initBeatDisplayMetronomo();
    
    // Event Listeners del metrónomo
    setupMetronomoEventListeners();
    
    // Teclado shortcuts
    document.addEventListener('keydown', handleMetronomoKeyboardShortcuts);
    
    // Asegurarse de que el audio context se active con un clic del usuario
    document.body.addEventListener('click', function() {
        if (metronomo.audioContext && metronomo.audioContext.state === 'suspended') {
            metronomo.audioContext.resume();
        }
    }, { once: true });
}

// Configurar event listeners del metrónomo
function setupMetronomoEventListeners() {
    // Slider de BPM
    metronomoElements.bpmSlider?.addEventListener('input', () => {
        setBpmMetronomo(parseInt(metronomoElements.bpmSlider.value));
    });
    
    // Compás
    metronomoElements.timeTop?.addEventListener('change', () => {
        setTimeSignatureMetronomo(parseInt(metronomoElements.timeTop.value));
    });
    
    // Botones de subdivisión
    metronomoElements.subdivisionButtons?.querySelectorAll('.subdivision-btn').forEach(button => {
        button.addEventListener('click', () => {
            setSubdivisionMetronomo(button.dataset.value);
        });
    });
    
    // Botones de inicio/detención
    metronomoElements.startBtn?.addEventListener('click', startMetronomo);
    metronomoElements.stopBtn?.addEventListener('click', stopMetronomo);
    
    // Tap tempo
    metronomoElements.tapTempoBtn?.addEventListener('click', tapTempoMetronomo);
}

// Inicializar display de compás
function initBeatDisplayMetronomo() {
    if (!metronomoElements.beatDisplay) return;
    
    metronomoElements.beatDisplay.innerHTML = '';
    for (let i = 0; i < metronomo.timeSignatureTop; i++) {
        const beatCell = document.createElement('div');
        beatCell.className = 'beat-cell';
        if (i === 0) beatCell.classList.add('accent');
        beatCell.textContent = i + 1;
        metronomoElements.beatDisplay.appendChild(beatCell);
    }
}

// Establecer BPM
function setBpmMetronomo(value) {
    metronomo.bpm = Math.max(40, Math.min(240, value));
    
    if (metronomoElements.bpmValue) {
        metronomoElements.bpmValue.textContent = metronomo.bpm;
    }
    if (metronomoElements.currentBpm) {
        metronomoElements.currentBpm.textContent = metronomo.bpm;
    }
    if (metronomoElements.bpmSlider) {
        metronomoElements.bpmSlider.value = metronomo.bpm;
    }
    
    // Reiniciar el temporizador si está en ejecución
    if (metronomo.isPlaying) {
        stopMetronomo();
        startMetronomo();
    }
}

// Establecer compás
function setTimeSignatureMetronomo(top) {
    metronomo.timeSignatureTop = Math.max(1, Math.min(4, top));
    
    if (metronomoElements.timeTop) {
        metronomoElements.timeTop.value = metronomo.timeSignatureTop;
    }
    
    // Reiniciar el contador de tiempo
    metronomo.beatCount = 0;
    
    // Actualizar display de compás
    initBeatDisplayMetronomo();
    
    // Reiniciar el temporizador si está en ejecución
    if (metronomo.isPlaying) {
        stopMetronomo();
        startMetronomo();
    }
}

// Establecer subdivisión
function setSubdivisionMetronomo(value) {
    metronomo.subdivision = parseInt(value);
    
    // Actualizar botones de subdivisión
    if (metronomoElements.subdivisionButtons) {
        metronomoElements.subdivisionButtons.querySelectorAll('.subdivision-btn').forEach(btn => {
            if (parseInt(btn.dataset.value) === metronomo.subdivision) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Reiniciar el temporizador si está en ejecución
    if (metronomo.isPlaying) {
        stopMetronomo();
        startMetronomo();
    }
}

// Crear sonido del metrónomo
function playSoundMetronomo(isAccent) {
    if (!metronomo.audioContext) return;
    
    // Crear oscilador
    const oscillator = metronomo.audioContext.createOscillator();
    const gainNode = metronomo.audioContext.createGain();
    
    // Configurar frecuencia según si es acento o no
    oscillator.frequency.value = isAccent ? 800 : 600;
    oscillator.type = 'sine';
    
    // Configurar volumen
    gainNode.gain.value = isAccent ? 0.8 : 0.5;
    
    // Conectar nodos
    oscillator.connect(gainNode);
    gainNode.connect(metronomo.audioContext.destination);
    
    // Configurar envolvente de volumen
    const now = metronomo.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(isAccent ? 0.8 : 0.5, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    
    // Iniciar y detener sonido
    oscillator.start(now);
    oscillator.stop(now + 0.1);
}

// Iniciar metrónomo
function startMetronomo() {
    if (metronomo.isPlaying) return;
    
    metronomo.isPlaying = true;
    if (metronomoElements.startBtn) metronomoElements.startBtn.disabled = true;
    if (metronomoElements.stopBtn) metronomoElements.stopBtn.disabled = false;
    
    // Calcular intervalo basado en BPM y subdivisión
    const interval = (60000 / metronomo.bpm) * (1 / metronomo.subdivision);
    
    // Iniciar temporizador
    metronomo.timer = setInterval(() => {
        // Determinar si es el primer tiempo (acento)
        const totalBeats = metronomo.timeSignatureTop * metronomo.subdivision;
        const currentSubBeat = metronomo.beatCount % totalBeats;
        const isFirstBeatOfMeasure = currentSubBeat === 0;
        
        // Reproducir sonido (acento en primer tiempo del compás)
        playSoundMetronomo(isFirstBeatOfMeasure);
        
        // Actualizar visualización de compás
        updateBeatDisplayMetronomo();
        
        // Incrementar contador de tiempo
        metronomo.beatCount++;
    }, interval);
}

// Detener metrónomo
function stopMetronomo() {
    if (!metronomo.isPlaying) return;
    
    metronomo.isPlaying = false;
    if (metronomoElements.startBtn) metronomoElements.startBtn.disabled = false;
    if (metronomoElements.stopBtn) metronomoElements.stopBtn.disabled = true;
    
    clearInterval(metronomo.timer);
    
    // Resetear display de compás
    if (metronomoElements.beatDisplay) {
        const beatCells = metronomoElements.beatDisplay.querySelectorAll('.beat-cell');
        beatCells.forEach(cell => cell.classList.remove('active'));
    }
}

// Actualizar display de compás
function updateBeatDisplayMetronomo() {
    if (!metronomoElements.beatDisplay) return;
    
    const beatCells = metronomoElements.beatDisplay.querySelectorAll('.beat-cell');
    const currentBeat = Math.floor(metronomo.beatCount / metronomo.subdivision) % metronomo.timeSignatureTop;
    
    // Remover clase activa de todas las celdas
    beatCells.forEach(cell => cell.classList.remove('active'));
    
    // Agregar clase activa a la celda actual
    if (beatCells[currentBeat]) {
        beatCells[currentBeat].classList.add('active');
    }
}

// Función Tap Tempo
function tapTempoMetronomo() {
    const now = Date.now();
    metronomo.tapTimes.push(now);
    
    // Mantener solo los últimos 4 taps
    if (metronomo.tapTimes.length > 4) {
        metronomo.tapTimes.shift();
    }
    
    // Calcular BPM si hay al menos 2 taps
    if (metronomo.tapTimes.length > 1) {
        const intervals = [];
        for (let i = 1; i < metronomo.tapTimes.length; i++) {
            intervals.push(metronomo.tapTimes[i] - metronomo.tapTimes[i - 1]);
        }
        
        const averageInterval = intervals.reduce((a, b) => a + b) / intervals.length;
        const calculatedBpm = Math.round(60000 / averageInterval);
        
        // Establecer BPM (limitado a 40-240)
        setBpmMetronomo(Math.max(40, Math.min(240, calculatedBpm)));
    }
    
    // Animación de feedback visual
    if (metronomoElements.tapTempoBtn) {
        metronomoElements.tapTempoBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            metronomoElements.tapTempoBtn.style.transform = 'scale(1)';
        }, 100);
    }
}

// Manejar teclado shortcuts del metrónomo
function handleMetronomoKeyboardShortcuts(e) {
    // Solo procesar shortcuts si estamos en la página del metrónomo
    if (!document.getElementById('metronomo')?.classList.contains('active')) {
        return;
    }
    
    switch(e.key) {
        case ' ':
            e.preventDefault();
            if (metronomo.isPlaying) {
                stopMetronomo();
            } else {
                startMetronomo();
            }
            break;
        case 'ArrowUp':
            e.preventDefault();
            setBpmMetronomo(metronomo.bpm + 1);
            break;
        case 'ArrowDown':
            e.preventDefault();
            setBpmMetronomo(metronomo.bpm - 1);
            break;
        case 't':
        case 'T':
            tapTempoMetronomo();
            break;
    }
}

// Funciones de administración
window.manageUsers = function() {
    alert('Redirigiendo a gestión de usuarios...');
};

window.manageContent = function() {
    alert('Redirigiendo a gestión de contenido...');
};

window.viewStatistics = function() {
    alert('Redirigiendo a estadísticas...');
};

// ========== ANIMACIONES Y EFECTOS ==========
// Efecto de escritura en el hero
document.addEventListener('DOMContentLoaded', function() {
    const heroText = document.querySelector('.hero h1');
    if (heroText) {
        const originalText = heroText.textContent;
        heroText.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < originalText.length) {
                heroText.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Iniciar animación después de 500ms
        setTimeout(typeWriter, 500);
    }
});