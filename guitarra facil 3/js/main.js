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

// ========== SISTEMA DE AUTENTICACIÓN FIREBASE v10 MODULAR ==========
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
let firebaseAvailable = false;
let auth = null;
let firebaseModules = null;

// Verificar si Firebase Modular está disponible
function checkFirebaseAvailability() {
    console.log("🔍 Verificando Firebase Modular v10...");
    
    if (!window.firebaseReady) {
        console.log("❌ Firebase NO está listo (window.firebaseReady = false)");
        return false;
    }
    
    if (!window.firebaseAuth) {
        console.log("❌ Firebase Auth NO está disponible");
        return false;
    }
    
    if (!window.firebaseModules) {
        console.log("❌ Firebase Modules NO están disponibles");
        return false;
    }
    
    console.log("✅ Firebase Modular v10 está completamente disponible");
    return true;
}

// Inicializar Firebase Modular
function initializeFirebase() {
    try {
        console.log("🎯 Inicializando Firebase Modular v10...");
        
        // Verificar disponibilidad
        firebaseAvailable = checkFirebaseAvailability();
        
        if (!firebaseAvailable) {
            console.warn("⚠️ Firebase Modular NO disponible. Usando modo local.");
            
            // Esperar un momento por si Firebase se carga después
            setTimeout(() => {
                firebaseAvailable = checkFirebaseAvailability();
                if (firebaseAvailable) {
                    setupAuthObserver();
                } else {
                    loadUserFromStorage();
                }
            }, 1000);
            
            loadUserFromStorage();
            return;
        }
        
        // Asignar módulos de Firebase
        auth = window.firebaseAuth;
        firebaseModules = window.firebaseModules;
        
        console.log("✅ Firebase Modular disponible, configurando observador...");
        setupAuthObserver();
        
    } catch (error) {
        console.error("❌ Error inicializando Firebase Modular:", error);
        firebaseAvailable = false;
        loadUserFromStorage();
    }
}

// Configurar observador de autenticación
function setupAuthObserver() {
    try {
        console.log("👁️ Configurando observador de autenticación...");
        
        firebaseModules.onAuthStateChanged(auth, (user) => {
            console.log("🔄 Cambio en estado de autenticación:", user ? `Usuario: ${user.email}` : "Sin usuario");
            
            if (user) {
                handleFirebaseUser(user);
            } else {
                currentUser = null;
                localStorage.removeItem('guitarraFacilUser');
                updateUIForUser(null);
            }
        });
        
        console.log("✅ Observador de autenticación configurado");
        
    } catch (error) {
        console.error("❌ Error configurando observador:", error);
        firebaseAvailable = false;
    }
}

// Manejar usuario de Firebase Modular
function handleFirebaseUser(user) {
    console.log("👤 Procesando usuario de Firebase Modular:", user.email);
    
    // Determinar rol
    const isAdmin = user.email.includes('admin') || user.email === 'admin@demo.com';
    
    currentUser = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        role: isAdmin ? 'admin' : 'student',
        isFirebaseUser: true,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL
    };
    
    // Formatear nombre
    if (!user.displayName && user.email) {
        const nameFromEmail = user.email.split('@')[0];
        currentUser.name = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    }
    
    // Guardar en localStorage
    localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUser));
    
    // Actualizar UI
    updateUIForUser(currentUser);
    
    console.log("✅ Usuario procesado:", currentUser.name, "Rol:", currentUser.role);
}

// Cargar usuario desde localStorage
function loadUserFromStorage() {
    const savedUser = localStorage.getItem('guitarraFacilUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForUser(currentUser);
        console.log("📂 Usuario cargado desde localStorage:", currentUser.email);
    }
}

