// ==============================================
// VARIABLES GLOBALES Y CONFIGURACIÓN
// ==============================================
const basePath = 'C:/Users/User/Downloads/Circo binario/Musica/Images/';
const ADMIN_EMAILS = [
    'jv4491816@gmail.com',
    'fraylingay@gmail.com',
    'admin@demo.com'
];

// ==============================================
// DATOS DE CONTENIDO
// ==============================================

// DATOS DE ACORDES MAYORES (7 en total)
const majorChords = [
    {
        id: 'do',
        name: 'DO Mayor',
        shortName: 'DO',
        note: 'C',
        image: basePath + 'AcordeDOmayor.png',
        fingering: [
            'Dedo 1 (Índice): Cuerda 2, traste 1',
            'Dedo 2 (Medio): Cuerda 4, traste 2',
            'Dedo 3 (Anular): Cuerda 5, traste 3'
        ],
        tips: 'Evita tocar la 6ª cuerda. Las cuerdas 1 y 3 suenan al aire. Mantén el pulgar detrás del mástil para mejor presión.',
        frequencies: [130.81, 164.81, 196.00, 261.63],
        points: 10
    },
    {
        id: 're',
        name: 'RE Mayor',
        shortName: 'RE',
        note: 'D',
        image: basePath + 'AcordeREmayor.png',
        fingering: [
            'Dedo 1 (Índice): Cuerda 3, traste 2',
            'Dedo 2 (Medio): Cuerda 1, traste 2',
            'Dedo 3 (Anular): Cuerda 2, traste 3'
        ],
        tips: 'Rasguea solo las primeras 4 cuerdas. Forma un triángulo con los dedos. La cuerda 4 suena al aire.',
        frequencies: [146.83, 185.00, 220.00, 293.66],
        points: 10
    },
    {
        id: 'mi',
        name: 'MI Mayor',
        shortName: 'MI',
        note: 'E',
        image: basePath + 'AcordeMImayor.png',
        fingering: [
            'Dedo 2 (Medio): Cuerda 5, traste 2',
            'Dedo 3 (Anular): Cuerda 4, traste 2',
            'Dedo 1 (Índice): Cuerda 3, traste 1'
        ],
        tips: 'El acorde más fácil para principiantes. Todas las cuerdas suenan al aire. Practica hasta que cada cuerda suene clara.',
        frequencies: [164.81, 207.65, 246.94, 329.63],
        points: 10
    },
    {
        id: 'fa',
        name: 'FA Mayor',
        shortName: 'FA',
        note: 'F',
        image: basePath + 'AcordeFAmayor.png',
        fingering: [
            'Cejilla: Dedo 1 (Índice) en traste 1',
            'Dedo 2 (Medio): Cuerda 3, traste 2',
            'Dedo 3 (Anular): Cuerda 4, traste 3',
            'Dedo 4 (Meñique): Cuerda 5, traste 3'
        ],
        tips: 'Primer acorde con cejilla. Practica primero la cejilla en dos cuerdas. Asegúrate de que el dedo 1 presione todas las cuerdas uniformemente.',
        frequencies: [174.61, 220.00, 261.63, 349.23],
        points: 15
    },
    {
        id: 'sol',
        name: 'SOL Mayor',
        shortName: 'SOL',
        note: 'G',
        image: basePath + 'AcordeSOLmayor.png',
        fingering: [
            'Dedo 2 (Medio): Cuerda 5, traste 2',
            'Dedo 3 (Anular): Cuerda 6, traste 3',
            'Dedo 4 (Meñique): Cuerda 1, traste 3'
        ],
        tips: 'Asegúrate de que el meñique no toque la cuerda 2. Todas las cuerdas suenan. Las cuerdas 2, 3 y 4 suenan al aire.',
        frequencies: [196.00, 246.94, 293.66, 392.00],
        points: 10
    },
    {
        id: 'la',
        name: 'LA Mayor',
        shortName: 'LA',
        note: 'A',
        image: basePath + 'AcordeLAmayor.png',
        fingering: [
            'Dedo 1 (Índice): Cuerda 2, traste 2',
            'Dedo 2 (Medio): Cuerda 4, traste 2',
            'Dedo 3 (Anular): Cuerda 3, traste 2'
        ],
        tips: 'Los tres dedos van juntos en el traste 2. Evita tocar la 6ª cuerda. Las cuerdas 1 y 5 suenan al aire.',
        frequencies: [220.00, 277.18, 329.63, 440.00],
        points: 10
    },
    {
        id: 'si',
        name: 'SI Mayor',
        shortName: 'SI',
        note: 'B',
        image: basePath + 'AcordeSImayor.png',
        fingering: [
            'Cejilla: Dedo 1 (Índice) en traste 2',
            'Dedo 2 (Medio): Cuerda 4, traste 4',
            'Dedo 3 (Anular): Cuerda 3, traste 4',
            'Dedo 4 (Meñique): Cuerda 2, traste 4'
        ],
        tips: 'Acorde con cejilla en traste 2. Requiere fuerza en el dedo índice. Practica la cejilla primero en trastes más altos donde es más fácil.',
        frequencies: [246.94, 311.13, 369.99, 493.88],
        points: 15
    }
];

// DATOS DE ACORDES MENORES (7 en total)
const minorChords = [
    {
        id: 'dom',
        name: 'do menor',
        shortName: 'do',
        note: 'Cm',
        image: basePath + 'AcordeDOmenor.png',
        fingering: [
            'Cejilla: Dedo 1 (Índice) en traste 3',
            'Dedo 2 (Medio): Cuerda 4, traste 4',
            'Dedo 3 (Anular): Cuerda 5, traste 5',
            'Dedo 4 (Meñique): Cuerda 2, traste 5'
        ],
        tips: 'Versión menor del DO Mayor. Sonido melancólico. Practica la cejilla en traste 3 antes de añadir los otros dedos.',
        frequencies: [130.81, 155.56, 196.00, 261.63],
        points: 10
    },
    {
        id: 'rem',
        name: 're menor',
        shortName: 're',
        note: 'Dm',
        image: basePath + 'AcordeREmenor.png',
        fingering: [
            'Dedo 1 (Índice): Cuerda 1, traste 1',
            'Dedo 2 (Medio): Cuerda 3, traste 2',
            'Dedo 3 (Anular): Cuerda 2, traste 3'
        ],
        tips: 'Similar al RE Mayor pero moviendo un dedo. Rasguea solo 4 cuerdas. La cuerda 4 suena al aire.',
        frequencies: [146.83, 174.61, 220.00, 293.66],
        points: 10
    },
    {
        id: 'mim',
        name: 'mi menor',
        shortName: 'mi',
        note: 'Em',
        image: basePath + 'AcordeMImenor.png',
        fingering: [
            'Dedo 2 (Medio): Cuerda 5, traste 2',
            'Dedo 3 (Anular): Cuerda 4, traste 2'
        ],
        tips: 'El acorde más fácil. Solo dos dedos. Todas las cuerdas suenan. Perfecto para empezar con acordes menores.',
        frequencies: [164.81, 196.00, 246.94, 329.63],
        points: 10
    },
    {
        id: 'fam',
        name: 'fa menor',
        shortName: 'fa',
        note: 'Fm',
        image: basePath + 'AcordeFAmenor.png',
        fingering: [
            'Cejilla: Dedo 1 (Índice) en traste 1',
            'Dedo 2 (Medio): Cuerda 2, traste 1',
            'Dedo 3 (Anular): Cuerda 3, traste 1',
            'Dedo 4 (Meñique): Cuerda 4, traste 3'
        ],
        tips: 'Versión menor del FA Mayor. Requiere buena técnica de cejilla. Sonido profundo y melancólico.',
        frequencies: [174.61, 207.65, 261.63, 349.23],
        points: 15
    },
    {
        id: 'solm',
        name: 'sol menor',
        shortName: 'sol',
        note: 'Gm',
        image: basePath + 'AcordeSOLmenor.png',
        fingering: [
            'Cejilla: Dedo 1 (Índice) en traste 3',
            'Dedo 2 (Medio): Cuerda 6, traste 3',
            'Dedo 3 (Anular): Cuerda 5, traste 5',
            'Dedo 4 (Meñique): Cuerda 4, traste 5'
        ],
        tips: 'Versión menor del SOL Mayor. Acorde con cejilla. Practica primero sin el meñique.',
        frequencies: [196.00, 233.08, 293.66, 392.00],
        points: 15
    },
    {
        id: 'lam',
        name: 'la menor',
        shortName: 'la',
        note: 'Am',
        image: basePath + 'AcordeLAmenor.png',
        fingering: [
            'Dedo 1 (Índice): Cuerda 2, traste 1',
            'Dedo 2 (Medio): Cuerda 4, traste 2',
            'Dedo 3 (Anular): Cuerda 3, traste 2'
        ],
        tips: 'Similar al LA Mayor pero más fácil. Sonido melancólico. Evita tocar la 6ª cuerda.',
        frequencies: [220.00, 261.63, 329.63, 440.00],
        points: 10
    },
    {
        id: 'sim',
        name: 'si menor',
        shortName: 'si',
        note: 'Bm',
        image: basePath + 'AcordeSImenor.png',
        fingering: [
            'Cejilla: Dedo 1 (Índice) en traste 2',
            'Dedo 2 (Medio): Cuerda 2, traste 3',
            'Dedo 3 (Anular): Cuerda 4, traste 4',
            'Dedo 4 (Meñique): Cuerda 3, traste 4'
        ],
        tips: 'Versión menor del SI Mayor. Acorde desafiante con cejilla. Sonido profundo y melancólico.',
        frequencies: [246.94, 293.66, 369.99, 493.88],
        points: 15
    }
];

