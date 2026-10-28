/* Juniper Collective: menu, scroll reveal, and email-composing forms. No dependencies. */
(function () {
  'use strict';
  var EMAIL = 'inquiries@junipercollective.co';

  // ---- mobile menu ----
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('span').textContent = open ? 'Close' : 'Menu';
      toggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
    };
    toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); toggle.focus(); }
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  }

  // ---- reveal on scroll ----
  var items = document.querySelectorAll('.reveal');
  if (items.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // ---- forms: validate, then open the visitor's own email app. Nothing is sent or stored by this site. ----
  function emailOk(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

  // ?topic=Advisory etc. preselects the contact form's topic
  try {
    var wanted = new URLSearchParams(location.search).get('topic');
    var sel = document.querySelector('form[data-mailto] select[name="topic"]');
    if (wanted && sel) Array.prototype.forEach.call(sel.options, function (o) { if (o.text === wanted) sel.value = o.text; });
  } catch (e) {}

  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    var summary = form.querySelector('.error-summary');
    var status = form.querySelector('[data-status]');

    function check(field) {
      var input = field.querySelector('input, select, textarea');
      if (!input) return null;
      var v = (input.value || '').trim(), msg = '';
      if (input.required && !v) msg = input.getAttribute('data-err-required') || 'This field is needed before we can prepare your message.';
      else if (v && input.type === 'email' && !emailOk(v)) msg = input.getAttribute('data-err-email') || 'Please enter an email address in the form name@example.com.';
      field.classList.toggle('invalid', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      var err = field.querySelector('.error');
      if (err) err.textContent = msg;
      return msg ? { input: input, msg: msg, label: (field.querySelector('label') || {}).textContent || '' } : null;
    }

    form.querySelectorAll('.field').forEach(function (field) {
      var input = field.querySelector('input, select, textarea');
      if (!input) return;
      // Flag a badly formed value when the visitor leaves the field. Clear a message while they type, never on
      // blur: removing it then would move the submit button between mouse-down and mouse-up and swallow the click.
      input.addEventListener('blur', function () { if ((input.value || '').trim()) check(field); });
      input.addEventListener('input', function () { if (field.classList.contains('invalid')) check(field); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var problems = [];
      form.querySelectorAll('.field').forEach(function (field) { var p = check(field); if (p) problems.push(p); });
      if (summary) {
        summary.classList.toggle('show', problems.length > 0);
        var list = summary.querySelector('ul');
        if (list) {
          list.innerHTML = '';
          problems.forEach(function (p) {
            var li = document.createElement('li'), a = document.createElement('a');
            a.href = '#' + p.input.id; a.textContent = p.label.replace(/\s*\(.*\)\s*$/, '').trim() + ': ' + p.msg;
            a.addEventListener('click', function (ev) { ev.preventDefault(); p.input.focus(); });
            li.appendChild(a); list.appendChild(li);
          });
        }
        if (problems.length) { summary.focus(); return; }
      } else if (problems.length) { problems[0].input.focus(); return; }

      var lines = [];
      form.querySelectorAll('.field').forEach(function (field) {
        var input = field.querySelector('input, select, textarea'), label = field.querySelector('label');
        if (!input || !label) return;
        var v = (input.value || '').trim();
        if (v) lines.push(label.textContent.replace(/\s*\(.*\)\s*$/, '').trim() + ': ' + v);
      });
      var subject = form.getAttribute('data-subject') || 'Enquiry from the Juniper Collective site';
      var topic = form.querySelector('select[name="topic"]');
      if (topic && topic.value) subject += ' (' + topic.value + ')';
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n\n'));
      if (status) status.textContent = 'Your email app should now be open with the message ready to send. If nothing opened, write to ' + EMAIL + '.';
    });
  });
})();
