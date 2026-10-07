(function () {
    'use strict';
    var isApplying = false;
    var scheduledFrame = null;

    function syncCompanyLogoAndFavicon() {
        try {
            var app = (window.Espo && window.Espo.app) || window.app;
            if (!app || typeof app.getConfig !== 'function') return;

            var companyLogoId = app.getConfig().get('companyLogoId');
            if (companyLogoId) {
                var basePath = typeof app.getBasePath === 'function' ? app.getBasePath() : '';
                var targetUrl = basePath + '?entryPoint=LogoImage&id=' + companyLogoId;

                // 1. Sync Logo Images in Navbar, Header, Sidebar, and Login Page
                var logoImgs = document.querySelectorAll(
                    '.navbar-brand img, .navbar-logo-container img, #login img.logo, .logo-container img.logo, #header img.logo, .sidebar img.logo'
                );

                logoImgs.forEach(function (img) {
                    if (img && img.src !== targetUrl && !img.src.includes('id=' + companyLogoId)) {
                        img.src = targetUrl;
                    }
                });

                // 2. Sync Favicon in Browser Tab (<head> <link rel="icon">)
                var faviconLinks = document.querySelectorAll('link[rel*="icon"]');
                if (faviconLinks && faviconLinks.length) {
                    faviconLinks.forEach(function (link) {
                        if (link && link.href !== targetUrl && !link.href.includes('id=' + companyLogoId)) {
                            link.href = targetUrl;
                        }
                    });
                } else {
                    var newFavicon = document.createElement('link');
                    newFavicon.rel = 'icon';
                    newFavicon.href = targetUrl;
                    document.head.appendChild(newFavicon);
                }
            }
        } catch (e) {}
    }

    function applyCodakFooter() {
        if (isApplying) return;
        isApplying = true;
        try {
            syncCompanyLogoAndFavicon();

            var footers = document.querySelectorAll('footer, #footer, body > footer');
            if (!footers || !footers.length) return;

            footers.forEach(function (footer) {
                var container = footer.querySelector('.el-hany-footer-container');
                if (!container) {
                    container = document.createElement('div');
                    container.className = 'el-hany-footer-container';
                    footer.appendChild(container);
                }

                if (!container.querySelector('.codak-unified-footer')) {
                    container.innerHTML = `
                        <div class="codak-unified-footer">
                            <div class="codak-footer-left">
                                <a class="codak-footer-title" href="https://codak.net/" target="_blank" rel="noopener" title="Visit Codak Official Site">Codak</a>
                                <span class="codak-footer-sep"><i class="fas fa-circle codak-dot-icon"></i></span>
                                <span class="codak-footer-copy">&copy; 2026 All Rights Reserved</span>
                            </div>
                        </div>
                    `;
                }
            });
        } catch (err) {
            console.error('[Codak Footer] Error applying footer:', err);
        } finally {
            isApplying = false;
        }
    }

    function sanitizeDocumentTitleAndText() {
        try {
            if (document.title && (document.title.includes('EspoCRM') || document.title.includes('Espo'))) {
                document.title = document.title.replace(/EspoCRM/g, 'CodakCRM').replace(/Espo/g, 'Codak');
            }
        } catch (e) {}
    }

    function scheduleApply() {
        if (scheduledFrame) return;
        if (typeof window.requestAnimationFrame === 'function') {
            scheduledFrame = window.requestAnimationFrame(function () {
                scheduledFrame = null;
                applyCodakFooter();
                syncCompanyLogoAndFavicon();
                sanitizeDocumentTitleAndText();
            });
        } else {
            scheduledFrame = setTimeout(function () {
                scheduledFrame = null;
                applyCodakFooter();
                syncCompanyLogoAndFavicon();
                sanitizeDocumentTitleAndText();
            }, 100);
        }
    }

    applyCodakFooter();
    syncCompanyLogoAndFavicon();
    sanitizeDocumentTitleAndText();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyCodakFooter);
        document.addEventListener('DOMContentLoaded', syncCompanyLogoAndFavicon);
        document.addEventListener('DOMContentLoaded', sanitizeDocumentTitleAndText);
    }
    window.addEventListener('load', applyCodakFooter);
    window.addEventListener('load', syncCompanyLogoAndFavicon);
    window.addEventListener('load', sanitizeDocumentTitleAndText);
    window.addEventListener('hashchange', scheduleApply);
    window.addEventListener('popstate', scheduleApply);

    var targetFooter = document.querySelector('footer, #footer');
    if (targetFooter) {
        try {
            var observer = new MutationObserver(scheduleApply);
            observer.observe(targetFooter, { childList: true, subtree: false });
        } catch (e) { }
    }

    try {
        var titleEl = document.querySelector('title');
        if (titleEl) {
            var titleObserver = new MutationObserver(sanitizeDocumentTitleAndText);
            titleObserver.observe(titleEl, { childList: true, characterData: true, subtree: true });
        }
    } catch (e) {}

    setInterval(function () {
        syncCompanyLogoAndFavicon();
        sanitizeDocumentTitleAndText();
    }, 1000);
})();
