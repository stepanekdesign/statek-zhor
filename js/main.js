document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup infinite marquee
    const marqueeContent = document.getElementById('marquee-content');
    
    if (marqueeContent) {
        // Clone the original images and append them to create a seamless loop
        const images = Array.from(marqueeContent.children);
        
        // Clone the set enough times to ensure it covers the screen width twice
        // 11 images is usually enough, but we clone them once to ensure seamless scrolling
        images.forEach(img => {
            const clone = img.cloneNode(true);
            marqueeContent.appendChild(clone);
        });
    }

    // 2. Fallback smooth scrolling for older browsers (though CSS scroll-behavior: smooth handles modern ones)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Initialize Leaflet Map
    const mapElement = document.getElementById('map');
    if (mapElement) {
        const map = L.map('map');
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        // Define markers
        const brno = L.marker([49.1951, 16.6068]).bindPopup('<b>Brno</b>');
        const urcice = L.marker([49.424, 17.067]).bindPopup('<b>Určice</b>');
        const zhor = L.marker([49.4147, 16.4789]).bindPopup('<b>Zhoř</b><br>Statek Zhoř');

        const group = L.featureGroup([brno, urcice, zhor]).addTo(map);
        map.fitBounds(group.getBounds().pad(0.2));
        zhor.openPopup();
    }

    // 4. Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const marqueeWrapper = document.querySelector('.marquee-wrapper');

    if (lightbox && lightboxImg && marqueeWrapper) {
        // Add pointer cursor to images
        document.querySelectorAll('.marquee-img').forEach(img => {
            img.style.cursor = 'pointer';
        });

        marqueeWrapper.addEventListener('click', (e) => {
            if (e.target.classList.contains('marquee-img')) {
                const src = e.target.getAttribute('src');
                // Switch to high-res image: use data attribute if exists, fallback to @2x
                const customHighRes = e.target.getAttribute('data-lightbox-src');
                const highResSrc = customHighRes || src.replace('.jpg', '@2x.jpg');
                lightboxImg.src = highResSrc;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            // Optional: clear src so it doesn't show old image on next open
            setTimeout(() => { lightboxImg.src = ''; }, 300);
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // 5. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('open');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('#nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('open');
                navMenu.classList.remove('active');
            });
        });
    }
});
