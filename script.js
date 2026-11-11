/**
 * ARQUITECTURA PREVENCIÓN DE FUGAS DE MEMORIA (MEMORY LEAK PROTECTION)
 * & CONTROL DE HIDRATACIÓN / REFRESH PWA
 */

(function () {
    'use strict';

    // Referencias cacheadas
    let activeModal = null;
    let currentSlide = 0;
    let slides = [];

    // 1. REFRESH Y BOTÓN DE HIDRATACIÓN
    function hydrateApp() {
        // Realiza una recarga limpia omitiendo la caché del navegador si es posible
        if (window.location) {
            window.location.reload(true);
        }
    }

    // 2. NAVEGACIÓN Y APERTURA DE MODALES
    function openModal(modalId) {
        if (!modalId) return;
        const targetModal = document.getElementById(modalId);
        if (targetModal) {
            if (activeModal && activeModal !== targetModal) {
                closeActiveModal();
            }
            targetModal.classList.add('active');
            activeModal = targetModal;
        }
    }

    function closeActiveModal() {
        if (activeModal) {
            activeModal.classList.remove('active');
            activeModal = null;
        }
    }

    // 3. CARRUSEL CON LIMPIEZA DE EVENTOS
    function initCarrusel() {
        slides = Array.from(document.querySelectorAll('.slide'));
    }

    function changeSlide(direction) {
        if (!slides.length) return;
        slides[currentSlide].classList.remove('active');
        if (direction === 'next') {
            currentSlide = (currentSlide + 1) % slides.length;
        } else if (direction === 'prev') {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        }
        slides[currentSlide].classList.add('active');
    }

    // 4. ACORDEÓN DESPLEGABLE
    function toggleAccordion(headerBtn) {
        const item = headerBtn.closest('.accordion-item');
        if (!item) return;

        const content = item.querySelector('.accordion-content');
        const isOpen = item.classList.contains('open');

        // Cerrar acordeones hermanos en la misma ventana
        const parentContainer = item.closest('.accordion-container');
        if (parentContainer) {
            parentContainer.querySelectorAll('.accordion-item').forEach(sibling => {
                if (sibling !== item) {
                    sibling.classList.remove('open');
                    const sibContent = sibling.querySelector('.accordion-content');
                    if (sibContent) sibContent.style.maxHeight = null;
                }
            });
        }

        if (isOpen) {
            item.classList.remove('open');
            content.style.maxHeight = null;
        } else {
            item.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }

    // 5. DELEGACIÓN DE EVENTOS GLOBAL (Evita acumulación de Event Listeners)
    document.addEventListener('click', function (e) {
        // A. Botón de Hidratación / Refresh
        if (e.target.closest('#hydrateBtn')) {
            hydrateApp();
            return;
        }

        // B. Tema Noche/Día
        if (e.target.closest('#themeBtn')) {
            document.body.classList.toggle('light-mode');
            const btn = document.getElementById('themeBtn');
            btn.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
            return;
        }

        // C. Abrir Modales vía data-modal o Avatar
        const modalTrigger = e.target.closest('[data-modal]');
        if (modalTrigger) {
            const modalId = modalTrigger.getAttribute('data-modal');
            openModal(modalId);
            return;
        }

        if (e.target.closest('#avatarBtn')) {
            openModal('perfil-win');
            return;
        }

        // D. Cerrar Modal activo (Botón X o Click fuera)
        if (e.target.closest('.close-win-btn') || e.target.classList.contains('rpg-modal')) {
            closeActiveModal();
            return;
        }

        // E. Controles del Carrusel
        if (e.target.closest('#nextBtn')) {
            changeSlide('next');
            return;
        }
        if (e.target.closest('#prevBtn')) {
            changeSlide('prev');
            return;
        }

        // F. Acordeón
        const accordionHeader = e.target.closest('.accordion-header');
        if (accordionHeader) {
            toggleAccordion(accordionHeader);
            return;
        }
    });

    // 6. MANEJO DE FORMULARIOS CON VALIDACIÓN LIMPIA
    document.addEventListener('submit', function (e) {
        if (e.target && e.target.id === 'hireForm') {
            e.preventDefault();
            const nombreInput = document.getElementById('nombre');
            const alertaBox = document.getElementById('alertaBox');

            if (alertaBox) {
                alertaBox.style.color = '#f3c66f';
                alertaBox.textContent = `¡Misiva enviada con éxito, ${nombreInput ? nombreInput.value : ''}! ✉️✨`;
            }

            e.target.reset();

            setTimeout(function () {
                if (alertaBox) alertaBox.textContent = '';
                closeActiveModal();
            }, 2000);
        }
    });

    // 7. INICIALIZACIÓN Y INMUNIZACIÓN PWA AL CARGAR LA PÁGINA
    window.addEventListener('DOMContentLoaded', function () {
        initCarrusel();

        // Previene rebote de viewport en iOS Safari (Overscroll / Bounce leak)
        document.body.addEventListener('touchmove', function (e) {
            if (!e.target.closest('.rpg-modal-content')) {
                e.preventDefault();
            }
        }, { passive: false });
    });

})();
// Lógica para desplegar / ocultar el widget lateral
const toggleWidgetBtn = document.getElementById('toggleWidgetBtn');
const socialWidget = document.querySelector('.rpg-social-widget');

if (toggleWidgetBtn && socialWidget) {
    toggleWidgetBtn.addEventListener('click', () => {
        socialWidget.classList.toggle('collapsed');
        toggleWidgetBtn.textContent = socialWidget.classList.contains('collapsed') ? '❯' : '❮';
    });
    
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registrado con éxito:', reg.scope))
            .catch(err => console.error('Error al registrar el Service Worker:', err));
    });
}
}