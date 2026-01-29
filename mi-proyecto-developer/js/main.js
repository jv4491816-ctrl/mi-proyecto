// ========== NAVEGACIÓN ENTRE PÁGINAS ==========
const navLinks = document.querySelectorAll('.nav-link, .back-btn, .feature-card');
const pages = document.querySelectorAll('.page');
const menuToggle = document.getElementById('menuToggle');
const navLinksContainer = document.getElementById('navLinks');
const adminNavItem = document.getElementById('admin-nav-item');

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
    } else if (pageId === 'admin-panel-page') {
        initAdminPanel();
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

// ========== SISTEMA DE AUTENTICACIÓN FIREBASE MODULAR OPTIMIZADO ==========
const loginModal = document.getElementById('loginModal');
const modalFormSection = document.getElementById('modalFormSection');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalSignupBtn = document.getElementById('modalSignupBtn');
const modalLoginBtn = document.getElementById('modalLoginBtn');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const authButtons = document.getElementById('auth-buttons');
const userInfo = document.getElementById('user-info');
const userName = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');
const userAvatarContainer = document.getElementById('user-avatar-container');
const userProfile = document.getElementById('user-profile');

let currentFormType = 'login';
let currentUser = null;

// Lista de emails admin específicos
const ADMIN_EMAILS = [
    'jv4491816@gmail.com',
    'fraylingay@gmail.com',
    'admin@demo.com'
];

// ========== SISTEMA DE ESTADO DE FIREBASE OPTIMIZADO ==========
const firebaseState = {
    available: false,
    auth: null,
    db: null,
    modules: null,
    lastChecked: null,
    retryAttempts: 0,
    maxRetries: 2
};

// Función única para actualizar estado de Firebase
function updateFirebaseState() {
    const previousState = firebaseState.available;
    
    // Verificar disponibilidad una sola vez
    const isAvailable = Boolean(
        window.firebaseReady && 
        window.firebaseAuth && 
        window.firebaseModules
    );
    
    firebaseState.available = isAvailable;
    
    if (isAvailable) {
        firebaseState.auth = window.firebaseAuth;
        firebaseState.db = window.firebaseDb;
        firebaseState.modules = window.firebaseModules;
        firebaseState.retryAttempts = 0; // Resetear intentos si funciona
        console.log("✅ Firebase Modular disponible");
    } else {
        firebaseState.auth = null;
        firebaseState.db = null;
        firebaseState.modules = null;
        console.warn("⚠️ Firebase Modular NO disponible");
    }
    
    firebaseState.lastChecked = Date.now();
    
    // Log solo si cambió el estado
    if (previousState !== firebaseState.available) {
        console.log(`Firebase: ${previousState ? 'ON' : 'OFF'} → ${firebaseState.available ? 'ON' : 'OFF'}`);
    }
    
    return firebaseState.available;
}

// Helper para usar Firebase de forma segura y optimizada
function useFirebase() {
    // Solo verificar si ha pasado más de 10 segundos desde la última verificación
    const shouldCheck = !firebaseState.lastChecked || 
                       (Date.now() - firebaseState.lastChecked) > 10000;
    
    if (shouldCheck) {
        updateFirebaseState();
    }
    
    return {
        isAvailable: firebaseState.available,
        auth: firebaseState.auth,
        db: firebaseState.db,
        modules: firebaseState.modules,
        
        // Método seguro para operaciones Firebase
        async safeOperation(operationName, operation, fallback) {
            if (!firebaseState.available) {
                console.warn(`Firebase no disponible para: ${operationName}`);
                return typeof fallback === 'function' ? await fallback() : fallback;
            }
            
            try {
                const result = await operation();
                return result;
            } catch (error) {
                console.error(`Error en ${operationName}:`, error.code || error.message);
                
                // Si es error de red, marcar Firebase como no disponible temporalmente
                if (error.code?.includes('network') || error.code?.includes('unavailable')) {
                    firebaseState.available = false;
                    firebaseState.lastChecked = Date.now();
                }
                
                return typeof fallback === 'function' ? await fallback() : fallback;
            }
        }
    };
}

// Verificar si un usuario es administrador
async function checkIfUserIsAdmin(email) {
    // Primero verificar en la lista local de emails admin
    if (ADMIN_EMAILS.includes(email.toLowerCase())) {
        return true;
    }
    
    // Si Firebase está disponible, verificar en Firestore
    const firebase = useFirebase();
    
    return await firebase.safeOperation(
        'check-admin',
        async () => {
            const adminDoc = await firebase.modules.getDoc(
                firebase.modules.doc(firebase.db, 'admins', email.toLowerCase())
            );
            return adminDoc.exists();
        },
        false // Fallback: no es admin
    );
}

// Guardar/Actualizar usuario en Firestore
async function saveUserToFirestore(user) {
    const firebase = useFirebase();
    
    return await firebase.safeOperation(
        'save-user',
        async () => {
            const userRef = firebase.modules.doc(firebase.db, 'users', user.uid);
            const userSnap = await firebase.modules.getDoc(userRef);
            
            // Verificar si es admin
            const isAdmin = await checkIfUserIsAdmin(user.email);
            
            if (!userSnap.exists()) {
                // Crear nuevo usuario
                await firebase.modules.setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || user.email.split('@')[0],
                    photoURL: user.photoURL || null,
                    provider: user.providerData?.[0]?.providerId || 'email',
                    role: isAdmin ? 'admin' : 'student',
                    progress: {
                        level: 1,
                        percentage: 0,
                        lessons: 0
                    },
                    createdAt: firebase.modules.serverTimestamp(),
                    lastLogin: firebase.modules.serverTimestamp()
                });
                console.log("✅ Usuario creado en Firestore:", user.uid);
            } else {
                // Actualizar último login
                await firebase.modules.updateDoc(userRef, {
                    lastLogin: firebase.modules.serverTimestamp()
                });
                console.log("✅ Usuario actualizado en Firestore:", user.uid);
            }
            return true;
        },
        false // Fallback: no se guardó en Firestore
    );
}

