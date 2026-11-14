const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const newsletterForm = document.querySelector(".newsletter-form");
const formNote = document.querySelector("#form-note");
const cupTapTarget = document.querySelector(".cup-tap-target");
const soundStatus = document.querySelector("#sound-status");
const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
let coffeeAudioContext;

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("is-open", !isExpanded);
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("is-open");
  }
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formNote.textContent =
    "This demo form isn't connected to a mailing list yet. Please email us if you'd like to hear from Coffee Day.";
  formNote.classList.add("form-note-message");
});

function playCupSound() {
  const now = coffeeAudioContext.currentTime;
  const output = coffeeAudioContext.createGain();
  output.gain.setValueAtTime(0.65, now);
  output.connect(coffeeAudioContext.destination);

  [610, 910].forEach((frequency, index) => {
    const oscillator = coffeeAudioContext.createOscillator();
    const volume = coffeeAudioContext.createGain();
    const start = now + index * 0.035;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.72, start + 0.14);
    volume.gain.setValueAtTime(0.0001, start);
    volume.gain.exponentialRampToValueAtTime(index === 0 ? 0.12 : 0.07, start + 0.008);
    volume.gain.exponentialRampToValueAtTime(0.0001, start + 0.19);
    oscillator.connect(volume);
    volume.connect(output);
    oscillator.start(start);
    oscillator.stop(start + 0.2);
  });

  const duration = 0.42;
  const buffer = coffeeAudioContext.createBuffer(
    1,
    Math.ceil(coffeeAudioContext.sampleRate * duration),
    coffeeAudioContext.sampleRate,
  );
  const samples = buffer.getChannelData(0);

  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = Math.random() * 2 - 1;
  }

  const sip = coffeeAudioContext.createBufferSource();
  const filter = coffeeAudioContext.createBiquadFilter();
  const volume = coffeeAudioContext.createGain();
  const sipStart = now + 0.09;

  sip.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1150, sipStart);
  filter.frequency.exponentialRampToValueAtTime(420, sipStart + duration);
  filter.Q.setValueAtTime(0.8, sipStart);
  volume.gain.setValueAtTime(0.0001, sipStart);
  volume.gain.exponentialRampToValueAtTime(0.055, sipStart + 0.08);
  volume.gain.exponentialRampToValueAtTime(0.0001, sipStart + duration);
  sip.connect(filter);
  filter.connect(volume);
  volume.connect(output);
  sip.start(sipStart);
  sip.stop(sipStart + duration);
}

cupTapTarget.addEventListener("click", async () => {
  if (!AudioContextConstructor) {
    soundStatus.textContent = "Audio isn't supported by this browser.";
    return;
  }

  if (!coffeeAudioContext) {
    coffeeAudioContext = new AudioContextConstructor();
  }

  if (coffeeAudioContext.state === "suspended") {
    try {
      await coffeeAudioContext.resume();
    } catch (error) {
      console.error("Could not start the coffee cup sound.", error);
      soundStatus.textContent = "The sound couldn't start. Check your browser audio settings and try again.";
      return;
    }
  }

  playCupSound();
  soundStatus.textContent = "A gentle cup clink and coffee sip sound played.";
  cupTapTarget.classList.add("is-sipping");
  window.setTimeout(() => cupTapTarget.classList.remove("is-sipping"), 220);
});

document.querySelector("#year").textContent = new Date().getFullYear();
