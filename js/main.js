/* ==========================================================================
   Unsung Heroes of America — site scripts
   ========================================================================== */
(function () {
  'use strict';

  var ORG_EMAIL = 'unsungheroesofamericainc@gmail.com';

  /* --- Mobile navigation ------------------------------------------------ */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close the menu after tapping a link on mobile.
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* --- FAQ accordion ---------------------------------------------------- */
  function initAccordion() {
    var triggers = document.querySelectorAll('.accordion-trigger');
    Array.prototype.forEach.call(triggers, function (trigger) {
      var body = trigger.nextElementSibling;
      if (!body || !body.classList.contains('accordion-body')) return;

      trigger.setAttribute('aria-expanded', 'false');
      trigger.addEventListener('click', function () {
        var open = body.classList.toggle('is-open');
        trigger.classList.toggle('is-open', open);
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }

  /* --- Forms ------------------------------------------------------------ */
  // Each form carries a real action/method in the markup, so submissions still
  // reach Formspree if this script fails to load. When it does load we post via
  // fetch and swap in an inline confirmation instead of navigating away.
  function showStatus(el, kind, title, bodyHtml) {
    el.className = 'form-status form-status-' + kind;
    el.innerHTML = '<strong>' + title + '</strong><p>' + bodyHtml + '</p>';
    el.hidden = false;
  }

  function initForms() {
    // Without fetch/FormData we leave the native POST alone rather than break it.
    if (!window.fetch || !window.FormData) return;

    var forms = document.querySelectorAll('form[data-formspree]');
    Array.prototype.forEach.call(forms, function (form) {
      var status = document.getElementById(form.id + '-status');
      if (!status) return;

      var button = form.querySelector('button[type="submit"]');
      var buttonLabel = button ? button.textContent : '';

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;

        status.hidden = true;
        if (button) { button.disabled = true; button.textContent = 'Sending…'; }

        fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        }).then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.hidden = true;
          showStatus(status, 'success',
            form.getAttribute('data-success-title'),
            form.getAttribute('data-success-body'));
          status.setAttribute('tabindex', '-1');
          status.focus();
        })['catch'](function () {
          if (button) { button.disabled = false; button.textContent = buttonLabel; }
          showStatus(status, 'error', 'That didn&rsquo;t go through.',
            'Something went wrong sending your message. Please try again, or email us ' +
            'directly at <a href="mailto:' + ORG_EMAIL + '">' + ORG_EMAIL + '</a> and ' +
            'we&rsquo;ll pick it up from there.');
        });
      });
    });
  }

  /* --- Init ------------------------------------------------------------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initNav(); initAccordion(); initForms(); });
  } else {
    initNav();
    initAccordion();
    initForms();
  }
})();
