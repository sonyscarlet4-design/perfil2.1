(function () {
    'use strict';

    // Referencias cacheadas
    let activeModal = null;
    let currentSlide = 0;
    let slides = [];

    // 1. REFRESH Y BOTÓN DE HIDRATACIÓN
    function hydrateApp() {
        if (window.location) {
            window.location.reload();
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

    // 3. ACORDEÓN DESPLEGABLE
    function toggleAccordion(headerBtn) {
        const item = headerBtn.closest('.accordion-item');
        if (!item) return;

        const content = item.querySelector('.accordion-content');
        const isOpen = item.classList.contains('open');

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

    // 4. DELEGACIÓN DE EVENTOS GLOBAL
    document.addEventListener('click', function (e) {
        if (e.target.closest('#hydrateBtn')) {
            hydrateApp();
            return;
        }

        if (e.target.closest('#themeBtn')) {
            document.body.classList.toggle('light-mode');
            const btn = document.getElementById('themeBtn');
            btn.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
            return;
        }

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

        if (e.target.closest('.close-win-btn') || e.target.classList.contains('rpg-modal')) {
            closeActiveModal();
            return;
        }

        const accordionHeader = e.target.closest('.accordion-header');
        if (accordionHeader) {
            toggleAccordion(accordionHeader);
            return;
        }
    });

    // 5. MANEJO DE FORMULARIOS CON VALIDACIÓN LIMPIA
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

    // 6. INICIALIZACIÓN AL CARGAR LA PÁGINA (Permitiendo scroll natural táctil)
    window.addEventListener('DOMContentLoaded', function () {
        // No bloqueamos touchmove global para permitir scroll fluido en celular
    });

})();

// --- WIDGET SOCIAL LATERAL IZQUIERDO ---
function toggleSocialWidget() {
    const widget = document.getElementById('socialWidget');
    if (widget) {
        widget.classList.toggle('collapsed');
        const btn = widget.querySelector('.widget-toggle-btn');
        if (btn) {
            btn.innerHTML = widget.classList.contains('collapsed') ? '▶' : '◀';
        }
    }
}

// --- REGISTRO DE SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registrado con éxito:', reg.scope))
            .catch(err => console.error('Error al registrar el Service Worker:', err));
    });
}

// --- SCRIPT DE DETECCIÓN AVANZADA DE DISPOSITIVOS ---
function detectarDispositivo() {
    const ancho = window.innerWidth;
    const userAgent = navigator.userAgent.toLowerCase();

    const esMovil = /android|iphone|ipad|ipod|blackberry|opera mini|mobile/i.test(userAgent) || ancho <= 768;
    const esTablet = (/ipad|tablet/i.test(userAgent) || (ancho > 768 && ancho <= 1024));
    
    document.body.classList.remove('dispositivo-movil', 'dispositivo-tablet', 'dispositivo-pc');

    if (esMovil) {
        document.body.classList.add('dispositivo-movil');
    } else if (esTablet) {
        document.body.classList.add('dispositivo-tablet');
    } else {
        document.body.classList.add('dispositivo-pc');
    }
}

window.addEventListener('load', detectarDispositivo);
window.addEventListener('resize', detectarDispositivo);