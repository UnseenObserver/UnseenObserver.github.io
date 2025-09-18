// sidebar.js - A clean implementation for sidebar functionality
(function() {
  let hoverArea = null;
  let sidebar = null;
  let isSidebarOpen = false;
  let initialized = false;

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('open');
    isSidebarOpen = true;
  }

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    isSidebarOpen = false;
  }

  function toggleSidebar() {
    if (isSidebarOpen) closeSidebar(); else openSidebar();
  }

  function init() {
    if (initialized) return;
    hoverArea = document.querySelector('.hover-area');
    sidebar = document.querySelector('.sidebar');
    if (!hoverArea || !sidebar) return; // not ready yet

    initialized = true;

    // Mouse Events (for desktop)
    hoverArea.addEventListener('mouseenter', openSidebar);
    hoverArea.addEventListener('mouseleave', () => { if (!isSidebarOpen) closeSidebar(); });
    sidebar.addEventListener('mouseenter', openSidebar);
    sidebar.addEventListener('mouseleave', closeSidebar);

    // Click and Touch Events (for mobile/touch devices)
    hoverArea.addEventListener('click', toggleSidebar);
    sidebar.addEventListener('click', toggleSidebar);
    hoverArea.addEventListener('touchstart', function(e) { e.preventDefault(); toggleSidebar(); });
    sidebar.addEventListener('touchstart', function(e) { e.preventDefault(); toggleSidebar(); });

    // Close when clicking/touching outside
    document.addEventListener('click', function(e) {
      if (isSidebarOpen && sidebar && hoverArea && !sidebar.contains(e.target) && !hoverArea.contains(e.target)) {
        closeSidebar();
      }
    });
    document.addEventListener('touchstart', function(e) {
      if (isSidebarOpen && sidebar && hoverArea && !sidebar.contains(e.target) && !hoverArea.contains(e.target)) {
        closeSidebar();
      }
    });
  }

  // Initialize when DOM is ready or when sidebar is dynamically loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('sidebar:loaded', init);

  // Hide contact link on contact page (preserve previous behavior)
  document.addEventListener('DOMContentLoaded', function() {
    try {
      const isContactPage = location.pathname.includes('senWebContact.html') || location.href.includes('senWebContact.html');
      if (!isContactPage) return;
      const footerLinks = document.querySelectorAll('.footer a[href$="senWebContact.html"]');
      footerLinks.forEach(a => {
        a.style.display = 'none';
        a.setAttribute('aria-hidden', 'true');
      });
    } catch (err) {
      console.error('footer link cleanup failed', err);
    }
  });

})();