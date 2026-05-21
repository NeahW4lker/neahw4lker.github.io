// --- 1. RESEAU DE PARTICULES INTERACTIF (CANVAS) ---
const canvas = document.getElementById('cyber-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const numberOfParticles = 60;

// Ajustement de la taille du canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Objet particule
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebond sur les bords
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    draw() {
        ctx.fillStyle = '#34495E'; // Wet Asphalt pour les nœuds
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialisation
function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Tracé des connexions réseaux (Lignes 2D)
function connectParticles() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                opacityValue = 1 - (distance / 150);
                ctx.strokeStyle = `rgba(44, 62, 80, ${opacityValue * 0.15})`; // Liens légers entre nœuds
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Boucle d'animation principale
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
}

initParticles();
animate();


// --- 2. ANIMATION SCROLL REVEAL (INTERSECTION OBSERVER) ---
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Évite de re-déclencher l'animation
        }
    });
}, {
    threshold: 0.15 // Se déclenche quand 15% de l'élément est visible
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});
// --- 3. EFFET DE LUEUR INTERACTIVE SUR LES CARTES (GLOW EFFECT) ---
const cards = document.querySelectorAll('.about-card');

cards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        // Calcul de la position de la souris relative à la carte
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Injection des coordonnées dans les variables CSS de la carte
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});
// --- 4. BARRE DE PROGRESSION DE LA TIMELINE AU SCROLL ---
const timelineWrapper = document.querySelector('.timeline-wrapper');
const progressFill = document.getElementById('experience-progress');

window.addEventListener('scroll', () => {
    if (!timelineWrapper) return;

    const wrapperRect = timelineWrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Début du calcul dès que le haut de la timeline entre dans l'écran
    const startTrigger = windowHeight * 0.7; 
    const totalHeight = wrapperRect.height;

    // Distance parcourue à l'intérieur du wrapper
    let currentProgress = startTrigger - wrapperRect.top;

    // Sécurité pour rester entre 0% et 100%
    if (currentProgress < 0) currentProgress = 0;
    let percentage = (currentProgress / totalHeight) * 100;
    if (percentage > 100) percentage = 100;

    // Mise à jour de la hauteur de la ligne CSS
    progressFill.style.height = `${percentage}%`;
});

// --- 5. ANIMATION DE CURSEUR PERSONNALISÉ ---
const cursorDot = document.querySelector('.custom-cursor-dot');
const cursorOutline = document.querySelector('.custom-cursor');

// Ne s'active que si les éléments existent (sécurité responsive)
if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Déplacement instantané du point central
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Déplacement fluide de l'anneau extérieur
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    });

    // Détection de tous les éléments interactifs du site
    const interactiveElements = document.querySelectorAll('a, button, .about-card, .cyber-project-card, .cert-badge-card');

    interactiveElements.forEach(el => {
        // Quand la souris entre sur l'élément : on ajoute la classe d'agrandissement
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-hover');
            cursorOutline.classList.add('cursor-hover');
        });

        // Quand la souris sort de l'élément : on retire la classe
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-hover');
            cursorOutline.classList.remove('cursor-hover');
        });
    });
}
// ==========================================================================
// SYSTEME DE TRADUCTION SANS ERREUR CORS (DONNÉES INTÉGRÉES)
// ==========================================================================


// Fonction globale pour changer la langue dynamiquement
function switchLanguage(lang) {
    // i18nTranslations est automatiquement accessible car chargé depuis translations.js
    if (!i18nTranslations || !i18nTranslations[lang]) return;

    // Traduit chaque balise dotée de l'attribut data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (i18nTranslations[lang][key]) {
            element.innerHTML = i18nTranslations[lang][key];
        }
    });

    // Gestion visuelle de la classe active sur les boutons FR, EN, DE
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.lang-btn[onclick="switchLanguage('${lang}')"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Mémorise le choix de langue
    localStorage.setItem('portfolio_lang', lang);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('portfolio_lang') || 'fr';
    switchLanguage(savedLang);
});

// --- Reste de ton code (Animation du curseur personnalisé, particules, etc.) ---
