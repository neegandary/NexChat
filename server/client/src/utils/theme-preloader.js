// Preload dark mode to prevent flash of wrong theme
(function () {
    'use strict';

    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    try {
        const savedTheme = localStorage.getItem('darkMode');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = savedTheme ? savedTheme === 'true' : prefersDark;

        if (shouldBeDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    } catch (error) {
        // Silently handle localStorage errors
        console.warn('Failed to initialize theme:', error);
    }
})();