// Actualizar UI según usuario
function updateUIForUser(user) {
    if (user) {
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        userName.textContent = user.name;
        userRole.textContent = user.role === 'admin' ? 'Administrador' : 'Estudiante';
        userRole.className = 'role-badge ' + (user.role === 'admin' ? 'role-admin' : 'role-student');
        
        // Mostrar contenido específico
        const studentElements = document.querySelectorAll('.student-only');
        const adminElements = document.querySelectorAll('.admin-only');
        
        if (user.role === 'admin') {
            studentElements.forEach(el => el.style.display = 'none');
            adminElements.forEach(el => el.style.display = 'block');
            if (document.getElementById('admin-welcome-name')) {
                document.getElementById('admin-welcome-name').textContent = user.name;
            }
        } else {
            studentElements.forEach(el => el.style.display = 'block');
            adminElements.forEach(el => el.style.display = 'none');
            if (document.getElementById('student-welcome-name')) {
                document.getElementById('student-welcome-name').textContent = user.name;
            }
        }
        
        // Actualizar estadísticas del estudiante
        if (user.role === 'student') {
            updateStudentStats();
        }
    } else {
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
        document.querySelectorAll('.student-only, .admin-only').forEach(el => el.style.display = 'none');
    }
}

// Actualizar estadísticas del estudiante
function updateStudentStats() {
    const userData = JSON.parse(localStorage.getItem('guitarraFacilUser')) || {};
    const progress = userData.progress || { level: 1, percentage: 0, lessons: 0 };
    
    if (document.getElementById('student-level')) {
        document.getElementById('student-level').textContent = progress.level;
    }
    if (document.getElementById('student-progress')) {
        document.getElementById('student-progress').textContent = `${progress.percentage}%`;
    }
    if (document.getElementById('student-lessons')) {
        document.getElementById('student-lessons').textContent = progress.lessons;
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
                    <label for="modalEmail">Email</label>
                    <div class="modal-input-with-icon" id="modalEmailContainer">
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="modalEmail" placeholder="Ingresa tu email" required>
                    </div>
                    <span class="error-message" id="modalEmailError"></span>
                </div>
                
                <div class="modal-form-group">
                    <label for="modalPassword">Contraseña</label>
                    <div class="modal-input-with-icon" id="modalPasswordContainer">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="modalPassword" placeholder="Ingresa tu contraseña" required>
                        <button type="button" id="togglePasswordBtn" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--primary-blue); cursor: pointer;">
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
                        <input type="password" id="modalSignupPassword" placeholder="Crea una contraseña segura (mínimo 6 caracteres)" required>
                        <button type="button" id="toggleSignupPasswordBtn" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--primary-blue); cursor: pointer;">
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
            </div>
            
            <div class="modal-signup-link">
                ¿Ya tienes una cuenta? <a href="#" id="modalSwitchToLogin">INICIA SESIÓN</a>
            </div>
        `;
    }
    
    setupFormEvents();
}

// Configurar eventos para el formulario
function setupFormEvents() {
    if (currentFormType === 'login') {
        const loginForm = document.getElementById('modalLoginForm');
        const passwordInput = document.getElementById('modalPassword');
        const togglePasswordBtn = document.getElementById('togglePasswordBtn');
        const switchToSignup = document.getElementById('modalSwitchToSignup');
        const forgotPassword = document.getElementById('modalForgotPassword');
        
        // Toggle password visibility
        if (togglePasswordBtn && passwordInput) {
            togglePasswordBtn.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
        }
        
        // Switch to signup
        if (switchToSignup) {
            switchToSignup.addEventListener('click', function(e) {
                e.preventDefault();
                currentFormType = 'signup';
                loadForm('signup');
            });
        }
        
        // Forgot password
        if (forgotPassword) {
            forgotPassword.addEventListener('click', function(e) {
                e.preventDefault();
                handleForgotPassword();
            });
        }
        
        // Login form submission
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleLogin();
            });
        }
    } else {
        const signupForm = document.getElementById('modalSignupForm');
        const passwordInput = document.getElementById('modalSignupPassword');
        const togglePasswordBtn = document.getElementById('toggleSignupPasswordBtn');
        const switchToLogin = document.getElementById('modalSwitchToLogin');
        
        // Toggle password visibility
        if (togglePasswordBtn && passwordInput) {
            togglePasswordBtn.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
        }
        
        // Switch to login
        if (switchToLogin) {
            switchToLogin.addEventListener('click', function(e) {
                e.preventDefault();
                currentFormType = 'login';
                loadForm('login');
            });
        }
        
        // Signup form submission
        if (signupForm) {
            signupForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleSignup();
            });
        }
    }
}

// Manejar login con Firebase Modular
async function handleLogin() {
    const email = document.getElementById('modalEmail')?.value.trim();
    const password = document.getElementById('modalPassword')?.value;
    const submitBtn = document.getElementById('modalSubmitBtn');
    
    // Validaciones básicas
    if (!email || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    // Actualizar UI del botón
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
    
    try {
        console.log("🔑 Intentando login... Firebase disponible:", firebaseAvailable);
        
        // PRIMERO intentar con Firebase Modular si está disponible
        if (firebaseAvailable && checkFirebaseAvailability()) {
            console.log("✅ Usando Firebase Modular para login...");
            
            const userCredential = await firebaseModules.signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log("✅ Login exitoso con Firebase Modular:", user.email);
            
            // Éxito con Firebase
            submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Éxito!';
            submitBtn.classList.add('success-btn');
            
            setTimeout(() => {
                closeModal();
            }, 1000);
            return;
        }
        
        // SI NO, usar login local (usuarios demo)
        console.log("⚠️ Firebase Modular no disponible, usando login local...");
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Credenciales de demostración CORREGIDAS
        const demoCredentials = [
            { email: 'estudiante@demo.com', password: '123456', name: 'Estudiante Demo', role: 'student' },
            { email: 'admin@demo.com', password: 'admin123', name: 'Administrador Demo', role: 'admin' },
            { email: 'usuario@demo.com', password: '123456', name: 'Usuario Regular', role: 'student' }
        ];
        
        const user = demoCredentials.find(
            cred => cred.email === email && cred.password === password
        );
        
        if (user) {
            // Login exitoso con usuario demo
            currentUser = user;
            localStorage.setItem('guitarraFacilUser', JSON.stringify(user));
            updateUIForUser(user);
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Éxito!';
            submitBtn.classList.add('success-btn');
            
            setTimeout(() => {
                closeModal();
                console.log('✅ Login exitoso con usuario demo:', user.email);
            }, 1000);
        } else {
            // Credenciales incorrectas
            submitBtn.innerHTML = '<i class="fas fa-times"></i> Error';
            submitBtn.classList.add('error-btn');
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>INICIAR SESIÓN</span><i class="fas fa-arrow-right"></i>';
                submitBtn.classList.remove('error-btn');
                alert('Email o contraseña incorrectos.\n\nUsuarios demo disponibles:\n• estudiante@demo.com / 123456\n• admin@demo.com / admin123\n• usuario@demo.com / 123456');
            }, 1000);
        }
        
    } catch (error) {
        console.error('❌ Error en login:', error);
        
        submitBtn.innerHTML = '<i class="fas fa-times"></i> Error';
        submitBtn.classList.add('error-btn');
        
        let errorMessage = 'Error al iniciar sesión';
        
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = 'Email o contraseña incorrectos';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Demasiados intentos. Intenta más tarde.';
        }
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>INICIAR SESIÓN</span><i class="fas fa-arrow-right"></i>';
            submitBtn.classList.remove('error-btn');
            alert(errorMessage);
        }, 1000);
    }
}

// Manejar registro con Firebase Modular
async function handleSignup() {
    const name = document.getElementById('modalSignupName')?.value.trim();
    const email = document.getElementById('modalSignupEmail')?.value.trim();
    const password = document.getElementById('modalSignupPassword')?.value;
    const submitBtn = document.getElementById('modalSignupSubmitBtn');
    
    console.log("📝 === DEBUG REGISTRO FIREBASE MODULAR ===");
    console.log("Email:", email);
    console.log("Firebase disponible:", firebaseAvailable);
    console.log("checkFirebaseAvailability:", checkFirebaseAvailability());
    console.log("auth disponible:", !!auth);
    console.log("firebaseModules:", !!firebaseModules);
    console.log("==========================");
    
    // Validaciones básicas
    if (!name || !email || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando cuenta...';
    
    try {
        // PRIMERO intentar con Firebase Modular si está disponible
        if (firebaseAvailable && checkFirebaseAvailability() && auth && firebaseModules) {
            console.log("🔥 Creando usuario en Firebase Modular...");
            
            const userCredential = await firebaseModules.createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log("✅ Usuario creado en Firebase Modular:", user.uid);
            console.log("📧 Email:", user.email);
            
            // Actualizar nombre en perfil
            await firebaseModules.updateProfile(user, { displayName: name });
            
            // Enviar email de verificación
            await firebaseModules.sendEmailVerification(user);
            console.log("📧 Email de verificación enviado");
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Cuenta creada!';
            submitBtn.classList.add('success-btn');
            
            setTimeout(() => {
                closeModal();
                alert(`¡Bienvenido ${name}! 🎸\n\nCuenta creada exitosamente en Firebase.\n\nHemos enviado un email de verificación a:\n${email}\n\nPor favor verifica tu email.`);
            }, 1500);
            
            return;
        }
        
        // SI NO, usar registro local
        console.log("⚠️ Firebase Modular no disponible, usando registro local...");
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        currentUser = {
            name: name,
            email: email,
            role: 'student',
            progress: { level: 1, percentage: 0, lessons: 0 },
            createdAt: new Date().toISOString(),
            isLocalUser: true
        };
        
        localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUser));
        updateUIForUser(currentUser);
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Cuenta creada!';
        submitBtn.classList.add('success-btn');
        
        setTimeout(() => {
            closeModal();
            alert(`¡Bienvenido ${name}! 🎸\n\nCuenta creada exitosamente en modo local.\n\nEmail: ${email}\nContraseña: ${password}`);
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error en registro:', error);
        
        submitBtn.innerHTML = '<i class="fas fa-times"></i> Error';
        submitBtn.classList.add('error-btn');
        
        let errorMessage = 'Error al crear la cuenta';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Este email ya está registrado';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Email inválido';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Contraseña muy débil (mínimo 6 caracteres)';
        }
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>CREAR CUENTA</span><i class="fas fa-user-plus"></i>';
            submitBtn.classList.remove('error-btn');
            alert(errorMessage + '\n\nCódigo de error: ' + error.code);
        }, 1000);
    }
}

// Manejar "Olvidé mi contraseña" con Firebase Modular
async function handleForgotPassword() {
    const email = prompt('Por favor, ingresa tu email para recuperar tu contraseña:');
    
    if (!email) return;
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Por favor, ingresa un email válido.');
        return;
    }
    
    try {
        if (firebaseAvailable && checkFirebaseAvailability() && auth && firebaseModules) {
            await firebaseModules.sendPasswordResetEmail(auth, email);
            alert(`✅ Se ha enviado un enlace de recuperación a:\n\n${email}\n\nRevisa tu bandeja de entrada.`);
        } else {
            alert(`⚠️ En modo local:\n\nSe simularía el envío de email a:\n\n${email}`);
        }
    } catch (error) {
        console.error('Error al enviar email de recuperación:', error);
        alert(`Error: ${error.message}`);
    }
}

// Manejar logout con Firebase Modular
async function handleLogout() {
    try {
        // Cerrar sesión en Firebase Modular si está disponible
        if (firebaseAvailable && checkFirebaseAvailability() && auth && firebaseModules) {
            await firebaseModules.signOut(auth);
            console.log("✅ Sesión cerrada en Firebase Modular");
        }
        
        // Limpiar datos locales
        currentUser = null;
        localStorage.removeItem('guitarraFacilUser');
        updateUIForUser(null);
        
        alert('Sesión cerrada exitosamente. ¡Hasta pronto! 🎸');
        
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión: ' + error.message);
    }
}

// Abrir modal
function openModal(formType = 'login') {
    currentFormType = formType;
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
if (studentLoginBtn) {
    studentLoginBtn.addEventListener('click', () => openModal('login'));
}
if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', () => openModal('login'));
}
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
}
if (modalSignupBtn) {
    modalSignupBtn.addEventListener('click', () => openModal('signup'));
}
if (modalLoginBtn) {
    modalLoginBtn.addEventListener('click', () => openModal('login'));
}
if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}

// Cerrar modal al hacer clic fuera
if (loginModal) {
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            closeModal();
        }
    });
}

// Inicializar Firebase Modular cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM cargado, inicializando aplicación Firebase Modular...');
    
    // Esperar un momento para asegurar que Firebase se cargó
    setTimeout(() => {
        initializeFirebase();
    }, 500);
    
    // Efecto de escritura en el hero
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
        
        setTimeout(typeWriter, 500);
    }
});

// ========== AFINADOR MEJORADO (MISMO CÓDIGO) ==========
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
    console.log('🎸 Afinador inicializado');
}

// Configurar event listeners del afinador
function setupEventListenersAfinador() {
    // Botón de micrófono
    if (elementsAfinador.micToggle) {
        elementsAfinador.micToggle.addEventListener('click', toggleMicrophoneAfinador);
    }
    
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
    
    console.log(`🎸 Cuerda seleccionada: ${STRINGS[stringType].name}`);
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
        
        console.log('🎤 Micrófono activado para afinador');
        
    } catch (error) {
        console.error('Error en configuración de audio:', error);
        alert('Error al acceder al micrófono. Asegúrate de que tu micrófono esté conectado y tengas permisos para usarlo.');
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
    console.log('🎤 Micrófono desactivado');
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
    const randomOffset = (Math.random() - 0.5) * 20;
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
            elementsAfinador.statusText.innerHTML = `🎸 <strong>¡${string.note} perfectamente afinado!</strong>`;
        }
    } else if (absCents <= 20) {
        status = 'warning';
        colorClass = cents > 0 ? 'sharp' : 'flat';
        text = cents > 0 ? 'Agudo' : 'Grave';
        if (elementsAfinador.statusText) {
            elementsAfinador.statusText.textContent = cents > 0 ? 
                `🎸 ${string.note} un poco AGUDO - Afloja ligeramente` : 
                `🎸 ${string.note} un poco GRAVE - Aprieta ligeramente`;
        }
    } else {
        status = 'out';
        colorClass = cents > 0 ? 'sharp' : 'flat';
        text = cents > 0 ? 'Muy agudo' : 'Muy grave';
        if (elementsAfinador.statusText) {
            elementsAfinador.statusText.textContent = cents > 0 ? 
                `🎸 ${string.note} muy AGUDO - Afloja la clavija` : 
                `🎸 ${string.note} muy GRAVE - Aprieta la clavija`;
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

// ========== METRÓNOMO MEJORADO (MISMO CÓDIGO) ==========
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
    try {
        metronomo.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
        console.error('Error creando AudioContext:', error);
        alert('Tu navegador no soporta la API de Audio necesaria para el metrónomo.');
        return;
    }
    
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
    
    console.log('🎵 Metrónomo inicializado');
}

// Configurar event listeners del metrónomo
function setupMetronomoEventListeners() {
    // Slider de BPM
    if (metronomoElements.bpmSlider) {
        metronomoElements.bpmSlider.addEventListener('input', () => {
            setBpmMetronomo(parseInt(metronomoElements.bpmSlider.value));
        });
    }
    
    // Compás
    if (metronomoElements.timeTop) {
        metronomoElements.timeTop.addEventListener('change', () => {
            setTimeSignatureMetronomo(parseInt(metronomoElements.timeTop.value));
        });
    }
    
    // Botones de subdivisión
    if (metronomoElements.subdivisionButtons) {
        metronomoElements.subdivisionButtons.querySelectorAll('.subdivision-btn').forEach(button => {
            button.addEventListener('click', () => {
                setSubdivisionMetronomo(button.dataset.value);
            });
        });
    }
    
    // Botones de inicio/detención
    if (metronomoElements.startBtn) {
        metronomoElements.startBtn.addEventListener('click', startMetronomo);
    }
    if (metronomoElements.stopBtn) {
        metronomoElements.stopBtn.addEventListener('click', stopMetronomo);
    }
    
    // Tap tempo
    if (metronomoElements.tapTempoBtn) {
        metronomoElements.tapTempoBtn.addEventListener('click', tapTempoMetronomo);
    }
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
    
    console.log('▶️ Metrónomo iniciado:', metronomo.bpm, 'BPM');
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
    
    console.log('⏹️ Metrónomo detenido');
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
    
    console.log('👆 Tap Tempo registrado');
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
            e.preventDefault();
            tapTempoMetronomo();
            break;
    }
}

// Funciones de administración
window.manageUsers = function() {
    alert('🔧 Redirigiendo a gestión de usuarios...');
};

window.manageContent = function() {
    alert('📚 Redirigiendo a gestión de contenido...');
};

window.viewStatistics = function() {
    alert('📊 Redirigiendo a estadísticas...');
};