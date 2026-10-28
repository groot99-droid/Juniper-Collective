(function () {
  var intro = document.getElementById('intro');
  if (!intro) return;
  var root = document.documentElement;
  if (root.classList.contains('intro-seen')) { intro.remove(); return; }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { intro.remove(); return; }

  // ---- timing & look ----
  var SPEED = 1.5;            // whole intro plays at 1.5x
  var T_BLUE = 20.5;          // clip second at which the sky is completely blue: ripple + text start
  var TEXT_DELAY = 450;       // ms after the ripple starts until the first line appears
  var THANKS_MS = 4000, NAME_MS = 4000;
  var ZOOM_FROM = 2.0, ZOOM_TO = 1.06;  // opens on the tree, slowly pulls back
  var ORIGIN = [0.49, 0.50];            // the tree, as a fraction of the frame
  var RIPPLE_AT = [0.5, 0.47];          // ripple centre (where the type sits)

  var video = document.getElementById('intro-video');
  var canvas = document.getElementById('intro-gl');
  var thanks = document.getElementById('intro-thanks');
  var name = document.getElementById('intro-name');
  var stage = document.getElementById('intro-stage');
  var hint = document.getElementById('intro-sound-hint');
  var soundBtn = document.getElementById('intro-sound');
  var soundUse = document.getElementById('intro-sound-use');
  var soundLabel = document.getElementById('intro-sound-label');
  var timers = [], finished = false, userMuted = false;
  var rippleStart = 0, textStarted = false;

  var audio = new Audio('media/ambience.m4a');
  audio.preload = 'auto';
  audio.volume = 0.85;

  root.classList.add('intro-lock');
  // the video is fetched only when the intro will play (never for a returning visitor)
  ['mp4', 'webm'].forEach(function (t) {
    var src = document.createElement('source'); src.src = 'media/intro.' + t; src.type = 'video/' + t; video.appendChild(src);
  });
  video.preload = 'auto';
  video.load();
  video.defaultPlaybackRate = SPEED;
  video.playbackRate = SPEED;

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function ease(p) { return 0.5 - 0.5 * Math.cos(Math.PI * p); }   // in-out sine

  function setStage(s) {
    intro.classList.remove('s-thanks', 's-name');
    intro.classList.add('s-hold');
    if (s) intro.classList.add(s);
  }
  function showCard(card, ms) {
    card.classList.remove('off'); card.classList.add('on');
    later(function () { card.classList.remove('on'); card.classList.add('off'); }, ms - 900);
  }

  // ---- ripple + text start together ----
  function startText() {
    if (textStarted || finished) return;
    textStarted = true;
    rippleStart = performance.now();
    setStage('s-thanks');
    later(function () { showCard(thanks, THANKS_MS); }, TEXT_DELAY);
    later(function () { setStage('s-name'); showCard(name, NAME_MS); }, TEXT_DELAY + THANKS_MS);
    later(finish, TEXT_DELAY + THANKS_MS + NAME_MS);
  }

  // ---- WebGL: zoom + ripple over the video ----
  var gl = null, prog, U = {}, tex;
  function initGL() {
    try { gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' }); } catch (e) {}
    if (!gl) return false;
    function sh(type, src) {
      var o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o));
      return o;
    }
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER,
        'attribute vec2 p; varying vec2 v; void main(){ v = vec2(p.x*.5+.5, .5-p.y*.5); gl_Position = vec4(p,0.,1.); }'));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, [
        'precision mediump float;',
        'uniform sampler2D tex; uniform vec2 cover, origin, centre; uniform float zoom, aspect, rt;',
        'varying vec2 v;',
        'void main(){',
        '  vec2 uv = v; float shade = 0.;',
        '  if (rt >= 0.) {',
        '    vec2 q = (uv - centre) * vec2(aspect, 1.);',
        '    float d = length(q);',
        '    float x = d - rt * .6;',                                   // ring front travels outward
        '    float env = smoothstep(-.26, -.02, x) * (1. - smoothstep(0., .035, x));',
        '    float h = sin(x * 54.) * env * exp(-rt * .55);',           // trailing concentric rings, fading
        '    uv += (q / max(d, 1e-4)) * h * .013 * vec2(1. / aspect, 1.);',
        '    shade = h;',
        '  }',
        '  vec2 z = origin + (uv - origin) / zoom;',
        '  vec2 t = (z - .5) * cover + .5;',
        '  vec3 c = texture2D(tex, t).rgb + shade * .07;',             // light catching the water
        '  gl_FragColor = vec4(c, 1.);',
        '}'].join('\n')));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
      gl.useProgram(prog);
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['tex','cover','origin','centre','zoom','aspect','rt'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
      tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.uniform1i(U.tex, 0);
      gl.uniform2f(U.origin, ORIGIN[0], ORIGIN[1]);
      gl.uniform2f(U.centre, RIPPLE_AT[0], RIPPLE_AT[1]);
      return true;
    } catch (e) { gl = null; return false; }
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = Math.min(Math.round(window.innerWidth * dpr), 1920);
    var h = Math.round(w * window.innerHeight / window.innerWidth);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }

  var glReady = initGL();
  if (glReady) { resize(); window.addEventListener('resize', resize); }

  function frame(now) {
    if (finished) return;
    var dur = video.duration || 24.04, ct = video.currentTime || 0;
    var p = Math.min(1, ct / dur);
    var zoom = ZOOM_FROM + (ZOOM_TO - ZOOM_FROM) * ease(p);

    if (!textStarted && ct >= T_BLUE) startText();

    if (glReady) {
      if (video.readyState >= 2) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video); } catch (e) { glReady = false; }
        var va = (video.videoWidth || 16) / (video.videoHeight || 9), sa = window.innerWidth / window.innerHeight;
        gl.uniform2f(U.cover, sa > va ? 1 : sa / va, sa > va ? va / sa : 1);
        gl.uniform1f(U.zoom, zoom);
        gl.uniform1f(U.aspect, sa);
        var rt = textStarted ? (now - rippleStart) / 1000 : -1;
        gl.uniform1f(U.rt, rt > 6 ? -1 : rt);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        intro.classList.add('gl-on');
      }
    } else {
      video.style.transformOrigin = (ORIGIN[0] * 100) + '% ' + (ORIGIN[1] * 100) + '%';
      video.style.transform = 'scale(' + zoom.toFixed(4) + ')';
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  video.addEventListener('ended', startText);
  video.addEventListener('error', startText);
  video.querySelectorAll('source').forEach(function (s) { s.addEventListener('error', function () {
    if (video.networkState === 3) startText();
  }); });
  var pv = video.play();
  if (pv && pv.catch) pv.catch(function () { /* autoplay blocked: go to the text after a beat */ later(startText, 600); });

  // ---- sound ----
  function renderSound() {
    var on = !audio.paused && !audio.muted;
    soundUse.setAttribute('href', on ? '#i-volume' : '#i-volume-off');
    soundLabel.textContent = on ? 'Sound on' : 'Sound off';
    soundBtn.setAttribute('aria-pressed', String(on));
  }
  function startAudio() {
    if (finished || userMuted || !audio.paused) return;
    try { audio.currentTime = Math.min((video.currentTime || 0) / SPEED, 22); } catch (e) {}
    var pa = audio.play();
    if (pa && pa.then) {
      pa.then(function () { hint.hidden = true; renderSound(); })
        .catch(function () { hint.hidden = false; renderSound(); });
    }
  }

  function finish() {
    if (finished) return;
    finished = true;
    try { sessionStorage.setItem('jc-intro-seen', '1'); } catch (e) {}
    timers.forEach(clearTimeout);
    intro.classList.add('done');
    root.classList.remove('intro-lock');
    window.scrollTo(0, 0);
    // fade the music out with the overlay
    var t0 = performance.now(), v0 = audio.volume;
    (function fade(now) {
      var k = Math.min(1, (now - t0) / 2200);
      audio.volume = v0 * (1 - k);
      if (k < 1) requestAnimationFrame(fade); else { audio.pause(); video.pause(); }
    })(t0);
    setTimeout(function () { intro.remove(); }, 2600);
  }

  startAudio();
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, function once() {
      if (audio.paused && !userMuted) startAudio();
      window.removeEventListener(ev, once);
    }, { passive: true });
  });
  soundBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (audio.paused) { userMuted = false; audio.muted = false; startAudio(); }
    else { audio.muted = !audio.muted; userMuted = audio.muted; }
    hint.hidden = true; renderSound();
  });
  document.getElementById('intro-skip').addEventListener('click', finish);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') finish(); });

  // slight pointer parallax on the type
  intro.addEventListener('pointermove', function (e) {
    var x = e.clientX / window.innerWidth - .5, y = e.clientY / window.innerHeight - .5;
    stage.style.setProperty('--ry', (x * 5).toFixed(2) + 'deg');
    stage.style.setProperty('--rx', (-y * 4).toFixed(2) + 'deg');
  });
  renderSound();
})();
