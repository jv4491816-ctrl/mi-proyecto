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
        // Esperar a que se carguen los datos antes de inicializar gráficos
        setTimeout(() => {
            if (adminUsers && adminUsers.length > 0) {
                initializeCharts();
            } else {
                // Si no hay datos, cargarlos primero
                loadAllUsers();
            }
        }, 800);
    } else if (pageId === 'foro') {
        // Inicializar mensajes si no están inicializados
        if (!isMessagesInitialized) {
            initMessages();
            isMessagesInitialized = true;
        }
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

// ========== SISTEMA DE NOTIFICACIONES ==========
function showNotification(message, type = 'info') {
    // Remover notificación anterior si existe
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== SISTEMA DE ACTIVIDAD DE USUARIOS ==========

// Estado de actividad de usuarios
let userActivity = {
    users: {},
    timeout: 5 * 60 * 1000, // 5 minutos de inactividad
    heartbeatInterval: 30 * 1000 // 30 segundos entre heartbeats
};

// Inicializar seguimiento de actividad
function initializeActivityTracking() {
    // Actualizar actividad en cada interacción del usuario
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    activityEvents.forEach(event => {
        document.addEventListener(event, updateUserActivity);
    });
    
    // Enviar heartbeat periódico
    setInterval(sendHeartbeat, userActivity.heartbeatInterval);
    
    // Verificar usuarios inactivos cada minuto
    setInterval(checkInactiveUsers, 60 * 1000);
}

// Actualizar actividad del usuario actual
function updateUserActivity() {
    if (!currentUser) return;
    
    const userId = currentUser.uid || currentUser.email;
    userActivity.users[userId] = Date.now();
    
    // Si el usuario está en el panel de admin, actualizar su estado
    if (document.getElementById('admin-panel-page')?.classList.contains('active')) {
        updateUserStatusInTable(userId, true);
    }
}

// Enviar heartbeat al servidor (simulado para modo local)
function sendHeartbeat() {
    if (!currentUser) return;
    
    const userId = currentUser.uid || currentUser.email;
    const firebase = useFirebase();
    
    if (firebase.isAvailable) {
        firebase.safeOperation(
            'heartbeat',
            async () => {
                // Actualizar lastActivity en Firestore
                if (currentUser.uid) {
                    await firebase.modules.updateDoc(
                        firebase.modules.doc(firebase.db, 'users', currentUser.uid),
                        { lastActivity: firebase.modules.serverTimestamp() }
                    );
                }
                return true;
            },
            () => {
                // Modo local: actualizar en localStorage
                userActivity.users[userId] = Date.now();
                return true;
            }
        );
    } else {
        // Modo local
        userActivity.users[userId] = Date.now();
    }
}

// Verificar usuarios inactivos
function checkInactiveUsers() {
    const now = Date.now();
    
    Object.keys(userActivity.users).forEach(userId => {
        const lastActivity = userActivity.users[userId];
        const isActive = (now - lastActivity) < userActivity.timeout;
        
        // Si el usuario está en el panel de admin, actualizar su estado
        if (document.getElementById('admin-panel-page')?.classList.contains('active')) {
            updateUserStatusInTable(userId, isActive);
        }
    });
}

// Actualizar estado de usuario en la tabla
function updateUserStatusInTable(userId, isActive) {
    const userRows = document.querySelectorAll('#users-list tr');
    
    userRows.forEach(row => {
        const emailCell = row.querySelector('td:nth-child(2)');
        if (emailCell && emailCell.textContent.includes(userId.split('@')[0])) {
            const statusCell = row.querySelector('.status-badge');
            if (statusCell) {
                if (isActive) {
                    statusCell.textContent = 'Activo';
                    statusCell.className = 'status-badge active';
                } else {
                    statusCell.textContent = 'Inactivo';
                    statusCell.className = 'status-badge inactive';
                }
            }
        }
    });
}

// Verificar si un usuario está activo
function isUserActive(user) {
    if (!user) return false;
    
    const userId = user.uid || user.email;
    const lastActivity = userActivity.users[userId];
    
    if (!lastActivity) return false;
    
    return (Date.now() - lastActivity) < userActivity.timeout;
}

// ========== SISTEMA DE CAMBIO DE NOMBRE ==========

// Elementos del modal de cambio de nombre
const changeNameModal = document.getElementById('changeNameModal');
const changeNameBtn = document.getElementById('change-name-btn');
const changeNameForm = document.getElementById('changeNameForm');
const newNameInput = document.getElementById('newName');
const changeNameSubmitBtn = document.getElementById('changeNameSubmitBtn');

// Inicializar funcionalidad de cambio de nombre
function initializeChangeName() {
    if (changeNameBtn) {
        changeNameBtn.addEventListener('click', openChangeNameModal);
    }
    
    if (changeNameForm) {
        changeNameForm.addEventListener('submit', handleChangeName);
    }
}

// Abrir modal de cambio de nombre
function openChangeNameModal() {
    if (!currentUser) return;
    
    newNameInput.value = currentUser.name || currentUser.firstName || '';
    changeNameModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cerrar modal de cambio de nombre
function closeChangeNameModal() {
    changeNameModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    changeNameForm.reset();
}

// Manejar cambio de nombre
async function handleChangeName(e) {
    e.preventDefault();
    
    const newName = newNameInput.value.trim();
    const nameError = document.getElementById('newNameError');
    
    if (!newName) {
        nameError.textContent = 'Por favor ingresa un nombre';
        return;
    }
    
    if (newName.length < 2) {
        nameError.textContent = 'El nombre debe tener al menos 2 caracteres';
        return;
    }
    
    if (!currentUser) {
        nameError.textContent = 'No hay usuario autenticado';
        return;
    }
    
    const originalContent = changeNameSubmitBtn.innerHTML;
    changeNameSubmitBtn.disabled = true;
    changeNameSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    
    try {
        // Actualizar en Firebase si está disponible
        const firebase = useFirebase();
        
        if (firebase.isAvailable && currentUser.uid) {
            // Actualizar en Firestore
            await firebase.modules.updateDoc(
                firebase.modules.doc(firebase.db, 'users', currentUser.uid),
                { displayName: newName }
            );
            
            // Actualizar en Auth si el usuario está autenticado
            if (firebase.auth.currentUser) {
                await firebase.modules.updateProfile(firebase.auth.currentUser, {
                    displayName: newName
                });
            }
        }
        
        // Actualizar usuario local
        currentUser.name = newName;
        currentUser.firstName = newName.split(' ')[0];
        currentUser.displayName = newName;
        
        // Guardar en localStorage
        localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUser));
        
        // Actualizar UI
        updateUIForUser(currentUser);
        
        // Cerrar modal
        closeChangeNameModal();
        
        // Mostrar notificación de éxito
        showNotification(`✅ Nombre actualizado a: ${newName}`, 'success');
        
        // Si estamos en el panel de admin, actualizar la tabla
        if (document.getElementById('admin-panel-page')?.classList.contains('active')) {
            loadAllUsers();
        }
        
    } catch (error) {
        console.error('❌ Error actualizando nombre:', error);
        nameError.textContent = 'Error al actualizar el nombre. Intenta de nuevo.';
    } finally {
        changeNameSubmitBtn.disabled = false;
        changeNameSubmitBtn.innerHTML = originalContent;
    }
}

// ========== FUNCIONES GLOBALES DEL PANEL DE ADMINISTRACIÓN - CORREGIDAS ==========
window.manageUsers = function() {
    // Mostrar el panel de administración completo
    showPage('admin-panel-page');
    
    // Asegurarse de que los gráficos se carguen correctamente
    setTimeout(() => {
        if (adminUsers && adminUsers.length > 0) {
            initializeCharts();
        } else {
            loadAllUsers();
        }
    }, 500);
    
    showNotification('📋 Panel de gestión de usuarios cargado', 'info');
};

window.manageContent = function() {
    // Navegar a la página de mensajes del admin para gestionar contenido
    showPage('foro');
    
    // Asegurarse de que el formulario de admin sea visible
    setTimeout(() => {
        const askSection = document.querySelector('.ask-section');
        const studentMessage = document.querySelector('.student-only');
        const userData = JSON.parse(localStorage.getItem('guitarraFacilUser'));
        const isAdmin = userData && userData.role === 'admin';
        
        if (askSection && studentMessage) {
            if (isAdmin) {
                askSection.style.display = 'block';
                studentMessage.style.display = 'none';
            }
        }
    }, 300);
    
    showNotification('📝 Redirigiendo a gestión de contenido (Mensajes del Admin)', 'info');
};

window.viewStatistics = function() {
    // Mostrar el panel de administración y enfocarse en las estadísticas
    showPage('admin-panel-page');
    
    // Desplazar hacia la sección de estadísticas
    setTimeout(() => {
        const statsSection = document.querySelector('.admin-section:nth-child(4)');
        if (statsSection) {
            statsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Asegurarse de que los gráficos se carguen
        if (adminUsers && adminUsers.length > 0) {
            initializeCharts();
        } else {
            loadAllUsers();
        }
    }, 500);
    
    showNotification('📊 Redirigiendo a estadísticas detalladas', 'info');
};

// Función global para recargar usuarios
window.refreshUsersList = function() {
    console.log("🔄 Recargando lista de usuarios...");
    userCache.clear(); // Limpiar caché
    loadAllUsers();
    showNotification('Lista de usuarios actualizada', 'success');
};

// ========== GRÁFICOS CON CHART.JS - VERSIÓN CORREGIDA ==========

// Variables para los gráficos
let rolePieChart = null;
let activityPieChart = null;
let activityBarChart = null;

// Inicializar gráficos CORREGIDO
function initializeCharts() {
    console.log("📊 Inicializando gráficos...");
    console.log("📊 Datos disponibles en adminUsers:", adminUsers ? adminUsers.length : 0);
    
    // Solo inicializar si estamos en el panel de admin
    const adminPage = document.getElementById('admin-panel-page');
    if (!adminPage || !adminPage.classList.contains('active')) {
        console.log("❌ No estamos en el panel de admin, no inicializar gráficos");
        return;
    }
    
    // Verificar si tenemos datos
    if (!adminUsers || adminUsers.length === 0) {
        console.warn("⚠️ No hay datos de usuarios. Cargando datos primero...");
        loadAllUsers(); // Cargar datos primero
        return;
    }
    
    // Esperar un poco para asegurar que el DOM esté listo
    setTimeout(() => {
        try {
            // Destruir gráficos existentes si hay
            destroyCharts();
            
            // Verificar que los canvas existen
            const canvases = [
                'rolePieChart', 
                'activityPieChart', 
                'activityBarChart'
            ];
            
            let allCanvasesExist = true;
            canvases.forEach(id => {
                const canvas = document.getElementById(id);
                if (!canvas) {
                    console.error(`❌ No se encontró el canvas: ${id}`);
                    allCanvasesExist = false;
                }
            });
            
            if (!allCanvasesExist) {
                console.error("❌ Faltan algunos canvas del DOM");
                return;
            }
            
            // Crear gráficos con datos ACTUALES
            createRolePieChart();
            createActivityPieChart();
            createActivityBarChartReal();
            
            console.log("✅ Gráficos inicializados correctamente");
            
        } catch (error) {
            console.error("❌ Error inicializando gráficos:", error);
            console.error("Detalle del error:", error.stack);
        }
    }, 300); // Aumentar delay para asegurar que el DOM esté listo
}

// Destruir gráficos existentes
function destroyCharts() {
    try {
        if (rolePieChart) {
            rolePieChart.destroy();
            rolePieChart = null;
        }
        if (activityPieChart) {
            activityPieChart.destroy();
            activityPieChart = null;
        }
        if (activityBarChart) {
            activityBarChart.destroy();
            activityBarChart = null;
        }
    } catch (error) {
        console.warn("⚠️ Error destruyendo gráficos:", error);
    }
}

// Crear gráfico de pastel para distribución por rol - VERSIÓN CORREGIDA
function createRolePieChart() {
    const ctx = document.getElementById('rolePieChart');
    if (!ctx) {
        console.error("❌ No se encontró el canvas para rolePieChart");
        return;
    }
    
    // Asegurarse de que adminUsers esté definida y tenga datos
    if (!adminUsers || adminUsers.length === 0) {
        console.warn("⚠️ No hay datos de usuarios para el gráfico de roles");
        // Usar datos por defecto para evitar errores
        adminUsers = adminUsers || [];
    }
    
    // Contar roles de manera segura
    const studentCount = adminUsers.filter(user => {
        const role = user.role || '';
        return role.toLowerCase() === 'estudiante' || role.toLowerCase() === 'student';
    }).length;
    
    const adminCount = adminUsers.filter(user => {
        const role = user.role || '';
        return role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrador';
    }).length;
    
    console.log(`📊 Datos para gráfico de roles: Estudiantes=${studentCount}, Admins=${adminCount}`, adminUsers);
    
    // Verificar que haya datos para mostrar
    if (studentCount === 0 && adminCount === 0) {
        console.warn("⚠️ No hay datos válidos para el gráfico de roles");
        // Crear gráfico con valores por defecto
        rolePieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Sin datos'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['rgba(128, 128, 128, 0.8)'],
                    borderColor: ['rgba(128, 128, 128, 1)'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'white',
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
        return;
    }
    
    // Si hay datos, crear gráfico normal
    rolePieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Estudiantes', 'Administradores'],
            datasets: [{
                data: [studentCount, adminCount],
                backgroundColor: [
                    'rgba(26, 115, 232, 0.8)',  // Azul para estudiantes
                    'rgba(251, 188, 4, 0.8)'    // Amarillo/naranja para admins
                ],
                borderColor: [
                    'rgba(26, 115, 232, 1)',
                    'rgba(251, 188, 4, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'white',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${label}: ${value} usuario${value !== 1 ? 's' : ''} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Crear gráfico de pastel para estado de actividad - CORREGIDO
function createActivityPieChart() {
    const ctx = document.getElementById('activityPieChart');
    if (!ctx) {
        console.error("❌ No se encontró el canvas para activityPieChart");
        return;
    }
    
    // Usar datos REALES con cálculo correcto de actividad
    const now = Date.now();
    const activeCount = adminUsers.filter(user => {
        // Verificar si el usuario tiene lastActivity o lastLogin
        const lastActivity = user.lastActivity || user.lastLogin;
        if (!lastActivity) return false;
        
        // Convertir a timestamp si es Date object
        const lastActivityTime = lastActivity instanceof Date ? 
            lastActivity.getTime() : 
            new Date(lastActivity).getTime();
            
        // Usuario activo si ha tenido actividad en los últimos 5 minutos
        return (now - lastActivityTime) < (5 * 60 * 1000);
    }).length;
    
    const inactiveCount = adminUsers.length - activeCount;
    
    console.log(`📊 Datos para gráfico de actividad: Activos=${activeCount}, Inactivos=${inactiveCount}`);
    
    activityPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Activos', 'Inactivos'],
            datasets: [{
                data: [activeCount, inactiveCount],
                backgroundColor: [
                    'rgba(52, 168, 83, 0.8)',   // Verde para activos
                    'rgba(234, 67, 53, 0.8)'    // Rojo para inactivos
                ],
                borderColor: [
                    'rgba(52, 168, 83, 1)',
                    'rgba(234, 67, 53, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'white',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${label}: ${value} usuario${value !== 1 ? 's' : ''} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Crear gráfico de barras para actividad por día - CON DATOS REALES
function createActivityBarChartReal() {
    const ctx = document.getElementById('activityBarChart');
    if (!ctx) {
        console.error("❌ No se encontró el canvas para activityBarChart");
        return;
    }
    
    // Generar datos REALES basados en las fechas de registro de usuarios
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const activities = [0, 0, 0, 0, 0, 0, 0];
    
    // Calcular usuarios registrados por día de la semana
    adminUsers.forEach(user => {
        if (user.createdAt) {
            const date = user.createdAt instanceof Date ? 
                user.createdAt : 
                new Date(user.createdAt);
            const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Lunes, etc.
            
            // Ajustar índice: nuestro array empieza con Lunes (índice 0)
            const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            if (adjustedIndex >= 0 && adjustedIndex < 7) {
                activities[adjustedIndex]++;
            }
        }
    });
    
    console.log("📊 Datos para gráfico de barras (registros por día):", activities);
    
    activityBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [{
                label: 'Usuarios Registrados',
                data: activities,
                backgroundColor: 'rgba(26, 115, 232, 0.8)',
                borderColor: 'rgba(26, 115, 232, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        precision: 0
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Registros: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });
}

// Actualizar gráficos cuando se cargan usuarios - CORREGIDO
function updateCharts() {
    console.log("🔄 Actualizando gráficos...");
    
    // Solo actualizar si estamos en el panel de admin
    const adminPage = document.getElementById('admin-panel-page');
    if (!adminPage || !adminPage.classList.contains('active')) {
        return;
    }
    
    // Destruir y recrear gráficos con datos actualizados
    destroyCharts();
    
    // Pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
        try {
            createRolePieChart();
            createActivityPieChart();
            createActivityBarChartReal();
            console.log("✅ Gráficos actualizados");
        } catch (error) {
            console.error("❌ Error actualizando gráficos:", error);
        }
    }, 100);
}

// ========== FUNCIÓN DE DIAGNÓSTICO PARA GRÁFICOS ==========
function diagnoseCharts() {
    console.log("🔍 DIAGNÓSTICO DE GRÁFICOS:");
    console.log("1. adminUsers:", adminUsers ? adminUsers.length : 'undefined');
    console.log("2. adminUsers contenido:", adminUsers);
    console.log("3. Canvas rolePieChart:", document.getElementById('rolePieChart'));
    console.log("4. Canvas activityPieChart:", document.getElementById('activityPieChart'));
    console.log("5. Canvas activityBarChart:", document.getElementById('activityBarChart'));
    console.log("6. Página admin activa:", document.getElementById('admin-panel-page')?.classList.contains('active'));
    
    // Verificar datos específicos
    if (adminUsers && adminUsers.length > 0) {
        const studentCount = adminUsers.filter(u => u.role === 'student').length;
        const adminCount = adminUsers.filter(u => u.role === 'admin').length;
        console.log(`📊 Conteo: Estudiantes=${studentCount}, Admins=${adminCount}`);
    }
}

// Función para forzar la actualización de gráficos
function refreshCharts() {
    console.log("🔄 Forzando actualización de gráficos...");
    
    // Destruir gráficos existentes
    destroyCharts();
    
    // Pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
        try {
            createRolePieChart();
            createActivityPieChart();
            createActivityBarChartReal();
            console.log("✅ Gráficos actualizados manualmente");
        } catch (error) {
            console.error("❌ Error actualizando gráficos:", error);
        }
    }, 300);
}

// Agregar funciones al objeto global window
window.diagnoseCharts = diagnoseCharts;
window.refreshCharts = refreshCharts;

// ========== FUNCIONES DE VALIDACIÓN DE CONTRASEÑA ==========

// Función para validar la fortaleza de la contraseña
function validatePasswordStrength() {
    const password = document.getElementById('modalSignupPassword')?.value || '';
    const strengthBar = document.getElementById('strengthBar');
    const passwordRules = {
        length: document.getElementById('ruleLength'),
        upper: document.getElementById('ruleUpper'),
        lower: document.getElementById('ruleLower'),
        number: document.getElementById('ruleNumber'),
        symbol: document.getElementById('ruleSymbol')
    };
    
    if (!password) {
        // Resetear todo si no hay contraseña
        Object.values(passwordRules).forEach(rule => {
            if (rule) rule.style.color = 'var(--accent-red)';
        });
        if (strengthBar) strengthBar.style.width = '0%';
        return false;
    }
    
    // Validaciones individuales
    const rules = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password),
        symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    
    // Actualizar colores de las reglas
    Object.keys(rules).forEach(key => {
        const ruleElement = passwordRules[key];
        if (ruleElement) {
            ruleElement.style.color = rules[key] ? 'var(--stage-2-color)' : 'var(--accent-red)';
        }
    });
    
    // Calcular fortaleza (0-100%)
    const validRules = Object.values(rules).filter(Boolean).length;
    const strength = (validRules / 5) * 100;
    
    // Actualizar barra de fortaleza
    if (strengthBar) {
        strengthBar.style.width = `${strength}%`;
        if (strength < 40) {
            strengthBar.style.backgroundColor = 'var(--accent-red)';
        } else if (strength < 80) {
            strengthBar.style.backgroundColor = 'var(--stage-3-color)';
        } else {
            strengthBar.style.backgroundColor = 'var(--stage-2-color)';
        }
    }
    
    return validRules === 5; // Todas las reglas cumplidas
}

// Función para validar que las contraseñas coincidan
function validatePasswordMatch() {
    const password = document.getElementById('modalSignupPassword')?.value || '';
    const confirmPassword = document.getElementById('modalSignupConfirmPassword')?.value || '';
    const matchStatus = document.getElementById('matchStatus');
    const confirmError = document.getElementById('modalSignupConfirmPasswordError');
    
    if (!matchStatus) return false;
    
    if (!confirmPassword) {
        matchStatus.textContent = '✓ Las contraseñas coinciden';
        matchStatus.style.color = 'var(--accent-red)';
        if (confirmError) confirmError.textContent = '';
        return false;
    }
    
    const passwordsMatch = password === confirmPassword;
    
    if (passwordsMatch) {
        matchStatus.textContent = '✓ Las contraseñas coinciden';
        matchStatus.style.color = 'var(--stage-2-color)';
        if (confirmError) confirmError.textContent = '';
    } else {
        matchStatus.textContent = '✗ Las contraseñas no coinciden';
        matchStatus.style.color = 'var(--accent-red)';
        if (confirmError) confirmError.textContent = 'Las contraseñas no coinciden';
    }
    
    return passwordsMatch;
}

// Función para validar toda la contraseña (fortaleza + coincidencia)
function validateCompletePassword() {
    const email = document.getElementById('modalSignupEmail')?.value.trim() || '';
    const password = document.getElementById('modalSignupPassword')?.value;
    const confirmPassword = document.getElementById('modalSignupConfirmPassword')?.value;
    const passwordError = document.getElementById('modalSignupPasswordError');
    const confirmError = document.getElementById('modalSignupConfirmPasswordError');
    
    // Resetear errores
    if (passwordError) passwordError.textContent = '';
    if (confirmError) confirmError.textContent = '';
    
    // BLOQUEAR EMAILS ADMIN (verificación redundante por seguridad)
    if (ADMIN_EMAILS.includes(email?.toLowerCase())) {
        const emailError = document.getElementById('modalSignupEmailError');
        if (emailError) {
            emailError.textContent = '❌ Email reservado para administradores';
            emailError.style.color = 'var(--accent-red)';
        }
        return false;
    }
    
    // Validar longitud mínima
    if (password && password.length < 8) {
        if (passwordError) passwordError.textContent = 'La contraseña debe tener al menos 8 caracteres';
        return false;
    }
    
    // Validar reglas de complejidad
    const rules = {
        upper: /[A-Z]/.test(password || ''),
        lower: /[a-z]/.test(password || ''),
        number: /\d/.test(password || ''),
        symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password || '')
    };
    
    const missingRules = [];
    if (!rules.upper) missingRules.push('mayúscula');
    if (!rules.lower) missingRules.push('minúscula');
    if (!rules.number) missingRules.push('número');
    if (!rules.symbol) missingRules.push('símbolo');
    
    if (missingRules.length > 0) {
        if (passwordError) {
            passwordError.textContent = `Falta: ${missingRules.join(', ')}`;
        }
        return false;
    }
    
    // Validar coincidencia
    if (password !== confirmPassword) {
        if (confirmError) confirmError.textContent = 'Las contraseñas no coinciden';
        return false;
    }
    
    return true;
}

// ========== SISTEMA DE AUTENTICACIÓN FIREBASE MODULAR ==========
const loginModal = document.getElementById('loginModal');
const modalFormSection = document.getElementById('modalFormSection');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalSignupBtn = document.getElementById('modalSignupBtn');
const modalLoginBtn = document.getElementById('modalLoginBtn');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const authButtons = document.getElementById('auth-buttons');
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

// ========== FUNCIONES DE VERIFICACIÓN DE EMAIL ==========

// Verificar si un email está disponible (no admin y no registrado)
async function checkEmailAvailable(email) {
    // 1. Verificar si es email admin (BLOQUEAR)
    if (ADMIN_EMAILS.includes(email.toLowerCase())) {
        return {
            available: false,
            reason: 'admin-reserved',
            message: 'Este email está reservado para administradores existentes.'
        };
    }
    
    // 2. Verificar si ya está registrado
    const firebase = useFirebase();
    
    if (firebase.isAvailable) {
        try {
            const methods = await firebase.modules.fetchSignInMethodsForEmail(firebase.auth, email);
            
            if (methods && methods.length > 0) {
                return {
                    available: false,
                    reason: 'already-registered',
                    message: 'Este email ya está registrado. Inicia sesión o usa otro email.'
                };
            }
            
            // Email disponible
            return {
                available: true,
                reason: 'available',
                message: 'Email disponible'
            };
            
        } catch (error) {
            console.warn('Error verificando email en Firebase:', error);
            // Si no se puede verificar, permitir continuar
            return {
                available: true,
                reason: 'verification-failed',
                message: 'No se pudo verificar el email. Puedes intentar continuar.'
            };
        }
    } else {
        // Modo local
        const savedUser = JSON.parse(localStorage.getItem('guitarraFacilUser'));
        if (savedUser && savedUser.email === email) {
            return {
                available: false,
                reason: 'already-registered-local',
                message: 'Este email ya está registrado localmente.'
            };
        }
        
        return {
            available: true,
            reason: 'available-local',
            message: 'Email disponible (modo local)'
        };
    }
}

// Validar formulario de registro completo
async function validateSignupForm() {
    const name = document.getElementById('modalSignupName')?.value.trim();
    const email = document.getElementById('modalSignupEmail')?.value.trim();
    const password = document.getElementById('modalSignupPassword')?.value;
    const confirmPassword = document.getElementById('modalSignupConfirmPassword')?.value;
    
    const errors = [];
    
    // Validar nombre
    if (!name || name.length < 2) {
        errors.push('Nombre debe tener al menos 2 caracteres');
    }
    
    // Validar email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Email inválido');
    } else if (ADMIN_EMAILS.includes(email.toLowerCase())) {
        errors.push('❌ Email reservado para administradores');
    }
    
    // Validar contraseña
    if (!validateCompletePassword()) {
        errors.push('La contraseña no cumple los requisitos');
    }
    
    // Verificar disponibilidad del email
    if (email && !ADMIN_EMAILS.includes(email.toLowerCase())) {
        const availability = await checkEmailAvailable(email);
        if (!availability.available) {
            errors.push(availability.message);
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors,
        data: { name, email, password, confirmPassword }
    };
}

// ========== SISTEMA DE ESTADO DE FIREBASE ==========
const firebaseState = {
    available: false,
    auth: null,
    db: null,
    modules: null,
    lastChecked: null,
    retryAttempts: 0,
    maxRetries: 2
};

// Función para actualizar estado de Firebase
function updateFirebaseState() {
    const previousState = firebaseState.available;
    
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
        firebaseState.retryAttempts = 0;
        console.log("✅ Firebase Modular disponible");
    } else {
        firebaseState.auth = null;
        firebaseState.db = null;
        firebaseState.modules = null;
        console.warn("⚠️ Firebase Modular NO disponible");
    }
    
    firebaseState.lastChecked = Date.now();
    
    if (previousState !== firebaseState.available) {
        console.log(`Firebase: ${previousState ? 'ON' : 'OFF'} → ${firebaseState.available ? 'ON' : 'OFF'}`);
    }
    
    return firebaseState.available;
}

// Helper para usar Firebase de forma segura
function useFirebase() {
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
    if (!email) return false;
    
    // Primero verificar en la lista local de emails admin
    if (ADMIN_EMAILS.includes(email.toLowerCase())) {
        return true;
    }
    
    const firebase = useFirebase();
    
    return await firebase.safeOperation(
        'check-admin',
        async () => {
            try {
                // Verificar en colección 'admins' si existe
                const adminDoc = await firebase.modules.getDoc(
                    firebase.modules.doc(firebase.db, 'admins', email.toLowerCase())
                );
                
                // También verificar en colección 'users' si tiene rol admin
                const usersQuery = firebase.modules.query(
                    firebase.modules.collection(firebase.db, 'users'),
                    firebase.modules.where('email', '==', email.toLowerCase()),
                    firebase.modules.where('role', '==', 'admin')
                );
                
                const usersSnapshot = await firebase.modules.getDocs(usersQuery);
                
                return adminDoc.exists() || !usersSnapshot.empty;
            } catch (error) {
                console.warn("Error verificando admin en Firestore:", error);
                return false;
            }
        },
        false
    );
}

// Guardar/Actualizar usuario en Firestore
async function saveUserToFirestore(user) {
    const firebase = useFirebase();
    
    return await firebase.safeOperation(
        'save-user',
        async () => {
            // VERIFICACIÓN FINAL DE SEGURIDAD: Bloquear emails admin
            if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
                console.error('❌ Intento de registro con email admin bloqueado:', user.email);
                
                // IMPORTANTE: Eliminar el usuario recién creado si pasa la validación
                try {
                    await firebase.modules.deleteUser(user);
                } catch (deleteError) {
                    console.error('Error eliminando usuario no autorizado:', deleteError);
                }
                
                throw new Error('auth/admin-email-restricted');
            }
            
            const userRef = firebase.modules.doc(firebase.db, 'users', user.uid);
            const userSnap = await firebase.modules.getDoc(userRef);
            
            const isAdmin = await checkIfUserIsAdmin(user.email);
            
            if (!userSnap.exists()) {
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
                    lastLogin: firebase.modules.serverTimestamp(),
                    lastActivity: firebase.modules.serverTimestamp()
                });
                console.log("✅ Usuario creado en Firestore:", user.uid);
            } else {
                await firebase.modules.updateDoc(userRef, {
                    lastLogin: firebase.modules.serverTimestamp(),
                    lastActivity: firebase.modules.serverTimestamp()
                });
                console.log("✅ Usuario actualizado en Firestore:", user.uid);
            }
            return true;
        },
        false
    );
}

// Inicializar Firebase
function initializeFirebase() {
    console.log("🎯 Inicializando Firebase...");
    
    updateFirebaseState();
    
    if (firebaseState.available) {
        setupAuthObserver();
        console.log("✅ Firebase inicializado correctamente");
    } else {
        console.log("⚠️ Firebase no disponible, usando modo local");
        loadUserFromStorage();
        
        if (firebaseState.retryAttempts < firebaseState.maxRetries) {
            firebaseState.retryAttempts++;
            const retryDelay = firebaseState.retryAttempts * 2000;
            
            console.log(`Reintento ${firebaseState.retryAttempts} en ${retryDelay}ms...`);
            
            setTimeout(() => {
                if (updateFirebaseState()) {
                    setupAuthObserver();
                }
            }, retryDelay);
        }
    }
    
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

// Configurar observador de autenticación y sincronización
function setupAuthObserver() {
    const firebase = useFirebase();
    
    if (!firebase.isAvailable || !firebase.auth || !firebase.modules) {
        console.log("⚠️ Firebase no disponible para observador");
        return;
    }
    
    try {
        console.log("👁️ Configurando observador de autenticación y sincronización...");
        
        firebase.modules.onAuthStateChanged(firebase.auth, async (user) => {
            console.log("🔄 Cambio en estado de autenticación:", user ? `Usuario: ${user.email}` : "Sin usuario");
            
            if (user) {
                // Guardar/Actualizar usuario en Firestore
                await saveUserToFirestore(user);
                
                // Manejar usuario
                await handleFirebaseUser(user);
                
                // Configurar listener en tiempo real para cambios en el documento del usuario
                setupUserRealtimeListener(user.uid);
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

// Configurar listener en tiempo real para cambios en el usuario
let userListenerUnsubscribe = null;

function setupUserRealtimeListener(userId) {
    const firebase = useFirebase();
    
    if (!firebase.isAvailable || !firebase.db) {
        console.log("📴 Modo offline - no se puede configurar listener en tiempo real");
        return;
    }
    
    try {
        // Referencia al documento del usuario en Firestore
        const userDocRef = firebase.modules.doc(firebase.db, 'users', userId);
        
        // Configurar listener en tiempo real
        userListenerUnsubscribe = firebase.modules.onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                console.log("🔄 Cambios detectados en usuario:", userData.email);
                
                // Actualizar usuario local con los nuevos datos
                updateLocalUserWithFirestoreData(userData);
                
                // Actualizar la interfaz de usuario
                updateUIWithRealTimeData(userData);
            }
        }, (error) => {
            console.error("❌ Error en listener de usuario en tiempo real:", error);
        });
        
        console.log("✅ Listener en tiempo real configurado para usuario:", userId);
        
    } catch (error) {
        console.error("❌ Error configurando listener en tiempo real:", error);
    }
}

// Limpiar listeners de sincronización
function cleanupRealtimeListeners() {
    if (userListenerUnsubscribe) {
        userListenerUnsubscribe();
        userListenerUnsubscribe = null;
        console.log("🧹 Listener de usuario en tiempo real limpiado");
    }
}

// Actualizar usuario local con datos de Firestore
function updateLocalUserWithFirestoreData(userData) {
    // Guardar en localStorage
    const savedUser = JSON.parse(localStorage.getItem('guitarraFacilUser')) || {};
    
    const updatedUser = {
        ...savedUser,
        ...userData,
        // Mantener propiedades que no están en Firestore
        isFirebaseUser: savedUser.isFirebaseUser !== undefined ? savedUser.isFirebaseUser : true,
        firstName: userData.displayName ? userData.displayName.split(' ')[0] : savedUser.firstName,
        name: userData.displayName || savedUser.name,
        email: userData.email || savedUser.email,
        role: userData.role || savedUser.role,
        progress: userData.progress || savedUser.progress
    };
    
    // Actualizar fecha de createdAt si existe
    if (userData.createdAt && userData.createdAt.toDate) {
        updatedUser.createdAt = userData.createdAt.toDate().toISOString();
    }
    
    // Actualizar fecha de lastLogin si existe
    if (userData.lastLogin && userData.lastLogin.toDate) {
        updatedUser.lastLogin = userData.lastLogin.toDate().toISOString();
    }
    
    // Actualizar fecha de lastActivity si existe
    if (userData.lastActivity && userData.lastActivity.toDate) {
        updatedUser.lastActivity = userData.lastActivity.toDate().toISOString();
    }
    
    localStorage.setItem('guitarraFacilUser', JSON.stringify(updatedUser));
    currentUser = updatedUser;
    
    console.log("📱 Usuario local actualizado desde Firestore");
}

// Actualizar interfaz con datos en tiempo real
function updateUIWithRealTimeData(userData) {
    // Actualizar nombre en la barra de navegación
    const userNameElement = document.getElementById('user-name');
    if (userNameElement && userData.displayName) {
        const firstName = userData.displayName.split(' ')[0];
        if (userNameElement.textContent !== firstName) {
            userNameElement.textContent = firstName;
            console.log("👤 Nombre actualizado en tiempo real:", firstName);
        }
    }
    
    // Actualizar avatar si hay photoURL
    if (userData.photoURL && userAvatar) {
        userAvatar.src = userData.photoURL;
        userAvatar.style.display = 'block';
        const avatarContainer = document.getElementById('user-avatar-container');
        if (avatarContainer && !avatarContainer.querySelector('img')) {
            avatarContainer.innerHTML = '';
            avatarContainer.appendChild(userAvatar);
        }
    }
    
    // Actualizar mensajes de bienvenida
    const updates = [
        { id: 'user-name', value: userData.displayName?.split(' ')[0] || '' },
        { id: 'admin-welcome-name', value: userData.displayName || '' },
        { id: 'student-welcome-name', value: userData.displayName?.split(' ')[0] || '' },
        { id: 'admin-username', value: userData.displayName || '' },
        { id: 'admin-email', value: userData.email || '' }
    ];
    
    updates.forEach(update => {
        const element = document.getElementById(update.id);
        if (element && element.textContent !== update.value) {
            element.textContent = update.value;
        }
    });
    
    // Actualizar progreso del estudiante si existe
    if (userData.progress) {
        const progressUpdates = [
            { id: 'student-level', value: userData.progress.level || 1 },
            { id: 'student-progress', value: `${userData.progress.percentage || 0}%` },
            { id: 'student-lessons', value: userData.progress.lessons || 0 }
        ];
        
        progressUpdates.forEach(update => {
            const element = document.getElementById(update.id);
            if (element && element.textContent !== String(update.value)) {
                element.textContent = update.value;
            }
        });
    }
    
    // Actualizar visibilidad de admin
    const isAdmin = userData.role === 'admin';
    uiUpdater.updateAdminVisibility(isAdmin);
}

// Manejar usuario de Firebase
async function handleFirebaseUser(user) {
    console.log("👤 Procesando usuario de Firebase:", user.email);
    
    const isAdmin = await checkIfUserIsAdmin(user.email);
    
    currentUser = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        firstName: user.displayName ? user.displayName.split(' ')[0] : user.email.split('@')[0],
        displayName: user.displayName || user.email.split('@')[0],
        role: isAdmin ? 'admin' : 'student',
        isFirebaseUser: true,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        provider: user.providerData?.[0]?.providerId || 'email'
    };
    
    if (!user.displayName && user.email) {
        const nameFromEmail = user.email.split('@')[0];
        currentUser.name = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        currentUser.firstName = currentUser.name.split(' ')[0];
        currentUser.displayName = currentUser.name;
    }
    
    localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUser));
    updateUIForUser(currentUser);
    
    // Registrar actividad inicial
    updateUserActivity();
    
    // Notificar si es admin
    if (isAdmin) {
        console.log("👑 Usuario es administrador:", currentUser.email);
        showNotification(`¡Bienvenido Administrador ${currentUser.firstName}! 👑`, 'success');
    } else {
        console.log("👤 Usuario es estudiante:", currentUser.email);
    }
    
    console.log("✅ Usuario procesado:", currentUser.firstName, "Rol:", currentUser.role);
}

// Cargar usuario desde localStorage
function loadUserFromStorage() {
    const savedUser = localStorage.getItem('guitarraFacilUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        
        if (!currentUser.firstName && currentUser.name) {
            currentUser.firstName = currentUser.name.split(' ')[0];
        }
        
        updateUIForUser(currentUser);
        console.log("📂 Usuario cargado desde localStorage:", currentUser.email);
        
        // Registrar actividad inicial
        updateUserActivity();
    }
}

// UI Updater
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
        this.updateChangeNameButton(user);
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
    
    updateChangeNameButton(user) {
        const changeNameBtn = document.getElementById('change-name-btn');
        if (changeNameBtn) {
            changeNameBtn.style.display = 'flex';
        }
    },
    
    showAuthButtons() {
        if (authButtons) authButtons.style.display = 'flex';
        const changeNameBtn = document.getElementById('change-name-btn');
        if (changeNameBtn) changeNameBtn.style.display = 'none';
    },
    
    hideAuthButtons() {
        if (authButtons) authButtons.style.display = 'none';
    },
    
    showUserInfo(user) {
        const userInfo = document.getElementById('user-info');
        if (userInfo) userInfo.style.display = 'flex';
        if (userName) userName.textContent = user.firstName || user.name.split(' ')[0];
    },
    
    hideUserInfo() {
        const userInfo = document.getElementById('user-info');
        if (userInfo) userInfo.style.display = 'none';
    },
    
    updateAdminVisibility(isAdmin) {
        if (adminNavItem) {
            adminNavItem.style.display = isAdmin ? 'block' : 'none';
        }
        
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

// Actualizar UI según usuario
async function updateUIForUser(user) {
    if (user) {
        // Verificar si es admin (esto es redundante pero asegura consistencia)
        const isAdmin = await checkIfUserIsAdmin(user.email);
        
        // Actualizar rol si es necesario
        if (user.role !== 'admin' && isAdmin) {
            user.role = 'admin';
            localStorage.setItem('guitarraFacilUser', JSON.stringify(user));
        }
        
        uiUpdater.updateUserInfo(user);
        uiUpdater.updateAdminVisibility(isAdmin);
        
        if (!isAdmin) {
            updateStudentStats();
        }
        
        // Log para debugging
        console.log(`👤 UI Actualizada para: ${user.email}, Rol: ${user.role}, Es Admin: ${isAdmin}`);
    } else {
        uiUpdater.updateUserInfo(null);
        uiUpdater.updateAdminVisibility(false);
        
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
                    firstName: user.name.split(' ')[0],
                    displayName: user.name
                };
                localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUser));
                updateUIForUser(currentUser);
                
                // Registrar actividad inicial
                updateUserActivity();
                
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
            // BLOQUEAR emails admin en modo local también
            if (ADMIN_EMAILS.includes(email.toLowerCase())) {
                reject(new Error('auth/admin-email-restricted'));
                return;
            }
            
            const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
            
            currentUser = {
                name: name,
                firstName: name.split(' ')[0],
                displayName: name,
                email: email,
                role: isAdmin ? 'admin' : 'student',
                progress: { level: 1, percentage: 0, lessons: 0 },
                createdAt: new Date().toISOString(),
                isLocalUser: true
            };
            
            localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUser));
            updateUIForUser(currentUser);
            
            // Registrar actividad inicial
            updateUserActivity();
            
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
                        <input type="password" id="modalSignupPassword" 
                               placeholder="Crea una contraseña segura (mínimo 8 caracteres)" 
                               required 
                               oninput="validatePasswordStrength()">
                        <button type="button" id="toggleSignupPasswordBtn" 
                                style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--primary-blue); cursor: pointer;">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div id="passwordStrength" style="margin-top: 5px; font-size: 0.8rem;">
                        <div id="passwordRules">
                            <div id="ruleLength" style="color: var(--accent-red);">✓ Mínimo 8 caracteres</div>
                            <div id="ruleUpper" style="color: var(--accent-red);">✓ 1 mayúscula</div>
                            <div id="ruleLower" style="color: var(--accent-red);">✓ 1 minúscula</div>
                            <div id="ruleNumber" style="color: var(--accent-red);">✓ 1 número</div>
                            <div id="ruleSymbol" style="color: var(--accent-red);">✓ 1 símbolo</div>
                        </div>
                        <div id="passwordStrengthBar" style="height: 4px; background: #ccc; margin-top: 5px; border-radius: 2px; overflow: hidden;">
                            <div id="strengthBar" style="height: 100%; width: 0%; background: var(--accent-red); transition: width 0.3s;"></div>
                        </div>
                    </div>
                    <span class="error-message" id="modalSignupPasswordError"></span>
                </div>
                
                <div class="modal-form-group">
                    <label for="modalSignupConfirmPassword">Confirmar Contraseña</label>
                    <div class="modal-input-with-icon" id="modalSignupConfirmPasswordContainer">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="modalSignupConfirmPassword" 
                               placeholder="Confirma tu contraseña" 
                               required
                               oninput="validatePasswordMatch()">
                        <button type="button" id="toggleConfirmPasswordBtn" 
                                style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--primary-blue); cursor: pointer;">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div id="passwordMatch" style="margin-top: 5px; font-size: 0.8rem;">
                        <div id="matchStatus" style="color: var(--accent-red);">✓ Las contraseñas coinciden</div>
                    </div>
                    <span class="error-message" id="modalSignupConfirmPasswordError"></span>
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
        
        if (togglePasswordBtn && passwordInput) {
            togglePasswordBtn.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
        }
        
        if (switchToSignup) {
            switchToSignup.addEventListener('click', function(e) {
                e.preventDefault();
                currentFormType = 'signup';
                loadForm('signup');
            });
        }
        
        if (forgotPassword) {
            forgotPassword.addEventListener('click', function(e) {
                e.preventDefault();
                handleForgotPassword();
            });
        }
        
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleSocialLogin('google');
            });
        }
        
        if (githubLoginBtn) {
            githubLoginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleSocialLogin('github');
            });
        }
        
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleLogin();
            });
        }
    } else {
        const signupForm = document.getElementById('modalSignupForm');
        const passwordInput = document.getElementById('modalSignupPassword');
        const confirmPasswordInput = document.getElementById('modalSignupConfirmPassword');
        const togglePasswordBtn = document.getElementById('toggleSignupPasswordBtn');
        const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPasswordBtn');
        const switchToLogin = document.getElementById('modalSwitchToLogin');
        const googleSignupBtn = document.getElementById('googleSignupBtn');
        const githubSignupBtn = document.getElementById('githubSignupBtn');
        
        // Toggle para mostrar/ocultar contraseña principal
        if (togglePasswordBtn && passwordInput) {
            togglePasswordBtn.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
        }
        
        // Toggle para mostrar/ocultar confirmación de contraseña
        if (toggleConfirmPasswordBtn && confirmPasswordInput) {
            toggleConfirmPasswordBtn.addEventListener('click', function() {
                const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                confirmPasswordInput.setAttribute('type', type);
                this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
        }
        
        // Validación en tiempo real de contraseña
        if (passwordInput) {
            passwordInput.addEventListener('input', validatePasswordStrength);
        }
        
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', validatePasswordMatch);
        }
        
        // Validación en tiempo real de email
        const emailInput = document.getElementById('modalSignupEmail');
        if (emailInput) {
            let validationTimeout;
            
            emailInput.addEventListener('input', function() {
                clearTimeout(validationTimeout);
                const email = this.value.trim();
                const errorElement = document.getElementById('modalSignupEmailError');
                const submitBtn = document.getElementById('modalSignupSubmitBtn');
                
                // Limpiar errores previos
                if (errorElement) errorElement.textContent = '';
                
                if (!email) {
                    return;
                }
                
                // Validar formato de email
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    if (errorElement) {
                        errorElement.textContent = 'Email inválido';
                        errorElement.style.color = 'var(--accent-red)';
                    }
                    if (submitBtn) submitBtn.disabled = true;
                    return;
                }
                
                validationTimeout = setTimeout(async () => {
                    // Primero: Verificar si es email admin (BLOQUEAR)
                    if (ADMIN_EMAILS.includes(email.toLowerCase())) {
                        if (errorElement) {
                            errorElement.innerHTML = '❌ <strong>Email reservado para administradores</strong><br><small>Si eres admin, inicia sesión. Si no, usa otro email.</small>';
                            errorElement.style.color = 'var(--accent-red)';
                            errorElement.style.fontWeight = 'bold';
                        }
                        if (submitBtn) {
                            submitBtn.disabled = true;
                            submitBtn.style.opacity = '0.5';
                            submitBtn.style.cursor = 'not-allowed';
                        }
                        return;
                    }
                    
                    // Segundo: Verificar si el email ya existe (Firestore o local)
                    try {
                        const firebase = useFirebase();
                        
                        if (firebase.isAvailable) {
                            // Verificar en Firebase
                            const methods = await firebase.modules.fetchSignInMethodsForEmail(firebase.auth, email);
                            
                            if (methods && methods.length > 0) {
                                if (errorElement) {
                                    errorElement.innerHTML = '⚠️ Este email ya está registrado<br><small>Si es tu cuenta, <a href="#" style="color: var(--primary-blue); text-decoration: underline;" onclick="openModal(\'login\')">inicia sesión</a></small>';
                                    errorElement.style.color = 'var(--stage-3-color)';
                                }
                                if (submitBtn) {
                                    submitBtn.disabled = true;
                                    submitBtn.style.opacity = '0.5';
                                }
                                return;
                            }
                        } else {
                            // Verificar en modo local
                            const savedUser = JSON.parse(localStorage.getItem('guitarraFacilUser'));
                            if (savedUser && savedUser.email === email) {
                                if (errorElement) {
                                    errorElement.innerHTML = '⚠️ Este email ya está registrado localmente<br><small>Si es tu cuenta, <a href="#" style="color: var(--primary-blue); text-decoration: underline;" onclick="openModal(\'login\')">inicia sesión</a></small>';
                                    errorElement.style.color = 'var(--stage-3-color)';
                                }
                                if (submitBtn) {
                                    submitBtn.disabled = true;
                                    submitBtn.style.opacity = '0.5';
                                }
                                return;
                            }
                        }
                        
                        // Email válido y disponible
                        if (errorElement) errorElement.textContent = '';
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.style.opacity = '1';
                            submitBtn.style.cursor = 'pointer';
                        }
                        
                    } catch (error) {
                        console.warn("Error verificando email:", error);
                        // Si hay error en la verificación, permitir continuar pero mostrar advertencia
                        if (errorElement) {
                            errorElement.textContent = '⚠️ No se pudo verificar el email. Intenta de nuevo.';
                            errorElement.style.color = 'var(--stage-3-color)';
                        }
                    }
                }, 800); // Delay mayor para no hacer demasiadas peticiones
            });
        }
        
        if (switchToLogin) {
            switchToLogin.addEventListener('click', function(e) {
                e.preventDefault();
                currentFormType = 'login';
                loadForm('login');
            });
        }
        
        if (googleSignupBtn) {
            googleSignupBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleSocialLogin('google');
            });
        }
        
        if (githubSignupBtn) {
            githubSignupBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleSocialLogin('github');
            });
        }
        
        if (signupForm) {
            signupForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleSignup();
            });
        }
    }
}

