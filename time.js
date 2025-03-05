// Automatically update the year in the footer
document.addEventListener('DOMContentLoaded', (event) => {
    // Get the current year
    const currentYear = new Date().getFullYear();
    // Update the footer with the current year
    document.getElementById('year').textContent = currentYear;
});