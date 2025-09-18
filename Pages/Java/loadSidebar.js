// Fetches and injects the shared sidebar HTML fragment into pages.
// Place this script before `sidebar.js` in pages that need the sidebar.

(function() {
  function loadSidebar() {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    // Determine path to fragment relative to current page.
    // Pages live under Pages/ so the fragment is in the same folder.
    const fragmentPath = 'sidebar.html';

    fetch(fragmentPath)
      .then(response => {
        if (!response.ok) throw new Error('Sidebar fragment not found');
        return response.text();
      })
      .then(html => {
        container.innerHTML = html;
        // If sidebar.js expects to run after DOM content, dispatch an event so it can initialize.
        const ev = new Event('sidebar:loaded');
        window.dispatchEvent(ev);
      })
      .catch(err => {
        console.error('Failed to load sidebar:', err);
      });
  }

  // Load as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSidebar);
  } else {
    loadSidebar();
  }
})();
