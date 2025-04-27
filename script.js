document.addEventListener('DOMContentLoaded', function() {
    // Initialize VanillaTilt for 3D effects
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
    });

    // Theme Toggle
    const toggle = document.getElementById('toggle');
    const body = document.body;

    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem