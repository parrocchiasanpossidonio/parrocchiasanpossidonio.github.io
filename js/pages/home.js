document.addEventListener('DOMContentLoaded', function() {
    // Global variables to track current page
    let currentAvvisiPage = 0;
    let currentEventiPage = 0;
    
    // Items per page
    const avvisiPerPage = 3;
    const eventiPerPage = 4;
    
    // Total pages (will be calculated after data is loaded)
    let totalAvvisiPages = 0;
    let totalEventiPages = 0;
    
    // Data containers
    let avvisiData = [];
    let eventiData = [];
    
    // Create an Intersection Observer to load images lazily
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                    // Add a fade-in effect once loaded
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                }
                // Stop observing once the image is loaded
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px', // Load images when they're 50px from entering the viewport
        threshold: 0.1
    });
    
    // Load data from JSON file
    fetch(`/db/db.json?t=${Date.now()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Store data globally
            avvisiData = data.avvisi || [];
            eventiData = data.eventi || [];
            
            // Calculate total pages
            totalAvvisiPages = Math.ceil(avvisiData.length / avvisiPerPage);
            totalEventiPages = Math.ceil(eventiData.length / eventiPerPage);
            
            // Initialize displays
            displayAvvisi(currentAvvisiPage);
            displayEventi(currentEventiPage);
            
            // Update arrow states
            updateAvvisiArrows();
            updateEventiArrows();
        })
        .catch(error => {
            console.error('Error loading data:', error);
        });
    
    // Display avvisi for the given page
    function displayAvvisi(page) {
        const avvisiContainer = document.querySelector('.avvisi-display');
        avvisiContainer.innerHTML = ''; // Clear existing content
        
        const startIndex = page * avvisiPerPage;
        const endIndex = Math.min(startIndex + avvisiPerPage, avvisiData.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const avviso = avvisiData[i];
            const avvisoElement = document.createElement('div');
            avvisoElement.className = 'avvisi-item';
            
            avvisoElement.innerHTML = `
                <a href="/avvisi/${avviso.file}" class="btn text-m1" target="_blank">${avviso.titolo}</a>
            `;
            
            avvisiContainer.appendChild(avvisoElement);
        }
    }
    
    // Display eventi for the given page with lazy loading
    function displayEventi(page) {
        const eventiContainer = document.querySelector('.eventi-grid');
        eventiContainer.innerHTML = ''; // Clear existing content
        
        const startIndex = page * eventiPerPage;
        const endIndex = Math.min(startIndex + eventiPerPage, eventiData.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const evento = eventiData[i];
            const eventoElement = document.createElement('div');
            eventoElement.className = 'eventi-item';
            
            // Verifica se esiste una pagina dedicata all'evento
            const hasPage = evento.pagina && evento.pagina.trim() !== '';
            
            // Crea HTML in base alla presenza o meno della pagina
            if (hasPage) {
                // Se c'è una pagina dedicata, mantieni il comportamento attuale
                eventoElement.innerHTML = `
                    <a href="/eventi/${evento.pagina}">
                        <div class="eventi-immagine">
                            <div class="eventi-image-placeholder">
                                <span class="loading-text">Caricamento...</span>
                            </div>
                            <img data-src="/eventi/images/${evento.immagine}" 
                                 alt="${evento.titolo}" 
                                 class="eventi-immagine-img">
                        </div>
                        <div class="eventi-titolo">
                            <h3 class="eventi-titolo-testo text-m1">${evento.titolo}</h3>
                        </div>
                    </a>
                `;
            } else {
                // Se non c'è una pagina dedicata, crea un elemento che aprirà l'immagine in una nuova scheda
                eventoElement.innerHTML = `
                    <a href="/eventi/images/${evento.immagine}" target="_blank">
                        <div class="eventi-immagine">
                            <div class="eventi-image-placeholder">
                                <span class="loading-text">Caricamento...</span>
                            </div>
                            <img data-src="/eventi/images/${evento.immagine}" 
                                 alt="${evento.titolo}" 
                                 class="eventi-immagine-img">
                        </div>
                        <div class="eventi-titolo">
                            <h3 class="eventi-titolo-testo text-m1">${evento.titolo}</h3>
                        </div>
                    </a>
                `;
            }
            
            eventiContainer.appendChild(eventoElement);
            
            // Observe the image for lazy loading
            const imgElement = eventoElement.querySelector('img');
            imageObserver.observe(imgElement);
        }
    }
    
    // Update avvisi arrows state
    function updateAvvisiArrows() {
        const prevBtn = document.querySelector('.avvisi-prev');
        const nextBtn = document.querySelector('.avvisi-next');
        
        // Disable prev button if on first page
        if (currentAvvisiPage === 0) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }
        
        // Disable next button if on last page
        if (currentAvvisiPage >= totalAvvisiPages - 1) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }
    
    // Update eventi arrows state
    function updateEventiArrows() {
        const prevBtn = document.querySelector('.eventi-prev');
        const nextBtn = document.querySelector('.eventi-next');
        
        // Disable prev button if on first page
        if (currentEventiPage === 0) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }
        
        // Disable next button if on last page
        if (currentEventiPage >= totalEventiPages - 1) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }
    
    // Event listeners for avvisi navigation
    document.querySelector('.avvisi-prev').addEventListener('click', function() {
        if (currentAvvisiPage > 0) {
            currentAvvisiPage--;
            displayAvvisi(currentAvvisiPage);
            updateAvvisiArrows();
        }
    });
    
    document.querySelector('.avvisi-next').addEventListener('click', function() {
        if (currentAvvisiPage < totalAvvisiPages - 1) {
            currentAvvisiPage++;
            displayAvvisi(currentAvvisiPage);
            updateAvvisiArrows();
        }
    });
    
    // Event listeners for eventi navigation
    document.querySelector('.eventi-prev').addEventListener('click', function() {
        if (currentEventiPage > 0) {
            currentEventiPage--;
            displayEventi(currentEventiPage);
            updateEventiArrows();
        }
    });
    
    document.querySelector('.eventi-next').addEventListener('click', function() {
        if (currentEventiPage < totalEventiPages - 1) {
            currentEventiPage++;
            displayEventi(currentEventiPage);
            updateEventiArrows();
        }
    });
});
