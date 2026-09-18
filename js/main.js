(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');

  /* 1. Nav scrolled state ------------------------------------------------- */

  if (nav) {
    var syncScrolled = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    };

    syncScrolled();
    window.addEventListener('scroll', syncScrolled, { passive: true });
  }

  /* 2. Mobile menu -------------------------------------------------------- */

  if (navToggle && navLinks) {
    var isMenuOpen = function () {
      return navToggle.getAttribute('aria-expanded') === 'true';
    };

    var setMenuOpen = function (open) {
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navLinks.classList.toggle('is-open', open);
    };

    navToggle.addEventListener('click', function () {
      setMenuOpen(!isMenuOpen());
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isMenuOpen()) {
        setMenuOpen(false);
        navToggle.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (!isMenuOpen()) {
        return;
      }
      if (event.target instanceof Element && event.target.closest('#nav')) {
        return;
      }
      setMenuOpen(false);
    });

    navLinks.addEventListener('click', function (event) {
      if (event.target instanceof Element && event.target.closest('a')) {
        setMenuOpen(false);
      }
    });

    /* Reset the menu when the layout switches to the desktop nav.
       Mirrors the CSS nav breakpoint (max-width: 760px). */
    if (typeof window.matchMedia === 'function') {
      var desktopLayout = window.matchMedia('(min-width: 760.01px)');

      var closeOnDesktop = function (event) {
        if (event.matches) {
          setMenuOpen(false);
        }
      };

      if (typeof desktopLayout.addEventListener === 'function') {
        desktopLayout.addEventListener('change', closeOnDesktop);
      } else if (typeof desktopLayout.addListener === 'function') {
        desktopLayout.addListener(closeOnDesktop);
      }
    }
  }

  /* 3. Active section in nav ---------------------------------------------- */

  var sectionLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a[href^="#"]')
  );

  if (sectionLinks.length && 'IntersectionObserver' in window) {
    var sections = sectionLinks
      .map(function (link) {
        var id = link.getAttribute('href').slice(1);
        return id ? document.getElementById(id) : null;
      })
      .filter(Boolean);

    var setCurrentSection = function (id) {
      sectionLinks.forEach(function (link) {
        if (link.getAttribute('href') === '#' + id) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }
})();
