/**
 * MaaMode Main Controller
 * Orchestrates UI interactions, Open-Source AI intent dispatching,
 * Skills tracking, and bilingual translations.
 */

class AppController {
  constructor() {
    this.currentLanguage = "mr"; // Default Marathi
    this.skills = {
      skill_photo: true,
      skill_uber: false,
      skill_document: false,
      skill_location: false,
      skill_money: false,
      skill_status: false,
      skill_message: false,
      skill_explain: true,
      skill_call: false
    };

    this.initStorage();
    this.initEventListeners();
    this.renderSkills();
  }

  initStorage() {
    const saved = localStorage.getItem("maamode_skills");
    if (saved) {
      try {
        this.skills = Object.assign(this.skills, JSON.parse(saved));
      } catch (e) {
        console.warn("Storage parse error", e);
      }
    }
  }

  saveSkills() {
    localStorage.setItem("maamode_skills", JSON.stringify(this.skills));
  }

  markSkillComplete(skillKey) {
    this.skills[skillKey] = true;
    this.saveSkills();
    this.renderSkills();
  }

  renderSkills() {
    const keys = Object.keys(this.skills);
    const completedCount = keys.filter(k => this.skills[k]).length;
    const percent = Math.round((completedCount / keys.length) * 100);

    const pill = document.getElementById("skillsProgressPill");
    if (pill) {
      pill.innerText = `${percent}% पूर्ण (Confident)`;
    }

    // Update row checks
    keys.forEach(k => {
      const row = document.getElementById(`row_${k}`);
      if (row) {
        if (this.skills[k]) {
          row.classList.add("done");
          const check = row.querySelector(".skill-check");
          if (check) check.innerText = "✓";
        }
      }
    });
  }

