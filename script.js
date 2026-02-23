// 1. Efecto en la barra de navegación al hacer scroll
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


// 2. Menú Móvil
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Agregamos este IF: Solo escucha el clic SI el botón existe en la página
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // Cerrar menú cuando se presiona cualquier link
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// 3. Animaciones al hacer scroll (Intersection Observer)
// Esto detecta cuando un elemento entra en la pantalla para animarlo
const reveals = document.querySelectorAll('.reveal');

const revealOptions = {
    threshold: 0.15, // Se activa cuando el 15% del elemento es visible
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('active');
            // Opcional: deja de observar una vez que ya apareció
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

reveals.forEach(reveal => {
    revealOnScroll.observe(reveal);
});

// 4. Lightbox de la Galería
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const botonesExpandir = document.querySelectorAll('.btn-expandir');
const cerrarLightbox = document.querySelector('.cerrar-lightbox');

botonesExpandir.forEach(boton => {
    boton.addEventListener('click', (e) => {
        // Encontramos la imagen que está dentro del mismo contenedor que el botón
        const contenedorPadre = e.target.closest('.item-galeria');
        const imgSrc = contenedorPadre.querySelector('img').src;
        
        lightboxImg.src = imgSrc;
        lightbox.classList.add('activo');
    });
});

// Cerrar con la X
cerrarLightbox.addEventListener('click', () => {
    lightbox.classList.remove('activo');
});

// Cerrar al hacer clic en el fondo oscuro
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('activo');
    }
});

// Extra: Cerrar con la tecla Escape para mejor accesibilidad
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('activo')) {
        lightbox.classList.remove('activo');
    }
});


// --- 5. BASE DE DATOS LOCAL DE LUGARES ---
const baseDeDatosLugares = {
    'llay-llay': {
        titulo: 'Llay-Llay',
        descripcion: 'Exploración aérea de la comuna de Llay-Llay.',
        videos: ['https://www.youtube.com/embed/toYy-val0vI'],
        imagenes: [
            'imagenes/llay-llay/llay-llay.jpg'
        ]
    },
    'brasil': {
        titulo: 'Brasil',
        descripcion: 'La inmensidad del océano capturada desde el cielo.',
        videos: ['https://www.youtube.com/embed/Bd1VkmQtAyc'],
        imagenes: [
            'imagenes/brasil/brasil.png'
        ]
    },
    'vregion': {
        titulo: 'V Región',
        descripcion: 'Vistas únicas de la costa y el entorno natural de V Región.',
        videos: ['https://www.youtube.com/embed/EZ-rUzmQRA0'],
        imagenes: [
            'imagenes/loncura/loncura.jpg'
        ]
    }
};

// --- 6. LÓGICA PARA CARGAR EL LUGAR ---
// Solo ejecutamos esto si estamos en la página lugar.html (comprobando si existe el titulo-lugar)
const tituloElemento = document.getElementById('titulo-lugar');

if (tituloElemento) {
    // 1. Leer el ID de la URL (ej: "?id=costa")
    const parametrosURL = new URLSearchParams(window.location.search);
    const idLugar = parametrosURL.get('id');

    // 2. Buscar ese ID en nuestra base de datos
    const datosLugar = baseDeDatosLugares[idLugar];

    if (datosLugar) {
        // Pintar Textos
        tituloElemento.innerHTML = datosLugar.titulo;
        document.getElementById('desc-lugar').innerHTML = datosLugar.descripcion;
        document.title = `${datosLugar.titulo} | Aerium`; // Cambia el título de la pestaña

        // Pintar Video
        const contenedorVideo = document.getElementById('video-lugar');
        const videosHTML = datosLugar.videos.map(urlVideo => 
            `<div class="contenedor-video-wrapper">
                <div class="contenedor-video">
                    <iframe src="${urlVideo}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
                </div>
                <a href="https://www.youtube.com/@Aerium-f6n" target="_blank" class="btn-primario" style="display: inline-block; margin-top: 15px;">Ver en YouTube</a>
            </div>`
        ).join('');
        contenedorVideo.innerHTML = videosHTML;

        // Pintar Galería (máximo 3 al lado del video, resto debajo)
        const galeriaLateral = document.getElementById('galeria-lateral');
        const galeriaExtra = document.getElementById('galeria-extra');
        const imagenesLado = datosLugar.imagenes.slice(0, 3);
        const imagenesDebajo = datosLugar.imagenes.slice(3);

        const crearItemGaleria = (urlImagen) => {
            const urlOptimizada = urlImagen.includes('unsplash') ? `${urlImagen}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80` : urlImagen;

            return `
                <div class="item-galeria">
                    <img src="${urlOptimizada}" alt="${datosLugar.titulo}">
                    <button class="btn-expandir" aria-label="Ver en pantalla completa"><i class="fas fa-expand"></i></button>
                </div>
            `;
        };

        galeriaLateral.innerHTML = imagenesLado.map(crearItemGaleria).join('');
        galeriaExtra.innerHTML = imagenesDebajo.map(crearItemGaleria).join('');

        // ¡IMPORTANTE! Como las fotos se acaban de crear dinámicamente, 
        // necesitamos volver a activar los eventos de clic del Lightbox
        activarLightboxDinamico();
    } else {
        // Si alguien escribe una URL inventada (ej: lugar.html?id=marte)
        tituloElemento.innerHTML = 'Destino no encontrado';
        document.getElementById('desc-lugar').innerHTML = 'Por favor, regresa al inicio y selecciona una ubicación válida.';
    }
}

// Envolvemos la lógica del Lightbox en una función para llamarla después de pintar las fotos
function activarLightboxDinamico() {
    const botonesExpandir = document.querySelectorAll('.btn-expandir');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightbox = document.getElementById('lightbox');

    botonesExpandir.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const contenedorPadre = e.target.closest('.item-galeria');
            const imgSrc = contenedorPadre.querySelector('img').src;
            lightboxImg.src = imgSrc;
            lightbox.classList.add('activo');
        });
    });
}