// DATOS DE ESCALAS MAYORES (7 en total)
const majorScales = [
    {
        id: 'do',
        name: 'Escala de DO Mayor',
        shortName: 'DO',
        note: 'C',
        image: basePath + 'EscalaDOmayor.png',
        pattern: ['T', 'T', 'S', 'T', 'T', 'T', 'S'],
        patternNotes: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'],
        fingering: [
            'Posición 1: Dedos 1-2-3-4 en trastes 0-2-4-5',
            'Posición 2: Desplaza mano hacia traste 5',
            'Usa el dedo meñique para notas en trastes 7 y 8',
            'Alterna dedos para mayor velocidad'
        ],
        tips: 'La escala mayor más básica. No tiene sostenidos ni bemoles. Perfecta para comenzar a aprender escalas.',
        frequencies: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25],
        points: 15
    },
    {
        id: 're',
        name: 'Escala de RE Mayor',
        shortName: 'RE',
        note: 'D',
        image: basePath + 'EscalaREmayor.png',
        pattern: ['T', 'T', 'S', 'T', 'T', 'T', 'S'],
        patternNotes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#', 'D'],
        fingering: [
            'Dedo 1 en traste 2, dedo 3 en traste 4',
            'Cuerdas 4 y 3: dedos 1-3-4',
            'Patrón repetitivo cada dos cuerdas',
            'Mantén la mano relajada'
        ],
        tips: 'Tiene dos sostenidos (F# y C#). Buen patrón para aprender desplazamientos.',
        frequencies: [293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 554.37, 587.33],
        points: 15
    },
    {
        id: 'mi',
        name: 'Escala de MI Mayor',
        shortName: 'MI',
        note: 'E',
        image: basePath + 'EscalaMImayor.png',
        pattern: ['T', 'T', 'S', 'T', 'T', 'T', 'S'],
        patternNotes: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#', 'E'],
        fingering: [
            'Comienza en cuerda 6, traste 0',
            'Dedo 1 en trastes 1, dedo 2 en 2, dedo 3 en 4',
            'Patrón de 3 notas por cuerda',
            'Buena escala para practicar velocidad'
        ],
        tips: 'Tiene cuatro sostenidos. Escala brillante que suena muy bien en guitarra.',
        frequencies: [329.63, 369.99, 415.30, 440.00, 493.88, 554.37, 622.25, 659.25],
        points: 15
    },
    {
        id: 'fa',
        name: 'Escala de FA Mayor',
        shortName: 'FA',
        note: 'F',
        image: basePath + 'EscalaFAmayor.png',
        pattern: ['T', 'T', 'S', 'T', 'T', 'T', 'S'],
        patternNotes: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E', 'F'],
        fingering: [
            'Posición con cejilla en traste 1',
            'Dedo 1 hace cejilla, dedos 2-3-4 para otras notas',
            'Alternativa: sin cejilla desde traste 8',
            'Practica lentamente la cejilla'
        ],
        tips: 'Tiene un bemol (Bb). Escala desafiante por la cejilla pero esencial.',
        frequencies: [349.23, 392.00, 440.00, 466.16, 523.25, 587.33, 659.25, 698.46],
        points: 20
    },
    {
        id: 'sol',
        name: 'Escala de SOL Mayor',
        shortName: 'SOL',
        note: 'G',
        image: basePath + 'EscalaSOLmayor.png',
        pattern: ['T', 'T', 'S', 'T', 'T', 'T', 'S'],
        patternNotes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#', 'G'],
        fingering: [
            'Comienza en cuerda 6, traste 3',
            'Dedo 2 en traste 5, dedo 4 en traste 7',
            'Patrón extenso por todo el mástil',
            'Ideal para practicar saltos de cuerda'
        ],
        tips: 'Tiene un sostenido (F#). Una de las escalas más utilizadas en música popular.',
        frequencies: [392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 739.99, 783.99],
        points: 15
    },
    {
        id: 'la',
        name: 'Escala de LA Mayor',
        shortName: 'LA',
        note: 'A',
        image: basePath + 'EscalaLAmayor.png',
        pattern: ['T', 'T', 'S', 'T', 'T', 'T', 'S'],
        patternNotes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#', 'A'],
        fingering: [
            'Posición en traste 5 con dedo 1',
            'Patrón de 2-3 notas por cuerda',
            'Desplazamiento suave entre cuerdas',
            'Usa metrónomo para practicar'
        ],
        tips: 'Tiene tres sostenidos. Escala muy versátil para improvisación.',
        frequencies: [440.00, 493.88, 554.37, 587.33, 659.25, 739.99, 830.61, 880.00],
        points: 15
    },
    {
        id: 'si',
        name: 'Escala de SI Mayor',
        shortName: 'SI',
        note: 'B',
        image: basePath + 'EscalaSImayor.png',
        pattern: ['T', 'T', 'S', 'T', 'T', 'T', 'S'],
        patternNotes: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#', 'B'],
        fingering: [
            'Cejilla en traste 7 con dedo 1',
            'Dedo 3 en traste 9, dedo 4 en traste 10',
            'Posición alta del mástil',
            'Practica en diferentes posiciones'
        ],
        tips: 'Tiene cinco sostenidos. Escala brillante que funciona bien para solos rápidos.',
        frequencies: [493.88, 554.37, 622.25, 659.25, 739.99, 830.61, 932.33, 987.77],
        points: 20
    }
];

// DATOS DE ESCALAS MENORES (7 en total)
const minorScales = [
    {
        id: 'dom',
        name: 'Escala de do menor',
        shortName: 'do',
        note: 'Cm',
        image: basePath + 'EscalaDOmenor.png',
        pattern: ['T', 'S', 'T', 'T', 'S', 'T', 'T'],
        patternNotes: ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb', 'C'],
        fingering: [
            'Posición en traste 3 con cejilla',
            'Dedo 1 para cejilla, dedos 3-4 para notas altas',
            'Patrón similar a escala mayor pero desplazado',
            'Enfócate en el tercer grado bemol (Eb)'
        ],
        tips: 'Escala menor natural. Tiene tres bemoles. Sonido melancólico perfecto para blues y rock.',
        frequencies: [261.63, 293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25],
        points: 15
    },
    {
        id: 'rem',
        name: 'Escala de re menor',
        shortName: 're',
        note: 'Dm',
        image: basePath + 'EscalaREmenor.png',
        pattern: ['T', 'S', 'T', 'T', 'S', 'T', 'T'],
        patternNotes: ['D', 'E', 'F', 'G', 'A', 'Bb', 'C', 'D'],
        fingering: [
            'Comienza en cuerda 4, traste 0',
            'Dedo 1 en traste 1, dedo 3 en traste 3',
            'Patrón simple en posición abierta',
            'Ideal para principiantes en escalas menores'
        ],
        tips: 'Tiene un bemol (Bb). Una de las escalas menores más fáciles de tocar.',
        frequencies: [293.66, 329.63, 349.23, 392.00, 440.00, 466.16, 523.25, 587.33],
        points: 15
    },
    {
        id: 'mim',
        name: 'Escala de mi menor',
        shortName: 'mi',
        note: 'Em',
        image: basePath + 'EscalaMImenor.png',
        pattern: ['T', 'S', 'T', 'T', 'S', 'T', 'T'],
        patternNotes: ['E', 'F#', 'G', 'A', 'B', 'C', 'D', 'E'],
        fingering: [
            'Posición abierta: cuerdas al aire',
            'Dedo 1 en traste 1, dedo 2 en traste 2',
            'Patrón extendido por todo el mástil',
            'Practica ascendente y descendente'
        ],
        tips: 'Escala menor más usada en rock. Relativa menor de SOL Mayor.',
        frequencies: [329.63, 369.99, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25],
        points: 15
    },
    {
        id: 'fam',
        name: 'Escala de fa menor',
        shortName: 'fa',
        note: 'Fm',
        image: basePath + 'EscalaFAmenor.png',
        pattern: ['T', 'S', 'T', 'T', 'S', 'T', 'T'],
        patternNotes: ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F'],
        fingering: [
            'Cejilla en traste 1 con dedo 1',
            'Dedo 3 en traste 3, dedo 4 en traste 4',
            'Patrón de 3 notas por cuerda',
            'Enfócate en la presión uniforme de la cejilla'
        ],
        tips: 'Tiene cuatro bemoles. Sonido oscuro y dramático, usado en música clásica.',
        frequencies: [349.23, 392.00, 415.30, 466.16, 523.25, 554.37, 622.25, 698.46],
        points: 20
    },
    {
        id: 'solm',
        name: 'Escala de sol menor',
        shortName: 'sol',
        note: 'Gm',
        image: basePath + 'EscalaSOLmenor.png',
        pattern: ['T', 'S', 'T', 'T', 'S', 'T', 'T'],
        patternNotes: ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F', 'G'],
        fingering: [
            'Posición en traste 3 sin cejilla',
            'Dedo 1 en traste 3, dedo 3 en traste 5',
            'Patrón ergonómico para la mano',
            'Buena para practicar ligados'
        ],
        tips: 'Tiene dos bemoles. Escala versátil para blues y jazz.',
        frequencies: [392.00, 440.00, 466.16, 523.25, 587.33, 622.25, 698.46, 783.99],
        points: 15
    },
    {
        id: 'lam',
        name: 'Escala de la menor',
        shortName: 'la',
        note: 'Am',
        image: basePath + 'EscalaLAmenor.png',
        pattern: ['T', 'S', 'T', 'T', 'S', 'T', 'T'],
        patternNotes: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'A'],
        fingering: [
            'Posición abierta: la más fácil',
            'Dedo 1 en traste 1, dedo 3 en traste 3',
            'Patrón que cubre 5 trastes',
            'Ideal para empezar con escalas menores'
        ],
        tips: 'No tiene sostenidos ni bemoles. Relativa menor de DO Mayor. Perfecta para principiantes.',
        frequencies: [440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00],
        points: 15
    },
    {
        id: 'sim',
        name: 'Escala de si menor',
        shortName: 'si',
        note: 'Bm',
        image: basePath + 'EscalaSImenor.png',
        pattern: ['T', 'S', 'T', 'T', 'S', 'T', 'T'],
        patternNotes: ['B', 'C#', 'D', 'E', 'F#', 'G', 'A', 'B'],
        fingering: [
            'Cejilla en traste 2 con dedo 1',
            'Dedo 3 en traste 4, dedo 4 en traste 5',
            'Patrón similar a RE Mayor pero desplazado',
            'Practica cambios lentos de posición'
        ],
        tips: 'Tiene dos sostenidos. Relativa menor de RE Mayor. Sonido intenso y emocional.',
        frequencies: [493.88, 554.37, 587.33, 659.25, 739.99, 783.99, 880.00, 987.77],
        points: 20
    }
];

// DATOS PARA ENTRENAMIENTO AUDITIVO
const earNotes = [
    { name: 'C4', displayName: 'Do (C4)', position: 95, frequency: 261.63 },
    { name: 'D4', displayName: 'Re (D4)', position: 85, frequency: 293.66 },
    { name: 'E4', displayName: 'Mi (E4)', position: 77, frequency: 329.63 },
    { name: 'F4', displayName: 'Fa (F4)', position: 70, frequency: 349.23 },
    { name: 'G4', displayName: 'Sol (G4)', position: 62, frequency: 392.00 },
    { name: 'A4', displayName: 'La (A4)', position: 55, frequency: 440.00 },
    { name: 'B4', displayName: 'Si (B4)', position: 48, frequency: 493.88 },
    { name: 'C5', displayName: 'Do (C5)', position: 40, frequency: 523.25 }
];

