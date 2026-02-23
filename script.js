/* ======================================================
   AERIUM LANDING - JS PURO MODULAR
   Secciones: navegación, reveal, portafolio, testimonios,
   FAQ, formulario, utilidades y compatibilidad lugar.html
====================================================== */

(function () {
    'use strict';

    /* =========================
       Utilidades base
    ========================= */
    const qs = (selector, context = document) => context.querySelector(selector);
    const qsa = (selector, context = document) => [...context.querySelectorAll(selector)];

    const on = (element, event, handler) => {
        if (element) {
            element.addEventListener(event, handler);
        }
    };

    /* =========================
       1) Navbar + menú mobile + scroll suave
    ========================= */
    function initNavbar() {
        const navbar = qs('#navbar');
        const menuToggle = qs('#menu-toggle');
        const navLinks = qs('#nav-links');
        const links = qsa('.nav-links a');

        const setScrolledState = () => {
            if (!navbar) return;
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        };

        setScrolledState();
        on(window, 'scroll', setScrolledState);

        on(menuToggle, 'click', () => {
            const isOpen = navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        links.forEach((link) => {
            on(link, 'click', (event) => {
                const targetId = link.getAttribute('href');
                if (!targetId || !targetId.startsWith('#')) return;

                const targetElement = qs(targetId);
                if (!targetElement) return;

                event.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

                if (navLinks && menuToggle && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    /* =========================
       2) Scroll reveal con IntersectionObserver
    ========================= */
    function initReveal() {
        const items = qsa('.reveal');
        if (!items.length) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        items.forEach((item) => observer.observe(item));
    }

    /* =========================
       3) Portafolio: filtros + modal imagen/video
    ========================= */
    function initPortfolio() {
        const filterButtons = qsa('.filtro-btn');
        const portfolioItems = qsa('.item-portafolio');
        const modal = qs('#portfolio-modal');
        const closeModalButton = qs('#cerrar-modal');
        const modalContent = qs('#modal-contenido');
        const maxItemsInAll = 8;
        const isHomePortfolio = Boolean(qs('#portafolio'));

        if (!portfolioItems.length) return;

        const applyFilter = (category) => {
            portfolioItems.forEach((item) => {
                const itemCategory = item.dataset.category;
                const show = category === 'all' || category === itemCategory;
                item.classList.toggle('hidden', !show);
            });

            if (category === 'all' && isHomePortfolio) {
                let visibleCount = 0;
                portfolioItems.forEach((item) => {
                    if (item.classList.contains('hidden')) return;
                    visibleCount += 1;
                    if (visibleCount > maxItemsInAll) {
                        item.classList.add('hidden');
                    }
                });
            }
        };

        filterButtons.forEach((button) => {
            on(button, 'click', () => {
                filterButtons.forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');
                applyFilter(button.dataset.filter || 'all');
            });
        });

        const openModal = (type, src, altText) => {
            if (!modal || !modalContent || !src) return;

            if (type === 'video') {
                modalContent.innerHTML = `<iframe src="${src}" title="Video de portafolio Aerium" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            } else {
                modalContent.innerHTML = `<img src="${src}" alt="${altText || 'Contenido de portafolio'}" loading="lazy">`;
            }

            modal.classList.add('activo');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            if (!modal || !modalContent) return;
            modal.classList.remove('activo');
            modal.setAttribute('aria-hidden', 'true');
            modalContent.innerHTML = '';
            document.body.style.overflow = '';
        };

        portfolioItems.forEach((item) => {
            on(item, 'click', () => {
                const type = item.dataset.type || 'image';
                const src = item.dataset.src;
                const altText = qs('img', item)?.alt || 'Contenido de portafolio';
                openModal(type, src, altText);
            });
        });

        on(closeModalButton, 'click', closeModal);
        on(modal, 'click', (event) => {
            if (event.target === modal) closeModal();
        });

        on(document, 'keydown', (event) => {
            if (event.key === 'Escape') closeModal();
        });

        applyFilter('all');
    }

    /* =========================
       4) Carrusel testimonios automático
    ========================= */
    function initTestimonials() {
        const testimonialItems = qsa('.testimonio');
        const indicatorsWrap = qs('#indicadores-testimonios');
        if (!testimonialItems.length || !indicatorsWrap) return;

        let activeIndex = 0;
        let timer = null;

        const renderIndicators = () => {
            indicatorsWrap.innerHTML = '';
            testimonialItems.forEach((_, index) => {
                const button = document.createElement('button');
                button.className = `indicador ${index === activeIndex ? 'active' : ''}`;
                button.type = 'button';
                button.setAttribute('aria-label', `Ir al testimonio ${index + 1}`);

                button.addEventListener('click', () => {
                    activeIndex = index;
                    paint();
                    restartAuto();
                });

                indicatorsWrap.appendChild(button);
            });
        };

        const paint = () => {
            testimonialItems.forEach((item, index) => {
                item.classList.toggle('active', index === activeIndex);
            });
            qsa('.indicador', indicatorsWrap).forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        };

        const next = () => {
            activeIndex = (activeIndex + 1) % testimonialItems.length;
            paint();
        };

        const restartAuto = () => {
            if (timer) clearInterval(timer);
            timer = setInterval(next, 5000);
        };

        renderIndicators();
        paint();
        restartAuto();
    }

    /* =========================
       5) FAQ acordeón
    ========================= */
    function initFaqAccordion() {
        const items = qsa('.faq-item');
        if (!items.length) return;

        items.forEach((item) => {
            const questionButton = qs('.faq-pregunta', item);
            on(questionButton, 'click', () => {
                const isActive = item.classList.contains('active');

                items.forEach((otherItem) => otherItem.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        });
    }

    /* =========================
       6) Formulario contacto: validación + loading
    ========================= */
    function initContactForm() {
        const form = qs('#formulario-contacto');
        const submitButton = qs('#btn-submit');
        const statusElement = qs('#estado-formulario');
        if (!form || !submitButton || !statusElement) return;

        const fields = {
            nombre: qs('#nombre', form),
            email: qs('#email', form),
            telefono: qs('#telefono', form),
            servicio: qs('#servicio', form),
            mensaje: qs('#mensaje', form)
        };

        const validators = {
            nombre: (value) => value.trim().length >= 2,
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
            telefono: (value) => /^[+\d\s()-]{8,}$/.test(value.trim()),
            servicio: (value) => value.trim().length > 0,
            mensaje: (value) => value.trim().length >= 10
        };

        const setFieldState = (field, valid) => {
            if (!field) return;
            field.classList.toggle('campo-error', !valid);
        };

        const validateForm = () => {
            let allValid = true;

            Object.entries(fields).forEach(([key, field]) => {
                const value = field?.value ?? '';
                const valid = validators[key](value);
                setFieldState(field, valid);
                if (!valid) allValid = false;
            });

            return allValid;
        };

        const setFormStatus = (message, type) => {
            statusElement.textContent = message;
            statusElement.classList.remove('error', 'ok');
            if (type) statusElement.classList.add(type);
        };

        const setLoading = (loading) => {
            submitButton.classList.toggle('loading', loading);
            submitButton.disabled = loading;
        };

        on(form, 'submit', async (event) => {
            event.preventDefault();

            const valid = validateForm();
            if (!valid) {
                setFormStatus('Revisa los campos marcados para continuar.', 'error');
                return;
            }

            setFormStatus('Enviando solicitud...', '');
            setLoading(true);

            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: { Accept: 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('No se pudo enviar el formulario.');
                }

                form.reset();
                Object.values(fields).forEach((field) => setFieldState(field, true));
                setFormStatus('Solicitud enviada correctamente. Te contactaremos pronto.', 'ok');
            } catch (error) {
                setFormStatus('Hubo un problema al enviar. Intenta nuevamente o escríbenos por WhatsApp.', 'error');
            } finally {
                setLoading(false);
            }
        });
    }

    /* =========================
       7) Footer: año dinámico
    ========================= */
    function initDynamicCopyright() {
        const element = qs('#copyright');
        if (!element) return;
        const year = new Date().getFullYear();
        element.textContent = `© ${year} Aerium. Todos los derechos reservados.`;
    }

    /* =========================
       8) Compatibilidad con lugar.html
       Mantiene la carga dinámica existente.
    ========================= */
    function initLugarPageCompatibility() {
        const baseDeDatosLugares = {
            'llay-llay': {
                titulo: 'Llay-Llay',
                descripcion: 'Exploración aérea de la comuna de Llay-Llay.',
                imagenFondo: 'imagenes/llay-llay/llay-llay.jpg',
                videos: ['https://www.youtube.com/embed/toYy-val0vI'],
                imagenes: ['imagenes/llay-llay/llay-llay.jpg']
            },
            brasil: {
                titulo: 'Brasil',
                descripcion: 'La inmensidad del océano capturada desde el cielo.',
                imagenFondo: 'imagenes/brasil/brasil.png',
                videos: ['https://www.youtube.com/embed/Bd1VkmQtAyc'],
                imagenes: ['imagenes/brasil/brasil.png']
            },
            vregion: {
                titulo: 'V Región',
                descripcion: 'Vistas únicas de la costa y el entorno natural de V Región.',
                imagenFondo: 'imagenes/loncura/loncura.jpg',
                videos: ['https://www.youtube.com/embed/EZ-rUzmQRA0'],
                imagenes: ['imagenes/loncura/loncura.jpg']
            }
        };

        const tituloElemento = qs('#titulo-lugar');
        if (!tituloElemento) return;

        const parametrosURL = new URLSearchParams(window.location.search);
        const idLugar = parametrosURL.get('id');
        const datosLugar = baseDeDatosLugares[idLugar];

        if (!datosLugar) {
            tituloElemento.textContent = 'Destino no encontrado';
            const descripcion = qs('#desc-lugar');
            if (descripcion) {
                descripcion.textContent = 'Por favor, regresa al inicio y selecciona una ubicación válida.';
            }
            return;
        }

        const descripcion = qs('#desc-lugar');
        const contenedorVideo = qs('#video-lugar');
        const galeriaLateral = qs('#galeria-lateral');
        const galeriaExtra = qs('#galeria-extra');
        const encabezadoBg = qs('#lugar-encabezado-bg');

        tituloElemento.textContent = datosLugar.titulo;
        document.title = `${datosLugar.titulo} | Aerium`;

        if (descripcion) {
            descripcion.textContent = datosLugar.descripcion;
        }

        if (encabezadoBg && datosLugar.imagenFondo) {
            encabezadoBg.style.backgroundImage = `url('${datosLugar.imagenFondo}')`;
        }

        if (contenedorVideo) {
            contenedorVideo.innerHTML = datosLugar.videos
                .map((urlVideo) => `
                    <div class="contenedor-video-wrapper">
                        <div class="contenedor-video">
                            <iframe src="${urlVideo}" title="Video ${datosLugar.titulo}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
                        </div>
                        <a href="https://www.youtube.com/@Aerium-f6n" target="_blank" class="btn-primario">Ver en YouTube</a>
                    </div>
                `)
                .join('');
        }

        const crearItemGaleria = (urlImagen) => `
            <div class="item-galeria">
                <img src="${urlImagen}" alt="${datosLugar.titulo}" loading="lazy">
                <button class="btn-expandir" aria-label="Ver en pantalla completa"><i class="fas fa-expand"></i></button>
            </div>
        `;

        if (galeriaLateral) {
            galeriaLateral.innerHTML = datosLugar.imagenes.slice(0, 3).map(crearItemGaleria).join('');
        }

        if (galeriaExtra) {
            galeriaExtra.innerHTML = datosLugar.imagenes.slice(3).map(crearItemGaleria).join('');
        }

        activarLightboxDinamico();
    }

    function activarLightboxDinamico() {
        const lightbox = qs('#lightbox');
        const lightboxImg = qs('#lightbox-img');
        const closeButton = qs('.cerrar-lightbox');
        const expandButtons = qsa('.btn-expandir');

        if (!lightbox || !lightboxImg || !expandButtons.length) return;

        const openLightbox = (source) => {
            if (!source) return;
            lightboxImg.src = source;
            lightbox.classList.add('activo');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('activo');
            lightbox.setAttribute('aria-hidden', 'true');
            lightboxImg.src = '';
            document.body.style.overflow = '';
        };

        expandButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const item = event.target.closest('.item-galeria');
                const source = qs('img', item)?.src;
                openLightbox(source);
            });
        });

        on(closeButton, 'click', closeLightbox);
        on(lightbox, 'click', (event) => {
            if (event.target === lightbox) closeLightbox();
        });
        on(document, 'keydown', (event) => {
            if (event.key === 'Escape') closeLightbox();
        });
    }

    /* =========================
       Inicialización global
    ========================= */
    initNavbar();
    initReveal();
    initPortfolio();
    initTestimonials();
    initFaqAccordion();
    initContactForm();
    initDynamicCopyright();
    initLugarPageCompatibility();
})();
