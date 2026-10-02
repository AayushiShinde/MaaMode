/**
 * MaaMode Voice & Sound Engine
 * Supports:
 * 1. ElevenLabs Multilingual v2 ultra-realistic maternal voice (Best Use of ElevenLabs Track)
 * 2. On-device SpeechSynthesis fallback (Marathi, Hindi, English)
 * 3. Web Audio API synthesized acoustic chimes (100% offline & foolproof)
 */

class VoiceEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.recognition = null;
    this.isListening = false;
    this.currentLanguage = 'mr-IN'; // Default Marathi
    this.audioCtx = null;
    this.voices = [];
    this.useElevenLabs = true; // Enabled by default
    this.elevenLabsVoiceId = '21m00Tcm4TlvDq8ikWAM'; // Warm maternal voice
    this.activeAudio = null;

    this.initAudioContext();
    this.initVoices();
    this.initRecognition();
  }

  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  ensureAudioUnlocked() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  initVoices() {
    if (!this.synth) return;
    const updateVoices = () => {
      this.voices = this.synth.getVoices();
    };
    updateVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoices;
    }
  }

  setLanguage(langCode) {
    this.currentLanguage = langCode;
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
  }

  getBestVoice() {
    if (!this.voices || this.voices.length === 0) {
      this.initVoices();
    }
    let voice = this.voices.find(v => v.lang === this.currentLanguage);
    if (!voice) {
      const prefix = this.currentLanguage.split('-')[0];
      voice = this.voices.find(v => v.lang.startsWith(prefix));
    }
    if (!voice && this.currentLanguage.startsWith('mr')) {
      voice = this.voices.find(v => v.lang.startsWith('hi'));
    }
    return voice || null;
  }

  /**
   * Speak text: First tries ElevenLabs high-fidelity multilingual voice,
   * then falls back to browser native SpeechSynthesis.
   */
  async speak(text, onEndCallback = null) {
    this.ensureAudioUnlocked();
    this.stopSpeaking();

    // 1. Try ElevenLabs API if enabled
    if (this.useElevenLabs) {
      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text,
            voiceId: this.elevenLabsVoiceId
          })
        });

        if (response.ok && response.headers.get('content-type')?.includes('audio')) {
          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          this.activeAudio = new Audio(audioUrl);
          this.activeAudio.onended = () => {
            if (onEndCallback) onEndCallback();
          };
          this.activeAudio.play();
          return;
        }
      } catch (err) {
        console.warn('ElevenLabs speech fallback to native:', err);
      }
    }

    // 2. Browser Native TTS Fallback
    if (!this.synth) {
      if (onEndCallback) onEndCallback();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.currentLanguage;
    utterance.rate = 0.92;
    utterance.pitch = 1.05;

    const voice = this.getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (e) => {
      console.warn('TTS error:', e);
      if (onEndCallback) onEndCallback();
    };

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio = null;
    }
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Chime Sound Synthesizer via Web Audio API
  playChime(type = 'success') {
    this.ensureAudioUnlocked();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      if (type === 'success') {
        const notes = [659.25, 830.61, 987.77];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0, now + idx * 0.12);
          gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.12 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.55);
        });
      } else if (type === 'tap') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'gentle_alert') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(370, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'listen') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.18);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.32);
      }
    } catch (e) {
      console.warn('Audio chime playback error:', e);
    }
  }

  // Web Speech Recognition Initialization
  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = this.currentLanguage;
  }

  startListening(onResult, onStatusChange) {
    if (!this.recognition) {
      this.initRecognition();
      if (!this.recognition) {
        if (onStatusChange) onStatusChange('not_supported');
        return;
      }
    }

    this.playChime('listen');
    this.isListening = true;
    if (onStatusChange) onStatusChange('listening');

    this.recognition.lang = this.currentLanguage;

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      if (onResult) onResult(text, Boolean(finalTranscript));
    };

    this.recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      this.isListening = false;
      if (onStatusChange) onStatusChange('error', event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onStatusChange) onStatusChange('idle');
    };

    try {
      this.recognition.start();
    } catch (err) {
      console.warn('Recognition start exception:', err);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

window.voiceEngine = new VoiceEngine();
