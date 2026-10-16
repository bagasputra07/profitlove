/**
 * ============================================================================
 * Do You Love Me? - Romantic Bucin Interactive Engine
 * Features:
 * - Stage 0: Gaya Index (Interactive 3D Envelope & Heartfelt Love Letter)
 * - Stage 1: Smart Evasive "No" Button & Exponentially Growing "Yes" Button
 * - Stage 2: Celebration Mode (Bear Kiss, Confetti, 1.000.000% Love Meter, WhatsApp Share)
 * - Stage 3: Virtual Love Coupons (Interactive Redeemable Tickets with Confetti)
 * - Stage 4: 5 Reasons Why I Love You (Romantic Interactive Cards)
 * - Web Audio API Sound Synthesizer + Romantic Lofi Acoustic BGM Player
 * - Tap / Click Screen Floating Love Words & Hearts Spawner
 * - Customization Modal (Crush Name, Question, Love Letter, WA Number, Character Theme)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const stages = document.querySelectorAll('.stage');
  const navPills = document.querySelectorAll('.nav-pill');

  // Stages
  const letterStage = document.getElementById('letter-stage');
  const questionStage = document.getElementById('question-stage');
  const celebrationStage = document.getElementById('celebration-stage');
  const couponsStage = document.getElementById('coupons-stage');
  const reasonsStage = document.getElementById('reasons-stage');

  // Buttons & Interactions
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const questionText = document.getElementById('question-text');
  const bubbleTag = document.getElementById('bubble-tag');
  const dodgeBadge = document.getElementById('dodge-badge');
  const dodgeCountSpan = document.getElementById('dodge-count');
  const replayBtn = document.getElementById('replay-btn');
  const waShareBtn = document.getElementById('wa-share-btn');
  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');
  const musicBtn = document.getElementById('music-btn');
  const musicIcon = document.getElementById('music-icon');
  const heartParticlesContainer = document.getElementById('heart-particles');
  const loveMeterFill = document.querySelector('.love-meter-fill');

  // Envelope Elements
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const waxSeal = document.getElementById('wax-seal');
  const crushLetterName = document.getElementById('crush-letter-name');
  const letterBodyText = document.getElementById('letter-body-text');
  const senderSignatureName = document.getElementById('sender-signature-name');
  const openEnvelopeBtn = document.getElementById('open-envelope-btn');
  const refoldLetterBtn = document.getElementById('refold-letter-btn');
  const letterUnopenedActions = document.getElementById('letter-unopened-actions');
  const letterOpenedActions = document.getElementById('letter-opened-actions');

  // Stage Switch Buttons
  const goQuestionBtn = document.getElementById('go-question-btn');
  const goCouponsBtn = document.getElementById('go-coupons-btn');
  const goReasonsBtn = document.getElementById('go-reasons-btn');
  const couponToQuestionBtn = document.getElementById('coupon-to-question-btn');
  const reasonsToQuestionBtn = document.getElementById('reasons-to-question-btn');
  const celebrateCouponsBtn = document.getElementById('celebrate-coupons-btn');

  // Prank Modal Elements
  const prankModal = document.getElementById('prank-modal');
  const prankYesBtn = document.getElementById('prank-yes-btn');
  const fakeProgress = document.getElementById('fake-progress');

  // Settings Modal Elements
  const customizeBtn = document.getElementById('customize-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const saveSettingsBtn = document.getElementById('save-settings-btn');
  const crushNameInput = document.getElementById('crush-name-input');
  const questionInput = document.getElementById('question-input');
  const customLetterInput = document.getElementById('custom-letter-input');
  const waNumberInput = document.getElementById('wa-number-input');

  const stickerImg = document.getElementById('sticker-img');
  const celebrateImg = document.getElementById('celebrate-img');
  const characterThemeSelect = document.getElementById('character-theme-select');

  // --- State Variables ---
  const MAX_DODGES = 5;
  let dodgeCount = 0;
  let yesScale = 1.0;
  let soundEnabled = true;
  let musicEnabled = false;
  let audioCtx = null;
  let isNoTeleporting = false;
  let lastDodgeTime = 0;
  let bgmInterval = null;
  let bgmStep = 0;

  let savedThemeCheck = localStorage.getItem('characterTheme');
  if (!savedThemeCheck || savedThemeCheck === 'cat') {
    savedThemeCheck = 'bears';
    localStorage.setItem('characterTheme', 'bears');
  }
  let currentTheme = savedThemeCheck;

  // Curated, 100% aesthetic, wholesome, non-alay cute GIFs (Offline local files)
  const characterThemes = {
    bears: {
      initial: 'assets/bucin-hug.gif',
      initialAnim: 'anim-heart-cat',
      celebrate: 'assets/bucin-kiss-big.gif',
      celebrateAnim: 'anim-celebrate-cat',
      steps: [
        { text: "Yakin gamau? 😢 (1/5)", bubble: "Eeehh kok mau klik No sih?! 🥺", scale: 1.25, image: 'assets/bucin-hug.gif', anim: 'anim-curious-cat' },
        { text: "Pikir dulu dong... 🤔 (2/5)", bubble: "Tuh kan tombol Yes-nya makin gede! 🙈", scale: 1.55, image: 'assets/bucin-cuddle.gif', anim: 'anim-curious-cat' },
        { text: "Jahat bgt wkwk 😭 (3/5)", bubble: "Tombol No nya lari terus kaann! 😂", scale: 1.85, image: 'assets/bucin-sad.gif', anim: 'anim-crying-cat' },
        { text: "Tinggal 1x lagi nih! 🥺 (4/5)", bubble: "Ayo pencet Yes aja daripada capek! 💖", scale: 2.15, image: 'assets/bucin-sad.gif', anim: 'anim-crying-cat' },
        { text: "YES juga deh! 🥰", bubble: "Yeeay batas 5x nolak tercapai! Sekarang harus YES! 🎉❤️", scale: 2.45, image: 'assets/bucin-cuddle.gif', anim: 'anim-heart-cat' }
      ]
    },
    panda: {
      initial: 'assets/bucin-initial.gif',
      initialAnim: 'anim-heart-cat',
      celebrate: 'assets/bucin-kiss-big.gif',
      celebrateAnim: 'anim-celebrate-cat',
      steps: [
        { text: "Yakin gamau? 😢 (1/5)", bubble: "Eeehh kok mau klik No sih?! 🥺", scale: 1.25, image: 'assets/bucin-initial.gif', anim: 'anim-curious-cat' },
        { text: "Pikir dulu dong... 🤔 (2/5)", bubble: "Tuh kan tombol Yes-nya makin gede! 🙈", scale: 1.55, image: 'assets/bucin-cuddle.gif', anim: 'anim-curious-cat' },
        { text: "Jahat bgt wkwk 😭 (3/5)", bubble: "Tombol No nya lari terus kaann! 😂", scale: 1.85, image: 'assets/bucin-sad.gif', anim: 'anim-crying-cat' },
        { text: "Tinggal 1x lagi nih! 🥺 (4/5)", bubble: "Ayo pencet Yes aja daripada capek! 💖", scale: 2.15, image: 'assets/bucin-sad.gif', anim: 'anim-crying-cat' },
        { text: "YES juga deh! 🥰", bubble: "Yeeay batas 5x nolak tercapai! Sekarang harus YES! 🎉❤️", scale: 2.45, image: 'assets/bucin-hug.gif', anim: 'anim-heart-cat' }
      ]
    },
    cuddle: {
      initial: 'assets/bucin-kiss.gif',
      initialAnim: 'anim-heart-cat',
      celebrate: 'assets/bucin-kiss-big.gif',
      celebrateAnim: 'anim-celebrate-cat',
      steps: [
        { text: "Yakin gamau? 😢 (1/5)", bubble: "Eeehh kok mau klik No sih?! 🥺", scale: 1.25, image: 'assets/bucin-kiss.gif', anim: 'anim-curious-cat' },
        { text: "Pikir dulu dong... 🤔 (2/5)", bubble: "Tuh kan tombol Yes-nya makin gede! 🙈", scale: 1.55, image: 'assets/bucin-hug.gif', anim: 'anim-curious-cat' },
        { text: "Jahat bgt wkwk 😭 (3/5)", bubble: "Tombol No nya lari terus kaann! 😂", scale: 1.85, image: 'assets/bucin-sad.gif', anim: 'anim-crying-cat' },
        { text: "Tinggal 1x lagi nih! 🥺 (4/5)", bubble: "Ayo pencet Yes aja daripada capek! 💖", scale: 2.15, image: 'assets/bucin-sad.gif', anim: 'anim-crying-cat' },
        { text: "YES juga deh! 🥰", bubble: "Yeeay batas 5x nolak tercapai! Sekarang harus YES! 🎉❤️", scale: 2.45, image: 'assets/bucin-cuddle.gif', anim: 'anim-heart-cat' }
      ]
    }
  };
  characterThemes.cat = characterThemes.cuddle;

  // --- Smooth Cute Image and Animation Switcher ---
  function setStickerImage(src, animClass) {
    if (!stickerImg) return;
    stickerImg.classList.remove('anim-capoo-vibrate', 'anim-heart-cat', 'anim-curious-cat', 'anim-crying-cat', 'anim-celebrate-cat', 'jelly-pop');
    void stickerImg.offsetWidth;
    stickerImg.src = src;
    stickerImg.classList.add('jelly-pop');
    if (animClass) {
      stickerImg.classList.add(animClass);
    }
  }

  function applyTheme(themeKey) {
    if (!characterThemes[themeKey] || themeKey === 'cat') themeKey = 'bears';
    currentTheme = themeKey;
    const themeData = characterThemes[themeKey];
    if (stickerImg) {
      setStickerImage(themeData.initial, themeData.initialAnim);
    }
    if (celebrateImg) {
      celebrateImg.src = themeData.celebrate;
      celebrateImg.className = `sticker-img ${themeData.celebrateAnim || 'anim-celebrate-cat'}`;
    }
    if (characterThemeSelect) {
      characterThemeSelect.value = themeKey;
    }
  }

  // --- Stage Switcher & Navigation System ---
  function showStage(stageId) {
    stages.forEach(stage => stage.classList.remove('active'));
    navPills.forEach(pill => pill.classList.remove('active'));

    const targetStage = document.getElementById(stageId);
    if (targetStage) {
      targetStage.classList.add('active');
    }

    // Match nav pill
    const matchingPill = document.querySelector(`.nav-pill[data-target="${stageId}"]`);
    if (matchingPill) {
      matchingPill.classList.add('active');
    }

    // If moving away from question stage, reset No button position if in body
    if (stageId !== 'question-stage' && isNoTeleporting) {
      resetNoButton();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navPills.forEach(pill => {
    pill.addEventListener('click', () => {
      initAudio();
      playPurrSound();
      showStage(pill.dataset.target);
    });
  });

  // Action links between stages
  if (goQuestionBtn) goQuestionBtn.addEventListener('click', () => showStage('question-stage'));
  if (goCouponsBtn) goCouponsBtn.addEventListener('click', () => showStage('coupons-stage'));
  if (goReasonsBtn) goReasonsBtn.addEventListener('click', () => showStage('reasons-stage'));
  if (couponToQuestionBtn) couponToQuestionBtn.addEventListener('click', () => showStage('question-stage'));
  if (reasonsToQuestionBtn) reasonsToQuestionBtn.addEventListener('click', () => showStage('question-stage'));
  if (celebrateCouponsBtn) celebrateCouponsBtn.addEventListener('click', () => showStage('coupons-stage'));

  // --- Interactive Envelope Logic (Stage 0) ---
  function openEnvelope() {
    if (!envelopeWrapper || envelopeWrapper.classList.contains('opened')) return;
    initAudio();
    playEnvelopeSound();

    envelopeWrapper.classList.add('opened');
    const letterBubble = document.getElementById('letter-bubble-tag');
    if (letterBubble) letterBubble.textContent = 'Suratnya udah terbuka! Baca pelan-pelan yaa 🥰';

    if (letterUnopenedActions) letterUnopenedActions.style.display = 'none';
    if (letterOpenedActions) {
      letterOpenedActions.style.display = 'flex';
      letterOpenedActions.classList.remove('fade-in-up');
      void letterOpenedActions.offsetWidth;
      letterOpenedActions.classList.add('fade-in-up');
    }

    burstMiniEmojis(window.innerWidth / 2, window.innerHeight * 0.45);
  }

  function closeEnvelope() {
    if (!envelopeWrapper || !envelopeWrapper.classList.contains('opened')) return;
    initAudio();

    envelopeWrapper.classList.remove('opened');
    const letterBubble = document.getElementById('letter-bubble-tag');
    if (letterBubble) letterBubble.textContent = 'Ada surat rahasia untukmu.. 🥺👉👈';

    if (letterOpenedActions) letterOpenedActions.style.display = 'none';
    if (letterUnopenedActions) {
      letterUnopenedActions.style.display = 'flex';
      letterUnopenedActions.classList.remove('fade-in-up');
      void letterUnopenedActions.offsetWidth;
      letterUnopenedActions.classList.add('fade-in-up');
    }
  }

  function toggleEnvelope() {
    if (!envelopeWrapper) return;
    if (envelopeWrapper.classList.contains('opened')) {
      closeEnvelope();
    } else {
      openEnvelope();
    }
  }

  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', (e) => {
      // If already opened, don't close when clicking or scrolling inside the letter paper or buttons
      if (envelopeWrapper.classList.contains('opened')) {
        if (e.target.closest('.letter-paper') || e.target.closest('button') || e.target.closest('a')) {
          return;
        }
      }
      toggleEnvelope();
    });
  }

  if (waxSeal) {
    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }

  if (openEnvelopeBtn) {
    openEnvelopeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }

  if (refoldLetterBtn) {
    refoldLetterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeEnvelope();
    });
  }

  // --- Virtual Love Coupons Claiming Engine ---
  const claimBtns = document.querySelectorAll('.claim-coupon-btn');
  claimBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      initAudio();
      playVictorySound();

      const card = btn.closest('.coupon-card');
      if (card) {
        card.classList.add('claimed');
        btn.innerHTML = '<span class="claim-icon">✅</span> Terklaim! Siap Ditukarkan 💖';
        btn.disabled = true;

        const rect = btn.getBoundingClientRect();
        burstMiniEmojis(rect.left + rect.width / 2, rect.top + rect.height / 2);
        launchConfetti();
      }
    });
  });

  // --- Web Audio API Synthesizer (Zero External Dependencies) ---
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playEnvelopeSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    try {
      const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6 sweet arpeggio
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const now = audioCtx.currentTime + (i * 0.08);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.38);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  function playDodgeSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.24);
    } catch (e) {
      console.warn(e);
    }
  }

  function playVictorySound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const startTime = audioCtx.currentTime + (i * 0.12);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.42);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  function playPurrSound() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.22);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {
      console.warn(e);
    }
  }

  // --- Romantic Lofi Melody BGM Synthesizer ---
  // Gentle, warm chord progression: Cmaj7 - Am7 - Fmaj7 - G7
  const romanticChords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [196.00, 246.94, 293.66, 349.23]  // G7
  ];

  function playRomanticChordStep() {
    if (!musicEnabled || !audioCtx) return;
    try {
      const chord = romanticChords[bgmStep % romanticChords.length];
      const now = audioCtx.currentTime;

      // Play each note in the chord with subtle arpeggiation
      chord.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const noteStart = now + (idx * 0.18);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.045, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 1.8);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 1.85);
      });

      // High gentle music box chime
      const highChimes = [523.25, 659.25, 783.99, 987.77, 1046.50];
      const chimeFreq = highChimes[Math.floor(Math.random() * highChimes.length)];
      const chimeOsc = audioCtx.createOscillator();
      const chimeGain = audioCtx.createGain();
      const chimeStart = now + 0.72;

      chimeOsc.type = 'triangle';
      chimeOsc.frequency.setValueAtTime(chimeFreq, chimeStart);

      chimeGain.gain.setValueAtTime(0.03, chimeStart);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, chimeStart + 1.2);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(audioCtx.destination);

      chimeOsc.start(chimeStart);
      chimeOsc.stop(chimeStart + 1.25);

      bgmStep++;
    } catch (e) {
      console.warn(e);
    }
  }

  function startRomanticBgm() {
    initAudio();
    musicEnabled = true;
    if (musicBtn) {
      musicBtn.classList.add('playing');
      musicIcon.textContent = '🎶';
      musicBtn.querySelector('.btn-tooltip').textContent = 'Matikan Musik';
    }
    playRomanticChordStep();
    bgmInterval = setInterval(playRomanticChordStep, 2400);
  }

  function stopRomanticBgm() {
    musicEnabled = false;
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
    if (musicBtn) {
      musicBtn.classList.remove('playing');
      musicIcon.textContent = '🎵';
      musicBtn.querySelector('.btn-tooltip').textContent = 'Musik Romantis';
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      initAudio();
      if (musicEnabled) {
        stopRomanticBgm();
      } else {
        startRomanticBgm();
      }
    });
  }

  // Toggle Sound Button
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    soundBtn.querySelector('.btn-tooltip').textContent = soundEnabled ? 'Sound ON' : 'Sound OFF';
    initAudio();
  });

  // --- Floating Ambient Background Hearts ---
  function createHeartParticle() {
    if (!heartParticlesContainer) return;
    const heart = document.createElement('div');
    heart.className = 'floating-heart';

    const hearts = ['❤️', '💖', '💕', '💗', '💓', '✨', '🌸'];
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    const startX = Math.random() * 100;
    const duration = 6 + Math.random() * 8;
    const size = 16 + Math.random() * 18;

    heart.style.left = `${startX}vw`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${duration}s`;

    heartParticlesContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, duration * 1000);
  }

  setInterval(createHeartParticle, 900);
  for (let i = 0; i < 6; i++) {
    createHeartParticle();
  }

  // Mini emoji burst at coordinate
  function burstMiniEmojis(x, y) {
    const emojis = ['💖', '✨', '💕', '🥰', '🌸'];
    for (let i = 0; i < 5; i++) {
      const span = document.createElement('span');
      span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      span.style.position = 'fixed';
      span.style.left = `${x}px`;
      span.style.top = `${y}px`;
      span.style.fontSize = '22px';
      span.style.pointerEvents = 'none';
      span.style.zIndex = '1500';
      span.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
      document.body.appendChild(span);

      const angle = (Math.PI * 2 * i) / 5 + (Math.random() * 0.4);
      const dist = 40 + Math.random() * 40;
      const targetX = x + Math.cos(angle) * dist;
      const targetY = y + Math.sin(angle) * dist;

      requestAnimationFrame(() => {
        span.style.transform = `translate(${targetX - x}px, ${targetY - y}px) scale(0)`;
        span.style.opacity = '0';
      });

      setTimeout(() => span.remove(), 600);
    }
  }

  // --- Screen Tap Floating Love Words Spawner ---
  const cuteWords = [
    "Sayang 💖",
    "Cantik bgt ✨",
    "Love You 🌸",
    "Gemesss 🥰",
    "My Only One 💕",
    "Pelukk 🤗",
    "I Love You 🥺",
    "Kamu Manis 🧸",
    "Milikku ❤️",
    "Senyum Terus yaa ✨"
  ];

  document.addEventListener('click', (e) => {
    // Ignore interactive control clicks
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select') || e.target.closest('textarea') || e.target.closest('a') || e.target.closest('.modal-card')) {
      return;
    }

    const word = document.createElement('div');
    word.className = 'floating-love-word';
    word.textContent = cuteWords[Math.floor(Math.random() * cuteWords.length)];
    word.style.left = `${e.clientX}px`;
    word.style.top = `${e.clientY}px`;
    document.body.appendChild(word);

    setTimeout(() => word.remove(), 1600);
  });

  // Helper to reset the No button back into the arena
  function resetNoButton() {
    isNoTeleporting = false;
    noBtn.classList.remove('teleporting', 'btn-yes-secondary', 'wiggle');
    noBtn.style.left = '';
    noBtn.style.top = '';
    const btnIcon = noBtn.querySelector('.btn-icon');
    const btnText = noBtn.querySelector('.btn-text');
    if (btnIcon) btnIcon.textContent = '🥺';
    if (btnText) btnText.textContent = 'No';

    const btnArena = document.getElementById('btn-arena');
    if (btnArena && noBtn.parentElement !== btnArena) {
      btnArena.appendChild(noBtn);
    }

    if (stickerImg) {
      const themeData = characterThemes[currentTheme];
      setStickerImage(themeData.initial, themeData.initialAnim);
    }
  }

  // --- The Evasive "No" Button Engine ---
  function handleNoInteraction(e) {
    if (e) {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
    }

    const now = Date.now();
    if (now - lastDodgeTime < 280) return;
    lastDodgeTime = now;

    if (dodgeCount >= MAX_DODGES) {
      celebrateYes();
      return;
    }

    dodgeNoButton(e);
  }

  function dodgeNoButton(e) {
    initAudio();
    playDodgeSound();

    const rect = noBtn.getBoundingClientRect();
    const touch = e?.touches?.[0] || e?.changedTouches?.[0];
    const clickX = touch ? touch.clientX : (e?.clientX || rect.left + rect.width / 2);
    const clickY = touch ? touch.clientY : (e?.clientY || rect.top + rect.height / 2);
    burstMiniEmojis(clickX, clickY);

    dodgeCount++;
    dodgeBadge.style.display = 'inline-block';

    if (!isNoTeleporting) {
      isNoTeleporting = true;
      document.body.appendChild(noBtn);
      noBtn.classList.add('teleporting');
    }

    const stepsList = characterThemes[currentTheme].steps;
    const currentStep = stepsList[dodgeCount - 1] || stepsList[stepsList.length - 1];

    yesScale = currentStep.scale;
    yesBtn.style.transform = `scale(${yesScale})`;
    if (yesScale > 1.3) {
      yesBtn.classList.add('super-size');
    }

    if (currentStep.image && stickerImg) {
      setStickerImage(currentStep.image, currentStep.anim);
    }

    const btnTextSpan = noBtn.querySelector('.btn-text');
    const btnIconSpan = noBtn.querySelector('.btn-icon');

    if (dodgeCount >= MAX_DODGES) {
      btnTextSpan.textContent = "YES juga deh! 🥰";
      if (btnIconSpan) btnIconSpan.textContent = "💖";
      noBtn.classList.add('btn-yes-secondary');
      bubbleTag.textContent = currentStep.bubble;
      dodgeBadge.innerHTML = 'Usaha kabur: <span id="dodge-count">5</span> / 5x (Maksimal! Tombol No menyerah 😜)';
    } else {
      btnTextSpan.textContent = currentStep.text;
      bubbleTag.textContent = currentStep.bubble;
      dodgeBadge.innerHTML = `Usaha kabur: <span id="dodge-count">${dodgeCount}</span> / 5x 😜`;
    }

    bubbleTag.classList.remove('wiggle');
    void bubbleTag.offsetWidth;
    bubbleTag.classList.add('wiggle');

    // Safe coordinates calculation across Windows, Tablet, and HP screens
    const btnW = noBtn.offsetWidth || 120;
    const btnH = noBtn.offsetHeight || 48;
    const screenW = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    const screenH = window.visualViewport ? window.visualViewport.height : window.innerHeight;

    const isSmallScreen = screenW <= 480;
    const padX = isSmallScreen ? 12 : 20;
    const padTop = isSmallScreen ? 60 : 75;
    const padBottom = isSmallScreen ? 50 : 65;

    const minX = padX;
    const maxX = Math.max(minX, screenW - btnW - padX);
    const minY = padTop;
    const maxY = Math.max(minY, screenH - btnH - padBottom);

    let randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    let randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

    const yesRect = yesBtn.getBoundingClientRect();
    const buffer = isSmallScreen ? 18 : 28;
    if (
      randomX < yesRect.right + buffer &&
      randomX + btnW > yesRect.left - buffer &&
      randomY < yesRect.bottom + buffer &&
      randomY + btnH > yesRect.top - buffer
    ) {
      if (yesRect.top - minY > btnH + buffer) {
        randomY = Math.floor(Math.random() * (yesRect.top - buffer - minY)) + minY;
      } else {
        randomY = Math.min(maxY, Math.floor(yesRect.bottom + buffer + Math.random() * 40));
      }
    }

    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    noBtn.classList.add('wiggle');
    setTimeout(() => noBtn.classList.remove('wiggle'), 300);
  }

  // Cross-platform interaction handling (Windows mouse, hybrid laptops, iPad/Tab, and mobile phones)
  document.addEventListener('mousemove', (e) => {
    // Only check proximity when question stage is active and dodge count < MAX_DODGES
    if (questionStage.classList.contains('active') && dodgeCount < MAX_DODGES) {
      const rect = noBtn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      // On Windows / cursor devices, proximity dodge within 68px
      if (distance < 68) {
        handleNoInteraction(e);
      }
    }
  });

  noBtn.addEventListener('mouseenter', (e) => {
    if (dodgeCount < MAX_DODGES) {
      handleNoInteraction(e);
    }
  });

  // Mobile & Tablet touch / pointer interactions
  noBtn.addEventListener('pointerdown', handleNoInteraction);
  noBtn.addEventListener('touchstart', handleNoInteraction, { passive: false });
  noBtn.addEventListener('click', handleNoInteraction);

  // Auto-reclamp No button position on screen resize or device orientation rotation
  window.addEventListener('resize', () => {
    if (isNoTeleporting && noBtn.classList.contains('teleporting')) {
      const screenW = window.visualViewport ? window.visualViewport.width : window.innerWidth;
      const screenH = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const btnW = noBtn.offsetWidth || 120;
      const btnH = noBtn.offsetHeight || 48;
      const currentLeft = parseFloat(noBtn.style.left) || 20;
      const currentTop = parseFloat(noBtn.style.top) || 80;

      const clampedX = Math.min(Math.max(12, currentLeft), screenW - btnW - 12);
      const clampedY = Math.min(Math.max(60, currentTop), screenH - btnH - 55);

      noBtn.style.left = `${clampedX}px`;
      noBtn.style.top = `${clampedY}px`;
    }
  });

  // --- The System32 Easter Egg Prank ---
  function triggerSystem32Prank() {
    prankModal.style.display = 'flex';
    fakeProgress.style.width = '0%';

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      fakeProgress.style.width = `${progress}%`;
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  }

  prankYesBtn.addEventListener('click', () => {
    prankModal.style.display = 'none';
    celebrateYes();
  });

  // --- Celebration Phase (When YES is clicked) ---
  function celebrateYes() {
    initAudio();
    playVictorySound();

    // Auto-start romantic music if not already on
    if (!musicEnabled) {
      startRomanticBgm();
    }

    // Hide question & show celebration
    stages.forEach(s => s.classList.remove('active'));
    celebrationStage.classList.add('active');

    launchConfetti();

    setTimeout(() => {
      if (loveMeterFill) {
        loveMeterFill.style.width = '100%';
      }
    }, 300);

    resetNoButton();
  }

  yesBtn.addEventListener('click', celebrateYes);

  // Confetti Launcher with Fallback
  function launchConfetti() {
    if (typeof confetti === 'function') {
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio)
        }));
      }

      fire(0.25, { spread: 26, startVelocity: 55, colors: ['#ff4d79', '#ff2a5f', '#ffccd5'] });
      fire(0.2, { spread: 60, colors: ['#ff85a2', '#fbb1bd', '#ffffff'] });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } else {
      fallbackConfetti();
    }
  }

  function fallbackConfetti() {
    const colors = ['#ff4d79', '#ff2a5f', '#ffd166', '#06d6a0', '#118ab2'];
    for (let i = 0; i < 70; i++) {
      const piece = document.createElement('div');
      piece.style.position = 'fixed';
      piece.style.width = `${8 + Math.random() * 8}px`;
      piece.style.height = `${8 + Math.random() * 12}px`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.top = '-20px';
      piece.style.borderRadius = '3px';
      piece.style.zIndex = '9999';
      piece.style.transition = `transform ${2 + Math.random() * 2}s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 2s ease`;
      document.body.appendChild(piece);

      requestAnimationFrame(() => {
        piece.style.transform = `translate(${Math.random() * 100 - 50}px, ${window.innerHeight + 50}px) rotate(${Math.random() * 720}deg)`;
        piece.style.opacity = '0';
      });

      setTimeout(() => piece.remove(), 4000);
    }
  }

  // --- Replay Engine ---
  replayBtn.addEventListener('click', () => {
    dodgeCount = 0;
    yesScale = 1.0;
    yesBtn.style.transform = 'scale(1)';
    yesBtn.classList.remove('super-size');
    resetNoButton();
    bubbleTag.textContent = 'Ada pertanyaan penting nih.. 🥺👉👈';
    dodgeBadge.style.display = 'none';
    dodgeBadge.innerHTML = 'Usaha kabur: <span id="dodge-count">0</span> / 5x 😜';

    if (loveMeterFill) {
      loveMeterFill.style.width = '0%';
    }

    showStage('question-stage');
  });

  // --- Customization Settings (Local Storage) ---
  function loadSavedSettings() {
    const savedName = localStorage.getItem('crushName');
    const savedQuestion = localStorage.getItem('customQuestion');
    const savedLetter = localStorage.getItem('customLetter');
    const savedWa = localStorage.getItem('waNumber');

    if (savedName) {
      questionText.innerHTML = `Do you love me, ${savedName}? <span class="heart-pulse">❤️</span>`;
      if (crushLetterName) crushLetterName.textContent = savedName;
      crushNameInput.value = savedName;
    }
    if (savedQuestion) {
      questionText.innerHTML = `${savedQuestion} <span class="heart-pulse">❤️</span>`;
      questionInput.value = savedQuestion;
    }
    if (savedLetter) {
      if (letterBodyText) letterBodyText.textContent = savedLetter;
      if (customLetterInput) customLetterInput.value = savedLetter;
    }
    if (savedWa) {
      waNumberInput.value = savedWa;
      updateWaLink(savedWa);
    } else {
      updateWaLink('');
    }

    const savedTheme = localStorage.getItem('characterTheme');
    const finalTheme = (savedTheme && characterThemes[savedTheme]) ? savedTheme : 'bears';
    if (characterThemeSelect) {
      characterThemeSelect.value = finalTheme;
    }
    applyTheme(finalTheme);
  }

  function updateWaLink(waNumber) {
    const crush = localStorage.getItem('crushName') || 'kamu';
    const message = encodeURIComponent(`Aku udah klik YES! 🥰❤️ I love you too so much, ${crush}! 💕✨`);
    if (waNumber && waNumber.trim() !== '') {
      const cleanNumber = waNumber.replace(/[^0-9]/g, '');
      waShareBtn.href = `https://wa.me/${cleanNumber}?text=${message}`;
    } else {
      waShareBtn.href = `https://api.whatsapp.com/send?text=${message}`;
    }
  }

  customizeBtn.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
  });

  closeModalBtn.addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });

  saveSettingsBtn.addEventListener('click', () => {
    const name = crushNameInput.value.trim();
    const question = questionInput.value.trim();
    const letter = customLetterInput ? customLetterInput.value.trim() : '';
    const wa = waNumberInput.value.trim();
    const theme = characterThemeSelect ? characterThemeSelect.value : 'bears';

    if (name) {
      localStorage.setItem('crushName', name);
      questionText.innerHTML = `Do you love me, ${name}? <span class="heart-pulse">❤️</span>`;
      if (crushLetterName) crushLetterName.textContent = name;
    }
    if (question) {
      localStorage.setItem('customQuestion', question);
      questionText.innerHTML = `${question} <span class="heart-pulse">❤️</span>`;
    }
    if (letter) {
      localStorage.setItem('customLetter', letter);
      if (letterBodyText) letterBodyText.textContent = letter;
    }
    if (wa) {
      localStorage.setItem('waNumber', wa);
    }
    if (theme) {
      localStorage.setItem('characterTheme', theme);
      applyTheme(theme);
    }

    updateWaLink(wa);
    settingsModal.style.display = 'none';
  });

  // Petting sticker sound and micro-interactions
  const stickerContainers = document.querySelectorAll('.sticker-container');
  const petCuteTexts = [
    "Ihihi geli tauu! 🥰",
    "Peluk teruss jangan lepas! 💕",
    "Pencet YES dong ayoo! 🥺👉👈",
    "Gemesss bangett! 🐻💖",
    "Kamu lucu deh! ✨"
  ];

  stickerContainers.forEach((container) => {
    container.addEventListener('click', (e) => {
      playPurrSound();
      const rect = container.getBoundingClientRect();
      const touch = e?.touches?.[0] || e?.changedTouches?.[0];
      const clickX = touch ? touch.clientX : (e?.clientX || rect.left + rect.width / 2);
      const clickY = touch ? touch.clientY : (e?.clientY || rect.top + rect.height / 2);

      burstMiniEmojis(clickX, clickY);

      if (bubbleTag && questionStage.classList.contains('active')) {
        const randomText = petCuteTexts[Math.floor(Math.random() * petCuteTexts.length)];
        bubbleTag.textContent = randomText;
        bubbleTag.classList.remove('wiggle');
        void bubbleTag.offsetWidth;
        bubbleTag.classList.add('wiggle');
      }
    });
  });

  // Character heart emission
  function emitCharacterFloatingHeart() {
    const activeStage = document.querySelector('.stage.active');
    if (!activeStage) return;
    const currentContainer = activeStage.querySelector('.sticker-container');
    if (!currentContainer) return;

    const rect = currentContainer.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const span = document.createElement('span');
    const miniHearts = ['💖', '💕', '✨', '🌸'];
    span.textContent = miniHearts[Math.floor(Math.random() * miniHearts.length)];
    span.style.position = 'fixed';
    span.style.left = `${rect.left + rect.width * 0.3 + Math.random() * (rect.width * 0.4)}px`;
    span.style.top = `${rect.top + 20}px`;
    span.style.fontSize = `${14 + Math.random() * 8}px`;
    span.style.pointerEvents = 'none';
    span.style.zIndex = '30';
    span.style.opacity = '0.85';
    span.style.transition = 'all 1.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
    document.body.appendChild(span);

    requestAnimationFrame(() => {
      span.style.transform = `translate(${(Math.random() - 0.5) * 50}px, -65px) scale(1.2)`;
      span.style.opacity = '0';
    });

    setTimeout(() => span.remove(), 1800);
  }

  setInterval(emitCharacterFloatingHeart, 1600);

  // Close modals on clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.style.display = 'none';
    }
    if (e.target === prankModal) {
      prankModal.style.display = 'none';
    }
  });

  // Initialize saved settings on startup
  loadSavedSettings();
});