// Inicializar Firebase optimizado
function initializeFirebase() {
    console.log("🎯 Inicializando Firebase optimizado...");
    
    // Una sola verificación inicial
    updateFirebaseState();
    
    if (firebaseState.available) {
        setupAuthObserver();
        console.log("✅ Firebase inicializado correctamente");
    } else {
        console.log("⚠️ Firebase no disponible, usando modo local");
        loadUserFromStorage();
        
        // Un solo reintento inteligente
        if (firebaseState.retryAttempts < firebaseState.maxRetries) {
            firebaseState.retryAttempts++;
            const retryDelay = firebaseState.retryAttempts * 2000; // 2s, 4s
            
            console.log(`Reintento ${firebaseState.retryAttempts} en ${retryDelay}ms...`);
            
            setTimeout(() => {
                if (updateFirebaseState()) {
                    setupAuthObserver();
                }
            }, retryDelay);
        }
    }
    
    // Detectar cambios en la conexión
    setupConnectionListeners();
}

// Configurar listeners de conexión
function setupConnectionListeners() {
    window.addEventListener('online', () => {
        console.log("📶 Conexión restaurada, verificando Firebase...");
        updateFirebaseState();
        if (firebaseState.available && !currentUser) {
            setupAuthObserver();
        }
    });
    
    window.addEventListener('offline', () => {
        console.log("📶 Sin conexión, usando modo local");
        firebaseState.available = false;
    });
}

// Configurar observador de autenticación optimizado
function setupAuthObserver() {
    const firebase = useFirebase();
    
    if (!firebase.isAvailable || !firebase.auth || !firebase.modules) {
        console.log("⚠️ Firebase no disponible para observador");
        return;
    }
    
    try {
        console.log("👁️ Configurando observador de autenticación optimizado...");
        
        firebase.modules.onAuthStateChanged(firebase.auth, async (user) => {
            console.log("🔄 Cambio en estado de autenticación:", user ? `Usuario: ${user.email}` : "Sin usuario");
            
            if (user) {
                // Guardar usuario en Firestore de forma segura
                await saveUserToFirestore(user);
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
        firebaseState.available = false;
    }
}

// Manejar usuario de Firebase optimizado
async function handleFirebaseUser(user) {
    console.log("👤 Procesando usuario de Firebase:", user.email);
    
    // Determinar rol (verificar si es admin)
    const isAdmin = await checkIfUserIsAdmin(user.email);
    
    currentUser = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        firstName: user.displayName ? user.displayName.split(' ')[0] : user.email.split('@')[0],
        role: isAdmin ? 'admin' : 'student',
        isFirebaseUser: true,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        provider: user.providerData?.[0]?.providerId || 'email'
    };
    
    // Formatear nombre
    if (!user.displayName && user.email) {
        const nameFromEmail = user.email.split('@')[0];
        currentUser.name = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        currentUser.firstName = currentUser.name.split(' ')[0];
    }
    
    // Guardar en localStorage
    localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUser));
    
    // Actualizar UI
    updateUIForUser(currentUser);
    
    console.log("✅ Usuario procesado:", currentUser.firstName, "Rol:", currentUser.role);
}

// Cargar usuario desde localStorage
function loadUserFromStorage() {
    const savedUser = localStorage.getItem('guitarraFacilUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        
        // Asegurarse de que existe firstName
        if (!currentUser.firstName && currentUser.name) {
            currentUser.firstName = currentUser.name.split(' ')[0];
        }
        
        updateUIForUser(currentUser);
        console.log("📂 Usuario cargado desde localStorage:", currentUser.email);
    }
}

// UI Updater optimizado
const uiUpdater = {
    updateUserInfo(user) {
        if (!user) {
            this.showAuthButtons();
            this.hideUserInfo();
            return;
        }
        
        this.hideAuthButtons();
        this.showUserInfo(user);
        this.updateAvatar(user);
        this.updateWelcomeMessages(user);
    },
    
    updateAvatar(user) {
        if (!userAvatarContainer) return;
        
        if (user.photoURL) {
            userAvatar.src = user.photoURL;
            userAvatar.style.display = 'block';
            userAvatarContainer.innerHTML = '';
            userAvatarContainer.appendChild(userAvatar);
        } else {
            const initial = (user.firstName || user.name).charAt(0).toUpperCase();
            userAvatarContainer.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--primary-blue); color: white; font-weight: bold; font-size: 14px;">${initial}</div>`;
        }
    },
    
    updateWelcomeMessages(user) {
        const updates = [
            { id: 'user-name', value: user.firstName || user.name.split(' ')[0] },
            { id: 'admin-welcome-name', value: user.name },
            { id: 'student-welcome-name', value: user.firstName }
        ];
        
        updates.forEach(update => {
            const element = document.getElementById(update.id);
            if (element) element.textContent = update.value;
        });
    },
    
    showAuthButtons() {
        if (authButtons) authButtons.style.display = 'flex';
    },
    
    hideAuthButtons() {
        if (authButtons) authButtons.style.display = 'none';
    },
    
    showUserInfo(user) {
        if (userInfo) userInfo.style.display = 'flex';
        if (userName) userName.textContent = user.firstName || user.name.split(' ')[0];
    },
    
    hideUserInfo() {
        if (userInfo) userInfo.style.display = 'none';
    },
    
    updateAdminVisibility(isAdmin) {
        if (adminNavItem) {
            adminNavItem.style.display = isAdmin ? 'block' : 'none';
        }
        
        // Mostrar/ocultar contenido específico
        const studentElements = document.querySelectorAll('.student-only');
        const adminElements = document.querySelectorAll('.admin-only');
        
        if (isAdmin) {
            studentElements.forEach(el => el.style.display = 'none');
            adminElements.forEach(el => el.style.display = 'block');
        } else {
            studentElements.forEach(el => el.style.display = 'block');
            adminElements.forEach(el => el.style.display = 'none');
        }
    }
};

