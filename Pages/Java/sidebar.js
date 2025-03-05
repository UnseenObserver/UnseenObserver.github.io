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

// When mouse enters the hover area
hoverArea.addEventListener('mouseenter', () => {
    openSidebar();
});

// When mouse leaves the hover area, close if not over sidebar
hoverArea.addEventListener('mouseleave', () => {
    if (!isSidebarOpen) {
        closeSidebar();
    }
});

// Keep sidebar open when hovering over the sidebar itself
sidebar.addEventListener('mouseenter', () => {
    openSidebar();
});

// Close sidebar when leaving the sidebar, if not hovering over hover-area
sidebar.addEventListener('mouseleave', () => {
    closeSidebar();
});