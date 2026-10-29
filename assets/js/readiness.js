/* Juniper Collective: readiness check. Scores in the browser; stores nothing, sends nothing. */
(function () {
  'use strict';
  var EMAIL = 'inquiries@junipercollective.co';
  var Q = [
    { id: 'stage', t: 'Where is the property today?', area: null, o: ['A concept, nothing secured', 'Land or a building secured, nothing designed', 'In design or under construction', 'Open and underperforming', 'Open and growing'] },
    { id: 'who', t: 'Can you say who the place is for, in one sentence?', area: 'Vision', o: ['Yes, clearly', 'Roughly', 'Not yet'] },
    { id: 'money', t: 'Is there a written budget that includes opening costs and the first year of running it?', area: 'Money', o: ['Yes', 'Partly', 'No'] },
    { id: 'price', t: 'Does your pricing follow from who you want to welcome and what the place must earn?', area: 'Pricing', o: ['Yes, it is modeled', 'It is a guess from comparable places', 'Not decided'] },
    { id: 'team', t: 'Do your designer, builder and marketer all work from the same written plan?', area: 'Alignment', o: ['Yes', 'Mostly, in conversation', 'No, each works alone'] },
    { id: 'demand', t: 'Have you begun building an audience or bookings before opening?', area: 'Demand', o: ['Yes, a list or first bookings', 'A little, social posts or word of mouth', 'Not yet'] },
    { id: 'ops', t: 'Do you know how an ordinary day will run: staffing, kitchen, housekeeping, guest contact?', area: 'Operations', o: ['Yes, written down', 'In my head', 'Not yet'] },
    { id: 'count', t: 'How many properties are you developing or running?', area: null, o: ['One', 'Two or three', 'Four or more'] }
  ];
  var form = document.getElementById('quiz'); if (!form) return;
  var host = document.getElementById('quiz-qs'), err = document.getElementById('quiz-error'), result = document.getElementById('result');
  var ans = {};

  Q.forEach(function (q, qi) {
    var fs = document.createElement('fieldset'); fs.className = 'q';
    var lg = document.createElement('legend'); lg.textContent = (qi + 1) + '. ' + q.t; fs.appendChild(lg);
    q.o.forEach(function (label, oi) {
      var l = document.createElement('label'); l.className = 'choice';
      var i = document.createElement('input'); i.type = 'radio'; i.name = q.id; i.value = oi;
      i.addEventListener('change', function () { ans[q.id] = oi; err.hidden = true; });
      var s = document.createElement('span'); s.textContent = label;
      l.appendChild(i); l.appendChild(s); fs.appendChild(l);
    });
    host.appendChild(fs);
  });

  function points(id) { var v = ans[id]; return v == null ? 0 : 2 - v; }   // first option scores 2, last scores 0

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var missing = Q.filter(function (q) { return ans[q.id] == null; });
    if (missing.length) {
      err.hidden = false;
      var first = form.querySelector('input[name="' + missing[0].id + '"]'); if (first) first.focus();
      return;
    }
    var scored = Q.filter(function (q) { return q.area; });
    var total = scored.reduce(function (n, q) { return n + points(q.id); }, 0), max = scored.length * 2;
    var pct = Math.round(100 * total / max);
    var stage = ans.stage, multi = ans.count > 0;

    var band, lede, fit;
    if (pct < 40) {
      band = 'Start from the ground';
      lede = 'Much of the plan is still open. That is the cheapest moment to decide it, before money is committed to the wrong things.';
      fit = 'A diagnostic first, then a Project. It sets the plan, the pricing and the order of work before the first large spend.';
    } else if (pct < 75) {
      band = 'Partly planned';
      lede = 'You have real pieces in place. The risk is the gaps between them: parts that are each sound and do not yet fit together.';
      fit = 'A diagnostic to find where the pieces disagree. From there, Advisory if you mostly need a second opinion, or a Project if the gaps are wide.';
    } else {
      band = 'Mostly there';
      lede = 'Your plan is in good shape. What helps now is a sharp outside eye on the few decisions that still carry weight.';
      fit = 'Advisory: regular reviews and direct critiques of the decisions ahead, with a Project available if something larger opens up.';
    }
    if (multi && stage >= 3) fit = 'You run or are growing more than one property that is already open. A Retainer fits best, to keep the intent consistent across them. A diagnostic is still the first step.';
    else if (multi) fit += ' With more than one property, ask about the Retainer once the first is open.';
    if (stage === 3 && !multi) fit = 'The place is open and underperforming, which is exactly what a diagnostic reads. We would start there, then decide between Advisory and a Project.';

    document.getElementById('result-h').textContent = band;
    document.getElementById('result-lede').textContent = lede;
    document.getElementById('meter-fill').style.width = pct + '%';
    document.getElementById('result-score').textContent = 'Readiness: ' + pct + ' out of 100. A rough guide to how settled the plan is, not a grade.';
    var ul = document.getElementById('result-areas'); ul.innerHTML = '';
    var lines = [];
    var words = ['Settled', 'Partly settled', 'Open'];
    scored.forEach(function (q) {
      var li = document.createElement('li'), v = 2 - points(q.id);
      li.className = 'a' + v;
      var b = document.createElement('b'); b.textContent = q.area;
      var sp = document.createElement('span'); sp.textContent = words[v];
      li.appendChild(b); li.appendChild(sp); ul.appendChild(li);
      lines.push(q.area + ': ' + words[v]);
    });
    document.getElementById('result-fit').textContent = fit;

    var body = 'Readiness check result: ' + band + ' (' + pct + '/100)\n\n' + lines.join('\n') +
      '\n\nStage: ' + Q[0].o[ans.stage] + '\nProperties: ' + Q[7].o[ans.count] +
      '\n\nWhere we would start: ' + fit + '\n\nAbout my property:\n';
    document.getElementById('result-mail').href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Readiness check: ' + band) + '&body=' + encodeURIComponent(body);

    form.hidden = true; result.hidden = false; result.focus();
    result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });

  document.getElementById('quiz-reset').addEventListener('click', function () {
    ans = {}; form.reset(); result.hidden = true; form.hidden = false; err.hidden = true;
    window.scrollTo(0, 0);
  });
})();
