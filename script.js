document.addEventListener('DOMContentLoaded', () => {
    // Referencias de contenedores principales
    const loaderWrapper = document.getElementById('loader-wrapper');
    const lockScreen = document.getElementById('lock-screen');
    const envelopeScreen = document.getElementById('envelope-screen');
    const explosionContainer = document.getElementById('explosion-container');
    const unlockedSection = document.getElementById('unlocked-section');
    
    // Configuración clave de acceso
    const CORRECT_CODE = "0328";
    let currentInput = "";
    
    // 1. CARGADOR INICIAL (FLORES GIRATORIAS)
    const ARTIFICIAL_DELAY = 1200; // 1.2s para apreciar el cargador floral
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loaderWrapper.classList.add('fade-out');
            lockScreen.classList.remove('hidden');
            void lockScreen.offsetWidth; // Refuerza reflow
            lockScreen.classList.add('visible');
            
            loaderWrapper.addEventListener('transitionend', () => {
                loaderWrapper.style.display = 'none';
            }, { once: true });
        }, ARTIFICIAL_DELAY);
    });

    // 2. TECLADO NUMÉRICO INTERACTIVO
    const keys = document.querySelectorAll('.key-btn');
    const dots = document.querySelectorAll('.passcode-dot');
    const dotsWrapper = document.querySelector('.passcode-dots-wrapper');
    
    keys.forEach(key => {
        key.addEventListener('click', () => {
            const val = key.getAttribute('data-value');
            if (val === 'delete') {
                handleDelete();
            } else if (val !== null) {
                handleNumberInput(val);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (!lockScreen.classList.contains('hidden') && lockScreen.classList.contains('visible')) {
            if (e.key >= '0' && e.key <= '9') {
                handleNumberInput(e.key);
            } else if (e.key === 'Backspace') {
                handleDelete();
            }
        }
    });

    function handleNumberInput(number) {
        if (currentInput.length < 4) {
            currentInput += number;
            updateDots();
            if ('vibrate' in navigator) {
                navigator.vibrate(20);
            }
            if (currentInput.length === 4) {
                setTimeout(verifyPasscode, 250);
            }
        }
    }

    function handleDelete() {
        if (currentInput.length > 0) {
            currentInput = currentInput.slice(0, -1);
            updateDots();
        }
    }

    function updateDots() {
        dots.forEach((dot, index) => {
            if (index < currentInput.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    function verifyPasscode() {
        if (currentInput === CORRECT_CODE) {
            unlockToEnvelope();
        } else {
            handleIncorrectCode();
        }
    }

    function handleIncorrectCode() {
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
        }
        dotsWrapper.classList.add('shake');
        dots.forEach(dot => dot.style.borderColor = '#d87f90');

        setTimeout(() => {
            dotsWrapper.classList.remove('shake');
            currentInput = "";
            updateDots();
            dots.forEach(dot => dot.style.borderColor = '');
        }, 500);
    }

    // Transición suave: Pantalla de bloqueo -> Pantalla intermedia de la carta
    function unlockToEnvelope() {
        if ('vibrate' in navigator) {
            navigator.vibrate(60);
        }
        
        // Desvanecer teclado
        lockScreen.classList.remove('visible');
        
        setTimeout(() => {
            lockScreen.classList.add('hidden');
            
            // Revelar pantalla intermedia de la carta
            envelopeScreen.classList.remove('hidden');
            void envelopeScreen.offsetWidth;
            envelopeScreen.classList.add('visible');
        }, 800);
    }

    // 3. PANTALLA INTERMEDIA DE LA CARTA Y TRANSICIÓN DE EXPLOSIÓN EN 3 CLICS
    const envelopeTrigger = document.getElementById('envelope-trigger');
    const envelopeText = document.getElementById('envelope-text');
    
    // Arreglo de fotos de pareja en assets/photos/
    const photoAssets = [
        'assets/photos/media__1779934938353.png',
        'assets/photos/media__1779934944120.png',
        'assets/photos/media__1779934950517.jpg',
        'assets/photos/media__1779934954881.png',
        'assets/photos/media__1779934958395.jpg',
        'assets/photos/media__1779934974687.png',
        'assets/photos/media__1779934977730.png',
        'assets/photos/media__1779934982283.png',
        'assets/photos/media__1779934985988.jpg',
        'assets/photos/media__1779934990561.png',
        'assets/photos/media__1779935005306.jpg',
        'assets/photos/media__1779935008764.png',
        'assets/photos/media__1779935011087.jpg',
        'assets/photos/media__1779935013811.jpg',
        'assets/photos/media__1779935016608.png',
        'assets/photos/media__1779935024972.jpg',
        'assets/photos/media__1779935027206.jpg',
        'assets/photos/media__1779935032240.png',
        'assets/photos/media__1779935091008.png',
        'assets/photos/media__1779935093563.png',
        'assets/photos/media__1779935096408.jpg',
        'assets/photos/media__1779935098414.png',
        'assets/photos/media__1779935100756.png',
        'assets/photos/media__1779935105077.jpg',
        'assets/photos/media__1779935107895.jpg',
        'assets/photos/media__1779935110038.jpg',
        'assets/photos/media__1779935112394.jpg',
        'assets/photos/media__1779935114659.jpg',
        'assets/photos/media__1779935118942.jpg',
        'assets/photos/media__1779935124357.png',
        'assets/photos/media__1779935126989.png',
        'assets/photos/media__1779935139107.jpg',
        'assets/photos/media__1779935150440.jpg'
    ];

    // Precargar fotos de pareja al cargar script.js para evitar retardos
    function preloadPhotos() {
        photoAssets.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    preloadPhotos();

    let pressCount = 0;
    let isTransitioning = false;

    envelopeTrigger.addEventListener('click', () => {
        if (isTransitioning) return;
        
        pressCount++;
        
        if (pressCount === 1) {
            // Primer Clic: Sacudida leve y escala
            if ('vibrate' in navigator) {
                navigator.vibrate(40);
            }
            envelopeTrigger.classList.add('press-1');
            envelopeText.classList.add('shaking');
            envelopeText.textContent = "¡Está queriendo abrirse!... 🤫";
            
            spawnParticles(8, 1);
            
        } else if (pressCount === 2) {
            // Segundo Clic: Sacudida intensa y brillo pulsante
            if ('vibrate' in navigator) {
                navigator.vibrate([60, 40, 60]);
            }
            envelopeTrigger.classList.remove('press-1');
            envelopeTrigger.classList.add('press-2');
            
            envelopeText.classList.remove('shaking');
            envelopeText.classList.add('glow');
            envelopeText.textContent = "¡Cuidado, va a explotar! 💖✨";
            
            spawnParticles(20, 1.8);
            
        } else if (pressCount === 3) {
            // Tercer Clic: ¡EXPLOSIÓN!
            isTransitioning = true;
            
            if ('vibrate' in navigator) {
                navigator.vibrate([100, 50, 100, 50, 300]);
            }
            
            envelopeTrigger.classList.remove('press-2');
            envelopeTrigger.classList.add('preparing-explosion');
            envelopeText.style.opacity = '0';
            envelopeText.style.transform = 'scale(0.8)';
            
            // Lanza un súper spray continuo de pétalos/corazones justo antes de estallar
            let preExplosionInterval = setInterval(() => {
                spawnParticles(6, 2);
            }, 80);
            
            setTimeout(() => {
                clearInterval(preExplosionInterval);
                triggerPhotoExplosion();
            }, 450); // Vibración máxima durante 450ms antes del estallido
        }
    });

    function spawnParticles(count, intensityFactor = 1) {
        const wrapper = document.querySelector('.envelope-wrapper');
        const colors = ['#EBAAB3', '#CBB6D9', '#D87F90', '#FADCE0', '#B54251'];
        const shapes = ['heart', 'petal'];

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('explosion-particle');
            
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 15 + 10; // 10px a 25px
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.color = color;
            
            if (shape === 'heart') {
                particle.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor" style="width:100%;height:100%;">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                `;
            } else {
                particle.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor" style="width:100%;height:100%;">
                        <path d="M12 2C10.5 4 8.5 7 8.5 10.5C8.5 15 12 17.5 12 17.5C12 17.5 15.5 15 15.5 10.5C15.5 7 13.5 4 12 2Z" />
                    </svg>
                `;
            }

            // Punto de origen central relativo al sobre
            particle.style.left = '50%';
            particle.style.top = '40%';
            particle.style.transform = 'translate(-50%, -50%)';

            // Dirección y distancia aleatoria
            const angle = Math.random() * Math.PI * 2;
            const distance = (Math.random() * 80 + 40) * intensityFactor;
            
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance - (Math.random() * 50); // Ligero impulso hacia arriba
            
            const rot = Math.random() * 360 - 180;
            const scale = Math.random() * 0.6 + 0.4;
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.setProperty('--rot', `${rot}deg`);
            particle.style.setProperty('--scale', scale);
            
            particle.style.animation = `particleBurst ${Math.random() * 0.6 + 0.6}s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`;
            
            particle.addEventListener('animationend', () => {
                particle.remove();
            });
        }
    }

    function triggerPhotoExplosion() {
        // Desaparecer sobre con animación de colapso y ocultar el sobre inmediatamente
        envelopeTrigger.classList.remove('preparing-explosion');
        envelopeTrigger.classList.add('exploded');
        
        // Ocultar la pantalla intermedia del sobre de forma inmediata para que no siga saliendo
        envelopeScreen.classList.remove('visible');
        envelopeScreen.classList.add('hidden');
        
        // Revelar contenedor de la explosión y activar destello de choque
        explosionContainer.classList.remove('hidden');
        void explosionContainer.offsetWidth;
        explosionContainer.classList.add('visible');
        
        const flash = explosionContainer.querySelector('.explosion-flash');
        flash.classList.add('active');
        
        // Total de Polaroids a disparar para una inundación 100% densa de pantalla - 320 fotos
        const totalPhotosToSpawn = 320;
        
        // Repetir y mezclar fotos para cantidad
        let explosionPhotos = [];
        for (let i = 0; i < totalPhotosToSpawn; i++) {
            const randomSrc = photoAssets[i % photoAssets.length];
            explosionPhotos.push(randomSrc);
        }
        
        // Algoritmo Fisher-Yates para mezclar el orden de las fotos
        for (let i = explosionPhotos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [explosionPhotos[i], explosionPhotos[j]] = [explosionPhotos[j], explosionPhotos[i]];
        }
        
        // Secuencia continua (Fountain/Pileta):
        // Disparamos las 320 Polaroids repartidas de forma continua a lo largo de 2.0 segundos!
        explosionPhotos.forEach((src, index) => {
            const delay = Math.random() * 2000; // Erupción continua sobre 2 segundos
            
            setTimeout(() => {
                createPolaroidCard(src, index, totalPhotosToSpawn);
            }, delay);
        });

        // Spawn en masa continuo de pétalos y corazones rápidos de adorno
        for (let i = 0; i < 90; i++) {
            const delay = Math.random() * 1800;
            setTimeout(() => {
                spawnExplosionDecoParticle();
            }, delay);
        }
        
        // Transición final: foto por foto cayendo de forma staggered suave (efecto gota de agua)
        // A los 4.2 segundos (cuando el collage inunda toda la pantalla)
        setTimeout(() => {
            // Revelar sección desbloqueada final por detrás (gracias al fondo transparente del explosionContainer)
            unlockedSection.classList.remove('hidden');
            void unlockedSection.offsetWidth;
            unlockedSection.classList.add('visible');
            
            // Obtener todas las fotos Polaroids acumuladas en pantalla
            const cards = explosionContainer.querySelectorAll('.polaroid-card');
            
            // Animamos cada carta de forma independiente con delay staggered (efecto gota resbaladiza)
            cards.forEach((card) => {
                // Delay aleatorio amplio para caída espaciada (0 a 1200ms) como gotas individuales
                const slideDelay = Math.random() * 1200;
                
                setTimeout(() => {
                    const tx = card.style.getPropertyValue('--tx');
                    const ty = card.style.getPropertyValue('--ty');
                    const rot = card.style.getPropertyValue('--rot');
                    
                    // IMPORTANTE: Para que la transición de JS funcione, debemos desactivar la animación CSS activa
                    // fijando la posición estática actual para evitar parpadeos visuales (reflow)
                    card.style.transform = `translate(calc(${tx}), calc(${ty})) rotate(${rot}) scale(1)`;
                    card.style.animation = 'none';
                    void card.offsetWidth; // Forzar reflow para registrar posición base
                    
                    // Aplicar la transición de gota de agua: inicio lento y aceleración hacia abajo (ease-in)
                    card.style.transition = 'transform 2.4s cubic-bezier(0.5, 0, 0.7, 0.45), opacity 1.8s ease-in-out';
                    card.style.transform = `translate(calc(${tx}), 110vh) rotate(calc(${rot} + ${Math.random() * 30 - 15}deg)) scale(0.95)`;
                    card.style.opacity = '0';
                }, slideDelay);
            });
            
            // Ocultar y limpiar todo después de que hayan caído completamente todas las fotos (1.2s delay + 2.4s transición)
            setTimeout(() => {
                explosionContainer.classList.remove('visible');
                explosionContainer.classList.add('hidden');
                explosionContainer.innerHTML = '<div class="explosion-flash"></div>';
            }, 3600);
            
        }, 4200); 
    }

    function createPolaroidCard(src, index, total) {
        const card = document.createElement('div');
        card.classList.add('polaroid-card');
        
        const img = document.createElement('img');
        img.src = src;
        img.alt = "Nuestra foto";
        card.appendChild(img);
        
        // --- Algoritmo de Cobertura Completa en Viewport Units (Cero Espacios Vacíos) ---
        // Distribuimos los objetivos en 6 zonas principales para garantizar inundación completa.
        // Agregamos una zona especial para el Top-Center para rellenar huecos superiores.
        const zone = index % 6;
        let tx, ty;
        
        if (zone === 0) {
            // Arriba Izquierda: tx de -56vw a 0vw, ty de -56vh a 0vh
            tx = -(Math.random() * 56);
            ty = -(Math.random() * 56);
        } else if (zone === 1) {
            // Arriba Derecha: tx de 0vw a 56vw, ty de -56vh a 0vh
            tx = (Math.random() * 56);
            ty = -(Math.random() * 56);
        } else if (zone === 2) {
            // Abajo Izquierda: tx de -56vw a 0vw, ty de 0vh a 56vh
            tx = -(Math.random() * 56);
            ty = (Math.random() * 56);
        } else if (zone === 3) {
            // Abajo Derecha: tx de 0vw a 56vw, ty de 0vh a 56vh
            tx = (Math.random() * 56);
            ty = (Math.random() * 56);
        } else if (zone === 4) {
            // Zona Especial: Arriba-Centro (Relleno del hueco superior reportado)
            tx = (Math.random() * 30 - 15); // -15vw a 15vw
            ty = -(Math.random() * 46 + 10); // -56vh a -10vh
        } else {
            // Dispersión general y relleno central
            tx = (Math.random() * 90 - 45); // -45vw a 45vw
            ty = (Math.random() * 90 - 45); // -45vh a 45vh
        }
        
        // Inclinación/Rotación estética
        const rot = (Math.random() * 80 - 40); // -40deg a +40deg
        
        // Tamaño responsivo y variado aumentado para dar volumen 3D y rellenar todo hueco
        const w = window.innerWidth;
        const h = window.innerHeight;
        const sizeBase = Math.min(w, h) * (Math.random() * 0.08 + 0.17); // 17% a 25% de la dimensión mínima
        const cardWidth = Math.max(115, Math.min(cardWidthMax(w), sizeBase)); 
        
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardWidth * 1.22}px`;
        
        // Asignamos las variables de CSS con sus unidades responsivas directamente!
        card.style.setProperty('--tx', `${tx}vw`);
        card.style.setProperty('--ty', `${ty}vh`);
        card.style.setProperty('--rot', `${rot}deg`);
        
        card.style.left = '50%';
        card.style.top = '50%';
        card.style.transform = 'translate(-50%, -50%) scale(0)';
        
        // Animación progresiva
        const duration = Math.random() * 0.6 + 1.4; // Vuelo de 1.4s a 2.0s
        card.style.animation = `photoBurst ${duration}s cubic-bezier(0.1, 0.8, 0.22, 1) forwards`;
        
        explosionContainer.appendChild(card);
    }
    
    function cardWidthMax(w) {
        if (w < 480) return 145;
        if (w < 900) return 175;
        return 210;
    }

    function spawnExplosionDecoParticle() {
        const particle = document.createElement('div');
        particle.classList.add('explosion-particle');
        
        const shapes = ['heart', 'petal'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const colors = ['#EBAAB3', '#CBB6D9', '#D87F90', '#FADCE0', '#FAF2F2', '#B54251'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 18 + 12;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.color = color;
        
        if (shape === 'heart') {
            particle.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:100%;height:100%;">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            `;
        } else {
            particle.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:100%;height:100%;">
                    <path d="M12 2C10.5 4 8.5 7 8.5 10.5C8.5 15 12 17.5 12 17.5C12 17.5 15.5 15 15.5 10.5C15.5 7 13.5 4 12 2Z" />
                </svg>
            `;
        }
        
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.transform = 'translate(-50%, -50%)';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.max(window.innerWidth, window.innerHeight) * (Math.random() * 0.55 + 0.45);
        
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - (Math.random() * 120);
        
        const rot = Math.random() * 720 - 360;
        const scale = Math.random() * 0.8 + 0.4;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.setProperty('--rot', `${rot}deg`);
        particle.style.setProperty('--scale', scale);
        
        const duration = Math.random() * 0.7 + 1.1;
        particle.style.animation = `particleBurst ${duration}s cubic-bezier(0.1, 0.8, 0.25, 1) forwards`;
        
        explosionContainer.appendChild(particle);
        
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }

    // --- DETECCIÓN DE VIDEO Y RASPABLES ---
    
    // Configuración del video para GitHub Pages (Soporte local MP4 + Youtube fallback)
    function setupVideoPlayer() {
        const localVideo = document.getElementById('local-video');
        const youtubeIframe = document.getElementById('youtube-iframe');
        
        if (!localVideo || !youtubeIframe) return;

        // Intentar detectar si existe "assets/video.mp4" localmente
        fetch('assets/video.mp4', { method: 'HEAD' })
            .then(res => {
                if (res.ok) {
                    // Si existe el archivo mp4, activar reproductor local y eliminar iframe
                    localVideo.classList.remove('hidden');
                    youtubeIframe.style.display = 'none';
                    youtubeIframe.remove();
                } else {
                    // Si no existe, eliminar el reproductor local y dejar el iframe
                    localVideo.remove();
                }
            })
            .catch(() => {
                // En caso de error, usar YouTube por defecto
                localVideo.remove();
            });
    }
    
    // Inicialización de tarjetas raspables interactivos ("Scratch Card")
    function setupScratchCards() {
        const collageImages = document.querySelectorAll('.collage-polaroid img');
        
        // Elegir 4 fotos aleatorias sin repetición del pool de photoAssets
        const shuffledAssets = [...photoAssets].sort(() => 0.5 - Math.random());
        
        collageImages.forEach((img, index) => {
            if (shuffledAssets[index]) {
                img.src = shuffledAssets[index];
            }
        });

        const canvases = document.querySelectorAll('.scratch-canvas');
        canvases.forEach(canvas => {
            initScratchCard(canvas);
        });
    }

    function initScratchCard(canvas) {
        const parent = canvas.parentElement;
        const img = parent.querySelector('img');
        
        const setupCanvas = () => {
            // Sincronizar el tamaño interno del canvas con el tamaño real de la Polaroid
            const rect = img.getBoundingClientRect();
            canvas.width = rect.width || 195;
            canvas.height = rect.height || 180;
            
            const ctx = canvas.getContext('2d');
            
            // Capa rosa/crema con degradado acuarela elegante
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#fadcce'); // Crema/rosa suave
            gradient.addColorStop(0.5, '#fadce0'); // Rosa pastel claro
            gradient.addColorStop(1, '#ebaab3'); // Rosa tulipán
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Añadir micro destellos / textura brillante blanca
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            for (let i = 0; i < 35; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1.5 + 1, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Letras "Scratch me" en cursiva elegante (Color dusty rose original)
            ctx.fillStyle = '#6b4e56'; 
            ctx.font = 'italic 600 1.15rem "Playfair Display", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Scratch me 💖', canvas.width / 2, canvas.height / 2);
            
            // Marco interno delicado
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
        };
        
        // Ejecutar setup una vez cargada la imagen de fondo para leer sus proporciones
        if (img.complete) {
            setupCanvas();
        } else {
            img.addEventListener('load', setupCanvas);
        }
        
        // Redimensionar el canvas en caso de cambio de pantalla
        window.addEventListener('resize', () => {
            // Solo si el canvas sigue existiendo en el DOM
            if (canvas.parentNode) {
                setupCanvas();
            }
        });
        
        let isDrawing = false;
        const ctx = canvas.getContext('2d');
        
        function drawScratch(clientX, clientY) {
            const rect = canvas.getBoundingClientRect();
            // Mapear coordenadas de pantalla a la resolución interna del canvas
            const x = (clientX - rect.left) * (canvas.width / rect.width);
            const y = (clientY - rect.top) * (canvas.height / rect.height);
            
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 22, 0, Math.PI * 2); // Brocha de raspado (radio 22px)
            ctx.fill();
            
            checkScratchPercent();
        }
        
        // Porcentaje raspado para auto-revelar
        let isRevealed = false;
        function checkScratchPercent() {
            if (isRevealed) return;
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            const totalPixels = pixels.length / 4;
            let cleared = 0;
            
            // Muestear 1 de cada 16 píxeles para optimizar el rendimiento de la CPU
            for (let i = 0; i < pixels.length; i += 64) {
                if (pixels[i + 3] === 0) {
                    cleared++;
                }
            }
            
            const percent = (cleared / (totalPixels / 16)) * 100;
            if (percent > 65) { // Si se raspó el 65% se revela completo
                isRevealed = true;
                canvas.style.opacity = '0';
                setTimeout(() => {
                    canvas.remove();
                }, 500);
            }
        }
        
        // Eventos Mouse (PC)
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            drawScratch(e.clientX, e.clientY);
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            e.preventDefault();
            drawScratch(e.clientX, e.clientY);
        });
        
        window.addEventListener('mouseup', () => {
            isDrawing = false;
        });
        
        // Eventos Touch (Móviles)
        canvas.addEventListener('touchstart', (e) => {
            isDrawing = true;
            if (e.touches[0]) {
                drawScratch(e.touches[0].clientX, e.touches[0].clientY);
            }
        });
        
        canvas.addEventListener('touchmove', (e) => {
            if (!isDrawing) return;
            e.preventDefault(); // Previene scroll del navegador mientras raspas
            if (e.touches[0]) {
                drawScratch(e.touches[0].clientX, e.touches[0].clientY);
            }
        });
        
        canvas.addEventListener('touchend', () => {
            isDrawing = false;
        });
    }

    // Inicializar funciones al cargar la página
    setupVideoPlayer();
    setupScratchCards();
});
