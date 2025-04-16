document.addEventListener("DOMContentLoaded", function () {
  const randomBtn = document.querySelector(".random-btn");
  randomBtn.addEventListener("click", () => {
    soundPads.activateRandomButtons();
  });
  class SoundPads {
    constructor() {
      this.pads = document.querySelectorAll(".pad");
      this.playBtn = document.querySelector(".play-btn");
      this.bpm = 17.7;
      this.playing = null;
      this.index = 0;
      this.tempoSlider = document.querySelector(".tempo__range");

      this.audioContext = null;
      this.audioBuffers = {};
    }

    initAudioContext() {
      if (this.audioContext === null) {
        this.audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
      }
    }

    activateRandomButtons() {
      const padsArray = Array.from(this.pads);
      const numberOfButtonsToActivate = Math.floor(
        Math.random() * padsArray.length
      );

      for (let i = 0; i < numberOfButtonsToActivate; i++) {
        const randomIndex = Math.floor(Math.random() * padsArray.length);
        const randomButton = padsArray.splice(randomIndex, 1)[0];
        randomButton.classList.add("active");
      }
    }

    async loadAudio(url, track) {
      try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        if (!this.audioContext) {
          this.initAudioContext();
        }
        const audioBuffer = await this.audioContext.decodeAudioData(buffer);
        this.audioBuffers[track] = audioBuffer;
      } catch (error) {
        console.error("Error decoding audio data:", error);
      }
    }

    activatePad() {
      this.classList.toggle("active");
    }

    rhythm() {
      const activePads = document.querySelectorAll(".pad.active");

      activePads.forEach((pad) => {
        const track = pad.getAttribute("data-track");
        this.playSound(track);
      });

      activePads.forEach((pad) => {
        pad.style.animation = `rhythm 0.3s ease-in-out`;
        pad.childNodes[0].style.animation = `playing .8s`;
        pad.addEventListener("animationend", () => {
          pad.style.animation = "";
          pad.childNodes[0].style.animation = "";
        });
      });
    }

    playSound(track) {
      const buffer = this.audioBuffers[track];
      if (!buffer) return;

      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start(0);
    }

    changeTempo(e) {
      const tempoValue = document.querySelector(".tempo__value");
      tempoValue.innerText = e.target.value;
    }

    setTempo(e) {
      this.bpm = e.target.value;
      this.play();
      this.play();
    }

    play() {
      if (!this.playing) {
        const interval = (60 / this.bpm) * 1000;
        this.playing = setInterval(() => {
          this.rhythm();
        }, interval);


        this.playBtn.style['animation-play-state'] = "running"

        console.log('Stop rotate');

      } else {
        clearInterval(this.playing);
        this.playing = null;
        console.log('Start rotate')

        this.playBtn.style['animation-play-state'] = "paused"


      }
    }
  }

  const soundPads = new SoundPads();

  const audioUrls = [
    "./media/eng_chords.mp3",
    "./media/eng_drums.mp3",
    "./media/eng_hihat.mp3",
    "./media/eng_percussion.mp3",
    "./media/ind_chords.mp3",
    "./media/ind_drums.mp3",
    "./media/ind_hihat.mp3",
    "./media/ind_percussion.mp3",
    "./media/arb_chords.mp3",
    "./media/arb_drums.mp3",
    "./media/arb_hihat.mp3",
    "./media/arb_percussion.mp3",
    "./media/alb_chords.mp3",
    "./media/alb_drums.mp3",
    "./media/alb_hihat.mp3",
    "./media/alb_percussion.mp3",
  ];
  const audioLoadPromises = audioUrls.map((url, index) =>
    soundPads.loadAudio(url, `sound${index + 1}`)
  );

  Promise.all(audioLoadPromises).then(() => {
    soundPads.playBtn.addEventListener("click", () => soundPads.play());
  });

  soundPads.pads.forEach((pad) => {
    pad.addEventListener("click", soundPads.activatePad);
  });

  soundPads.tempoSlider.addEventListener("input", (e) =>
    soundPads.changeTempo(e)
  );

  soundPads.tempoSlider.addEventListener("change", (e) =>
    soundPads.setTempo(e)
  );
});