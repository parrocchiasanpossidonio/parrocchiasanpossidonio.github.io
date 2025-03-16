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

document.addEventListener("DOMContentLoaded", includeHTML);