// Actualizar UI según usuario optimizado
async function updateUIForUser(user) {
    if (user) {
        // Actualizar información básica
        uiUpdater.updateUserInfo(user);
        
        // Verificar si es admin
        const isAdmin = await checkIfUserIsAdmin(user.email);
        uiUpdater.updateAdminVisibility(isAdmin);
        
        // Actualizar estadísticas del estudiante si no es admin
        if (!isAdmin) {
            updateStudentStats();
        }
    } else {
        uiUpdater.updateUserInfo(null);
        uiUpdater.updateAdminVisibility(false);
        
        // Ocultar todo el contenido específico
        document.querySelectorAll('.student-only, .admin-only').forEach(el => {
            el.style.display = 'none';
        });
    }
}

// Actualizar estadísticas del estudiante
function updateStudentStats() {
    const userData = JSON.parse(localStorage.getItem('guitarraFacilUser')) || {};
    const progress = userData.progress || { level: 1, percentage: 0, lessons: 0 };
    
    const updates = [
        { id: 'student-level', value: progress.level },
        { id: 'student-progress', value: `${progress.percentage}%` },
        { id: 'student-lessons', value: progress.lessons }
    ];
    
    updates.forEach(update => {
        const element = document.getElementById(update.id);
        if (element) element.textContent = update.value;
    });
}

// Login local (usuarios demo)
function handleLocalLogin(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Credenciales de demostración
            const demoCredentials = [
                { email: 'estudiante@demo.com', password: '123456', name: 'Estudiante Demo', role: 'student' },
                { email: 'admin@demo.com', password: 'admin123', name: 'Administrador Demo', role: 'admin' },
                { email: 'jv4491816@gmail.com', password: '123456', name: 'Juan Villar', role: 'admin' },
                { email: 'fraylingay@gmail.com', password: '123456', name: 'Fraylingay', role: 'admin' },
                { email: 'usuario@demo.com', password: '123456', name: 'Usuario Regular', role: 'student' }
            ];
            
            const user = demoCredentials.find(
                cred => cred.email === email && cred.password === password
            );
            
            if (user) {
                currentUser = {
                    ...user,
                    firstName: user.name.split(' ')[0]
                };
                localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUser));
                updateUIForUser(currentUser);
                resolve(currentUser);
            } else {
                reject(new Error('Email o contraseña incorrectos'));
            }
        }, 1000);
    });
}

