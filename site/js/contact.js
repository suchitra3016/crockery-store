/* Contact form validation. validateContact is a pure function so it can be unit tested in Node. */
(function () {
  'use strict';

  function validateContact(v) {
    const errors = {};
    const name = (v.name || '').trim();
    const email = (v.email || '').trim();
    const phone = (v.phone || '').trim();
    const message = (v.message || '').trim();

    if (!name) errors.name = 'Enter your name.';
    else if (name.length < 2) errors.name = 'Your name must be at least 2 characters.';

    if (!email) errors.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Enter a valid email address, like name@example.com.';

    if (phone && !/^[0-9 +()-]{7,20}$/.test(phone)) errors.phone = 'Use 7 to 20 digits. You can include spaces, +, ( ) and -.';

    if (!message) errors.message = 'Enter a message.';
    else if (message.length < 10) errors.message = 'Your message must be at least 10 characters.';

    return { valid: Object.keys(errors).length === 0, errors };
  }

  if (typeof module !== 'undefined' && module.exports) { module.exports = { validateContact }; return; }

  const form = document.getElementById('contact-form');
  if (!form) return;
  const fields = ['name', 'email', 'phone', 'message'];
  const success = document.getElementById('form-success');
  const btn = document.getElementById('submit-btn');

  function show(errors) {
    fields.forEach((f) => {
      const input = document.getElementById(f);
      document.getElementById(f + '-error').textContent = errors[f] || '';
      input.setAttribute('aria-invalid', errors[f] ? 'true' : 'false');
    });
  }
  const values = () => Object.fromEntries(fields.map((f) => [f, document.getElementById(f).value]));

  // Re-check a field when the person leaves it
  fields.forEach((f) => document.getElementById(f).addEventListener('blur', () => {
    const { errors } = validateContact(values());
    const input = document.getElementById(f);
    document.getElementById(f + '-error').textContent = input.value || f !== 'phone' ? (errors[f] || '') : '';
    input.setAttribute('aria-invalid', errors[f] ? 'true' : 'false');
  }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    success.hidden = true;
    const { valid, errors } = validateContact(values());
    show(errors);
    if (!valid) { document.getElementById(fields.find((f) => errors[f])).focus(); return; }
    btn.disabled = true; btn.textContent = 'Sending...';
    setTimeout(() => {                       // simulated submission
      const name = values().name.trim();
      form.reset(); show({});
      success.textContent = 'Thanks, ' + name + '. Your message was received. This is a demo, so nobody will reply.';
      success.hidden = false; success.focus && success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      btn.disabled = false; btn.textContent = 'Send message';
    }, 800);
  });
})();
