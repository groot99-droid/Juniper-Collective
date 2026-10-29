/* Juniper Collective: diagnostic checklist. Ticks are kept in this browser only; nothing is sent. */
(function () {
  'use strict';
  var EMAIL = 'inquiries@junipercollective.co', KEY = 'jc-checklist';
  var form = document.getElementById('checklist'); if (!form) return;
  var boxes = Array.prototype.slice.call(form.querySelectorAll('input[type=checkbox]'));
  var count = document.getElementById('check-count'), note = document.getElementById('check-note'), mail = document.getElementById('check-mail');

  try { var saved = JSON.parse(localStorage.getItem(KEY) || '[]'); boxes.forEach(function (b) { b.checked = saved.indexOf(b.value) > -1; }); } catch (e) {}

  function update() {
    var on = boxes.filter(function (b) { return b.checked; });
    count.textContent = on.length + ' of ' + boxes.length + ' ticked';
    note.textContent = on.length === 0 ? 'Bring what you have.' : on.length < 6 ? 'A start. Gaps tell us where to look first.' : on.length < 13 ? 'A good base to work from.' : 'You are well prepared.';
    try { localStorage.setItem(KEY, JSON.stringify(on.map(function (b) { return b.value; }))); } catch (e) {}
    var body = 'I am requesting a diagnostic. What I have ready:\n\n' + (on.length ? on.map(function (b) { return '- ' + b.value; }).join('\n') : '(nothing ticked yet)') + '\n\nAbout my property:\n';
    mail.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Diagnostic request') + '&body=' + encodeURIComponent(body);
  }
  boxes.forEach(function (b) { b.addEventListener('change', update); });
  document.getElementById('check-reset').addEventListener('click', function () { boxes.forEach(function (b) { b.checked = false; }); update(); });
  update();
})();