// Registro local
function handleLocalSignup(name, email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Verificar si es admin
            const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
            
            currentUser = {
                name: name,
                firstName: name.split(' ')[0],
                email: email,
                role: isAdmin ? 'admin' : 'student',
                progress: { level: 1, percentage: 0, lessons: 0 },
                createdAt: new Date().toISOString(),
                isLocalUser: true
            };
            
            localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUser));
            updateUIForUser(currentUser);
            
            resolve(currentUser);
        }, 1000);
    });
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
                <button class="modal-social-btn google" id="googleLoginBtn">
                    <i class="fab fa-google"></i> Google
                </button>
                <button class="modal-social-btn github" id="githubLoginBtn">
                    <i class="fab fa-github"></i> GitHub
                </button>
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
                <button class="modal-social-btn google" id="googleSignupBtn">
                    <i class="fab fa-google"></i> Google
                </button>
                <button class="modal-social-btn github" id="githubSignupBtn">
                    <i class="fab fa-github"></i> GitHub
                </button>
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
        const googleLoginBtn = document.getElementById('googleLoginBtn');
        const githubLoginBtn = document.getElementById('githubLoginBtn');
        
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
        
        // Google Login
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleSocialLogin('google');
            });
        }
        
        // GitHub Login
        if (githubLoginBtn) {
            githubLoginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleSocialLogin('github');
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
        const googleSignupBtn = document.getElementById('googleSignupBtn');
        const githubSignupBtn = document.getElementById('githubSignupBtn');
        
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
        
        // Google Signup
        if (googleSignupBtn) {
            googleSignupBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleSocialLogin('google');
            });
        }
        
        // GitHub Signup
        if (githubSignupBtn) {
            githubSignupBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleSocialLogin('github');
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

// Manejar login con redes sociales optimizado
async function handleSocialLogin(providerType) {
    const firebase = useFirebase();
    const submitBtn = document.getElementById('modalSubmitBtn') || document.getElementById('modalSignupSubmitBtn');
    
    if (!submitBtn) return;
    
    const originalContent = submitBtn.innerHTML;
    const originalDisabled = submitBtn.disabled;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Conectando con ${providerType === 'google' ? 'Google' : 'GitHub'}...`;
    
    // Si Firebase no está disponible
    if (!firebase.isAvailable) {
        submitBtn.innerHTML = '<i class="fas fa-times"></i> Error';
        submitBtn.classList.add('error-btn');
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            submitBtn.classList.remove('error-btn');
            alert('Firebase no está disponible. Por favor, usa el registro por email.');
        }, 1000);
        return;
    }
    
    try {
        const provider = providerType === 'google' 
            ? new firebase.modules.GoogleAuthProvider()
            : new firebase.modules.GithubAuthProvider();
        
        if (providerType === 'github') {
            provider.addScope('read:user');
            provider.addScope('user:email');
        }
        
        const result = await firebase.modules.signInWithPopup(firebase.auth, provider);
        const user = result.user;
        
        console.log(`✅ Login con ${providerType} exitoso:`, user.email);
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Éxito!';
        submitBtn.classList.add('success-btn');
        
        setTimeout(() => {
            closeModal();
        }, 1000);
        
    } catch (error) {
        console.error(`❌ Error en login con ${providerType}:`, error);
        
        submitBtn.innerHTML = '<i class="fas fa-times"></i> Error';
        submitBtn.classList.add('error-btn');
        
        let errorMessage = `Error al conectar con ${providerType === 'google' ? 'Google' : 'GitHub'}`;
        
        const errorMessages = {
            'auth/popup-closed-by-user': 'El popup fue cerrado. Intenta de nuevo.',
            'auth/cancelled-popup-request': 'La solicitud fue cancelada.',
            'auth/account-exists-with-different-credential': 'Ya existe una cuenta con el mismo email pero con otro método de autenticación.',
            'auth/operation-not-allowed': `La autenticación con ${providerType === 'google' ? 'Google' : 'GitHub'} no está habilitada.`
        };
        
        errorMessage = errorMessages[error.code] || errorMessage;
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            submitBtn.classList.remove('error-btn');
            alert(errorMessage);
        }, 1000);
    }
}

// Manejar login optimizado
async function handleLogin() {
    const email = document.getElementById('modalEmail')?.value.trim();
    const password = document.getElementById('modalPassword')?.value;
    const submitBtn = document.getElementById('modalSubmitBtn');
    
    if (!submitBtn) return;
    
    // Validaciones básicas
    if (!email || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    // Validar formato de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Por favor, ingresa un email válido');
        return;
    }
    
    // Actualizar UI del botón
    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
    
    try {
        const firebase = useFirebase();
        
        if (firebase.isAvailable) {
            // Intentar login con Firebase
            await firebase.safeOperation(
                'login',
                async () => {
                    const userCredential = await firebase.modules.signInWithEmailAndPassword(
                        firebase.auth, email, password
                    );
                    return userCredential.user;
                },
                async () => {
                    // Fallback a login local
                    return await handleLocalLogin(email, password);
                }
            );
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Éxito!';
            submitBtn.classList.add('success-btn');
            
            setTimeout(() => {
                closeModal();
            }, 1000);
            
        } else {
            // Usar login local directamente
            await handleLocalLogin(email, password);
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Éxito!';
            submitBtn.classList.add('success-btn');
            
            setTimeout(() => {
                closeModal();
            }, 1000);
        }
        
    } catch (error) {
        console.error('❌ Error en login:', error);
        
        submitBtn.innerHTML = '<i class="fas fa-times"></i> Error';
        submitBtn.classList.add('error-btn');
        
        let errorMessage = 'Error al iniciar sesión';
        
        const errorMessages = {
            'auth/user-not-found': 'No existe una cuenta con este email',
            'auth/wrong-password': 'Contraseña incorrecta',
            'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
            'Email o contraseña incorrectos': 'Email o contraseña incorrectos'
        };
        
        errorMessage = errorMessages[error.message] || errorMessages[error.code] || errorMessage;
        
        // Mostrar usuarios demo disponibles
        if (errorMessage.includes('incorrectos')) {
            errorMessage += '\n\nUsuarios demo disponibles:\n• estudiante@demo.com / 123456\n• admin@demo.com / admin123\n• jv4491816@gmail.com / 123456\n• fraylingay@gmail.com / 123456\n• usuario@demo.com / 123456';
        }
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            submitBtn.classList.remove('error-btn');
            alert(errorMessage);
        }, 1000);
    }
}

// Manejar registro optimizado
async function handleSignup() {
    const name = document.getElementById('modalSignupName')?.value.trim();
    const email = document.getElementById('modalSignupEmail')?.value.trim();
    const password = document.getElementById('modalSignupPassword')?.value;
    const submitBtn = document.getElementById('modalSignupSubmitBtn');
    
    if (!submitBtn) return;
    
    // Validaciones básicas
    if (!name || !email || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Por favor, ingresa un email válido');
        return;
    }
    
    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando cuenta...';
    
    try {
        const firebase = useFirebase();
        
        if (firebase.isAvailable) {
            // Crear usuario en Firebase
            await firebase.safeOperation(
                'signup',
                async () => {
                    const userCredential = await firebase.modules.createUserWithEmailAndPassword(
                        firebase.auth, email, password
                    );
                    const user = userCredential.user;
                    
                    // Actualizar nombre en perfil
                    await firebase.modules.updateProfile(user, { displayName: name });
                    
                    // Enviar email de verificación
                    await firebase.modules.sendEmailVerification(user);
                    
                    return user;
                },
                async () => {
                    // Fallback a registro local
                    return await handleLocalSignup(name, email, password);
                }
            );
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Cuenta creada!';
            submitBtn.classList.add('success-btn');
            
            setTimeout(() => {
                closeModal();
                alert(`¡Bienvenido ${name.split(' ')[0]}! 🎸\n\nCuenta creada exitosamente en Firebase.\n\nHemos enviado un email de verificación a:\n${email}\n\nPor favor verifica tu email.`);
            }, 1500);
            
        } else {
            // Usar registro local directamente
            await handleLocalSignup(name, email, password);
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Cuenta creada!';
            submitBtn.classList.add('success-btn');
            
            const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
            const roleMsg = isAdmin ? 'Administrador' : 'Estudiante';
            
            setTimeout(() => {
                closeModal();
                alert(`¡Bienvenido ${name.split(' ')[0]}! 🎸\n\nCuenta creada exitosamente en modo local.\n\nEmail: ${email}\nRol: ${roleMsg}`);
            }, 1000);
        }
        
    } catch (error) {
        console.error('❌ Error en registro:', error);
        
        submitBtn.innerHTML = '<i class="fas fa-times"></i> Error';
        submitBtn.classList.add('error-btn');
        
        let errorMessage = 'Error al crear la cuenta';
        
        const errorMessages = {
            'auth/email-already-in-use': 'Este email ya está registrado',
            'auth/invalid-email': 'Email inválido',
            'auth/weak-password': 'Contraseña muy débil (mínimo 6 caracteres)',
            'auth/operation-not-allowed': 'El registro con email/contraseña no está habilitado'
        };
        
        errorMessage = errorMessages[error.code] || errorMessage;
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            submitBtn.classList.remove('error-btn');
            alert(errorMessage + (error.code ? '\n\nCódigo: ' + error.code : ''));
        }, 1000);
    }
}

// Manejar "Olvidé mi contraseña" optimizado
async function handleForgotPassword() {
    const email = prompt('Por favor, ingresa tu email para recuperar tu contraseña:');
    
    if (!email) return;
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Por favor, ingresa un email válido.');
        return;
    }
    
    try {
        const firebase = useFirebase();
        
        if (firebase.isAvailable) {
            await firebase.safeOperation(
                'forgot-password',
                async () => {
                    await firebase.modules.sendPasswordResetEmail(firebase.auth, email);
                    return true;
                },
                false
            );
            
            alert(`✅ Se ha enviado un enlace de recuperación a:\n\n${email}\n\nRevisa tu bandeja de entrada.`);
            
        } else {
            alert(`⚠️ En modo local:\n\nSe simularía el envío de email a:\n\n${email}\n\nUsuarios demo disponibles:\n• estudiante@demo.com\n• admin@demo.com\n• jv4491816@gmail.com\n• fraylingay@gmail.com\n• usuario@demo.com`);
        }
        
    } catch (error) {
        console.error('Error al enviar email de recuperación:', error);
        
        const errorMessages = {
            'auth/user-not-found': 'No existe una cuenta con este email',
            'auth/invalid-email': 'Email inválido'
        };
        
        const errorMessage = errorMessages[error.code] || error.message || 'Error al enviar el email';
        alert(`Error: ${errorMessage}`);
    }
}

// Manejar logout optimizado
async function handleLogout() {
    try {
        const firebase = useFirebase();
        
        // Cerrar sesión en Firebase si está disponible
        if (firebase.isAvailable) {
            await firebase.safeOperation(
                'logout',
                async () => {
                    await firebase.modules.signOut(firebase.auth);
                    return true;
                },
                true
            );
        }
        
        // Limpiar datos locales
        currentUser = null;
        localStorage.removeItem('guitarraFacilUser');
        updateUIForUser(null);
        
        alert('Sesión cerrada exitosamente. ¡Hasta pronto! 🎸');
        
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión. Intenta de nuevo.');
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
if (loginBtn) {
    loginBtn.addEventListener('click', () => openModal('login'));
}
if (registerBtn) {
    registerBtn.addEventListener('click', () => openModal('signup'));
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

// ========== PANEL DE ADMINISTRACIÓN OPTIMIZADO ==========
let adminUsers = [];
const userCache = {
    cache: new Map(),
    timeout: 2 * 60 * 1000, // 2 minutos
    
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > this.timeout) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data;
    },
    
    set(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    },
    
    clear() {
        this.cache.clear();
    }
};

// Inicializar panel de administración
function initAdminPanel() {
    console.log("👑 Inicializando panel de administración...");
    
    // Verificar que el usuario actual es admin
    if (!currentUser || !ADMIN_EMAILS.includes(currentUser.email.toLowerCase())) {
        alert("⚠️ Acceso denegado. Solo administradores pueden acceder a esta página.");
        showPage('index');
        return;
    }
    
    // Actualizar información del admin
    const updates = [
        { id: 'admin-username', value: currentUser.firstName || currentUser.name },
        { id: 'admin-email', value: currentUser.email }
    ];
    
    updates.forEach(update => {
        const element = document.getElementById(update.id);
        if (element) element.textContent = update.value;
    });
    
    // Cargar usuarios
    loadAllUsers();
    
    // Configurar búsqueda
    const searchInput = document.getElementById('user-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterUsers);
    }
}

// Cargar todos los usuarios optimizado
async function loadAllUsers() {
    const usersList = document.getElementById('users-list');
    if (!usersList) return;
    
    // Verificar caché primero
    const cachedUsers = userCache.get('allUsers');
    if (cachedUsers) {
        adminUsers = cachedUsers;
        updateUsersTable();
        updateAdminStats();
        console.log("📦 Usuarios cargados desde caché");
        return;
    }
    
    usersList.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin"></i> Cargando usuarios...</td></tr>';
    
    try {
        const firebase = useFirebase();
        
        if (firebase.isAvailable) {
            // Cargar desde Firestore
            const usersSnapshot = await firebase.modules.getDocs(
                firebase.modules.collection(firebase.db, 'users')
            );
            
            adminUsers = [];
            usersSnapshot.forEach(doc => {
                const userData = doc.data();
                adminUsers.push({
                    id: doc.id,
                    ...userData,
                    createdAt: userData.createdAt?.toDate() || new Date(),
                    lastLogin: userData.lastLogin?.toDate() || null
                });
            });
            
            console.log(`✅ ${adminUsers.length} usuarios cargados desde Firestore`);
            
        } else {
            // Usar datos demo
            adminUsers = [
                {
                    id: '1',
                    email: 'jv4491816@gmail.com',
                    displayName: 'Juan Villar',
                    role: 'admin',
                    createdAt: new Date('2024-01-01'),
                    lastLogin: new Date(),
                    photoURL: '',
                    progress: { level: 5, percentage: 80, lessons: 25 }
                },
                {
                    id: '2',
                    email: 'fraylingay@gmail.com',
                    displayName: 'Fraylingay',
                    role: 'admin',
                    createdAt: new Date('2024-01-02'),
                    lastLogin: new Date(),
                    progress: { level: 4, percentage: 70, lessons: 20 }
                },
                {
                    id: '3',
                    email: 'estudiante@demo.com',
                    displayName: 'Estudiante Demo',
                    role: 'student',
                    createdAt: new Date('2024-01-03'),
                    lastLogin: new Date(),
                    progress: { level: 2, percentage: 40, lessons: 10 }
                },
                {
                    id: '4',
                    email: 'usuario@demo.com',
                    displayName: 'Usuario Regular',
                    role: 'student',
                    createdAt: new Date('2024-01-04'),
                    lastLogin: null,
                    progress: { level: 1, percentage: 10, lessons: 2 }
                }
            ];
            
            console.log(`📋 ${adminUsers.length} usuarios demo cargados`);
        }
        
        // Guardar en caché
        userCache.set('allUsers', adminUsers);
        
        updateUsersTable();
        updateAdminStats();
        
    } catch (error) {
        console.error('❌ Error cargando usuarios:', error);
        usersList.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--accent-red);"><i class="fas fa-exclamation-triangle"></i> Error al cargar usuarios</td></tr>';
    }
}

// Actualizar tabla de usuarios optimizada
function updateUsersTable() {
    const usersList = document.getElementById('users-list');
    if (!usersList || !adminUsers.length) {
        usersList.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No hay usuarios para mostrar</td></tr>';
        return;
    }
    
    // Usar DocumentFragment para mejor rendimiento
    const fragment = document.createDocumentFragment();
    
    adminUsers.forEach(user => {
        const isActive = user.lastLogin && (new Date() - user.lastLogin) < (7 * 24 * 60 * 60 * 1000);
        const isCurrentUser = user.email === currentUser?.email;
        const isAdmin = user.role === 'admin';
        
        // Obtener iniciales para avatar
        const displayName = user.displayName || user.email.split('@')[0];
        const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        
        // Formatear fechas
        const registerDate = user.createdAt ? user.createdAt.toLocaleDateString() : 'N/A';
        const lastAccess = user.lastLogin ? 
            user.lastLogin.toLocaleDateString() + ' ' + user.lastLogin.toLocaleTimeString().substring(0, 5) : 
            'Nunca';
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <div class="user-info-cell">
                    <div class="user-avatar">
                        ${user.photoURL ? 
                            `<img src="${user.photoURL}" alt="${displayName}" class="user-avatar-img">` :
                            `<span>${initials}</span>`
                        }
                    </div>
                    <div class="user-details">
                        <div class="user-name">
                            ${displayName}
                            ${isCurrentUser ? '<span class="user-you-badge">(Tú)</span>' : ''}
                        </div>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>${registerDate}</td>
            <td>${lastAccess}</td>
            <td><span class="role-badge-cell ${user.role}">${isAdmin ? 'Administrador' : 'Estudiante'}</span></td>
            <td><span class="status-badge ${isActive ? 'active' : 'inactive'}">${isActive ? 'Activo' : 'Inactivo'}</span></td>
            <td>
                <div class="user-actions">
                    <button class="action-icon-btn" onclick="editUser('${user.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-icon-btn" onclick="toggleUserRole('${user.id}', '${user.email}')" title="${isAdmin ? 'Quitar Admin' : 'Hacer Admin'}">
                        <i class="fas ${isAdmin ? 'fa-user-minus' : 'fa-user-shield'}"></i>
                    </button>
                    ${!isCurrentUser ? `
                        <button class="action-icon-btn delete" onclick="deleteUser('${user.id}', '${user.email}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        
        fragment.appendChild(row);
    });
    
    usersList.innerHTML = '';
    usersList.appendChild(fragment);
}