// Manejar login con redes sociales
async function handleSocialLogin(providerType) {
    const firebase = useFirebase();
    const submitBtn = document.getElementById('modalSubmitBtn') || document.getElementById('modalSignupSubmitBtn');
    
    if (!submitBtn) return;
    
    const originalContent = submitBtn.innerHTML;
    const originalDisabled = submitBtn.disabled;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Conectando con ${providerType === 'google' ? 'Google' : 'GitHub'}...`;
    
    if (!firebase.isAvailable) {
        submitBtn.innerHTML = '<i class="fas fa-times"></i> Error';
        submitBtn.classList.add('error-btn');
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            submitBtn.classList.remove('error-btn');
            showNotification('Firebase no está disponible. Por favor, usa el registro por email.', 'error');
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
            showNotification(errorMessage, 'error');
        }, 1000);
    }
}

// Manejar login
async function handleLogin() {
    const email = document.getElementById('modalEmail')?.value.trim();
    const password = document.getElementById('modalPassword')?.value;
    const submitBtn = document.getElementById('modalSubmitBtn');
    
    if (!submitBtn) return;
    
    if (!email || !password) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Por favor, ingresa un email válido', 'error');
        return;
    }
    
    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
    
    try {
        const firebase = useFirebase();
        
        if (firebase.isAvailable) {
            await firebase.safeOperation(
                'login',
                async () => {
                    const userCredential = await firebase.modules.signInWithEmailAndPassword(
                        firebase.auth, email, password
                    );
                    return userCredential.user;
                },
                async () => {
                    return await handleLocalLogin(email, password);
                }
            );
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Éxito!';
            submitBtn.classList.add('success-btn');
            
            setTimeout(() => {
                closeModal();
            }, 1000);
            
        } else {
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
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            submitBtn.classList.remove('error-btn');
            showNotification(errorMessage, 'error');
        }, 1000);
    }
}

// Manejar registro
async function handleSignup() {
    const submitBtn = document.getElementById('modalSignupSubmitBtn');
    if (!submitBtn) return;
    
    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Validando...';
    
    try {
        // 1. Validar formulario completo
        const validation = await validateSignupForm();
        
        if (!validation.isValid) {
            throw new Error(validation.errors.join('\n'));
        }
        
        const { name, email, password } = validation.data;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando cuenta...';
        
        // 2. Procesar registro
        const firebase = useFirebase();
        
        if (firebase.isAvailable) {
            // PRIMERO: Verificación final antes de crear cuenta
            if (ADMIN_EMAILS.includes(email.toLowerCase())) {
                throw new Error('auth/admin-email-restricted');
            }
            
            // Registro con Firebase
            const userCredential = await firebase.modules.createUserWithEmailAndPassword(
                firebase.auth, email, password
            );
            const user = userCredential.user;
            
            await firebase.modules.updateProfile(user, { displayName: name });
            await saveUserToFirestore(user);
            
        } else {
            // Registro local
            await handleLocalSignup(name, email, password);
        }
        
        // 3. Éxito
        submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Cuenta creada!';
        submitBtn.classList.add('success-btn');
        
        setTimeout(() => {
            closeModal();
            showNotification(`¡Bienvenido ${name.split(' ')[0]}! 🎸\nCuenta creada exitosamente.`, 'success');
        }, 1500);
        
    } catch (error) {
        console.error('❌ Error en registro:', error);
        
        submitBtn.innerHTML = '<i class="fas fa-times"></i> Error';
        submitBtn.classList.add('error-btn');
        
        // Mensajes de error específicos
        let errorMessage = 'Error al crear la cuenta';
        const errorMap = {
            'auth/email-already-in-use': 'Este email ya está registrado. Por favor, inicia sesión o usa otro email.',
            'auth/admin-email-restricted': '❌ Email reservado para administradores. Usa otro email.',
            'auth/invalid-email': 'Email inválido',
            'auth/weak-password': 'Contraseña muy débil. Debe tener al menos 8 caracteres con mayúsculas, minúsculas, números y símbolos.',
            'auth/operation-not-allowed': 'El registro con email/contraseña no está habilitado',
            'Este email ya está registrado en modo local': 'Este email ya está registrado localmente.'
        };
        
        errorMessage = errorMap[error.code] || errorMap[error.message] || error.message || errorMessage;
        
        // Limpiar campos si es error de email
        if (error.code === 'auth/email-already-in-use' || 
            error.code === 'auth/admin-email-restricted' ||
            error.message.includes('Email reservado') ||
            error.message.includes('ya está registrado')) {
            
            const emailInput = document.getElementById('modalSignupEmail');
            if (emailInput) emailInput.value = '';
            
            const emailError = document.getElementById('modalSignupEmailError');
            if (emailError) {
                emailError.textContent = errorMessage.split('\n')[0];
                emailError.style.color = 'var(--accent-red)';
            }
        }
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            submitBtn.classList.remove('error-btn');
            showNotification(errorMessage, 'error');
        }, 2000);
    }
}

// Manejar "Olvidé mi contraseña"
async function handleForgotPassword() {
    const email = prompt('Por favor, ingresa tu email para recuperar tu contraseña:');
    
    if (!email) return;
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Por favor, ingresa un email válido.', 'error');
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
            
            showNotification(`✅ Se ha enviado un enlace de recuperación a:\n\n${email}\n\nRevisa tu bandeja de entrada.`, 'success');
            
        } else {
            showNotification(`⚠️ En modo local:\n\nSe simularía el envío de email a:\n\n${email}`, 'info');
        }
        
    } catch (error) {
        console.error('Error al enviar email de recuperación:', error);
        
        const errorMessages = {
            'auth/user-not-found': 'No existe una cuenta con este email',
            'auth/invalid-email': 'Email inválido'
        };
        
        const errorMessage = errorMessages[error.code] || error.message || 'Error al enviar el email';
        showNotification(`Error: ${errorMessage}`, 'error');
    }
}

// Manejar logout
async function handleLogout() {
    try {
        const firebase = useFirebase();
        
        // Limpiar listeners de sincronización
        cleanupRealtimeListeners();
        
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
        
        currentUser = null;
        localStorage.removeItem('guitarraFacilUser');
        updateUIForUser(null);
        
        showNotification('Sesión cerrada exitosamente. ¡Hasta pronto! 🎸', 'success');
        
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        showNotification('Error al cerrar sesión. Intenta de nuevo.', 'error');
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

// Event Listeners de autenticación
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

// Cerrar modal de cambio de nombre al hacer clic fuera
if (changeNameModal) {
    changeNameModal.addEventListener('click', function(e) {
        if (e.target === changeNameModal) {
            closeChangeNameModal();
        }
    });
}

// ========== SISTEMA DE MENSAJES DEL ADMIN CON FIRESTORE ==========

// Estado de los mensajes
let adminMessages = [];
let messagesUnsubscribe = null;
let isMessagesInitialized = false;

// Colección de Firestore para mensajes
const MESSAGES_COLLECTION = 'adminMessages';

// Elementos del DOM de mensajes
const askForm = document.getElementById('askForm');
const messagesList = document.getElementById('messagesList');
const emptyState = document.getElementById('emptyState');

// Función para obtener la referencia a la colección de mensajes
function getMessagesCollection() {
    const firebase = useFirebase();
    if (!firebase.isAvailable || !firebase.db) return null;
    return firebase.modules.collection(firebase.db, MESSAGES_COLLECTION);
}

// Función para inicializar la sincronización de mensajes en tiempo real
async function initMessagesSync() {
    const firebase = useFirebase();
    const syncStatus = document.getElementById('syncStatus');
    
    if (!firebase.isAvailable) {
        // Modo offline - usar localStorage
        console.log('📴 Modo offline para mensajes');
        if (syncStatus) {
            syncStatus.innerHTML = '<i class="fas fa-circle sync-disconnected"></i> <span>Modo offline</span>';
        }
        loadMessagesFromLocalStorage();
        return;
    }
    
    const messagesCollection = getMessagesCollection();
    if (!messagesCollection) {
        console.error('❌ No se pudo obtener la colección de mensajes');
        return;
    }
    
    try {
        // Ordenar por fecha de creación (más reciente primero)
        const q = firebase.modules.query(
            messagesCollection,
            firebase.modules.orderBy('createdAt', 'desc')
        );
        
        // Configurar listener en tiempo real
        messagesUnsubscribe = firebase.modules.onSnapshot(q, (snapshot) => {
            adminMessages = [];
            snapshot.forEach((doc) => {
                const messageData = doc.data();
                adminMessages.push({
                    id: doc.id,
                    ...messageData,
                    // Convertir Firestore Timestamp a Date si existe
                    createdAt: messageData.createdAt?.toDate?.() || new Date(messageData.createdAt),
                    updatedAt: messageData.updatedAt?.toDate?.() || null
                });
            });
            
            // Actualizar UI
            updateSyncStatus(true);
            displayMessages();
            updateMessageCount();
            saveMessagesToLocalStorage();
            
            console.log(`✅ ${adminMessages.length} mensajes sincronizados`);
        });
        
        console.log('🔗 Listener de mensajes configurado en tiempo real');
        
    } catch (error) {
        console.error('❌ Error configurando listener de mensajes:', error);
        updateSyncStatus(false);
        loadMessagesFromLocalStorage();
    }
}

// Actualizar estado de sincronización
function updateSyncStatus(isConnected) {
    const syncStatus = document.getElementById('syncStatus');
    if (!syncStatus) return;
    
    if (isConnected) {
        syncStatus.innerHTML = '<i class="fas fa-circle sync-connected"></i> <span>Sincronizado</span>';
        syncStatus.querySelector('i').className = 'fas fa-circle sync-connected';
    } else {
        syncStatus.innerHTML = '<i class="fas fa-circle sync-disconnected"></i> <span>Sin conexión</span>';
        syncStatus.querySelector('i').className = 'fas fa-circle sync-disconnected';
    }
}

// Guardar mensajes en localStorage
function saveMessagesToLocalStorage() {
    try {
        const messagesToSave = adminMessages.map(msg => ({
            ...msg,
            createdAt: msg.createdAt instanceof Date ? msg.createdAt.toISOString() : msg.createdAt,
            updatedAt: msg.updatedAt instanceof Date ? msg.updatedAt.toISOString() : msg.updatedAt
        }));
        localStorage.setItem('adminMessages', JSON.stringify(messagesToSave));
    } catch (error) {
        console.error('❌ Error guardando mensajes en localStorage:', error);
    }
}

// Cargar mensajes desde localStorage
function loadMessagesFromLocalStorage() {
    try {
        const savedMessages = localStorage.getItem('adminMessages');
        if (savedMessages) {
            adminMessages = JSON.parse(savedMessages).map(msg => ({
                ...msg,
                createdAt: new Date(msg.createdAt),
                updatedAt: msg.updatedAt ? new Date(msg.updatedAt) : null
            }));
            displayMessages();
            updateMessageCount();
            console.log(`📂 ${adminMessages.length} mensajes cargados desde localStorage`);
        }
    } catch (error) {
        console.error('❌ Error cargando mensajes desde localStorage:', error);
        adminMessages = [];
    }
}

// Publicar nuevo mensaje en Firestore
async function publishMessageToFirestore(messageData) {
    const firebase = useFirebase();
    
    if (!firebase.isAvailable) {
        // Modo offline - agregar al array local
        const newMessage = {
            id: Date.now().toString(),
            ...messageData,
            createdAt: new Date(),
            isLocal: true
        };
        adminMessages.unshift(newMessage);
        saveMessagesToLocalStorage();
        displayMessages();
        updateMessageCount();
        return newMessage.id;
    }
    
    try {
        const messagesCollection = getMessagesCollection();
        if (!messagesCollection) {
            throw new Error('No se pudo acceder a la colección de mensajes');
        }
        
        // Crear documento con ID automático
        const newMessageRef = firebase.modules.doc(messagesCollection);
        
        const messageWithMetadata = {
            ...messageData,
            createdAt: firebase.modules.serverTimestamp(),
            updatedAt: firebase.modules.serverTimestamp()
        };
        
        await firebase.modules.setDoc(newMessageRef, messageWithMetadata);
        
        console.log('✅ Mensaje publicado en Firestore:', newMessageRef.id);
        return newMessageRef.id;
        
    } catch (error) {
        console.error('❌ Error publicando mensaje en Firestore:', error);
        throw error;
    }
}

// Eliminar mensaje de Firestore
async function deleteMessageFromFirestore(messageId) {
    const firebase = useFirebase();
    
    if (!firebase.isAvailable) {
        // Modo offline - eliminar del array local
        adminMessages = adminMessages.filter(msg => msg.id !== messageId);
        saveMessagesToLocalStorage();
        displayMessages();
        updateMessageCount();
        return true;
    }
    
    try {
        const messagesCollection = getMessagesCollection();
        if (!messagesCollection) {
            throw new Error('No se pudo acceder a la colección de mensajes');
        }
        
        const messageRef = firebase.modules.doc(messagesCollection, messageId);
        await firebase.modules.deleteDoc(messageRef);
        
        console.log('✅ Mensaje eliminado de Firestore:', messageId);
        return true;
        
    } catch (error) {
        console.error('❌ Error eliminando mensaje de Firestore:', error);
        throw error;
    }
}

// Eliminar todos los mensajes de Firestore
async function deleteAllMessagesFromFirestore() {
    const firebase = useFirebase();
    
    if (!firebase.isAvailable) {
        // Modo offline - limpiar array local
        adminMessages = [];
        saveMessagesToLocalStorage();
        displayMessages();
        updateMessageCount();
        return true;
    }
    
    try {
        const messagesCollection = getMessagesCollection();
        if (!messagesCollection) {
            throw new Error('No se pudo acceder a la colección de mensajes');
        }
        
        // Obtener todos los mensajes
        const snapshot = await firebase.modules.getDocs(messagesCollection);
        
        // Eliminar cada documento
        const deletePromises = [];
        snapshot.forEach((doc) => {
            deletePromises.push(firebase.modules.deleteDoc(firebase.modules.doc(messagesCollection, doc.id)));
        });
        
        await Promise.all(deletePromises);
        
        console.log(`✅ ${snapshot.size} mensajes eliminados de Firestore`);
        return true;
        
    } catch (error) {
        console.error('❌ Error eliminando todos los mensajes de Firestore:', error);
        throw error;
    }
}

// Función para formatear fecha relativa
function formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Obtener clase CSS para categoría
function getCategoryClass(category) {
    const categoryClasses = {
        'general': 'category-general',
        'tecnica': 'category-tecnica',
        'consejo': 'category-consejo',
        'anuncio': 'category-anuncio',
        'mantenimiento': 'category-mantenimiento'
    };
    return categoryClasses[category] || 'category-general';
}

// Obtener ícono para categoría
function getCategoryIcon(category) {
    const categoryIcons = {
        'general': 'fa-bullhorn',
        'tecnica': 'fa-guitar',
        'consejo': 'fa-lightbulb',
        'anuncio': 'fa-exclamation-circle',
        'mantenimiento': 'fa-tools'
    };
    return categoryIcons[category] || 'fa-bullhorn';
}

// Verificar si el usuario actual es admin
function isCurrentUserAdmin() {
    const userData = JSON.parse(localStorage.getItem('guitarraFacilUser'));
    return userData && userData.role === 'admin';
}

// Mostrar los mensajes
function displayMessages() {
    if (!messagesList) return;
    
    messagesList.innerHTML = '';
    
    if (adminMessages.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    adminMessages.forEach(message => {
        const messageCard = document.createElement('div');
        messageCard.className = 'question-card fade-in';
        messageCard.dataset.id = message.id;
        
        // Formatear fecha
        const date = message.createdAt instanceof Date ? message.createdAt : new Date(message.createdAt);
        const formattedDate = date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const relativeTime = formatRelativeTime(date);
        const categoryClass = getCategoryClass(message.category || 'general');
        const categoryIcon = getCategoryIcon(message.category || 'general');
        
        messageCard.innerHTML = `
            <div class="question-header">
                <h3 class="question-title">
                    ${message.title}
                    <span class="message-category-badge ${categoryClass}">
                        <i class="fas ${categoryIcon}"></i> ${message.category || 'General'}
                    </span>
                </h3>
                <div class="question-meta">
                    <div class="question-author">
                        <i class="fas fa-user-shield"></i> ${message.author}
                        <span class="admin-badge">Admin</span>
                    </div>
                    <div class="question-date">
                        <i class="far fa-calendar"></i> ${formattedDate}
                    </div>
                </div>
            </div>
            
            <div class="question-content">
                ${message.content}
            </div>
            
            <div class="message-timestamp">
                <i class="far fa-clock"></i> ${relativeTime}
                ${message.isLocal ? '<span style="color: var(--stage-3-color);"><i class="fas fa-exclamation-circle"></i> Pendiente de sincronizar</span>' : ''}
            </div>
            
            <!-- BOTONES DE ACCIÓN (SOLO PARA ADMINS) -->
            <div class="question-actions" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                <button class="btn-outline delete-message-btn" data-id="${message.id}" style="padding: 5px 15px; font-size: 0.8rem;">
                    <i class="fas fa-trash"></i> Eliminar Mensaje
                </button>
            </div>
        `;
        
        messagesList.appendChild(messageCard);
        
        // Añadir evento para eliminar mensaje
        const deleteBtn = messageCard.querySelector('.delete-message-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                deleteAdminMessage(message.id);
            });
        }
    });
    
    // Actualizar visibilidad de botones de acción
    updateMessageActionsVisibility();
}

// Actualizar contador de mensajes
function updateMessageCount() {
    const messageCount = document.getElementById('messageCount');
    const liveMessageCount = document.getElementById('liveMessageCount');
    
    if (messageCount) {
        messageCount.textContent = adminMessages.length;
    }
    if (liveMessageCount) {
        liveMessageCount.textContent = adminMessages.length;
    }
}

// Función para refrescar mensajes manualmente
async function refreshMessages() {
    const refreshBtn = document.querySelector('[onclick="refreshMessages()"]');
    const originalContent = refreshBtn.innerHTML;
    
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
    
    try {
        const firebase = useFirebase();
        
        if (firebase.isAvailable) {
            // Forzar recarga desde Firestore
            const messagesCollection = getMessagesCollection();
            if (messagesCollection) {
                const snapshot = await firebase.modules.getDocs(
                    firebase.modules.query(messagesCollection, firebase.modules.orderBy('createdAt', 'desc'))
                );
                
                adminMessages = [];
                snapshot.forEach((doc) => {
                    const messageData = doc.data();
                    adminMessages.push({
                        id: doc.id,
                        ...messageData,
                        createdAt: messageData.createdAt?.toDate?.() || new Date(messageData.createdAt),
                    });
                });
                
                displayMessages();
                updateMessageCount();
                saveMessagesToLocalStorage();
                
                showNotification(`✅ ${adminMessages.length} mensajes actualizados`, 'success');
            }
        } else {
            showNotification('⚠️ Modo offline - usando mensajes locales', 'info');
        }
    } catch (error) {
        console.error('❌ Error refrescando mensajes:', error);
        showNotification('Error al actualizar mensajes', 'error');
    } finally {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = originalContent;
    }
}

// Función para eliminar un mensaje del admin
async function deleteAdminMessage(messageId) {
    // Verificar que el usuario sea admin
    if (!isCurrentUserAdmin()) {
        showNotification('Solo los administradores pueden eliminar mensajes', 'error');
        return;
    }
    
    if (!confirm('¿Estás seguro de que quieres eliminar este mensaje?\nEsta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        await deleteMessageFromFirestore(messageId);
        showNotification('Mensaje eliminado correctamente', 'success');
    } catch (error) {
        console.error('❌ Error eliminando mensaje:', error);
        showNotification('Error al eliminar el mensaje', 'error');
    }
}

// Función para eliminar todos los mensajes
window.deleteAllMessages = async function() {
    if (!isCurrentUserAdmin()) {
        showNotification('Solo los administradores pueden eliminar mensajes', 'error');
        return;
    }
    
    if (!confirm('¿Estás seguro de que quieres eliminar TODOS los mensajes?\nEsta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        await deleteAllMessagesFromFirestore();
        showNotification('Todos los mensajes han sido eliminados', 'success');
    } catch (error) {
        console.error('❌ Error eliminando todos los mensajes:', error);
        showNotification('Error al eliminar los mensajes', 'error');
    }
};

// Formulario para nuevo mensaje
if (askForm) {
    askForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Verificar que el usuario sea admin
        if (!isCurrentUserAdmin()) {
            showNotification('Solo los administradores pueden publicar mensajes', 'error');
            return;
        }
        
        const messageTitle = document.getElementById('messageTitle').value.trim();
        const messageContent = document.getElementById('messageContent').value.trim();
        const messageCategory = document.getElementById('messageCategory').value;
        const submitBtn = document.getElementById('submitMessageBtn');
        
        if (!messageTitle || !messageContent) {
            showNotification('Por favor completa todos los campos', 'error');
            return;
        }
        
        // Obtener información del usuario actual
        const userData = JSON.parse(localStorage.getItem('guitarraFacilUser'));
        
        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publicando...';
        
        try {
            const messageData = {
                title: messageTitle,
                content: messageContent,
                category: messageCategory,
                author: userData.name || 'Administrador',
                authorEmail: userData.email,
                authorId: userData.uid || 'local',
                isAdmin: true
            };
            
            await publishMessageToFirestore(messageData);
            
            // Limpiar formulario
            askForm.reset();
            
            // Mostrar mensaje de éxito
            showNotification('¡Mensaje publicado con éxito! Todos los usuarios lo verán.', 'success');
            
        } catch (error) {
            console.error('❌ Error publicando mensaje:', error);
            showNotification('Error al publicar el mensaje', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
        }
    });
}

// Actualizar visibilidad del formulario según el rol
function updateMessagesFormVisibility() {
    const isAdmin = isCurrentUserAdmin();
    const askSection = document.querySelector('.ask-section');
    const studentMessage = document.querySelector('.student-only');
    
    if (askSection && studentMessage) {
        if (isAdmin) {
            askSection.style.display = 'block';
            studentMessage.style.display = 'none';
        } else {
            askSection.style.display = 'none';
            studentMessage.style.display = 'block';
        }
    }
    
    updateMessageActionsVisibility();
}

// Actualizar visibilidad de botones de acción
function updateMessageActionsVisibility() {
    const isAdmin = isCurrentUserAdmin();
    const actionDivs = document.querySelectorAll('.question-actions');
    
    if (isAdmin) {
        actionDivs.forEach(div => {
            div.style.display = 'block';
        });
    } else {
        actionDivs.forEach(div => {
            div.style.display = 'none';
        });
    }
}

// Inicializar mensajes
function initMessages() {
    if (document.getElementById('foro')) {
        console.log('💬 Inicializando sistema de mensajes...');
        initMessagesSync();
        updateMessagesFormVisibility();
        isMessagesInitialized = true;
    }
}

// ========== PANEL DE ADMINISTRACIÓN ==========
let adminUsers = [];
const userCache = {
    cache: new Map(),
    timeout: 2 * 60 * 1000,
    
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
    const userData = JSON.parse(localStorage.getItem('guitarraFacilUser'));
    if (!userData || userData.role !== 'admin') {
        showNotification("⚠️ Acceso denegado. Solo administradores pueden acceder a esta página.", 'error');
        showPage('index');
        return;
    }
    
    // Actualizar información del admin
    const updates = [
        { id: 'admin-username', value: userData.firstName || userData.name },
        { id: 'admin-email', value: userData.email }
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

// Cargar todos los usuarios
async function loadAllUsers() {
    const usersList = document.getElementById('users-list');
    if (!usersList) return;
    
    const cachedUsers = userCache.get('allUsers');
    if (cachedUsers) {
        adminUsers = cachedUsers;
        updateUsersTable();
        updateAdminStats();
        // LLAMAR A updateCharts() DESPUÉS de actualizar adminUsers
        updateCharts();
        console.log("📦 Usuarios cargados desde caché");
        return;
    }
    
    usersList.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin"></i> Cargando usuarios...</td></tr>';
    
    try {
        const firebase = useFirebase();
        
        if (firebase.isAvailable) {
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
                    lastLogin: userData.lastLogin?.toDate() || null,
                    lastActivity: userData.lastActivity?.toDate() || null
                });
            });
            
            console.log(`✅ ${adminUsers.length} usuarios cargados desde Firestore`);
            
        } else {
            // Datos demo para desarrollo
            adminUsers = [
                {
                    id: '1',
                    email: 'jv4491816@gmail.com',
                    displayName: 'Juan Villar',
                    role: 'admin',
                    createdAt: new Date('2024-01-01'),
                    lastLogin: new Date(),
                    lastActivity: new Date(),
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
                    lastActivity: new Date(Date.now() - 10 * 60 * 1000), // 10 minutos atrás
                    progress: { level: 4, percentage: 70, lessons: 20 }
                },
                {
                    id: '3',
                    email: 'estudiante@demo.com',
                    displayName: 'Estudiante Demo',
                    role: 'student',
                    createdAt: new Date('2024-01-03'),
                    lastLogin: new Date(),
                    lastActivity: new Date(),
                    progress: { level: 2, percentage: 40, lessons: 10 }
                },
                {
                    id: '4',
                    email: 'usuario@demo.com',
                    displayName: 'Usuario Regular',
                    role: 'student',
                    createdAt: new Date('2024-01-04'),
                    lastLogin: null,
                    lastActivity: null,
                    progress: { level: 1, percentage: 10, lessons: 2 }
                }
            ];
            
            console.log(`📋 ${adminUsers.length} usuarios demo cargados`);
        }
        
        userCache.set('allUsers', adminUsers);
        updateUsersTable();
        updateAdminStats();
        // LLAMAR A updateCharts() DESPUÉS de tener los datos
        updateCharts();
        
    } catch (error) {
        console.error('❌ Error cargando usuarios:', error);
        usersList.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--accent-red);"><i class="fas fa-exclamation-triangle"></i> Error al cargar usuarios</td></tr>';
    }
}

// Actualizar tabla de usuarios
// Actualizar tabla de usuarios - VERSIÓN CORREGIDA
function updateUsersTable() {
    const usersList = document.getElementById('users-list');
    if (!usersList || !adminUsers.length) {
        usersList.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No hay usuarios para mostrar</td></tr>';
        return;
    }
    
    const fragment = document.createDocumentFragment();
    const userData = JSON.parse(localStorage.getItem('guitarraFacilUser'));
    
    adminUsers.forEach(user => {
        // Determinar si el usuario está activo (basado en lastActivity o lastLogin)
        const lastActivity = user.lastActivity || user.lastLogin;
        const isActive = lastActivity && (new Date() - lastActivity) < (5 * 60 * 1000); // 5 minutos
        
        const isCurrentUser = user.email === userData?.email;
        const isAdmin = user.role === 'admin';
        
        const displayName = user.displayName || user.email.split('@')[0];
        const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        
        const registerDate = user.createdAt ? user.createdAt.toLocaleDateString() : 'N/A';
        const lastAccess = lastActivity ? 
            lastActivity.toLocaleDateString() + ' ' + lastActivity.toLocaleTimeString().substring(0, 5) : 
            'Nunca';
        
        // CORRECCIÓN: Usar las clases CSS correctas para los badges
        const roleClass = isAdmin ? 'admin' : 'estudiante';
        const roleText = isAdmin ? 'Administrador' : 'Estudiante';
        const statusClass = isActive ? 'active' : 'inactive';
        const statusText = isActive ? 'Activo' : 'Inactivo';
        
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
            <td><span class="role-badge-cell ${roleClass}">${roleText}</span></td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
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

// Actualizar estadísticas del admin
function updateAdminStats() {
    const totalUsers = adminUsers.length;
    const activeUsers = adminUsers.filter(user => {
        const lastActivity = user.lastActivity || user.lastLogin;
        return lastActivity && (new Date() - lastActivity) < (5 * 60 * 1000);
    }).length;
    
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

// Filtrar usuarios por búsqueda
// Filtrar usuarios por búsqueda - VERSIÓN CORREGIDA
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
    
    const fragment = document.createDocumentFragment();
    const userData = JSON.parse(localStorage.getItem('guitarraFacilUser'));
    
    filteredUsers.forEach(user => {
        const lastActivity = user.lastActivity || user.lastLogin;
        const isActive = lastActivity && (new Date() - lastActivity) < (5 * 60 * 1000);
        const isCurrentUser = user.email === userData?.email;
        const isAdmin = user.role === 'admin';
        
        const displayName = user.displayName || user.email.split('@')[0];
        const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        
        const registerDate = user.createdAt ? user.createdAt.toLocaleDateString() : 'N/A';
        const lastAccess = lastActivity ? 
            lastActivity.toLocaleDateString() + ' ' + lastActivity.toLocaleTimeString().substring(0, 5) : 
            'Nunca';
        
        const row = document.createElement('tr');
        
        // CORRECCIÓN: Usar las clases CSS correctas para los badges
        const roleClass = isAdmin ? 'admin' : 'estudiante';
        const roleText = isAdmin ? 'Administrador' : 'Estudiante';
        const statusClass = isActive ? 'active' : 'inactive';
        const statusText = isActive ? 'Activo' : 'Inactivo';
        
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
            <td><span class="role-badge-cell ${roleClass}">${roleText}</span></td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
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

// Toggle rol de usuario
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
        
        user.role = newRole;
        userCache.set('allUsers', adminUsers);
        
        updateUsersTable();
        updateAdminStats();
        updateCharts();
        
        showNotification(`✅ Rol actualizado: ${userEmail} ahora es ${newRole === 'admin' ? 'administrador' : 'estudiante'}`, 'success');
        
    } catch (error) {
        console.error('❌ Error cambiando rol:', error);
        showNotification('Error al cambiar el rol del usuario', 'error');
    }
}


// Editar usuario - FUNCIÓN ACTUALIZADA PARA FIREBASE
async function editUser(userId) {
    const user = adminUsers.find(u => u.id === userId);
    if (!user) return;
    
    const newName = prompt('Nuevo nombre para el usuario:', user.displayName || user.email.split('@')[0]);
    if (newName === null || !newName.trim()) return;
    
    const trimmedName = newName.trim();
    
    try {
        const firebase = useFirebase();
        
        if (firebase.isAvailable) {
            // Actualizar en Firestore
            await firebase.safeOperation(
                'update-user-name',
                async () => {
                    await firebase.modules.updateDoc(
                        firebase.modules.doc(firebase.db, 'users', userId),
                        { 
                            displayName: trimmedName,
                            updatedAt: firebase.modules.serverTimestamp()
                        }
                    );
                    return true;
                },
                false
            );
            
            // Actualizar en la lista local
            user.displayName = trimmedName;
            
            // Si el usuario tiene nombre en la propiedad 'name' también
            if (user.name) {
                user.name = trimmedName;
            }
            
            // Actualizar cache
            userCache.set('allUsers', adminUsers);
            
            // Actualizar tabla
            updateUsersTable();
            
            // Si el usuario editado es el usuario actual, actualizar localStorage
            const currentUserData = JSON.parse(localStorage.getItem('guitarraFacilUser'));
            if (currentUserData && currentUserData.uid === userId) {
                currentUserData.displayName = trimmedName;
                currentUserData.name = trimmedName;
                currentUserData.firstName = trimmedName.split(' ')[0];
                localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUserData));
                updateUIForUser(currentUserData);
            }
            
            showNotification(`✅ Nombre actualizado a: ${trimmedName}`, 'success');
            
        } else {
            // Modo offline - actualizar solo localmente
            user.displayName = trimmedName;
            userCache.set('allUsers', adminUsers);
            updateUsersTable();
            showNotification(`✅ Nombre actualizado localmente: ${trimmedName}`, 'info');
        }
        
    } catch (error) {
        console.error('❌ Error actualizando nombre en Firebase:', error);
        showNotification('Error al actualizar el nombre. Intenta de nuevo.', 'error');
    }
}

// Eliminar usuario
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
        
        adminUsers = adminUsers.filter(u => u.id !== userId);
        userCache.set('allUsers', adminUsers);
        
        updateUsersTable();
        updateAdminStats();
        updateCharts();
        
        showNotification('✅ Usuario eliminado correctamente', 'success');
        
    } catch (error) {
        console.error('❌ Error eliminando usuario:', error);
        showNotification('Error al eliminar el usuario', 'error');
    }
}

// Exportar datos de usuarios
window.exportUsers = function() {
    const csvContent = [
        ['Nombre', 'Email', 'Rol', 'Registro', 'Último Acceso', 'Estado'],
        ...adminUsers.map(user => [
            user.displayName || '',
            user.email,
            user.role === 'admin' ? 'Administrador' : 'Estudiante',
            user.createdAt.toLocaleDateString(),
            user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Nunca',
            (user.lastActivity || user.lastLogin) && (new Date() - (user.lastActivity || user.lastLogin)) < (5 * 60 * 1000) ? 'Activo' : 'Inactivo'
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
    
    showNotification(`✅ Datos exportados: ${adminUsers.length} usuarios`, 'success');
}

// Generar reporte mensual
window.generateReport = function() {
    const today = new Date();
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    const newThisMonth = adminUsers.filter(user => user.createdAt >= monthAgo).length;
    const activeThisMonth = adminUsers.filter(user => {
        const lastActivity = user.lastActivity || user.lastLogin;
        return lastActivity && lastActivity >= monthAgo;
    }).length;
    
    showNotification(`📊 Reporte Mensual:\n\n• Nuevos usuarios este mes: ${newThisMonth}\n• Usuarios activos este mes: ${activeThisMonth}\n• Total usuarios: ${adminUsers.length}\n• Administradores: ${adminUsers.filter(u => u.role === 'admin').length}\n• Estudiantes: ${adminUsers.filter(u => u.role === 'student').length}`, 'info');
}

// Respaldar base de datos
window.backupDatabase = function() {
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
    
    showNotification('✅ Respaldo de base de datos generado y descargado', 'success');
}

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
            showNotification('No se pudo acceder al micrófono. Asegúrate de permitir el acceso.', 'error');
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
        showNotification('Error al acceder al micrófono. Asegúrate de que tu micrófono esté conectado y tengas permisos para usarlo.', 'error');
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
        showNotification('Tu navegador no soporta la API de Audio necesaria para el metrónomo.', 'error');
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
    console.log('🚀 DOM cargado, inicializando aplicación...');
    
    // Inicializar Firebase
    initializeFirebase();
    
    // Inicializar sistema de actividad
    initializeActivityTracking();
    
    // Inicializar funcionalidad de cambio de nombre
    initializeChangeName();
    
    // Monitorear cambios en el estado del usuario para mensajes
    let lastUserState = null;
    setInterval(() => {
        const currentUser = JSON.parse(localStorage.getItem('guitarraFacilUser'));
        if (JSON.stringify(currentUser) !== JSON.stringify(lastUserState)) {
            lastUserState = currentUser;
            if (document.getElementById('foro')?.classList.contains('active')) {
                updateMessagesFormVisibility();
            }
        }
    }, 1000);
    
    // Verificar que los botones de admin estén configurados
    setTimeout(() => {
        const adminButtons = document.querySelectorAll('.admin-actions .btn');
        adminButtons.forEach(btn => {
            // Asegurarse de que los botones tengan los eventos correctos
            if (!btn.getAttribute('onclick')) {
                const text = btn.textContent;
                if (text.includes('Usuarios')) {
                    btn.setAttribute('onclick', 'window.manageUsers()');
                } else if (text.includes('Contenido')) {
                    btn.setAttribute('onclick', 'window.manageContent()');
                } else if (text.includes('Estadísticas')) {
                    btn.setAttribute('onclick', 'window.viewStatistics()');
                }
            }
        });
    }, 1000);
    
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

// Función de diagnóstico para verificar los botones
function diagnoseAdminButtons() {
    console.log("🔍 DIAGNÓSTICO DE BOTONES DE ADMIN:");
    
    // Verificar que las funciones globales existan
    console.log("1. window.manageUsers:", typeof window.manageUsers);
    console.log("2. window.manageContent:", typeof window.manageContent);
    console.log("3. window.viewStatistics:", typeof window.viewStatistics);
    
    // Verificar que los botones existan en el DOM
    const adminPanel = document.getElementById('admin-panel');
    if (adminPanel) {
        console.log("4. Panel de admin encontrado en el DOM");
        
        const buttons = adminPanel.querySelectorAll('.btn');
        console.log(`5. ${buttons.length} botones encontrados en el panel`);
        
        buttons.forEach((btn, index) => {
            console.log(`   Botón ${index + 1}: "${btn.textContent}" - onclick: ${btn.getAttribute('onclick')}`);
        });
    } else {
        console.log("4. ❌ Panel de admin NO encontrado en el DOM");
    }
    
    // Verificar usuario actual
    const userData = JSON.parse(localStorage.getItem('guitarraFacilUser'));
    console.log("6. Usuario actual:", userData ? `${userData.email} (${userData.role})` : "No autenticado");
    
    // Verificar si el panel de admin está visible
    console.log("7. Panel de admin visible:", adminPanel && adminPanel.style.display !== 'none' ? 'Sí' : 'No');
}

// Hacer la función disponible globalmente
window.diagnoseAdminButtons = diagnoseAdminButtons;

// También puedes mantener la función original como global si necesitas compatibilidad
window.loadAllUsers = loadAllUsers;
window.refreshMessages = refreshMessages;
window.closeChangeNameModal = closeChangeNameModal;