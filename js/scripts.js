function toggleMenu() {
    const menu = document.getElementById("menu");
    const hamburger = document.getElementById("hamburger");
    const closeMenu = document.getElementById("close-menu");
    const html = document.documentElement;
    
    menu.classList.toggle("active");
    hamburger.style.display = menu.classList.contains("active") ? "none" : "block";
    closeMenu.style.display = menu.classList.contains("active") ? "block" : "none";
    html.classList.toggle("no-scroll");
}

function closeMenu() {
    const menu = document.getElementById("menu");
    const hamburger = document.getElementById("hamburger");
    const closeMenu = document.getElementById("close-menu");
    const html = document.documentElement;

    menu.classList.remove("active");
    hamburger.style.display = "block";
    closeMenu.style.display = "none";
    html.classList.remove("no-scroll");
}

function includeHTML() {
    document.querySelectorAll("[data-include]").forEach(async (el) => {
        const file = el.getAttribute("data-include");
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Errore nel caricamento di ${file}`);
            el.innerHTML = await response.text();
        } catch (error) {
            console.error(error);
            el.innerHTML = "<p>Errore nel caricamento del contenuto.</p>";
        }
    });
}


// Google Analytics Measurement ID - SOSTITUISCI CON IL TUO ID
const GA_MEASUREMENT_ID = 'G-XRP1W06CP9';

// Funzione per caricare Google Analytics
function loadGoogleAnalytics() {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = function() {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID);
    };
}

// Funzione per gestire il consenso ai cookie
function handleCookieConsent() {
    localStorage.setItem('cookieconsent', 'true');
    document.querySelector('.cookie-banner').style.display = 'none';
}

// Funzione per creare e mostrare il banner dei cookie
function initCookieBanner() {
    if (!localStorage.getItem('cookieconsent')) {
        const cookieBanner = document.createElement('div');
        cookieBanner.className = 'cookie-banner';
        cookieBanner.innerHTML = `
            <div class="cookie-content">
                <button class="cookie-close" onclick="handleCookieConsent()" aria-label="Chiudi banner cookie">×</button>
                <div class="cookie-text">
                    <p>Questo sito fa uso di cookie per migliorare l'esperienza di navigazione degli utenti e per raccogliere informazioni sull'utilizzo del sito. Usando il sito accetti questo utilizzo. <a href="/privacy.html">Consulta l'Informativa sui cookie</a>.</p>
                </div>
            </div>
        `;
        document.body.appendChild(cookieBanner);
        cookieBanner.style.display = 'block';
    }
    // Carica sempre Google Analytics
    loadGoogleAnalytics();
}


// Inizializza il caricamento del menu e del banner dei cookie
document.addEventListener("DOMContentLoaded", () => {
    includeHTML();
    initCookieBanner();
});