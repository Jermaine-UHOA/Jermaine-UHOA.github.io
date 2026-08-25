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
  // Each form composes a mailto: message so submissions reach UHOA without a
  // server. The label text of each field becomes the line item in the body.
  function labelFor(field, form) {
    if (field.id) {
      var label = form.querySelector('label[for="' + field.id + '"]');
      if (label) return label.textContent.replace(/\s*\*\s*$/, '').trim();
    }
    return (field.name || 'Field').replace(/_/g, ' ');
  }

  function buildBody(form) {
    var lines = [];
    Array.prototype.forEach.call(form.elements, function (field) {
      if (!field.name || field.type === 'submit' || field.type === 'button') return;
      if ((field.type === 'checkbox' || field.type === 'radio') && !field.checked) return;
      var value = (field.value || '').trim();
      if (!value) return;
      lines.push(labelFor(field, form) + ': ' + value);
    });
    return lines.join('\n');
  }

  function submitViaEmail(event, subjectPrefix) {
    event.preventDefault();
    var form = event.target;
    if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;

    var subjectField = form.querySelector('[name="subject"]');
    var typed = subjectField ? subjectField.value.trim() : '';
    var subject = typed ? subjectPrefix + ': ' + typed : subjectPrefix;

    window.location.href = 'mailto:' + ORG_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(buildBody(form));
  }

  // Called inline from the page markup (onsubmit="...").
  window.handleContactForm = function (e) { submitViaEmail(e, 'Website Contact'); };
  window.handleHelpForm = function (e) { submitViaEmail(e, 'Veteran Assistance Request'); };
  window.handleVolunteerForm = function (e) { submitViaEmail(e, 'Volunteer Application'); };

  /* --- Init ------------------------------------------------------------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initNav(); initAccordion(); });
  } else {
    initNav();
    initAccordion();
  }
})();