  initEventListeners() {
    // 1. Language Toggle
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const lang = btn.dataset.lang;
        this.setLanguage(lang);
      });
    });

    // 2. Giant Voice Mic Hero
    const micBtn = document.getElementById("heroMicBtn");
    const transcriptEl = document.getElementById("voiceTranscript");
    
    if (micBtn) {
      micBtn.addEventListener("click", () => {
        if (window.voiceEngine.isListening) {
          window.voiceEngine.stopListening();
        } else {
          window.voiceEngine.startListening(
            (transcript, isFinal) => {
              if (transcriptEl) {
                transcriptEl.style.display = "block";
                transcriptEl.innerText = `"${transcript}"`;
              }
              if (isFinal) {
                this.handleVoiceCommand(transcript);
              }
            },
            (status, error) => {
              if (status === "listening") {
                micBtn.classList.add("listening");
              } else {
                micBtn.classList.remove("listening");
              }
            }
          );
        }
      });
    }

    // 3. Action Grid Cards
    const bindTutorial = (id, tutName) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("click", () => {
          if (window.tutorialSandbox) {
            window.tutorialSandbox.startTutorial(tutName);
          }
        });
      }
    };

    bindTutorial("cardPhoto", "whatsapp_photo");
    bindTutorial("cardUber", "uber_booking");
    bindTutorial("cardDoc", "whatsapp_document");
    bindTutorial("cardLocation", "whatsapp_location");
    bindTutorial("cardMoney", "whatsapp_money");
    bindTutorial("cardStatus", "whatsapp_status");
    bindTutorial("cardMessage", "whatsapp_text");

    const cardExplain = document.getElementById("cardExplain");
    if (cardExplain) {
      cardExplain.addEventListener("click", () => {
        this.openExplainModal();
      });
    }

    const cardReply = document.getElementById("cardReply");
    if (cardReply) {
      cardReply.addEventListener("click", () => {
        this.openReplyModal();
      });
    }

    const cardCall = document.getElementById("cardCall");
    if (cardCall) {
      cardCall.addEventListener("click", () => {
        if (window.voiceEngine) {
          window.voiceEngine.speak("बाबांना फोन लावत आहे.");
        }
        alert("📞 बाबांना फोन लावत आहे... (+91 98220 XXXXX)");
        this.markSkillComplete("skill_call");
      });
    }

    const cardStuck = document.getElementById("cardStuck");
    if (cardStuck) {
      cardStuck.addEventListener("click", () => {
        this.openStuckModal();
      });
    }

    // 4. Open-Source AI Inspector Toggle
    const inspectTrigger = document.getElementById("aiInspectTrigger");
    const inspectPanel = document.getElementById("aiInspectPanel");
    if (inspectTrigger && inspectPanel) {
      inspectTrigger.addEventListener("click", () => {
        inspectPanel.classList.toggle("visible");
        this.updateInspectorDisplay();
      });
    }

    // 5. Sound toggle
    const soundToggle = document.getElementById("soundToggleBtn");
    if (soundToggle) {
      soundToggle.addEventListener("click", () => {
        if (window.tutorialSandbox) {
          window.tutorialSandbox.isMuted = !window.tutorialSandbox.isMuted;
          soundToggle.innerText = window.tutorialSandbox.isMuted ? "🔇" : "🔊";
        }
      });
    }
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
    const langCode = lang === "mr" ? "mr-IN" : (lang === "hi" ? "hi-IN" : "en-IN");
    if (window.voiceEngine) {
      window.voiceEngine.setLanguage(langCode);
      if (lang === "mr") {
        window.voiceEngine.speak("नमस्कार आई, मी तुमची कशी मदत करू?");
      } else if (lang === "hi") {
        window.voiceEngine.speak("नमस्ते माँ, मैं आपकी क्या मदद करूँ?");
      } else {
        window.voiceEngine.speak("Hello Mom, how can I help you today?");
      }
    }
  }

  handleVoiceCommand(transcript) {
    if (!window.maaAIEngine) return;

    const result = window.maaAIEngine.classifyIntent(transcript, this.currentLanguage);
    this.updateInspectorDisplay(result.log);

    const tutorialMap = {
      "TUTORIAL_WHATSAPP_PHOTO": "whatsapp_photo",
      "TUTORIAL_UBER_BOOKING": "uber_booking",
      "TUTORIAL_WHATSAPP_DOC": "whatsapp_document",
      "TUTORIAL_WHATSAPP_LOC": "whatsapp_location",
      "TUTORIAL_WHATSAPP_MONEY": "whatsapp_money",
      "TUTORIAL_WHATSAPP_STATUS": "whatsapp_status",
      "TUTORIAL_WHATSAPP_MSG": "whatsapp_text"
    };

    if (tutorialMap[result.intent]) {
      setTimeout(() => {
        window.tutorialSandbox.startTutorial(tutorialMap[result.intent]);
      }, 700);
    } else if (result.intent === "EXPLAIN_MESSAGE") {
      setTimeout(() => {
        this.openExplainModal();
      }, 700);
    } else if (result.intent === "HELP_REPLY") {
      setTimeout(() => {
        this.openReplyModal();
      }, 700);
    } else if (result.intent === "EMERGENCY_STUCK") {
      setTimeout(() => {
        this.openStuckModal();
      }, 700);
    }
  }

  updateInspectorDisplay(log = null) {
    const codeEl = document.getElementById("aiInspectCode");
    if (!codeEl) return;

    const activeLog = log || (window.maaAIEngine ? window.maaAIEngine.lastInferenceLog : null);
    if (activeLog) {
      codeEl.innerText = JSON.stringify(activeLog, null, 2);
    } else {
      codeEl.innerText = JSON.stringify({
        architecture: "Open-Weights Gemma 2 2B / Llama 3.2 1B",
        quantization: "INT4 on-device / LiteRT ready",
        privacyConstraint: "Strict Zero-Telemetry (Family Data Sealed)",
        allowedIntentRegistry: [
          "TUTORIAL_WHATSAPP_PHOTO",
          "TUTORIAL_WHATSAPP_DOC",
          "TUTORIAL_WHATSAPP_LOC",
          "TUTORIAL_WHATSAPP_MONEY",
          "TUTORIAL_WHATSAPP_STATUS",
          "TUTORIAL_WHATSAPP_MSG",
          "TUTORIAL_MAKE_CALL",
          "EXPLAIN_MESSAGE",
          "HELP_REPLY",
          "EMERGENCY_STUCK"
        ]
      }, null, 2);
    }
  }

  // Explain Modal Logic
  openExplainModal() {
    const modal = document.getElementById("explainModal");
    if (!modal) return;
    modal.classList.add("active");
    this.loadExplainData("doctor_appointment");
    if (window.voiceEngine) {
      window.voiceEngine.playChime("tap");
    }
  }

  closeExplainModal() {
    const modal = document.getElementById("explainModal");
    if (modal) modal.classList.remove("active");
    if (window.voiceEngine) window.voiceEngine.stopSpeaking();
  }

  loadExplainData(presetId) {
    const data = window.maaAIEngine.getExplanationById(presetId);
    if (!data) return;

    document.getElementById("explainSender").innerText = data.sender;
    document.getElementById("explainIncoming").innerText = `"${data.incoming}"`;
    document.getElementById("explainWhat").innerText = data.whatIsIt;
    document.getElementById("explainAction").innerText = data.actionRequired;
    document.getElementById("explainUrgency").innerText = data.urgency;

    const voiceBtn = document.getElementById("btnListenExplain");
    if (voiceBtn) {
      voiceBtn.onclick = () => {
        if (window.voiceEngine) {
          window.voiceEngine.playChime("listen");
          window.voiceEngine.speak(data.voiceText);
        }
      };
    }

    if (window.voiceEngine) {
      window.voiceEngine.speak(data.voiceText);
    }
  }

  // Reply Modal Logic
  openReplyModal() {
    const modal = document.getElementById("replyModal");
    if (!modal) return;
    modal.classList.add("active");

    this.loadReplyData("papa_photo_request");
    if (window.voiceEngine) {
      window.voiceEngine.playChime("tap");
      window.voiceEngine.speak("बाबांच्या मेसेजला काय उत्तर द्यायचे आहे?");
    }
  }

  closeReplyModal() {
    const modal = document.getElementById("replyModal");
    if (modal) modal.classList.remove("active");
    if (window.voiceEngine) window.voiceEngine.stopSpeaking();
  }

  loadReplyData(presetId) {
    const data = window.maaAIEngine.getReplyById(presetId);
    if (!data) return;

    document.getElementById("replySenderName").innerText = data.sender;
    document.getElementById("replyIncomingText").innerText = `"${data.incoming}"`;

    const container = document.getElementById("replyChoicesContainer");
    if (!container) return;
    container.innerHTML = "";

    data.options.forEach((opt, idx) => {
      const card = document.createElement("div");
      card.className = "reply-choice-card";
      card.innerHTML = `
        <div class="reply-choice-text">
          <h4>${opt.marathi}</h4>
          <p>${opt.english}</p>
        </div>
        <div class="card-badge" style="background:#D1FAE5; color:#065F46;">${opt.tag}</div>
      `;
      card.onclick = () => {
        this.openSafetyConfirm(opt.marathi, opt.english);
      };
      container.appendChild(card);
    });
  }

  // Giant Safety Confirmation (SEND vs CANCEL)
  openSafetyConfirm(marathiText, englishText) {
    const overlay = document.getElementById("safetyConfirmOverlay");
    const previewEl = document.getElementById("safetyPreviewText");
    if (!overlay || !previewEl) return;

    previewEl.innerHTML = `<strong>${marathiText}</strong><br><small style="color:#6B7280">${englishText}</small>`;
    overlay.classList.add("active");

    if (window.voiceEngine) {
      window.voiceEngine.playChime("gentle_alert");
      window.voiceEngine.speak(`हा मेसेज पाठवायचा आहे का? ${marathiText}`);
    }

    const sendBtn = document.getElementById("btnConfirmSend");
    const cancelBtn = document.getElementById("btnConfirmCancel");

    sendBtn.onclick = () => {
      overlay.classList.remove("active");
      if (window.voiceEngine) {
        window.voiceEngine.playChime("success");
        window.voiceEngine.speak("मेसेज पाठवला गेला आहे! शाब्बास आई.");
      }
      this.closeReplyModal();
      this.markSkillComplete("skill_message");
      alert(`✅ मेसेज पाठवला: "${marathiText}"`);
    };

    cancelBtn.onclick = () => {
      overlay.classList.remove("active");
      if (window.voiceEngine) {
        window.voiceEngine.playChime("tap");
        window.voiceEngine.speak("मेसेज रद्द केला आहे. काहीही पाठवले नाही.");
      }
    };
  }

  // "I'm Stuck" Modal
  openStuckModal() {
    const modal = document.getElementById("stuckModal");
    if (!modal) return;
    modal.classList.add("active");

    if (window.voiceEngine) {
      window.voiceEngine.playChime("gentle_alert");
      window.voiceEngine.speak("आई, घाबरू नका. सर्व ठीक आहे. आम्ही आहोत इथे.");
    }
  }

  closeStuckModal() {
    const modal = document.getElementById("stuckModal");
    if (modal) modal.classList.remove("active");
  }
}

// Initialize on DOM load
window.addEventListener("DOMContentLoaded", () => {
  window.appController = new AppController();
  if (window.tutorialSandbox) {
    window.tutorialSandbox.init();
  }
});


// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('[PWA] Service Worker registered:', reg.scope))
      .catch(err => console.warn('[PWA] Service Worker registration failed:', err));
  });
}

// Native PWA Installation Prompt Handler
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installBanner = document.getElementById('pwaInstallBanner');
  if (installBanner) {
    installBanner.style.display = 'flex';
  }
});

function triggerPwaInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
        const installBanner = document.getElementById('pwaInstallBanner');
        if (installBanner) installBanner.style.display = 'none';
      }
      deferredPrompt = null;
    });
  } else {
    alert('ॲप इन्स्टॉल करण्यासाठी: तुमच्या मोबाईल ब्राऊझरच्या वरील ३ टिंबांवर (⋮) दाबा आणि "Add to Home screen" / "Install App" निवडा!');
  }
}
