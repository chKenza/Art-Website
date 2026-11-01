(function () {
    // Fade thumbnails in once they have loaded
    document.querySelectorAll('.art img').forEach(function (img) {
        if (img.complete && img.naturalWidth) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function () { img.classList.add('loaded'); });
            img.addEventListener('error', function () { img.classList.add('loaded'); });
        }
    });

    // Centre the (shorter) last row of each gallery wall instead of leaving
    // it hanging on the left. Without JS it simply stays left-aligned.
    function balance(gallery) {
        var items = gallery.querySelectorAll('.art');
        if (!items.length) return;
        items.forEach(function (a) { a.classList.remove('last-row'); });
        gallery.classList.remove('balanced');
        var lastTop = items[items.length - 1].offsetTop;
        items.forEach(function (a) {
            if (a.offsetTop === lastTop) a.classList.add('last-row');
        });
        gallery.classList.add('balanced');
    }
    document.querySelectorAll('.gallery').forEach(function (gallery) {
        balance(gallery);
        if (window.ResizeObserver) {
            var lastWidth = gallery.clientWidth;
            new ResizeObserver(function () {
                if (gallery.clientWidth !== lastWidth) {
                    lastWidth = gallery.clientWidth;
                    balance(gallery);
                }
            }).observe(gallery);
        }
    });
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
            document.querySelectorAll('.gallery').forEach(balance);
        });
    }

    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    var image = document.getElementById('lightbox-image');
    var title = document.getElementById('lightbox-title');
    var technique = document.getElementById('lightbox-technique');
    var description = document.getElementById('lightbox-description');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    var current = null;
    var lastFocus = null;

    function siblings(art) {
        return Array.prototype.slice.call(art.closest('.gallery').querySelectorAll('.art'));
    }

    function preload(art) {
        if (art) new Image().src = art.dataset.full;
    }

    function show(art) {
        current = art;
        image.src = art.dataset.full;
        image.alt = art.dataset.title;
        title.textContent = art.dataset.title;
        technique.textContent = art.dataset.technique;
        description.textContent = art.dataset.description;
        lightbox.querySelector('.lightbox-text').scrollTop = 0;
        lightbox.querySelector('.lightbox-panel').scrollTop = 0;

        var list = siblings(art);
        var i = list.indexOf(art);
        prevBtn.hidden = i === 0;
        nextBtn.hidden = i === list.length - 1;
        preload(list[i + 1]);
        preload(list[i - 1]);
    }

    function open(art) {
        lastFocus = art;
        show(art);
        lightbox.classList.add('open');
        document.body.classList.add('lightbox-open');
        lightbox.querySelector('.lightbox-close').focus();
    }

    function close() {
        lightbox.classList.remove('open');
        document.body.classList.remove('lightbox-open');
        image.removeAttribute('src');
        current = null;
        if (lastFocus) lastFocus.focus();
    }

    function step(delta) {
        if (!current) return;
        var list = siblings(current);
        var next = list[list.indexOf(current) + delta];
        if (next) show(next);
    }

    document.querySelectorAll('.art').forEach(function (art) {
        art.addEventListener('click', function () { open(art); });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    prevBtn.addEventListener('click', function () { step(-1); });
    nextBtn.addEventListener('click', function () { step(1); });

    // Click on the dark backdrop closes
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', function (e) {
        if (!current) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') step(-1);
        else if (e.key === 'ArrowRight') step(1);
    });

    // Swipe left/right on the image (phones)
    var startX = null, startY = null;
    var media = lightbox.querySelector('.lightbox-media');
    media.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    media.addEventListener('touchend', function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        var dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
        startX = null;
    });
})();
