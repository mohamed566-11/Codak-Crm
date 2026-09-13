(function () {
    'use strict';
    var isApplying = false;

    function applyCodakFooter() {
        if (isApplying) return;
        isApplying = true;
        try {
            var footers = document.querySelectorAll('footer, #footer, body > footer');
            if (!footers || !footers.length) return;

            footers.forEach(function (footer) {
                // 1. Hide legacy EspoCRM credit text
                var credits = footer.querySelectorAll('.credit, p.credit, a[href*="espocrm.com"]');
                credits.forEach(function (el) {
                    el.style.setProperty('display', 'none', 'important');
                });

                // 2. Inject Dazzling Codak CRM Footer if not already present
                if (!footer.querySelector('.codak-unified-footer')) {
                    var container = footer.querySelector('.el-hany-footer-container');
                    if (!container) {
                        container = document.createElement('div');
                        container.className = 'el-hany-footer-container';
                        footer.appendChild(container);
                    }
                    container.innerHTML = `
                        <div class="codak-unified-footer">
                            <div class="codak-footer-left">
                                <div class="codak-footer-logo-box">
                                    <img src="client/custom/img/logo-39.png" class="codak-footer-brand-logo" alt="Codak Logo">
                                </div>
                                <span class="codak-footer-title">Codak CRM</span>
                                <span class="codak-footer-sep"><i class="fas fa-circle codak-dot-icon"></i></span>
                                <span class="codak-footer-copy">&copy; 2026 All Rights Reserved</span>
                            </div>
                            <div class="codak-footer-right">
                                <a class="codak-footer-action-link" href="https://codak.net/" target="_blank" rel="noopener" title="Visit Codak Official Site">
                                    <span>codak.net</span>
                                    <i class="fas fa-external-link-alt codak-link-arrow"></i>
                                </a>
                            </div>
                        </div>
                    `;
                }
            });
        } catch (err) {
            console.error('[Codak Footer] Error applying dazzling footer:', err);
        } finally {
            isApplying = false;
        }
    }

    // Run immediately
    applyCodakFooter();

    // Run on DOMContentLoaded & load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyCodakFooter);
    }
    window.addEventListener('load', applyCodakFooter);

    // Observe SPA DOM mutations
    try {
        var observer = new MutationObserver(function () {
            applyCodakFooter();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    } catch (e) {
        setInterval(applyCodakFooter, 1000);
    }
})();