// ==============================================
// SISTEMA DE AUTENTICACIÓN
// ==============================================
const authSystem = (function() {
    let currentUser = null;
    let currentFormType = 'login';
    
    // Referencias a elementos del DOM
    const loginModal = document.getElementById('loginModal');
    const modalFormSection = document.getElementById('modalFormSection');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalSignupBtn = document.getElementById('modalSignupBtn');
    const modalLoginBtn = document.getElementById('modalLoginBtn');
    const loginBtn = document.getElementById('loginBtnLearning');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userPoints = document.getElementById('userPoints');
    const userInitial = document.getElementById('userInitial');
    
    function initializeFirebaseForLearning() {
        console.log("🎯 Inicializando Firebase para aprendizaje...");
        
        if (window.firebaseReady && window.firebaseAuth && window.firebaseModules) {
            setupAuthObserver();
            console.log("✅ Firebase inicializado correctamente para aprendizaje");
        } else {
            console.log("⚠️ Firebase no disponible, usando modo local");
            loadUserFromStorage();
        }
    }
    
    function setupAuthObserver() {
        if (!window.firebaseAuth || !window.firebaseModules) {
            console.log("⚠️ Firebase no disponible para observador");
            return;
        }
        
        try {
            window.firebaseModules.onAuthStateChanged(window.firebaseAuth, async (user) => {
                console.log("🔄 Cambio en estado de autenticación:", user ? `Usuario: ${user.email}` : "Sin usuario");
                
                if (user) {
                    await saveUserToFirestore(user);
                    await handleFirebaseUser(user);
                } else {
                    currentUser = null;
                    localStorage.removeItem('guitarraFacilUser');
                    updateUIForUser(null);
                }
            });
            
            console.log("✅ Observador de autenticación configurado");
        } catch (error) {
            console.error("❌ Error configurando observador:", error);
        }
    }
    
    async function saveUserToFirestore(user) {
        if (!window.firebaseReady || !window.firebaseDb || !window.firebaseModules) {
            console.log("⚠️ Firestore no disponible para guardar usuario");
            return false;
        }
        
        try {
            const userRef = window.firebaseModules.doc(window.firebaseDb, 'users', user.uid);
            const userSnap = await window.firebaseModules.getDoc(userRef);
            
            const isAdmin = await checkIfUserIsAdmin(user.email);
            
            if (!userSnap.exists()) {
                await window.firebaseModules.setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || user.email.split('@')[0],
                    photoURL: user.photoURL || null,
                    provider: user.providerData?.[0]?.providerId || 'email',
                    role: isAdmin ? 'admin' : 'student',
                    points: 0,
                    achievements: [],
                    learningProgress: {
                        majorChords: {
                            completed: false,
                            unlockedChords: Array(7).fill(false),
                            currentIndex: 0,
                            totalHeard: 0
                        },
                        minorChords: {
                            completed: false,
                            unlockedChords: Array(7).fill(false),
                            currentIndex: 0,
                            totalHeard: 0
                        },
                        majorScales: {
                            completed: false,
                            unlockedScales: Array(7).fill(false),
                            currentIndex: 0,
                            totalHeard: 0
                        },
                        minorScales: {
                            completed: false,
                            unlockedScales: Array(7).fill(false),
                            currentIndex: 0,
                            totalHeard: 0
                        },
                        earTraining: {
                            completed: false,
                            score: 0,
                            correctCount: 0,
                            incorrectCount: 0
                        }
                    },
                    createdAt: window.firebaseModules.serverTimestamp(),
                    lastLogin: window.firebaseModules.serverTimestamp()
                });
                console.log("✅ Usuario creado en Firestore:", user.uid);
            } else {
                await window.firebaseModules.updateDoc(userRef, {
                    lastLogin: window.firebaseModules.serverTimestamp()
                });
                console.log("✅ Usuario actualizado en Firestore:", user.uid);
            }
            return true;
        } catch (error) {
            console.error("❌ Error guardando usuario en Firestore:", error);
            return false;
        }
    }
    
    async function checkIfUserIsAdmin(email) {
        if (ADMIN_EMAILS.includes(email.toLowerCase())) {
            return true;
        }
        
        if (!window.firebaseReady || !window.firebaseDb || !window.firebaseModules) {
            return false;
        }
        
        try {
            const adminDoc = await window.firebaseModules.getDoc(
                window.firebaseModules.doc(window.firebaseDb, 'admins', email.toLowerCase())
            );
            return adminDoc.exists();
        } catch (error) {
            console.error("❌ Error verificando admin:", error);
            return false;
        }
    }
    
    async function handleFirebaseUser(user) {
        console.log("👤 Procesando usuario de Firebase:", user.email);
        
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
            provider: user.providerData?.[0]?.providerId || 'email',
            points: 0
        };
        
        if (!user.displayName && user.email) {
            const nameFromEmail = user.email.split('@')[0];
            currentUser.name = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
            currentUser.firstName = currentUser.name.split(' ')[0];
        }
        
        // Cargar datos del usuario desde Firestore (incluyendo puntos)
        await loadUserDataFromFirestore(user.uid);
        
        localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUser));
        updateUIForUser(currentUser);
        
        console.log("✅ Usuario procesado:", currentUser.firstName, "Rol:", currentUser.role, "Puntos:", currentUser.points);
    }
    
    async function loadUserDataFromFirestore(uid) {
        if (!window.firebaseReady || !window.firebaseDb || !window.firebaseModules) {
            console.log("⚠️ Firestore no disponible, usando datos locales");
            return;
        }
        
        try {
            const userDoc = await window.firebaseModules.getDoc(
                window.firebaseModules.doc(window.firebaseDb, 'users', uid)
            );
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                currentUser.points = userData.points || 0;
                currentUser.learningProgress = userData.learningProgress || {};
                console.log("✅ Datos de usuario cargados desde Firestore. Puntos:", currentUser.points);
            } else {
                console.log("⚠️ Usuario no encontrado en Firestore");
            }
        } catch (error) {
            console.error("❌ Error cargando datos del usuario:", error);
        }
    }
    
    function loadUserFromStorage() {
        const savedUser = localStorage.getItem('guitarraFacilUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            
            if (!currentUser.firstName && currentUser.name) {
                currentUser.firstName = currentUser.name.split(' ')[0];
            }
            
            updateUIForUser(currentUser);
            console.log("📂 Usuario cargado desde localStorage:", currentUser.email, "Puntos:", currentUser.points);
        }
    }
    
    function updateUIForUser(user) {
        if (user) {
            // Mostrar información del usuario y botón cerrar sesión
            userInfo.style.display = 'block';
            loginBtn.style.display = 'none';
            logoutBtnLearning.style.display = 'flex'; // Mostrar botón cerrar sesión
            
            // Actualizar información
            userName.textContent = user.firstName || user.name.split(' ')[0];
            userPoints.textContent = user.points || 0;
            
            // Mostrar inicial del usuario
            const name = user.name || user.email || 'U';
            userInitial.textContent = name.charAt(0).toUpperCase();
            
            // Actualizar progreso si está disponible
            if (window.AppState && user.learningProgress) {
                window.AppState.syncProgressWithFirebase(user.learningProgress);
            }
        } else {
            // Mostrar botón de login y ocultar cerrar sesión
            userInfo.style.display = 'none';
            loginBtn.style.display = 'block';
            logoutBtnLearning.style.display = 'none'; // Ocultar botón cerrar sesión
        }
    }
    
    // ========== MODAL DE LOGIN/REGISTRO ==========
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
                            <button type="button" id="togglePasswordBtn" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #1a73e8; cursor: pointer;">
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
                            <button type="button" id="toggleSignupPasswordBtn" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #1a73e8; cursor: pointer;">
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
            const togglePasswordBtn = document.getElementById('toggleSignupPasswordBtn');
            const switchToLogin = document.getElementById('modalSwitchToLogin');
            const googleSignupBtn = document.getElementById('googleSignupBtn');
            const githubSignupBtn = document.getElementById('githubSignupBtn');
            
            if (togglePasswordBtn && passwordInput) {
                togglePasswordBtn.addEventListener('click', function() {
                    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                    passwordInput.setAttribute('type', type);
                    this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
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
    
    async function handleSocialLogin(providerType) {
        if (!window.firebaseReady || !window.firebaseAuth || !window.firebaseModules) {
            showNotification('Firebase no está disponible. Por favor, usa el registro por email.', 'error');
            return;
        }
        
        try {
            const provider = providerType === 'google' 
                ? new window.firebaseModules.GoogleAuthProvider()
                : new window.firebaseModules.GithubAuthProvider();
            
            if (providerType === 'github') {
                provider.addScope('read:user');
                provider.addScope('user:email');
            }
            
            const result = await window.firebaseModules.signInWithPopup(window.firebaseAuth, provider);
            console.log(`✅ Login con ${providerType} exitoso:`, result.user.email);
            
            showNotification(`¡Sesión iniciada con ${providerType === 'google' ? 'Google' : 'GitHub'}!`, 'success');
            closeModal();
            
        } catch (error) {
            console.error(`❌ Error en login con ${providerType}:`, error);
            
            let errorMessage = `Error al conectar con ${providerType === 'google' ? 'Google' : 'GitHub'}`;
            
            const errorMessages = {
                'auth/popup-closed-by-user': 'El popup fue cerrado. Intenta de nuevo.',
                'auth/cancelled-popup-request': 'La solicitud fue cancelada.',
                'auth/account-exists-with-different-credential': 'Ya existe una cuenta con el mismo email pero con otro método de autenticación.',
                'auth/operation-not-allowed': `La autenticación con ${providerType === 'google' ? 'Google' : 'GitHub'} no está habilitada.`
            };
            
            errorMessage = errorMessages[error.code] || errorMessage;
            showNotification(errorMessage, 'error');
        }
    }
    
    async function handleLogin() {
        const email = document.getElementById('modalEmail')?.value.trim();
        const password = document.getElementById('modalPassword')?.value;
        
        if (!email || !password) {
            showNotification('Por favor, completa todos los campos', 'error');
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Por favor, ingresa un email válido', 'error');
            return;
        }
        
        const submitBtn = document.getElementById('modalSubmitBtn');
        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
        
        try {
            if (window.firebaseReady && window.firebaseAuth && window.firebaseModules) {
                await window.firebaseModules.signInWithEmailAndPassword(
                    window.firebaseAuth, email, password
                );
                
                submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Éxito!';
                submitBtn.classList.add('success-btn');
                
                setTimeout(() => {
                    closeModal();
                    showNotification('¡Sesión iniciada correctamente!', 'success');
                }, 1000);
                
            } else {
                showNotification('Firebase no está disponible. Usando modo demo.', 'info');
                
                // Modo demo para testing
                currentUser = {
                    email: email,
                    name: email.split('@')[0],
                    firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                    role: ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'student',
                    points: 0,
                    isLocalUser: true
                };
                
                localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUser));
                updateUIForUser(currentUser);
                
                submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Éxito!';
                submitBtn.classList.add('success-btn');
                
                setTimeout(() => {
                    closeModal();
                    showNotification('¡Sesión iniciada en modo local!', 'success');
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
                'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.'
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
    
    async function handleSignup() {
        const name = document.getElementById('modalSignupName')?.value.trim();
        const email = document.getElementById('modalSignupEmail')?.value.trim();
        const password = document.getElementById('modalSignupPassword')?.value;
        
        if (!name || !email || !password) {
            showNotification('Por favor, completa todos los campos', 'error');
            return;
        }
        
        if (password.length < 6) {
            showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Por favor, ingresa un email válido', 'error');
            return;
        }
        
        const submitBtn = document.getElementById('modalSignupSubmitBtn');
        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando cuenta...';
        
        try {
            if (window.firebaseReady && window.firebaseAuth && window.firebaseModules) {
                const userCredential = await window.firebaseModules.createUserWithEmailAndPassword(
                    window.firebaseAuth, email, password
                );
                
                await window.firebaseModules.updateProfile(userCredential.user, { displayName: name });
                await window.firebaseModules.sendEmailVerification(userCredential.user);
                
                submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Cuenta creada!';
                submitBtn.classList.add('success-btn');
                
                setTimeout(() => {
                    closeModal();
                    showNotification(`¡Bienvenido ${name.split(' ')[0]}! 🎸\nCuenta creada exitosamente. Hemos enviado un email de verificación.`, 'success');
                }, 1500);
                
            } else {
                // Modo local para testing
                const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
                
                currentUser = {
                    name: name,
                    firstName: name.split(' ')[0],
                    email: email,
                    role: isAdmin ? 'admin' : 'student',
                    points: 0,
                    isLocalUser: true
                };
                
                localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUser));
                updateUIForUser(currentUser);
                
                const roleMsg = isAdmin ? 'Administrador' : 'Estudiante';
                
                submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Cuenta creada!';
                submitBtn.classList.add('success-btn');
                
                setTimeout(() => {
                    closeModal();
                    showNotification(`¡Bienvenido ${name.split(' ')[0]}! 🎸\nCuenta creada exitosamente en modo local.\nEmail: ${email}\nRol: ${roleMsg}`, 'success');
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
                showNotification(errorMessage, 'error');
            }, 1000);
        }
    }
    
    async function handleForgotPassword() {
        const email = prompt('Por favor, ingresa tu email para recuperar tu contraseña:');
        
        if (!email) return;
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('Por favor, ingresa un email válido.', 'error');
            return;
        }
        
        try {
            if (window.firebaseReady && window.firebaseAuth && window.firebaseModules) {
                await window.firebaseModules.sendPasswordResetEmail(window.firebaseAuth, email);
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
    
    async function handleLogout() {
        try {
            if (window.firebaseReady && window.firebaseAuth && window.firebaseModules) {
                await window.firebaseModules.signOut(window.firebaseAuth);
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
    
    function openModal(formType = 'login') {
        currentFormType = formType;
        loadForm(formType);
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function showNotification(message, type = 'info') {
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
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // ========== SISTEMA DE PUNTOS ==========
    async function addPoints(points, reason = '') {
        console.log(`🎯 Intentando añadir ${points} puntos: ${reason}`);
        
        if (!currentUser) {
            console.log('⚠️ Usuario no autenticado, no se pueden añadir puntos');
            return;
        }
        
        try {
            // Actualizar localmente
            currentUser.points = (currentUser.points || 0) + points;
            updateUIForUser(currentUser);
            
            // Guardar en localStorage
            localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUser));
            
            // Guardar en Firestore si está disponible
            if (window.firebaseReady && window.firebaseDb && window.firebaseModules && currentUser.uid) {
                const userRef = window.firebaseModules.doc(window.firebaseDb, 'users', currentUser.uid);
                
                // Usar increment para sumar puntos en Firestore
                await window.firebaseModules.updateDoc(userRef, {
                    points: window.firebaseModules.increment(points),
                    lastActive: window.firebaseModules.serverTimestamp()
                });
                
                console.log(`✅ ${points} puntos añadidos en Firestore: ${reason}`);
                
                // Actualizar puntos locales desde Firestore para estar seguros
                const userDoc = await window.firebaseModules.getDoc(userRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    currentUser.points = userData.points || currentUser.points;
                    updateUIForUser(currentUser);
                    localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUser));
                }
            } else {
                console.log(`✅ ${points} puntos añadidos (modo local): ${reason}`);
            }
            
            // Mostrar notificación de puntos ganados
            showPointsNotification(points, reason);
            
        } catch (error) {
            console.error('❌ Error añadiendo puntos:', error);
            
            // En caso de error, mantener puntos locales
            localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUser));
        }
    }
    
    function showPointsNotification(points, reason) {
        // Crear notificación de puntos
        const notification = document.createElement('div');
        notification.className = 'points-notification';
        notification.innerHTML = `
            <i class="fas fa-coins" style="color: #f1c40f;"></i>
            <span>+${points} puntos! ${reason}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-eliminar después de 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    async function registerAchievement(achievementId, description, points) {
        if (!currentUser) {
            console.log('⚠️ Usuario no autenticado, no se puede registrar logro');
            return false;
        }
        
        console.log(`🏆 Registrando logro: ${description} (+${points} puntos)`);
        
        // Primero añadir puntos
        await addPoints(points, description);
        
        // Mostrar notificación de logro
        showAchievementNotification(description, points);
        
        // Guardar logro en Firestore
        if (window.firebaseReady && window.firebaseDb && window.firebaseModules && currentUser.uid) {
            try {
                const userRef = window.firebaseModules.doc(window.firebaseDb, 'users', currentUser.uid);
                const userDoc = await window.firebaseModules.getDoc(userRef);
                
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const achievements = userData.achievements || [];
                    
                    // Verificar si el logro ya existe
                    if (!achievements.includes(achievementId)) {
                        achievements.push(achievementId);
                        
                        await window.firebaseModules.updateDoc(userRef, {
                            achievements: achievements
                        });
                        
                        console.log(`✅ Logro "${achievementId}" guardado en Firestore`);
                    }
                }
            } catch (error) {
                console.error('❌ Error guardando logro en Firestore:', error);
            }
        }
        
        return true;
    }
    
    function showAchievementNotification(description, points) {
        const notification = document.getElementById('achievementNotification');
        const nameElement = document.getElementById('achievementName');
        const descElement = document.getElementById('achievementDesc');
        const progressElement = document.getElementById('achievementProgress');
        
        if (notification && nameElement && descElement && progressElement) {
            nameElement.textContent = description;
            descElement.textContent = '¡Logro desbloqueado!';
            progressElement.textContent = `+${points} puntos`;
            
            notification.classList.remove('hide');
            notification.classList.add('show');
            
            // Reproducir sonido de logro
            if (window.AppState && window.AppState.playAchievementSound) {
                window.AppState.playAchievementSound();
            }
            
            // Auto-ocultar después de 5 segundos
            setTimeout(() => {
                notification.classList.remove('show');
                notification.classList.add('hide');
                
                setTimeout(() => {
                    notification.classList.remove('hide');
                }, 500);
            }, 5000);
        }
    }
    
    async function syncPointsWithFirestore() {
        if (!currentUser || !currentUser.uid) {
            return;
        }
        
        if (!window.firebaseReady || !window.firebaseDb || !window.firebaseModules) {
            return;
        }
        
        try {
            const userRef = window.firebaseModules.doc(window.firebaseDb, 'users', currentUser.uid);
            const userDoc = await window.firebaseModules.getDoc(userRef);
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const firestorePoints = userData.points || 0;
                
                // Si hay diferencia, usar el valor más alto
                if (firestorePoints !== currentUser.points) {
                    currentUser.points = Math.max(firestorePoints, currentUser.points || 0);
                    updateUIForUser(currentUser);
                    localStorage.setItem('guitarraFacilUser', JSON.stringify(currentUser));
                    console.log(`🔄 Puntos sincronizados: ${currentUser.points}`);
                }
            }
        } catch (error) {
            console.error('❌ Error sincronizando puntos:', error);
        }
    }
    
    // ========== INICIALIZACIÓN ==========
    function init() {
        // Inicializar Firebase
        initializeFirebaseForLearning();
        
        // Configurar event listeners
        loginBtn.addEventListener('click', () => openModal('login'));
        modalCloseBtn.addEventListener('click', closeModal);
        modalSignupBtn.addEventListener('click', () => openModal('signup'));
        modalLoginBtn.addEventListener('click', () => openModal('login'));
        
        // Cerrar modal al hacer clic fuera
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                closeModal();
            }
        });
        
        // Botón volver al index
        document.getElementById('backToIndex').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        // Botón cerrar sesión
        userInfo.addEventListener('click', handleLogout);
    }
    
    // API pública
    return {
        init,
        isAuthenticated: () => currentUser !== null,
        getCurrentUser: () => currentUser,
        addPoints,
        registerAchievement,
        syncPointsWithFirestore,
        showAchievementNotification,
        openModal,
        closeModal
    };
})();

// ==============================================
// SISTEMA DE APRENDIZAJE MUSICAL
// ==============================================
const AppState = {
    currentLevel: 'menu',
    majorChordIndex: 0,
    minorChordIndex: 0,
    majorScaleIndex: 0,
    minorScaleIndex: 0,
    completedMajorChords: false,
    completedMinorChords: false,
    completedMajorScales: false,
    completedMinorScales: false,
    completedEarTraining: false,
    heardMajorChords: [],
    heardMinorChords: [],
    heardMajorScales: [],
    heardMinorScales: [],
    audioContext: null,
    currentModule: 'chords',
    isReviewMode: false,
    reviewModeLevel: null,
    isPlaying: false,
    
    // Variables para entrenamiento auditivo
    currentEarNote: null,
    selectedEarNote: null,
    earScore: 0,
    earCorrectCount: 0,
    earIncorrectCount: 0,
    earIsPlaying: false,
    earIsAnswerVerified: false,
    earMissionScore: 100,
    
    init() {
        this.loadProgress();
        this.initAudio();
        this.setupEventListeners();
        this.updateMenuStatus();
        this.showMainMenu();
        
        // Inicializar estadísticas del entrenamiento auditivo
        this.updateEarStats();
        this.updateMissionProgress();
        
        // Sincronizar puntos con Firestore al iniciar
        if (authSystem.syncPointsWithFirestore) {
            setTimeout(() => {
                authSystem.syncPointsWithFirestore();
            }, 1000);
        }
    },
    
    loadProgress() {
        const saved = localStorage.getItem('musicAppProgress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.majorChordIndex = data.majorChordIndex || 0;
                this.minorChordIndex = data.minorChordIndex || 0;
                this.majorScaleIndex = data.majorScaleIndex || 0;
                this.minorScaleIndex = data.minorScaleIndex || 0;
                this.completedMajorChords = data.completedMajorChords || false;
                this.completedMinorChords = data.completedMinorChords || false;
                this.completedMajorScales = data.completedMajorScales || false;
                this.completedMinorScales = data.completedMinorScales || false;
                this.completedEarTraining = data.completedEarTraining || false;
                this.heardMajorChords = data.heardMajorChords || Array(majorChords.length).fill(false);
                this.heardMinorChords = data.heardMinorChords || Array(minorChords.length).fill(false);
                this.heardMajorScales = data.heardMajorScales || Array(majorScales.length).fill(false);
                this.heardMinorScales = data.heardMinorScales || Array(minorScales.length).fill(false);
                
                // Cargar progreso del entrenamiento auditivo
                this.earScore = data.earScore || 0;
                this.earCorrectCount = data.earCorrectCount || 0;
                this.earIncorrectCount = data.earIncorrectCount || 0;
                
                // Actualizar misión si ya está completada
                if (this.earScore >= this.earMissionScore) {
                    this.completedEarTraining = true;
                }
                
                console.log('✅ Progreso cargado desde localStorage');
                
            } catch (error) {
                console.error('❌ Error cargando progreso:', error);
                this.resetProgress();
            }
        } else {
            this.resetProgress();
        }
    },
    
    resetProgress() {
        this.heardMajorChords = Array(majorChords.length).fill(false);
        this.heardMinorChords = Array(minorChords.length).fill(false);
        this.heardMajorScales = Array(majorScales.length).fill(false);
        this.heardMinorScales = Array(minorScales.length).fill(false);
    },
    
    saveProgress() {
        const data = {
            majorChordIndex: this.majorChordIndex,
            minorChordIndex: this.minorChordIndex,
            majorScaleIndex: this.majorScaleIndex,
            minorScaleIndex: this.minorScaleIndex,
            completedMajorChords: this.completedMajorChords,
            completedMinorChords: this.completedMinorChords,
            completedMajorScales: this.completedMajorScales,
            completedMinorScales: this.completedMinorScales,
            completedEarTraining: this.completedEarTraining,
            heardMajorChords: this.heardMajorChords,
            heardMinorChords: this.heardMinorChords,
            heardMajorScales: this.heardMajorScales,
            heardMinorScales: this.heardMinorScales,
            earScore: this.earScore,
            earCorrectCount: this.earCorrectCount,
            earIncorrectCount: this.earIncorrectCount
        };
        
        try {
            localStorage.setItem('musicAppProgress', JSON.stringify(data));
            console.log('✅ Progreso guardado en localStorage');
        } catch (error) {
            console.error('❌ Error guardando progreso:', error);
        }
    },
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('AudioContext inicializado');
        } catch (e) {
            console.log('Audio no disponible:', e);
        }
    },
    
    // ========== SISTEMA DE SONIDO ==========
    playSound(frequencies, type = 'chord') {
        if (!this.audioContext || this.isPlaying) return;
        
        this.isPlaying = true;
        
        // Si el contexto está suspendido, reanudarlo
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        const now = this.audioContext.currentTime;
        
        if (type === 'chord') {
            // Para acorde: tocar todas las frecuencias al mismo tiempo
            frequencies.forEach(freq => {
                this.playNoteAtFrequency(freq, now, 1.5);
            });
        } else if (type === 'arpeggio') {
            // Para arpegio: tocar cada frecuencia en secuencia
            frequencies.forEach((freq, index) => {
                const delay = index * 0.3; // 300ms entre notas
                this.playNoteAtFrequency(freq, now + delay, 1.0);
            });
        } else if (type === 'scale') {
            // Para escala: tocar las notas de la escala en secuencia (ascendente)
            frequencies.forEach((freq, index) => {
                const delay = index * 0.3; // 300ms entre notas
                this.playNoteAtFrequency(freq, now + delay, 0.8);
            });
        } else if (type === 'pattern') {
            // Para patrón: tocar notas específicas de la escala (tónica, tercera, quinta, octava)
            const patternFrequencies = [
                frequencies[0], // Tónica
                frequencies[2], // Tercera
                frequencies[4], // Quinta
                frequencies[7]  // Octava
            ];
            
            patternFrequencies.forEach((freq, index) => {
                const delay = index * 0.4; // 400ms entre notas
                this.playNoteAtFrequency(freq, now + delay, 1.0);
            });
        }
        
        // Marcar como escuchado y dar puntos si no es modo repaso
        if (!this.isReviewMode) {
            this.markContentAsHeard();
        }
        
        // Resetear estado después de reproducir
        setTimeout(() => {
            this.isPlaying = false;
        }, 2000);
    },
    
    // Reproducir nota individual (para entrenamiento auditivo)
    playEarNote(noteName) {
        if (!this.audioContext || this.earIsPlaying) return;
        
        this.earIsPlaying = true;
        
        // Si el contexto está suspendido, reanudarlo
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        const now = this.audioContext.currentTime;
        const note = earNotes.find(n => n.name === noteName);
        
        if (note) {
            this.playNoteAtFrequency(note.frequency, now, 1.5);
            
            // Mostrar mensaje de "Escuchando..."
            document.getElementById('currentNote').textContent = "🎵 Escuchando...";
            document.getElementById('currentNote').style.color = "#3498db";
        }
        
        // Resetear estado después de reproducir
        setTimeout(() => {
            this.earIsPlaying = false;
            document.getElementById('currentNote').textContent = "¿Qué nota escuchaste?";
            document.getElementById('currentNote').style.color = "white";
        }, 1500);
    },
    
    playNoteAtFrequency(frequency, startTime, duration = 1.5) {
        const ctx = this.audioContext;
        if (!ctx) return;
        
        // Crear oscilador
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        // Usar tipo de onda sine
        oscillator.type = 'sine';
        
        // Configurar frecuencia
        oscillator.frequency.value = frequency;
        
        // Configurar envolvente para sonido más natural
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02); // Ataque rápido
        gainNode.gain.exponentialRampToValueAtTime(0.2, startTime + 0.5); // Decaimiento
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration); // Release
        
        // Conectar nodos
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        // Iniciar y detener oscilador
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    },
    
    // SONIDO DE LOGRO (como Steam)
    playAchievementSound() {
        if (!this.audioContext) return;
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        const now = this.audioContext.currentTime;
        
        // Crear un sonido de logro tipo Steam
        const frequencies = [523.25, 659.25, 783.99, 1046.50];
        
        // Primeras tres notas rápidas y ascendentes
        frequencies.slice(0, 3).forEach((freq, index) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0, now + index * 0.1);
            gain.gain.linearRampToValueAtTime(0.3, now + index * 0.1 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.2);
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.start(now + index * 0.1);
            osc.stop(now + index * 0.1 + 0.2);
        });
        
        // Última nota más larga (el "ding" final)
        setTimeout(() => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = frequencies[3];
            
            gain.gain.setValueAtTime(0, now + 0.35);
            gain.gain.linearRampToValueAtTime(0.4, now + 0.4);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.start(now + 0.35);
            osc.stop(now + 1.2);
        }, 350);
    },
    
    setupEventListeners() {
        // Botón Volver al Menú
        document.getElementById('backToMenu').addEventListener('click', () => this.showMainMenu());
        document.getElementById('backToMenuFromSelection').addEventListener('click', () => this.showMainMenu());
        document.getElementById('backToMenuFromScaleSelection').addEventListener('click', () => this.showMainMenu());
        document.getElementById('backToMenuFromEar').addEventListener('click', () => this.showMainMenu());
        
        // Menú Principal
        document.getElementById('menuChords').addEventListener('click', () => this.showChordTypeSelection());
        document.getElementById('menuScales').addEventListener('click', () => {
            if (this.completedMajorChords && this.completedMinorChords) {
                this.showScaleTypeSelection();
            } else {
                alert('Debes completar primero los acordes para desbloquear las escalas.');
            }
        });
        document.getElementById('menuEar').addEventListener('click', () => {
            if (this.completedMajorChords && this.completedMinorChords && 
                this.completedMajorScales && this.completedMinorScales) {
                this.startEarTraining();
            } else {
                alert('Debes completar primero acordes y escalas para desbloquear el entrenamiento auditivo.');
            }
        });
        
        // Selección de tipo de acorde
        document.getElementById('selectMajorChords').addEventListener('click', () => this.startMajorChords());
        document.getElementById('selectMinorChords').addEventListener('click', () => this.startMinorChords());
        
        // Selección de tipo de escala
        document.getElementById('selectMajorScales').addEventListener('click', () => this.startMajorScales());
        document.getElementById('selectMinorScales').addEventListener('click', () => this.startMinorScales());
        
        // Botones volver a selección
        document.getElementById('backToChordSelectFromMajor').addEventListener('click', () => this.showChordTypeSelection());
        document.getElementById('backToChordSelectFromMinor').addEventListener('click', () => this.showChordTypeSelection());
        document.getElementById('backToScaleSelectFromMajor').addEventListener('click', () => this.showScaleTypeSelection());
        document.getElementById('backToScaleSelectFromMinor').addEventListener('click', () => this.showScaleTypeSelection());
        
        // Navegación acordes mayores
        document.getElementById('majorPrev').addEventListener('click', () => this.prevMajorChord());
        document.getElementById('majorNext').addEventListener('click', () => this.nextMajorChord());
        
        // Navegación acordes menores
        document.getElementById('minorPrev').addEventListener('click', () => this.prevMinorChord());
        document.getElementById('minorNext').addEventListener('click', () => this.nextMinorChord());
        
        // Navegación escalas mayores
        document.getElementById('majorScalePrev').addEventListener('click', () => this.prevMajorScale());
        document.getElementById('majorScaleNext').addEventListener('click', () => this.nextMajorScale());
        
        // Navegación escalas menores
        document.getElementById('minorScalePrev').addEventListener('click', () => this.prevMinorScale());
        document.getElementById('minorScaleNext').addEventListener('click', () => this.nextMinorScale());
        
        // Sonido acordes mayores
        document.getElementById('majorPlayChord').addEventListener('click', () => this.playCurrentChord('major'));
        document.getElementById('majorPlayArpeggio').addEventListener('click', () => this.playCurrentArpeggio('major'));
        
        // Sonido acordes menores
        document.getElementById('minorPlayChord').addEventListener('click', () => this.playCurrentChord('minor'));
        document.getElementById('minorPlayArpeggio').addEventListener('click', () => this.playCurrentArpeggio('minor'));
        
        // Sonido escalas mayores
        document.getElementById('majorScalePlayScale').addEventListener('click', () => this.playCurrentScale('major'));
        document.getElementById('majorScalePlayPattern').addEventListener('click', () => this.playCurrentPattern('major'));
        
        // Sonido escalas menores
        document.getElementById('minorScalePlayScale').addEventListener('click', () => this.playCurrentScale('minor'));
        document.getElementById('minorScalePlayPattern').addEventListener('click', () => this.playCurrentPattern('minor'));
        
        // Botones modo repaso
        document.getElementById('majorReviewModeBtn').addEventListener('click', () => this.activateReviewMode('majorChords'));
        document.getElementById('minorReviewModeBtn').addEventListener('click', () => this.activateReviewMode('minorChords'));
        document.getElementById('majorScaleReviewModeBtn').addEventListener('click', () => this.activateReviewMode('majorScales'));
        document.getElementById('minorScaleReviewModeBtn').addEventListener('click', () => this.activateReviewMode('minorScales'));
        
        // Controles entrenamiento auditivo
        document.getElementById('playNote').addEventListener('click', () => {
            if (this.currentEarNote && !this.earIsPlaying) {
                this.playEarNote(this.currentEarNote.name);
            }
        });
        
        document.getElementById('checkAnswer').addEventListener('click', () => this.checkEarAnswer());
        document.getElementById('nextNote').addEventListener('click', () => this.generateRandomEarNote());
        
        // Configurar eventos para las opciones de nota
        const noteOptions = document.querySelectorAll('.note-option');
        noteOptions.forEach(option => {
            option.addEventListener('click', () => {
                if (this.earIsAnswerVerified) return;
                
                // Deseleccionar todas las opciones
                noteOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Seleccionar la opción actual
                option.classList.add('selected');
                this.selectedEarNote = option.getAttribute('data-note');
                
                // Mostrar la nota seleccionada en el pentagrama
                this.showEarNoteOnStaff(this.selectedEarNote, 'selected');
            });
        });
        
        // Cerrar logro
        document.getElementById('achievementClose').addEventListener('click', () => {
            this.hideAchievement();
        });
        
        // Inicializar audio con primer clic
        document.addEventListener('click', () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });
    },
    
    updateMenuStatus() {
        // Desbloquear escalas si acordes están completados
        if (this.completedMajorChords && this.completedMinorChords) {
            document.getElementById('scalesStatus').textContent = 'DESBLOQUEADO';
            document.getElementById('scalesStatus').className = 'status-badge unlocked';
            document.getElementById('menuScales').classList.remove('locked');
        }
        
        // Desbloquear entrenamiento auditivo solo si acordes y escalas están completados
        if (this.completedMajorChords && this.completedMinorChords && 
            this.completedMajorScales && this.completedMinorScales) {
            document.getElementById('earStatus').textContent = this.completedEarTraining ? 'COMPLETADO' : 'DESBLOQUEADO';
            document.getElementById('earStatus').className = this.completedEarTraining ? 'status-badge completed' : 'status-badge unlocked';
            document.getElementById('menuEar').classList.remove('locked');
            
            if (this.completedEarTraining) {
                document.getElementById('menuEar').classList.add('completed');
            }
        }
    },
    
    showMainMenu() {
        // Ocultar todo
        document.getElementById('learningContent').style.display = 'none';
        document.getElementById('chordTypeSelection').classList.remove('active');
        document.getElementById('scaleTypeSelection').classList.remove('active');
        document.getElementById('backToMenu').style.display = 'none';
        document.getElementById('progressContainer').style.display = 'none';
        
        // Mostrar menú principal
        document.getElementById('mainMenu').style.display = 'flex';
        
        // Actualizar título
        document.getElementById('appTitle').textContent = 'Aprende Música - Sistema Completo';
        document.getElementById('appDescription').textContent = 'Sistema completo de aprendizaje musical en 3 etapas';
        
        this.updateMenuStatus();
        this.deactivateReviewMode();
    },
    
    showChordTypeSelection() {
        // Ocultar menú principal
        document.getElementById('mainMenu').style.display = 'none';
        
        // Ocultar contenido de aprendizaje
        document.getElementById('learningContent').style.display = 'none';
        
        // Mostrar selección de tipo de acorde
        document.getElementById('chordTypeSelection').classList.add('active');
        document.getElementById('backToMenu').style.display = 'flex';
        document.getElementById('progressContainer').style.display = 'none';
        
        // Actualizar título
        document.getElementById('appTitle').textContent = 'Aprende Acordes Básicos';
        document.getElementById('appDescription').textContent = 'Selecciona el tipo de acorde que quieres practicar';
        
        this.deactivateReviewMode();
    },
    
    showScaleTypeSelection() {
        // Ocultar menú principal
        document.getElementById('mainMenu').style.display = 'none';
        
        // Ocultar contenido de aprendizaje
        document.getElementById('learningContent').style.display = 'none';
        
        // Mostrar selección de tipo de escala
        document.getElementById('scaleTypeSelection').classList.add('active');
        document.getElementById('backToMenu').style.display = 'flex';
        document.getElementById('progressContainer').style.display = 'none';
        
        // Actualizar título
        document.getElementById('appTitle').textContent = 'Aprende Escalas Básicas';
        document.getElementById('appDescription').textContent = 'Selecciona el tipo de escala que quieres practicar';
        
        this.deactivateReviewMode();
    },
    
    startMajorChords() {
        this.currentModule = 'chords';
        this.currentLevel = 'majorChords';
        this.isReviewMode = false;
        this.showLearningContent();
        this.showMajorChordLevel();
        this.updateContentSelectors();
    },
    
    startMinorChords() {
        this.currentModule = 'chords';
        this.currentLevel = 'minorChords';
        this.isReviewMode = false;
        this.showLearningContent();
        this.showMinorChordLevel();
        this.updateContentSelectors();
    },
    
    startMajorScales() {
        this.currentModule = 'scales';
        this.currentLevel = 'majorScales';
        this.isReviewMode = false;
        this.showLearningContent();
        this.showMajorScaleLevel();
        this.updateContentSelectors();
    },
    
    startMinorScales() {
        this.currentModule = 'scales';
        this.currentLevel = 'minorScales';
        this.isReviewMode = false;
        this.showLearningContent();
        this.showMinorScaleLevel();
        this.updateContentSelectors();
    },
    
    startEarTraining() {
        this.currentModule = 'ear';
        this.currentLevel = 'earTraining';
        this.isReviewMode = false;
        this.showLearningContent();
        this.showEarTrainingLevel();
        this.generateRandomEarNote();
    },
    
    showLearningContent() {
        // Ocultar selección
        document.getElementById('chordTypeSelection').classList.remove('active');
        document.getElementById('scaleTypeSelection').classList.remove('active');
        
        // Mostrar contenido de aprendizaje
        document.getElementById('learningContent').style.display = 'block';
        document.getElementById('backToMenu').style.display = 'flex';
        document.getElementById('progressContainer').style.display = 'flex';
    },
    
    showMajorChordLevel() {
        this.currentLevel = 'majorChords';
        document.getElementById('majorLevel').style.display = 'block';
        document.getElementById('minorLevel').style.display = 'none';
        document.getElementById('majorScaleLevel').style.display = 'none';
        document.getElementById('minorScaleLevel').style.display = 'none';
        document.getElementById('earTrainingLevel').style.display = 'none';
        
        this.updateMajorChordDisplay();
        this.updateProgress();
    },
    
    showMinorChordLevel() {
        this.currentLevel = 'minorChords';
        document.getElementById('majorLevel').style.display = 'none';
        document.getElementById('minorLevel').style.display = 'block';
        document.getElementById('majorScaleLevel').style.display = 'none';
        document.getElementById('minorScaleLevel').style.display = 'none';
        document.getElementById('earTrainingLevel').style.display = 'none';
        
        this.updateMinorChordDisplay();
        this.updateProgress();
    },
    
    showMajorScaleLevel() {
        this.currentLevel = 'majorScales';
        document.getElementById('majorLevel').style.display = 'none';
        document.getElementById('minorLevel').style.display = 'none';
        document.getElementById('majorScaleLevel').style.display = 'block';
        document.getElementById('minorScaleLevel').style.display = 'none';
        document.getElementById('earTrainingLevel').style.display = 'none';
        
        this.updateMajorScaleDisplay();
        this.updateProgress();
    },
    
    showMinorScaleLevel() {
        this.currentLevel = 'minorScales';
        document.getElementById('majorLevel').style.display = 'none';
        document.getElementById('minorLevel').style.display = 'none';
        document.getElementById('majorScaleLevel').style.display = 'none';
        document.getElementById('minorScaleLevel').style.display = 'block';
        document.getElementById('earTrainingLevel').style.display = 'none';
        
        this.updateMinorScaleDisplay();
        this.updateProgress();
    },
    
    showEarTrainingLevel() {
        this.currentLevel = 'earTraining';
        document.getElementById('majorLevel').style.display = 'none';
        document.getElementById('minorLevel').style.display = 'none';
        document.getElementById('majorScaleLevel').style.display = 'none';
        document.getElementById('minorScaleLevel').style.display = 'none';
        document.getElementById('earTrainingLevel').style.display = 'block';
        
        this.updateProgress();
    },
    
    // ========== MÉTODOS PARA ACTUALIZAR DISPLAY ==========
    updateMajorChordDisplay() {
        const chord = majorChords[this.majorChordIndex];
        if (!chord) return;
        
        // Actualizar nombre
        document.getElementById('majorChordName').textContent = chord.name;
        
        // Actualizar imagen
        const imageContainer = document.getElementById('majorImageContainer');
        imageContainer.innerHTML = `
            <img src="${chord.image}" alt="${chord.name}" class="content-image" 
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200/3498db/ffffff?text=${chord.shortName}+Mayor';">
        `;
        
        // Actualizar digitación
        const fingeringList = document.getElementById('majorFingering');
        fingeringList.innerHTML = chord.fingering.map(item => `<li>${item}</li>`).join('');
        
        // Actualizar consejo
        document.getElementById('majorTips').textContent = chord.tips;
        
        // Actualizar contador
        document.getElementById('majorCounter').textContent = `Acorde ${this.majorChordIndex + 1} de ${majorChords.length}`;
        
        // Actualizar botones de navegación
        document.getElementById('majorPrev').disabled = this.majorChordIndex === 0;
        document.getElementById('majorNext').disabled = this.majorChordIndex === majorChords.length - 1;
        
        // Actualizar estado de completado
        if (this.majorChordIndex === majorChords.length - 1) {
            document.getElementById('majorNext').classList.add('complete');
            document.getElementById('majorNext').innerHTML = '<span>¡Completar!</span><i class="fas fa-check"></i>';
        } else {
            document.getElementById('majorNext').classList.remove('complete');
            document.getElementById('majorNext').innerHTML = '<span>Siguiente</span><i class="fas fa-chevron-right"></i>';
        }
        
        // Actualizar selector de acordes
        this.updateChordSelector('major');
    },
    
    updateMinorChordDisplay() {
        const chord = minorChords[this.minorChordIndex];
        if (!chord) return;
        
        // Actualizar nombre
        document.getElementById('minorChordName').textContent = chord.name;
        
        // Actualizar imagen
        const imageContainer = document.getElementById('minorImageContainer');
        imageContainer.innerHTML = `
            <img src="${chord.image}" alt="${chord.name}" class="content-image" 
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200/9b59b6/ffffff?text=${chord.shortName}+Menor';">
        `;
        
        // Actualizar digitación
        const fingeringList = document.getElementById('minorFingering');
        fingeringList.innerHTML = chord.fingering.map(item => `<li>${item}</li>`).join('');
        
        // Actualizar consejo
        document.getElementById('minorTips').textContent = chord.tips;
        
        // Actualizar contador
        document.getElementById('minorCounter').textContent = `Acorde ${this.minorChordIndex + 1} de ${minorChords.length}`;
        
        // Actualizar botones de navegación
        document.getElementById('minorPrev').disabled = this.minorChordIndex === 0;
        document.getElementById('minorNext').disabled = this.minorChordIndex === minorChords.length - 1;
        
        // Actualizar estado de completado
        if (this.minorChordIndex === minorChords.length - 1) {
            document.getElementById('minorNext').classList.add('complete');
            document.getElementById('minorNext').innerHTML = '<span>¡Completar!</span><i class="fas fa-check"></i>';
        } else {
            document.getElementById('minorNext').classList.remove('complete');
            document.getElementById('minorNext').innerHTML = '<span>Siguiente</span><i class="fas fa-chevron-right"></i>';
        }
        
        // Actualizar selector de acordes
        this.updateChordSelector('minor');
    },
    
    updateMajorScaleDisplay() {
        const scale = majorScales[this.majorScaleIndex];
        if (!scale) return;
        
        // Actualizar nombre
        document.getElementById('majorScaleName').textContent = scale.name;
        
        // Actualizar imagen
        const imageContainer = document.getElementById('majorScaleImageContainer');
        imageContainer.innerHTML = `
            <img src="${scale.image}" alt="${scale.name}" class="content-image" 
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200/3498db/ffffff?text=${scale.shortName}+Mayor';">
        `;
        
        // Actualizar patrón de escala
        const patternContainer = document.getElementById('majorScalePattern');
        patternContainer.innerHTML = scale.patternNotes.map((note, index) => {
            const isTonic = index === 0 || index === scale.patternNotes.length - 1;
            return `<span class="pattern-item ${isTonic ? 'tonic' : ''}">${note}</span>`;
        }).join('');
        
        // Actualizar digitación
        const fingeringList = document.getElementById('majorScaleFingering');
        fingeringList.innerHTML = scale.fingering.map(item => `<li>${item}</li>`).join('');
        
        // Actualizar consejo
        document.getElementById('majorScaleTips').textContent = scale.tips;
        
        // Actualizar contador
        document.getElementById('majorScaleCounter').textContent = `Escala ${this.majorScaleIndex + 1} de ${majorScales.length}`;
        
        // Actualizar botones de navegación
        document.getElementById('majorScalePrev').disabled = this.majorScaleIndex === 0;
        document.getElementById('majorScaleNext').disabled = this.majorScaleIndex === majorScales.length - 1;
        
        // Actualizar estado de completado
        if (this.majorScaleIndex === majorScales.length - 1) {
            document.getElementById('majorScaleNext').classList.add('complete');
            document.getElementById('majorScaleNext').innerHTML = '<span>¡Completar!</span><i class="fas fa-check"></i>';
        } else {
            document.getElementById('majorScaleNext').classList.remove('complete');
            document.getElementById('majorScaleNext').innerHTML = '<span>Siguiente</span><i class="fas fa-chevron-right"></i>';
        }
        
        // Actualizar selector de escalas
        this.updateScaleSelector('major');
    },
    
    updateMinorScaleDisplay() {
        const scale = minorScales[this.minorScaleIndex];
        if (!scale) return;
        
        // Actualizar nombre
        document.getElementById('minorScaleName').textContent = scale.name;
        
        // Actualizar imagen
        const imageContainer = document.getElementById('minorScaleImageContainer');
        imageContainer.innerHTML = `
            <img src="${scale.image}" alt="${scale.name}" class="content-image" 
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200/9b59b6/ffffff?text=${scale.shortName}+Menor';">
        `;
        
        // Actualizar patrón de escala
        const patternContainer = document.getElementById('minorScalePattern');
        patternContainer.innerHTML = scale.patternNotes.map((note, index) => {
            const isTonic = index === 0 || index === scale.patternNotes.length - 1;
            return `<span class="pattern-item ${isTonic ? 'tonic' : ''}">${note}</span>`;
        }).join('');
        
        // Actualizar digitación
        const fingeringList = document.getElementById('minorScaleFingering');
        fingeringList.innerHTML = scale.fingering.map(item => `<li>${item}</li>`).join('');
        
        // Actualizar consejo
        document.getElementById('minorScaleTips').textContent = scale.tips;
        
        // Actualizar contador
        document.getElementById('minorScaleCounter').textContent = `Escala ${this.minorScaleIndex + 1} de ${minorScales.length}`;
        
        // Actualizar botones de navegación
        document.getElementById('minorScalePrev').disabled = this.minorScaleIndex === 0;
        document.getElementById('minorScaleNext').disabled = this.minorScaleIndex === minorScales.length - 1;
        
        // Actualizar estado de completado
        if (this.minorScaleIndex === minorScales.length - 1) {
            document.getElementById('minorScaleNext').classList.add('complete');
            document.getElementById('minorScaleNext').innerHTML = '<span>¡Completar!</span><i class="fas fa-check"></i>';
        } else {
            document.getElementById('minorScaleNext').classList.remove('complete');
            document.getElementById('minorScaleNext').innerHTML = '<span>Siguiente</span><i class="fas fa-chevron-right"></i>';
        }
        
        // Actualizar selector de escalas
        this.updateScaleSelector('minor');
    },
    
    // ========== MÉTODOS DE NAVEGACIÓN ==========
    prevMajorChord() {
        if (this.majorChordIndex > 0) {
            this.majorChordIndex--;
            this.updateMajorChordDisplay();
            this.updateProgress();
        }
    },
    
    nextMajorChord() {
        if (this.majorChordIndex < majorChords.length - 1) {
            this.majorChordIndex++;
            this.updateMajorChordDisplay();
            this.updateProgress();
        } else {
            // Completar acordes mayores
            this.completeMajorChords();
        }
    },
    
    prevMinorChord() {
        if (this.minorChordIndex > 0) {
            this.minorChordIndex--;
            this.updateMinorChordDisplay();
            this.updateProgress();
        }
    },
    
    nextMinorChord() {
        if (this.minorChordIndex < minorChords.length - 1) {
            this.minorChordIndex++;
            this.updateMinorChordDisplay();
            this.updateProgress();
        } else {
            // Completar acordes menores
            this.completeMinorChords();
        }
    },
    
    prevMajorScale() {
        if (this.majorScaleIndex > 0) {
            this.majorScaleIndex--;
            this.updateMajorScaleDisplay();
            this.updateProgress();
        }
    },
    
    nextMajorScale() {
        if (this.majorScaleIndex < majorScales.length - 1) {
            this.majorScaleIndex++;
            this.updateMajorScaleDisplay();
            this.updateProgress();
        } else {
            // Completar escalas mayores
            this.completeMajorScales();
        }
    },
    
    prevMinorScale() {
        if (this.minorScaleIndex > 0) {
            this.minorScaleIndex--;
            this.updateMinorScaleDisplay();
            this.updateProgress();
        }
    },
    
    nextMinorScale() {
        if (this.minorScaleIndex < minorScales.length - 1) {
            this.minorScaleIndex++;
            this.updateMinorScaleDisplay();
            this.updateProgress();
        } else {
            // Completar escalas menores
            this.completeMinorScales();
        }
    },
    
    // ========== MÉTODOS DE COMPLETADO CON PUNTOS ==========
    completeMajorChords() {
        this.completedMajorChords = true;
        
        // Desbloquear escalas en el menú
        document.getElementById('scalesStatus').textContent = 'DESBLOQUEADO';
        document.getElementById('scalesStatus').className = 'status-badge unlocked';
        document.getElementById('menuScales').classList.remove('locked');
        
        // Dar puntos por completar todos los acordes mayores
        const totalPoints = majorChords.reduce((sum, chord) => sum + (chord.points || 10), 0);
        const bonusPoints = 50; // Bono por completar todos
        
        if (authSystem) {
            authSystem.addPoints(totalPoints + bonusPoints, 'Completar todos los acordes mayores');
            authSystem.registerAchievement(
                'completado_acordes_mayores',
                'Dominador de Acordes Mayores',
                100
            );
        }
        
        this.saveProgress();
        this.updateMenuStatus();
        
        // Mostrar mensaje de felicitación
        alert(`¡Felicidades! Has completado todos los acordes mayores. ¡Ganaste ${totalPoints + bonusPoints} puntos! ¡Ahora puedes aprender escalas!`);
    },
    
    completeMinorChords() {
        this.completedMinorChords = true;
        
        // Dar puntos por completar todos los acordes menores
        const totalPoints = minorChords.reduce((sum, chord) => sum + (chord.points || 10), 0);
        const bonusPoints = 50; // Bono por completar todos
        
        if (authSystem) {
            authSystem.addPoints(totalPoints + bonusPoints, 'Completar todos los acordes menores');
            authSystem.registerAchievement(
                'completado_acordes_menores',
                'Dominador de Acordes Menores',
                100
            );
        }
        
        this.saveProgress();
        this.updateMenuStatus();
        
        // Mostrar mensaje de felicitación
        alert(`¡Excelente! Has completado todos los acordes menores. ¡Ganaste ${totalPoints + bonusPoints} puntos!`);
    },
    
    completeMajorScales() {
        this.completedMajorScales = true;
        
        // Dar puntos por completar todas las escalas mayores
        const totalPoints = majorScales.reduce((sum, scale) => sum + (scale.points || 15), 0);
        const bonusPoints = 75; // Bono por completar todas
        
        if (authSystem) {
            authSystem.addPoints(totalPoints + bonusPoints, 'Completar todas las escalas mayores');
            authSystem.registerAchievement(
                'completado_escalas_mayores',
                'Dominador de Escalas Mayores',
                100
            );
        }
        
        this.saveProgress();
        this.updateMenuStatus();
        
        // Mostrar mensaje de felicitación
        alert(`¡Increíble! Has completado todas las escalas mayores. ¡Ganaste ${totalPoints + bonusPoints} puntos!`);
    },
    
    completeMinorScales() {
        this.completedMinorScales = true;
        
        // Desbloquear entrenamiento auditivo
        if (this.completedMajorChords && this.completedMinorChords && 
            this.completedMajorScales && this.completedMinorScales) {
            document.getElementById('earStatus').textContent = 'DESBLOQUEADO';
            document.getElementById('earStatus').className = 'status-badge unlocked';
            document.getElementById('menuEar').classList.remove('locked');
            
            // Dar puntos por completar todas las escalas menores
            const totalPoints = minorScales.reduce((sum, scale) => sum + (scale.points || 15), 0);
            const bonusPoints = 75; // Bono por completar todas
            
            if (authSystem) {
                authSystem.addPoints(totalPoints + bonusPoints, 'Completar todas las escalas menores');
                authSystem.registerAchievement(
                    'completado_escalas_menores',
                    'Dominador de Escalas Menores',
                    100
                );
            }
        }
        
        this.saveProgress();
        this.updateMenuStatus();
        
        // Mostrar mensaje de felicitación
        alert(`¡Fantástico! Has completado todas las escalas menores. ¡Ganaste ${totalPoints + bonusPoints} puntos! ¡Ahora puedes entrenar tu oído!`);
    },
    
    completeEarTrainingMission() {
        this.completedEarTraining = true;
        this.earScore = this.earMissionScore;
        
        // Marcar como completado en el menú
        document.getElementById('earStatus').textContent = 'COMPLETADO';
        document.getElementById('earStatus').className = 'status-badge completed';
        document.getElementById('menuEar').classList.add('completed');
        
        // Dar puntos por completar entrenamiento auditivo
        const bonusPoints = 200; // Gran bono por completar
        
        if (authSystem) {
            authSystem.addPoints(bonusPoints, 'Completar entrenamiento auditivo');
            authSystem.registerAchievement(
                'completado_entrenamiento_auditivo',
                'Oído Absoluto Completado',
                100
            );
        }
        
        this.saveProgress();
        this.updateMenuStatus();
        
        // Mostrar mensaje de felicitación
        alert(`¡Felicidades! Has completado la misión de oído absoluto. ¡Ganaste ${bonusPoints} puntos! ¡Eres un verdadero músico!`);
    },
    
    // ========== MÉTODOS DE SONIDO CON PUNTOS ==========
    playCurrentChord(type) {
        let chord;
        let frequencies;
        
        if (type === 'major') {
            chord = majorChords[this.majorChordIndex];
            frequencies = chord ? chord.frequencies : [261.63, 329.63, 392.00]; // Do, Mi, Sol
        } else {
            chord = minorChords[this.minorChordIndex];
            frequencies = chord ? chord.frequencies : [261.63, 311.13, 392.00]; // Do, Mib, Sol
        }
        
        this.playSound(frequencies, 'chord');
    },
    
    playCurrentArpeggio(type) {
        let chord;
        let frequencies;
        
        if (type === 'major') {
            chord = majorChords[this.majorChordIndex];
            frequencies = chord ? chord.frequencies : [261.63, 329.63, 392.00, 523.25]; // Do, Mi, Sol, Do
        } else {
            chord = minorChords[this.minorChordIndex];
            frequencies = chord ? chord.frequencies : [261.63, 311.13, 392.00, 523.25]; // Do, Mib, Sol, Do
        }
        
        this.playSound(frequencies, 'arpeggio');
    },
    
    playCurrentScale(type) {
        let scale;
        let frequencies;
        
        if (type === 'major') {
            scale = majorScales[this.majorScaleIndex];
            frequencies = scale ? scale.frequencies : [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
        } else {
            scale = minorScales[this.minorScaleIndex];
            frequencies = scale ? scale.frequencies : [261.63, 293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25];
        }
        
        this.playSound(frequencies, 'scale');
    },
    
    playCurrentPattern(type) {
        let scale;
        let frequencies;
        
        if (type === 'major') {
            scale = majorScales[this.majorScaleIndex];
            frequencies = scale ? scale.frequencies : [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
        } else {
            scale = minorScales[this.minorScaleIndex];
            frequencies = scale ? scale.frequencies : [261.63, 293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25];
        }
        
        this.playSound(frequencies, 'pattern');
    },
    
    // ========== MÉTODOS DE PROGRESO CON PUNTOS ==========
    markContentAsHeard() {
        if (this.isReviewMode) return;
        
        let pointsEarned = 0;
        let contentName = '';
        let contentType = '';
        
        switch (this.currentLevel) {
            case 'majorChords':
                if (!this.heardMajorChords[this.majorChordIndex]) {
                    this.heardMajorChords[this.majorChordIndex] = true;
                    const chord = majorChords[this.majorChordIndex];
                    pointsEarned = chord.points || 10;
                    contentName = chord.name;
                    contentType = 'acorde mayor';
                    this.saveProgress();
                }
                break;
            case 'minorChords':
                if (!this.heardMinorChords[this.minorChordIndex]) {
                    this.heardMinorChords[this.minorChordIndex] = true;
                    const chord = minorChords[this.minorChordIndex];
                    pointsEarned = chord.points || 10;
                    contentName = chord.name;
                    contentType = 'acorde menor';
                    this.saveProgress();
                }
                break;
            case 'majorScales':
                if (!this.heardMajorScales[this.majorScaleIndex]) {
                    this.heardMajorScales[this.majorScaleIndex] = true;
                    const scale = majorScales[this.majorScaleIndex];
                    pointsEarned = scale.points || 15;
                    contentName = scale.name;
                    contentType = 'escala mayor';
                    this.saveProgress();
                }
                break;
            case 'minorScales':
                if (!this.heardMinorScales[this.minorScaleIndex]) {
                    this.heardMinorScales[this.minorScaleIndex] = true;
                    const scale = minorScales[this.minorScaleIndex];
                    pointsEarned = scale.points || 15;
                    contentName = scale.name;
                    contentType = 'escala menor';
                    this.saveProgress();
                }
                break;
        }
        
        // Dar puntos si se ganaron
        if (pointsEarned > 0 && authSystem) {
            authSystem.addPoints(pointsEarned, `Aprender ${contentName}`);
            console.log(`🎵 ${pointsEarned} puntos por aprender ${contentType}: ${contentName}`);
        }
        
        this.updateProgress();
    },
    
    updateProgress() {
        let current = 0;
        let total = 0;
        let levelName = '';
        let progressPercentage = 0;
        
        switch (this.currentLevel) {
            case 'majorChords':
                current = this.majorChordIndex + 1;
                total = majorChords.length;
                levelName = 'Acordes Mayores';
                progressPercentage = Math.round((current / total) * 100);
                break;
            case 'minorChords':
                current = this.minorChordIndex + 1;
                total = minorChords.length;
                levelName = 'Acordes Menores';
                progressPercentage = Math.round((current / total) * 100);
                break;
            case 'majorScales':
                current = this.majorScaleIndex + 1;
                total = majorScales.length;
                levelName = 'Escalas Mayores';
                progressPercentage = Math.round((current / total) * 100);
                break;
            case 'minorScales':
                current = this.minorScaleIndex + 1;
                total = minorScales.length;
                levelName = 'Escalas Menores';
                progressPercentage = Math.round((current / total) * 100);
                break;
            case 'earTraining':
                current = this.earScore;
                total = this.earMissionScore;
                levelName = 'Entrenamiento Auditivo';
                progressPercentage = Math.min(100, Math.round((current / total) * 100));
                break;
        }
        
        // Actualizar UI
        document.getElementById('currentLevelText').textContent = `${levelName}`;
        document.getElementById('progressFill').style.width = `${progressPercentage}%`;
        document.getElementById('progressText').textContent = `${progressPercentage}% Completado`;
    },
    
    // ========== MÉTODOS DE MODO REPASO ==========
    activateReviewMode(level) {
        this.isReviewMode = true;
        this.reviewModeLevel = level;
        
        // Mostrar selector de contenido
        switch (level) {
            case 'majorChords':
                document.getElementById('majorChordSelector').classList.add('active');
                break;
            case 'minorChords':
                document.getElementById('minorChordSelector').classList.add('active');
                break;
            case 'majorScales':
                document.getElementById('majorScaleSelector').classList.add('active');
                break;
            case 'minorScales':
                document.getElementById('minorScaleSelector').classList.add('active');
                break;
        }
        
        // Cambiar texto del botón
        const btn = document.getElementById(`${level}ReviewModeBtn`);
        if (btn) {
            btn.innerHTML = '<i class="fas fa-times"></i> Salir del Modo Repaso';
            btn.classList.add('active');
        }
    },
    
    deactivateReviewMode() {
        this.isReviewMode = false;
        this.reviewModeLevel = null;
        
        // Ocultar todos los selectores
        document.querySelectorAll('.content-selector').forEach(selector => {
            selector.classList.remove('active');
        });
        
        // Restaurar texto de botones
        document.querySelectorAll('.review-mode-btn').forEach(btn => {
            btn.innerHTML = '<i class="fas fa-redo"></i> Activar Modo Repaso';
        });
    },
    
    updateContentSelectors() {
        this.updateChordSelector('major');
        this.updateChordSelector('minor');
        this.updateScaleSelector('major');
        this.updateScaleSelector('minor');
    },
    
    updateChordSelector(type) {
        const chords = type === 'major' ? majorChords : minorChords;
        const heardChords = type === 'major' ? this.heardMajorChords : this.heardMinorChords;
        const selectorId = type === 'major' ? 'majorChordSelector' : 'minorChordSelector';
        const currentIndex = type === 'major' ? this.majorChordIndex : this.minorChordIndex;
        
        const selector = document.getElementById(selectorId);
        if (!selector) return;
        
        selector.innerHTML = chords.map((chord, index) => {
            const isHeard = heardChords[index];
            const isActive = index === currentIndex;
            return `
                <button class="content-selector-btn ${type === 'minor' ? 'minor' : ''} ${isActive ? 'active' : ''}" 
                        data-index="${index}" ${!isHeard ? 'disabled' : ''}>
                    ${chord.shortName}
                </button>
            `;
        }).join('');
        
        // Agregar event listeners
        selector.querySelectorAll('.content-selector-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.disabled) return;
                
                const index = parseInt(btn.getAttribute('data-index'));
                if (type === 'major') {
                    this.majorChordIndex = index;
                    this.updateMajorChordDisplay();
                } else {
                    this.minorChordIndex = index;
                    this.updateMinorChordDisplay();
                }
                
                // Actualizar botones activos
                selector.querySelectorAll('.content-selector-btn').forEach(b => {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
            });
        });
    },
    
    updateScaleSelector(type) {
        const scales = type === 'major' ? majorScales : minorScales;
        const heardScales = type === 'major' ? this.heardMajorScales : this.heardMinorScales;
        const selectorId = type === 'major' ? 'majorScaleSelector' : 'minorScaleSelector';
        const currentIndex = type === 'major' ? this.majorScaleIndex : this.minorScaleIndex;
        
        const selector = document.getElementById(selectorId);
        if (!selector) return;
        
        selector.innerHTML = scales.map((scale, index) => {
            const isHeard = heardScales[index];
            const isActive = index === currentIndex;
            return `
                <button class="content-selector-btn ${type === 'minor' ? 'minor' : ''} ${isActive ? 'active' : ''}" 
                        data-index="${index}" ${!isHeard ? 'disabled' : ''}>
                    ${scale.shortName}
                </button>
            `;
        }).join('');
        
        // Agregar event listeners
        selector.querySelectorAll('.content-selector-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.disabled) return;
                
                const index = parseInt(btn.getAttribute('data-index'));
                if (type === 'major') {
                    this.majorScaleIndex = index;
                    this.updateMajorScaleDisplay();
                } else {
                    this.minorScaleIndex = index;
                    this.updateMinorScaleDisplay();
                }
                
                // Actualizar botones activos
                selector.querySelectorAll('.content-selector-btn').forEach(b => {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
            });
        });
    },
    
    // ========== MÉTODOS PARA ENTRENAMIENTO AUDITIVO CON PUNTOS ==========
    generateRandomEarNote() {
        // Resetear estado
        this.earIsAnswerVerified = false;
        this.selectedEarNote = null;
        
        // Deseleccionar todas las opciones
        document.querySelectorAll('.note-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Limpiar feedback
        const feedbackElement = document.getElementById('feedback');
        if (feedbackElement) {
            feedbackElement.textContent = '';
            feedbackElement.className = 'ear-feedback';
        }
        
        // Limpiar nota del pentagrama
        const noteOnStaff = document.getElementById('staffNote');
        if (noteOnStaff) {
            noteOnStaff.className = 'note-on-staff';
        }
        
        // Generar nueva nota aleatoria
        const randomIndex = Math.floor(Math.random() * earNotes.length);
        this.currentEarNote = earNotes[randomIndex];
        
        // Actualizar UI
        document.getElementById('currentNote').textContent = "¿Qué nota escuchaste?";
        document.getElementById('currentNote').style.color = "white";
    },
    
    checkEarAnswer() {
        if (!this.currentEarNote || !this.selectedEarNote || this.earIsAnswerVerified) {
            return;
        }
        
        this.earIsAnswerVerified = true;
        
        const isCorrect = (this.selectedEarNote === this.currentEarNote.name);
        const feedbackElement = document.getElementById('feedback');
        
        if (isCorrect) {
            // Respuesta correcta
            this.earScore += 10;
            this.earCorrectCount++;
            
            feedbackElement.textContent = `¡Correcto! Era ${this.currentEarNote.displayName} (+10 puntos)`;
            feedbackElement.className = 'ear-feedback correct';
            
            // Mostrar nota en pentagrama con color verde
            this.showEarNoteOnStaff(this.currentEarNote.name, 'correct');
            
            // Añadir puntos al sistema de auth
            if (authSystem) {
                authSystem.addPoints(10, 'Respuesta correcta en entrenamiento auditivo');
            }
            
            // Verificar si completó la misión
            if (this.earScore >= this.earMissionScore && !this.completedEarTraining) {
                this.completeEarTrainingMission();
            }
            
        } else {
            // Respuesta incorrecta
            this.earIncorrectCount++;
            
            feedbackElement.textContent = `Incorrecto. Era ${this.currentEarNote.displayName}`;
            feedbackElement.className = 'ear-feedback incorrect';
            
            // Mostrar nota correcta en pentagrama con color rojo
            this.showEarNoteOnStaff(this.currentEarNote.name, 'incorrect');
        }
        
        // Actualizar estadísticas
        this.updateEarStats();
        
        // Actualizar progreso de misión
        this.updateMissionProgress();
        
        // Guardar progreso
        this.saveProgress();
    },
    
    showEarNoteOnStaff(noteName, status = 'selected') {
        const noteOnStaff = document.getElementById('staffNote');
        const note = earNotes.find(n => n.name === noteName);
        
        if (note && noteOnStaff) {
            noteOnStaff.style.left = `50%`;
            noteOnStaff.style.top = `${note.position}%`;
            noteOnStaff.className = `note-on-staff show ${status}`;
            noteOnStaff.textContent = noteName.replace('4', '').replace('5', '');
        }
    },
    
    updateEarStats() {
        document.getElementById('score').textContent = this.earScore;
        document.getElementById('correctCount').textContent = this.earCorrectCount;
        document.getElementById('incorrectCount').textContent = this.earIncorrectCount;
    },
    
    updateMissionProgress() {
        const progressFill = document.getElementById('missionProgressFill');
        const missionScore = document.getElementById('missionScore');
        const missionText = document.getElementById('missionText');
        
        if (progressFill && missionScore && missionText) {
            const percentage = Math.min(100, (this.earScore / this.earMissionScore) * 100);
            progressFill.style.width = `${percentage}%`;
            
            missionScore.textContent = this.earMissionScore;
            
            if (this.earScore >= this.earMissionScore) {
                missionText.innerHTML = '<span class="mission-completed">¡Misión completada! ¡Eres un oído absoluto!</span>';
            } else {
                const remaining = this.earMissionScore - this.earScore;
                missionText.textContent = `Te faltan ${remaining} puntos para completar la misión`;
            }
        }
    },
    
    // ========== MÉTODOS DE NOTIFICACIÓN DE LOGROS ==========
    hideAchievement() {
        const notification = document.getElementById('achievementNotification');
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        setTimeout(() => {
            notification.classList.remove('hide');
        }, 500);
    },
    
    // Sincronizar progreso con Firebase
    syncProgressWithFirestore: async function(progressData) {
        if (!window.firebaseReady || !authSystem || !authSystem.getCurrentUser()) {
            return;
        }
        
        const user = authSystem.getCurrentUser();
        if (!user || !user.uid) return;
        
        // Actualizar progreso local con datos de Firebase
        if (progressData) {
            this.heardMajorChords = progressData.majorChords?.unlockedChords || this.heardMajorChords;
            this.heardMinorChords = progressData.minorChords?.unlockedChords || this.heardMinorChords;
            this.heardMajorScales = progressData.majorScales?.unlockedScales || this.heardMajorScales;
            this.heardMinorScales = progressData.minorScales?.unlockedScales || this.heardMinorScales;
            
            // Actualizar estado de completado
            this.completedMajorChords = progressData.majorChords?.completed || this.completedMajorChords;
            this.completedMinorChords = progressData.minorChords?.completed || this.completedMinorChords;
            this.completedMajorScales = progressData.majorScales?.completed || this.completedMajorScales;
            this.completedMinorScales = progressData.minorScales?.completed || this.completedMinorScales;
            this.completedEarTraining = progressData.earTraining?.completed || this.completedEarTraining;
            
            // Actualizar entrenamiento auditivo
            this.earScore = progressData.earTraining?.score || this.earScore;
            this.earCorrectCount = progressData.earTraining?.correctCount || this.earCorrectCount;
            this.earIncorrectCount = progressData.earTraining?.incorrectCount || this.earIncorrectCount;
            
            console.log('🔄 Progreso sincronizado desde Firebase');
            this.saveProgress();
            this.updateMenuStatus();
        }
    }
};

// ==============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sistema de autenticación
    authSystem.init();
    
    // Inicializar aplicación de aprendizaje
    AppState.init();
    
    // Hacer AppState global para debugging
    window.AppState = AppState;
    
    console.log('✅ Aplicación de aprendizaje musical inicializada con sistema de puntos');
    
    // Sincronizar puntos cada 30 segundos
    setInterval(() => {
        if (authSystem && authSystem.syncPointsWithFirestore) {
            authSystem.syncPointsWithFirestore();
        }
    }, 30000);
});
