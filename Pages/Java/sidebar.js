// Get the elements
const hoverArea = document.querySelector('.hover-area');
const sidebar = document.querySelector('.sidebar');

let isSidebarOpen = false; // Track the sidebar state

// Function to open the sidebar
function openSidebar() {
    sidebar.classList.add('open');
    isSidebarOpen = true;
}

// Function to close the sidebar
function closeSidebar() {
    sidebar.classList.remove('open');
    isSidebarOpen = false;
}

// Function to toggle the sidebar (used for click and touch events)
function toggleSidebar() {
    if (isSidebarOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

// --- Mouse Events (for desktop) ---
// Open sidebar when the mouse enters the hover area
hoverArea.addEventListener('mouseenter', () => {
    openSidebar();
});

// Optionally, close sidebar when the mouse leaves the hover area.
// You may adjust this behavior depending on whether you want manual click/touch to “lock” the sidebar open.
hoverArea.addEventListener('mouseleave', () => {
    // Here we check if the sidebar is not already toggled open manually.
    if (!isSidebarOpen) {
        closeSidebar();
    }
});

// Keep the sidebar open when hovering over it.
sidebar.addEventListener('mouseenter', () => {
    openSidebar();
});

// Close sidebar when leaving the sidebar itself.
sidebar.addEventListener('mouseleave', () => {
    closeSidebar();
});

// --- Click and Touch Events (for mobile/touch devices) ---
// Toggle the sidebar when clicking the hover area or the sidebar (including any buttons within it)
hoverArea.addEventListener('click', toggleSidebar);
sidebar.addEventListener('click', toggleSidebar);

// Add touch event listeners to improve touch responsiveness.
// Using e.preventDefault() helps prevent the simulated mouse events on touch devices.
hoverArea.addEventListener('touchstart', function(e) {
    e.preventDefault();
    toggleSidebar();
});
sidebar.addEventListener('touchstart', function(e) {
    e.preventDefault();
    toggleSidebar();
});

// --- Global Event Listeners to Close Sidebar on Outside Click/Touch ---
// This listener checks for any click outside of the sidebar and hover area,
// and if the sidebar is open, it will close it.
document.addEventListener('click', function(e) {
    // If the sidebar is open and the click target is NOT within the sidebar or hover area,
    // then close the sidebar.
    if (isSidebarOpen && !sidebar.contains(e.target) && !hoverArea.contains(e.target)) {
        closeSidebar();
    }
});

// Similarly, for touch events on mobile devices.
document.addEventListener('touchstart', function(e) {
    if (isSidebarOpen && !sidebar.contains(e.target) && !hoverArea.contains(e.target)) {
        closeSidebar();
    }
});

// Hide 'Contact Me' footer link only when on the contact page itself
document.addEventListener('DOMContentLoaded', function() {
    try {
        const isContactPage = location.pathname.includes('senWebContact.html') || location.href.includes('senWebContact.html');
        if (!isContactPage) return; // only hide on the contact page
        const footerLinks = document.querySelectorAll('.footer a[href$="senWebContact.html"]');
        footerLinks.forEach(a => {
            a.style.display = 'none';
            a.setAttribute('aria-hidden', 'true');
        });
    } catch (err) {
        console.error('footer link cleanup failed', err);
    }
});
