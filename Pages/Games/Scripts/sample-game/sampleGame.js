// Minimal sample game: click the red box to score
(function(){
    // Wait until DOM is ready in case script is loaded in head
    function init(){
        const start = document.getElementById('start-button');
        const box = document.getElementById('color-box');
        const scoreEl = document.getElementById('score-val');
        if(!start || !box || !scoreEl) return; // graceful no-op if used elsewhere
        let score = 0;
        let timer = null;

        function placeBox(){
            const container = document.getElementById('game-container');
            const rect = container.getBoundingClientRect();
            const size = 100;
            const x = Math.random()*(Math.max(rect.width, size)-size);
            const y = Math.random()*(Math.max(rect.height, size)-size-20)+20;
            box.style.left = x + 'px';
            box.style.top = y + 'px';
            box.style.display = 'block';
        }

        box.addEventListener('click', function(){
            score += 1; scoreEl.textContent = score;
            placeBox();
        });

        start.addEventListener('click', function(){
            score = 0; scoreEl.textContent = score;
            placeBox();
            if(timer) clearInterval(timer);
            timer = setInterval(placeBox, 1200);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();