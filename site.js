(function () {
  'use strict';

  function smoothScrollTo(hash) {
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');
      if (!hash || hash === '#') return;
      if (!document.querySelector(hash)) return;
      e.preventDefault();
      smoothScrollTo(hash);
      closeMobileNav();
    });
  });

  function closeMobileNav() {
    var nav = document.querySelector('.nav-links');
    var toggle = document.querySelector('.nav-toggle');
    if (nav) nav.classList.remove('nav-links--open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('nav-links--open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileNav();
    });
  }

  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    var feedback = document.getElementById('contact-feedback');
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = contactForm.querySelector('[name="name"]');
      var email = contactForm.querySelector('[name="email"]');
      var message = contactForm.querySelector('[name="message"]');
      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        if (feedback) {
          feedback.textContent = 'Please fill in every field.';
          feedback.className = 'form-feedback form-feedback--error';
          feedback.hidden = false;
        }
        return;
      }
      contactForm.reset();
      if (feedback) {
        feedback.textContent = 'Thanks — your message was sent.';
        feedback.className = 'form-feedback form-feedback--success';
        feedback.hidden = false;
      }
    });
  }

  var cards = document.querySelectorAll('.products-card[data-product-slug]');
  cards.forEach(function (card) {
    var slug = card.getAttribute('data-product-slug');
    var buyLink = card.querySelector('a.buy');
    if (buyLink && slug) buyLink.href = './buy.html?product=' + encodeURIComponent(slug);
  });

  var buyRoot = document.querySelector('[data-buy-page]');
  if (buyRoot) {
    var products = {
      stellar: {
        title: 'Stellar Sticks',
        price: '$5',
        image: 'imgs/Sticks.jpg',
        alt: 'Stellar Sticks snack',
      },
      truffles: {
        title: 'Chocolate Truffles (1 box)',
        price: '$14',
        image: 'imgs/Bolitas.jpeg',
        alt: 'Chocolate Truffles',
      },
      crunch: {
        title: 'Comet Crunch',
        price: '$10',
        image: 'imgs/Crunch.jpg',
        alt: 'Comet Crunch granola',
      },
    };

    var params = new URLSearchParams(window.location.search);
    var key = (params.get('product') || 'truffles').toLowerCase();
    var product = products[key] || products.truffles;

    var titleEl = document.getElementById('buy-title');
    var priceEl = document.getElementById('buy-price');
    var imgEl = document.getElementById('buy-image');
    if (titleEl) titleEl.textContent = product.title;
    if (priceEl) priceEl.textContent = product.price;
    if (imgEl) {
      imgEl.src = product.image;
      imgEl.alt = product.alt;
    }
    document.title = product.title + ' · Nova Snacks';

    var qtyDown = document.getElementById('qty-down');
    var qtyUp = document.getElementById('qty-up');
    var qtyInput = document.getElementById('qty-input');
    var buyBtn = document.getElementById('buy-submit');

    function setQty(n) {
      var v = Math.max(1, Math.min(99, n));
      if (qtyInput) qtyInput.value = String(v);
    }

    if (qtyDown && qtyInput) {
      qtyDown.addEventListener('click', function () {
        setQty(parseInt(qtyInput.value, 10) - 1 || 1);
      });
    }
    if (qtyUp && qtyInput) {
      qtyUp.addEventListener('click', function () {
        setQty(parseInt(qtyInput.value, 10) + 1 || 2);
      });
    }
    if (qtyInput) {
      qtyInput.addEventListener('change', function () {
        var n = parseInt(qtyInput.value, 10);
        setQty(isNaN(n) ? 1 : n);
      });
    }

    function showToast(text) {
      var toast = document.getElementById('toast');
      if (!toast) return;
      toast.textContent = text;
      toast.classList.add('toast--visible');
      clearTimeout(showToast._t);
      showToast._t = setTimeout(function () {
        toast.classList.remove('toast--visible');
      }, 3200);
    }

    if (buyBtn && qtyInput) {
      buyBtn.addEventListener('click', function () {
        var q = parseInt(qtyInput.value, 10) || 1;
        showToast(
          q === 1
            ? 'Added 1 × ' + product.title + ' to cart.'
            : 'Added ' + q + ' × ' + product.title + ' to cart.'
        );
      });
    }
  }

  var prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('reveal--visible');
    });
  }
})();