// Actualizar estadísticas del admin optimizado
function updateAdminStats() {
    const totalUsers = adminUsers.length;
    const activeUsers = adminUsers.filter(user => 
        user.lastLogin && (new Date() - user.lastLogin) < (7 * 24 * 60 * 60 * 1000)
    ).length;
    
    const newToday = adminUsers.filter(user => 
        user.createdAt.toDateString() === new Date().toDateString()
    ).length;
    
    const studentCount = adminUsers.filter(user => user.role === 'student').length;
    const adminCount = adminUsers.filter(user => user.role === 'admin').length;
    
    const stats = [
        { id: 'total-users', value: totalUsers },
        { id: 'active-users', value: activeUsers },
        { id: 'new-today', value: newToday },
        { id: 'student-count', value: studentCount },
        { id: 'admin-count', value: adminCount },
        { id: 'active-count', value: activeUsers },
        { id: 'inactive-count', value: totalUsers - activeUsers }
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) element.textContent = stat.value;
    });
}

// Filtrar usuarios por búsqueda optimizado
function filterUsers() {
    const searchTerm = document.getElementById('user-search').value.toLowerCase().trim();
    const usersList = document.getElementById('users-list');
    
    if (!usersList) return;
    
    if (!searchTerm) {
        updateUsersTable();
        return;
    }
    
    const filteredUsers = adminUsers.filter(user => 
        user.email.toLowerCase().includes(searchTerm) ||
        (user.displayName && user.displayName.toLowerCase().includes(searchTerm)) ||
        user.role.toLowerCase().includes(searchTerm)
    );
    
    if (filteredUsers.length === 0) {
        usersList.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No se encontraron usuarios</td></tr>';
        return;
    }
    
    // Actualizar solo con usuarios filtrados
    const fragment = document.createDocumentFragment();
    
    filteredUsers.forEach(user => {
        const isActive = user.lastLogin && (new Date() - user.lastLogin) < (7 * 24 * 60 * 60 * 1000);
        const isCurrentUser = user.email === currentUser?.email;
        const isAdmin = user.role === 'admin';
        
        // Obtener iniciales para avatar
        const displayName = user.displayName || user.email.split('@')[0];
        const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        
        // Formatear fechas
        const registerDate = user.createdAt ? user.createdAt.toLocaleDateString() : 'N/A';
        const lastAccess = user.lastLogin ? 
            user.lastLogin.toLocaleDateString() + ' ' + user.lastLogin.toLocaleTimeString().substring(0, 5) : 
            'Nunca';
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <div class="user-info-cell">
                    <div class="user-avatar">
                        ${user.photoURL ? 
                            `<img src="${user.photoURL}" alt="${displayName}" class="user-avatar-img">` :
                            `<span>${initials}</span>`
                        }
                    </div>
                    <div class="user-details">
                        <div class="user-name">
                            ${displayName}
                            ${isCurrentUser ? '<span class="user-you-badge">(Tú)</span>' : ''}
                        </div>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>${registerDate}</td>
            <td>${lastAccess}</td>
            <td><span class="role-badge-cell ${user.role}">${isAdmin ? 'Administrador' : 'Estudiante'}</span></td>
            <td><span class="status-badge ${isActive ? 'active' : 'inactive'}">${isActive ? 'Activo' : 'Inactivo'}</span></td>
            <td>
                <div class="user-actions">
                    <button class="action-icon-btn" onclick="editUser('${user.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-icon-btn" onclick="toggleUserRole('${user.id}', '${user.email}')" title="${isAdmin ? 'Quitar Admin' : 'Hacer Admin'}">
                        <i class="fas ${isAdmin ? 'fa-user-minus' : 'fa-user-shield'}"></i>
                    </button>
                    ${!isCurrentUser ? `
                        <button class="action-icon-btn delete" onclick="deleteUser('${user.id}', '${user.email}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        
        fragment.appendChild(row);
    });
    
    usersList.innerHTML = '';
    usersList.appendChild(fragment);
}

// Funciones del panel de administración
window.manageUsers = function() {
    showPage('admin-panel-page');
};

window.manageContent = function() {
    alert('📚 Redirigiendo a gestión de contenido...');
};

window.viewStatistics = function() {
    alert('📊 Redirigiendo a estadísticas...');
};

// Toggle rol de usuario optimizado
async function toggleUserRole(userId, userEmail) {
    if (!confirm(`¿Estás seguro de cambiar el rol de ${userEmail}?`)) {
        return;
    }
    
    const user = adminUsers.find(u => u.id === userId);
    if (!user) return;
    
    const newRole = user.role === 'admin' ? 'student' : 'admin';
    
    try {
        const firebase = useFirebase();
        
        if (firebase.isAvailable) {
            await firebase.safeOperation(
                'toggle-role',
                async () => {
                    await firebase.modules.updateDoc(
                        firebase.modules.doc(firebase.db, 'users', userId),
                        { role: newRole }
                    );
                    return true;
                },
                false
            );
        }
        
        // Actualizar en la lista local
        user.role = newRole;
        
        // Actualizar cache
        userCache.set('allUsers', adminUsers);
        
        updateUsersTable();
        updateAdminStats();
        
        alert(`✅ Rol actualizado: ${userEmail} ahora es ${newRole === 'admin' ? 'administrador' : 'estudiante'}`);
        
    } catch (error) {
        console.error('❌ Error cambiando rol:', error);
        alert('Error al cambiar el rol del usuario');
    }
}

// Editar usuario
function editUser(userId) {
    const user = adminUsers.find(u => u.id === userId);
    if (!user) return;
    
    const newName = prompt('Nuevo nombre para el usuario:', user.displayName || '');
    if (newName === null) return;
    
    if (newName.trim()) {
        user.displayName = newName.trim();
        
        // Actualizar cache
        userCache.set('allUsers', adminUsers);
        
        updateUsersTable();
        alert('✅ Nombre actualizado correctamente');
    }
}

// Eliminar usuario optimizado
async function deleteUser(userId, userEmail) {
    if (!confirm(`¿Estás seguro de eliminar al usuario ${userEmail}?\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    try {
        const firebase = useFirebase();
        
        if (firebase.isAvailable) {
            await firebase.safeOperation(
                'delete-user',
                async () => {
                    await firebase.modules.deleteDoc(
                        firebase.modules.doc(firebase.db, 'users', userId)
                    );
                    return true;
                },
                false
            );
        }
        
        // Eliminar de la lista local
        adminUsers = adminUsers.filter(u => u.id !== userId);
        
        // Actualizar cache
        userCache.set('allUsers', adminUsers);
        
        updateUsersTable();
        updateAdminStats();
        
        alert('✅ Usuario eliminado correctamente');
        
    } catch (error) {
        console.error('❌ Error eliminando usuario:', error);
        alert('Error al eliminar el usuario');
    }
}

// Enviar anuncio a todos los usuarios
function sendAnnouncement() {
    const message = prompt('Escribe el anuncio que quieres enviar a todos los usuarios:');
    if (message && message.trim()) {
        alert(`📢 Anuncio enviado a ${adminUsers.length} usuarios:\n\n"${message}"`);
    }
}

// Exportar datos de usuarios
function exportUsers() {
    const csvContent = [
        ['Nombre', 'Email', 'Rol', 'Registro', 'Último Acceso', 'Estado'],
        ...adminUsers.map(user => [
            user.displayName || '',
            user.email,
            user.role === 'admin' ? 'Administrador' : 'Estudiante',
            user.createdAt.toLocaleDateString(),
            user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Nunca',
            user.lastLogin && (new Date() - user.lastLogin) < (7 * 24 * 60 * 60 * 1000) ? 'Activo' : 'Inactivo'
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios-guitarra-facil-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`✅ Datos exportados: ${adminUsers.length} usuarios`);
}

// Generar reporte mensual
function generateReport() {
    const today = new Date();
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    const newThisMonth = adminUsers.filter(user => user.createdAt >= monthAgo).length;
    const activeThisMonth = adminUsers.filter(user => user.lastLogin && user.lastLogin >= monthAgo).length;
    
    alert(`📊 Reporte Mensual:\n\n• Nuevos usuarios este mes: ${newThisMonth}\n• Usuarios activos este mes: ${activeThisMonth}\n• Total usuarios: ${adminUsers.length}\n• Administradores: ${adminUsers.filter(u => u.role === 'admin').length}\n• Estudiantes: ${adminUsers.filter(u => u.role === 'student').length}`);
}

// Respaldar base de datos
function backupDatabase() {
    const backupData = {
        timestamp: new Date().toISOString(),
        totalUsers: adminUsers.length,
        users: adminUsers
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-guitarra-facil-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('✅ Respaldo de base de datos generado y descargado');
}

// ========== AFINADOR MEJORADO CON DETECCIÓN REAL ==========
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
        updateAfinadorUI(true);
        
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
    cleanupAfinadorResources();
    updateAfinadorUI(false);
    
    const string = STRINGS[state.currentString];
    if (elementsAfinador.statusText) {
        elementsAfinador.statusText.textContent = `Micrófono desactivado - ${string.name}`;
    }
    
    resetDisplayAfinador();
    console.log('🎤 Micrófono desactivado');
}

// Limpiar recursos del afinador
function cleanupAfinadorResources() {
    // Cancelar animación
    if (state.animationId) {
        cancelAnimationFrame(state.animationId);
        state.animationId = null;
    }
    
    // Limpiar recursos de audio
    if (state.microphone) {
        try {
            state.microphone.disconnect();
            const stream = state.microphone.mediaStream;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        } catch (error) {
            console.warn("Error desconectando micrófono:", error);
        }
        state.microphone = null;
    }
    
    // Cerrar contexto de audio
    if (state.audioContext) {
        if (state.audioContext.state !== 'closed') {
            state.audioContext.close().catch(console.error);
        }
        state.audioContext = null;
    }
    
    // Limpiar estado
    state.isListening = false;
    state.frequencyHistory = [];
    state.lastValidDetection = null;
}

// Actualizar UI del afinador
function updateAfinadorUI(isListening) {
    if (elementsAfinador.micStatus) {
        elementsAfinador.micStatus.textContent = isListening ? 
            'Desactivar Micrófono' : 'Activar Micrófono';
    }
    
    if (elementsAfinador.micToggle) {
        if (isListening) {
            elementsAfinador.micToggle.classList.add('listening');
        } else {
            elementsAfinador.micToggle.classList.remove('listening');
        }
    }
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
    
    // Detectar frecuencia con algoritmo de autocorrelación
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

// Función mejorada de detección de frecuencia por autocorrelación
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
    
    // Algoritmo básico de autocorrelación para detección de frecuencia
    let bestR = 0;
    let bestLag = 0;
    
    // Buscar periodicidad (solo en un rango razonable)
    const minLag = Math.floor(sampleRate / STRINGS[state.currentString].range.high);
    const maxLag = Math.floor(sampleRate / STRINGS[state.currentString].range.low);
    
    for (let lag = minLag; lag < maxLag && lag < dataArray.length / 2; lag++) {
        let r = 0;
        for (let i = 0; i < dataArray.length - lag; i++) {
            r += dataArray[i] * dataArray[i + lag];
        }
        
        if (r > bestR) {
            bestR = r;
            bestLag = lag;
        }
    }
    
    if (bestLag === 0 || bestR < 0.1) {
        return { valid: false, frequency: 0, strength: energy };
    }
    
    // Calcular frecuencia
    const frequency = sampleRate / bestLag;
    
    // Verificar si está en el rango de la cuerda actual
    const string = STRINGS[state.currentString];
    if (frequency < string.range.low || frequency > string.range.high) {
        return { valid: false, frequency: frequency, strength: energy };
    }
    
    return { 
        valid: true, 
        frequency: frequency, 
        strength: Math.min(energy * 10, 1) 
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

// ========== INICIALIZACIÓN DE LA APLICACIÓN ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM cargado, inicializando aplicación optimizada...');
    
    // Inicializar Firebase optimizado
    initializeFirebase();
    
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