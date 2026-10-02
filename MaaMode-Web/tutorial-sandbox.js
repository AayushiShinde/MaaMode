/**
 * MaaMode Interactive Tutorial Sandbox ("SHOW ME" Mode)
 * Complete suite of smartphone tutorials tailored with love for Mom:
 * 1. WhatsApp Photo sharing (फोटो पाठवणे)
 * 2. Document & Aadhaar Card sharing (डॉक्युमेंट / आधार कार्ड)
 * 3. Live Location sharing for safety (लाईव्ह लोकेशन पाठवणे)
 * 4. Sending Money safely via UPI (यूपीआयने पैसे पाठवणे)
 * 5. Keeping WhatsApp Status with Caption (स्टेटस ठेवणे)
 * 6. Sending text messages (मेसेज पाठवणे)
 */

class TutorialSandbox {
  constructor() {
    this.currentTutorial = null;
    this.currentStepIndex = 0;
    this.overlayElement = null;
    this.isMuted = false;

    // Tutorials Definition
    this.tutorials = {
      whatsapp_photo: {
        id: "whatsapp_photo",
        title: "व्हॉट्सॲपवर फोटो पाठवणे",
        skillKey: "skill_photo",
        steps: [
          {
            screen: "home",
            targetSelector: "#appIconWhatsapp",
            instructionMarathi: "इथे व्हॉट्सॲपवर दाबा.",
            instructionEnglish: "Tap WhatsApp icon here.",
            hint: "हिरव्या रंगाच्या व्हॉट्सॲप चिन्हावर दाबा"
          },
          {
            screen: "wa_list",
            targetSelector: "#chatItemPapa",
            instructionMarathi: "आता बाबांच्या नावावर दाबा.",
            instructionEnglish: "Now tap on Papa's name.",
            hint: "पहिलेच बाबांचे नाव दिसेल तिथे दाबा"
          },
          {
            screen: "wa_chat",
            targetSelector: "#btnAttachmentClip",
            instructionMarathi: "आता खाली पिनच्या चिन्हावर दाबा.",
            instructionEnglish: "Tap the paperclip attachment icon below.",
            hint: "मेसेज टाईप करायच्या जागेजवळ पिनचे चिन्ह आहे"
          },
          {
            screen: "wa_chat_sheet",
            targetSelector: "#btnAttachGallery",
            instructionMarathi: "गॅलरीवर दाबा.",
            instructionEnglish: "Tap Gallery.",
            hint: "जांभळ्या रंगाच्या गॅलरी बटनावर दाबा"
          },
          {
            screen: "gallery",
            targetSelector: "#galleryPhotoItem1",
            instructionMarathi: "हा पूजेचा फोटो निवडा.",
            instructionEnglish: "Select this puja photo.",
            hint: "फोटोवर एकदा दाबा"
          },
          {
            screen: "photo_preview",
            targetSelector: "#btnSendFinalPhoto",
            instructionMarathi: "आता हिरव्या बटनावर दाबून पाठवून द्या.",
            instructionEnglish: "Now tap the green button to send.",
            hint: "उजव्या बाजूला खाली गोल हिरवे बटन आहे"
          },
          {
            screen: "wa_chat_sent",
            targetSelector: null,
            instructionMarathi: "शाब्बास आई! तुम्ही बाबांना फोटो पाठवला! ❤️",
            instructionEnglish: "Well done Mom! You sent the photo to Papa!",
            hint: "फोटो यशस्वीरीत्या पाठवला गेला आहे!"
          }
        ]
      },

      whatsapp_document: {
        id: "whatsapp_document",
        title: "डॉक्युमेंट / आधार कार्ड पाठवणे",
        skillKey: "skill_document",
        steps: [
          {
            screen: "home",
            targetSelector: "#appIconWhatsapp",
            instructionMarathi: "इथे व्हॉट्सॲपवर दाबा.",
            instructionEnglish: "Tap WhatsApp icon here.",
            hint: "हिरव्या चिन्हावर दाबा"
          },
          {
            screen: "wa_list",
            targetSelector: "#chatItemPapa",
            instructionMarathi: "बाबांच्या नावावर दाबा.",
            instructionEnglish: "Tap on Papa's name.",
            hint: "बाबांच्या चॅटवर दाबा"
          },
          {
            screen: "wa_chat",
            targetSelector: "#btnAttachmentClip",
            instructionMarathi: "खाली पिनच्या चिन्हावर दाबा.",
            instructionEnglish: "Tap the paperclip icon.",
            hint: "पिनच्या चिन्हावर दाबा"
          },
          {
            screen: "wa_chat_sheet",
            targetSelector: "#btnAttachDocument",
            instructionMarathi: "निळ्या रंगाच्या डॉक्युमेंटवर दाबा.",
            instructionEnglish: "Tap the blue Document icon.",
            hint: "डॉक्युमेंट (Document) चिन्हावर दाबा"
          },
          {
            screen: "document_picker",
            targetSelector: "#docItemAadhaar",
            instructionMarathi: "आधार कार्डच्या फाईलवर दाबा.",
            instructionEnglish: "Tap on Aadhaar_Card.pdf.",
            hint: "Aadhaar_Card_2026.pdf फाईलवर दाबा"
          },
          {
            screen: "document_picker",
            targetSelector: "#btnSendDocumentConfirm",
            instructionMarathi: "पाठवा (Send) बटनावर दाबा.",
            instructionEnglish: "Tap the green Send button.",
            hint: "हिरव्या बटनावर दाबून पाठवून द्या"
          },
          {
            screen: "wa_chat_doc_sent",
            targetSelector: null,
            instructionMarathi: "शाब्बास आई! आधार कार्ड डॉक्युमेंट सुरक्षितपणे पाठवले! 📄",
            instructionEnglish: "Great! Document sent safely.",
            hint: "डॉक्युमेंट पाठवले गेले आहे!"
          }
        ]
      },

      whatsapp_location: {
        id: "whatsapp_location",
        title: "लाईव्ह लोकेशन पाठवणे (सुरक्षा)",
        skillKey: "skill_location",
        steps: [
          {
            screen: "home",
            targetSelector: "#appIconWhatsapp",
            instructionMarathi: "इथे व्हॉट्सॲपवर दाबा.",
            instructionEnglish: "Tap WhatsApp icon here.",
            hint: "व्हॉट्सॲप उघडा"
          },
          {
            screen: "wa_list",
            targetSelector: "#chatItemPapa",
            instructionMarathi: "बाबांच्या नावावर दाबा.",
            instructionEnglish: "Tap on Papa's name.",
            hint: "बाबांच्या चॅटवर दाबा"
          },
          {
            screen: "wa_chat",
            targetSelector: "#btnAttachmentClip",
            instructionMarathi: "पिनच्या चिन्हावर दाबा.",
            instructionEnglish: "Tap the attachment clip.",
            hint: "पिनच्या चिन्हावर दाबा"
          },
          {
            screen: "wa_chat_sheet",
            targetSelector: "#btnAttachLocation",
            instructionMarathi: "हिरव्या लोकेशन चिन्हावर दाबा.",
            instructionEnglish: "Tap the green Location icon.",
            hint: "लोकेशन (Location) वर दाबा"
          },
          {
            screen: "location_picker",
            targetSelector: "#btnShareLiveLocation",
            instructionMarathi: "Share live location (१ तास) वर दाबा.",
            instructionEnglish: "Tap Share Live Location.",
            hint: "जिथे लाल दिवा चमकतोय तिथे दाबा"
          },
          {
            screen: "location_picker",
            targetSelector: "#btnSendLocationConfirm",
            instructionMarathi: "हिरव्या बाणावर दाबून लोकेशन पाठवून द्या.",
            instructionEnglish: "Tap the green send arrow.",
            hint: "आता तुमचे सध्याचे ठिकाण बाबांना दिसेल"
          },
          {
            screen: "wa_chat_loc_sent",
            targetSelector: null,
            instructionMarathi: "उत्तम आई! तुमचे थेट लोकेशन बाबांना मिळाले आहे. तुम्ही सुरक्षित आहात! 📍",
            instructionEnglish: "Wonderful! Live location shared.",
            hint: "लाईव्ह लोकेशन सुरू झाले!"
          }
        ]
      },

      whatsapp_money: {
        id: "whatsapp_money",
        title: "पैसे पाठवणे (UPI Payment)",
        skillKey: "skill_money",
        steps: [
          {
            screen: "home",
            targetSelector: "#appIconWhatsapp",
            instructionMarathi: "इथे व्हॉट्सॲपवर दाबा.",
            instructionEnglish: "Tap WhatsApp icon here.",
            hint: "व्हॉट्सॲप उघडा"
          },
          {
            screen: "wa_list",
            targetSelector: "#chatItemPapa",
            instructionMarathi: "बाबांच्या नावावर दाबा.",
            instructionEnglish: "Tap on Papa's name.",
            hint: "बाबांच्या चॅटवर दाबा"
          },
          {
            screen: "wa_chat",
            targetSelector: "#btnAttachmentClip",
            instructionMarathi: "पिनच्या चिन्हावर दाबा.",
            instructionEnglish: "Tap the attachment clip.",
            hint: "पिनच्या चिन्हावर दाबा"
          },
          {
            screen: "wa_chat_sheet",
            targetSelector: "#btnAttachPayment",
            instructionMarathi: "पैसे (Payment / ₹) वर दाबा.",
            instructionEnglish: "Tap Payment / Rupee icon.",
            hint: "रुपयाच्या चिन्हावर दाबा"
          },
          {
            screen: "payment_screen",
            targetSelector: "#btnPayConfirmStep",
            instructionMarathi: "रक्कम तपासा आणि खाली हिरव्या बटनावर दाबा. महत्त्वाचे: पैसे मिळण्यासाठी कधीही PIN टाकू नये!",
            instructionEnglish: "Check amount and tap Send. Never enter PIN to receive money!",
            hint: "पैसे पाठवतानाच PIN टाकावा लागतो"
          },
          {
            screen: "wa_chat_pay_sent",
            targetSelector: null,
            instructionMarathi: "शाब्बास आई! ₹२०० रुपये सुरक्षितपणे बाबांना पोहोचले! 💸",
            instructionEnglish: "Money sent successfully via UPI!",
            hint: "पैसे यशस्वीरीत्या पोहोचले!"
          }
        ]
      },

      whatsapp_status: {
        id: "whatsapp_status",
        title: "व्हॉट्सॲप स्टेटस व कॅपशन ठेवणे",
        skillKey: "skill_status",
        steps: [
          {
            screen: "home",
            targetSelector: "#appIconWhatsapp",
            instructionMarathi: "इथे व्हॉट्सॲपवर दाबा.",
            instructionEnglish: "Tap WhatsApp icon here.",
            hint: "व्हॉट्सॲप उघडा"
          },
          {
            screen: "wa_list",
            targetSelector: "#waTabStatus",
            instructionMarathi: "वर 'स्टेटस' (Status) टॅबवर दाबा.",
            instructionEnglish: "Tap the 'Status' tab at the top.",
            hint: "चॅट्सच्या बाजूला स्टेटस आहे"
          },
          {
            screen: "wa_status_tab",
            targetSelector: "#myStatusItem",
            instructionMarathi: "माझे स्टेटस (My Status) वर दाबा.",
            instructionEnglish: "Tap on My Status / Add status.",
            hint: "हिरव्या + चिन्हावर दाबा"
          },
          {
            screen: "gallery",
            targetSelector: "#galleryPhotoItem1",
            instructionMarathi: "स्टेटससाठी हा पूजेचा फोटो निवडा.",
            instructionEnglish: "Select the photo for your status.",
            hint: "फोटोवर दाबा"
          },
          {
            screen: "status_compose",
            targetSelector: "#statusCaptionInputBox",
            instructionMarathi: "कॅपशनच्या जागेवर दाबा. आम्ही 'शुभ सकाळ! 🌸' लिहिले आहे.",
            instructionEnglish: "Tap caption box to add greeting.",
            hint: "कॅपशन तपासा"
          },
          {
            screen: "status_compose",
            targetSelector: "#btnSendStatusFinal",
            instructionMarathi: "आता हिरव्या बटनावर दाबून स्टेटस ठेवा!",
            instructionEnglish: "Tap green button to post status.",
            hint: "हिरव्या बटनावर दाबा"
          },
          {
            screen: "wa_status_posted",
            targetSelector: null,
            instructionMarathi: "छान आई! तुमचे व्हॉट्सॲप स्टेटस सर्व नातेवाईकांना दिसेल! 🌸",
            instructionEnglish: "Status posted successfully!",
            hint: "स्टेटस ठेवले गेले आहे!"
          }
        ]
      },

      
      uber_booking: {
        id: "uber_booking",
        title: "उबरवरून रिक्षा बुक करणे",
        skillKey: "skill_uber",
        steps: [
          {
            screen: "home",
            targetSelector: "#appIconUber",
            instructionMarathi: "इथे काळ्या रंगाच्या उबर (Uber) ॲपवर दाबा.",
            instructionEnglish: "Tap the black Uber app icon here.",
            hint: "उबर (Uber) ॲप उघडा"
          },
          {
            screen: "uber_home",
            targetSelector: "#uberWhereToBox",
            instructionMarathi: "कुठे जायचे आहे (Where to) तिथे दाबा.",
            instructionEnglish: "Tap on 'Where to?' search box.",
            hint: "सर्च बारवर दाबा"
          },
          {
            screen: "uber_home",
            targetSelector: "#uberDestClinic",
            instructionMarathi: "दवाखान्यासाठी 'डॉ. कुलकर्णी क्लिनिक' वर दाबा.",
            instructionEnglish: "Tap on Dr. Kulkarni Clinic destination.",
            hint: "दवाखान्याच्या पत्त्यावर दाबा"
          },
          {
            screen: "uber_rides",
            targetSelector: "#uberRideAuto",
            instructionMarathi: "इथे रिक्षा (Uber Auto) निवडा. भाडे फक्त ६५ रुपये आहे.",
            instructionEnglish: "Select Uber Auto. Fare is ₹65.",
            hint: "रिक्षा (Auto) च्या पर्यायावर दाबा"
          },
          {
            screen: "uber_rides",
            targetSelector: "#btnConfirmUberAuto",
            instructionMarathi: "खाली काळ्या बटनावर दाबून रिक्षा पक्की करा.",
            instructionEnglish: "Tap Confirm Auto to book your ride.",
            hint: "रिक्षा बुक करा (Confirm Auto) वर दाबा"
          },
          {
            screen: "uber_confirmed",
            targetSelector: "#btnUberDoneStep",
            instructionMarathi: "शाब्बास! रिक्षा बुक झाली. गाडीचा नंबर तपासा आणि रिक्षात बसल्यावरच ड्रायव्हरला ७२९४ हा पिन सांगा!",
            instructionEnglish: "Auto booked! Check vehicle number and share PIN 7294 only after boarding.",
            hint: "गाडीचा नंबर व ४ अंकी पिन तपासा"
          },
          {
            screen: "uber_confirmed",
            targetSelector: null,
            instructionMarathi: "खूप छान आई! तुम्ही कोणाचीही मदत न घेता स्वतः रिक्षा बुक करायला शिकलात! 🛺",
            instructionEnglish: "Well done Mom! You booked an auto completely independently!",
            hint: "प्रवास सुरक्षित आणि सुखकर होवो!"
          }
        ]
      },
      whatsapp_text: {
        id: "whatsapp_text",
        title: "व्हॉट्सॲपवर मेसेज पाठवणे",
        skillKey: "skill_message",
        steps: [
          {
            screen: "home",
            targetSelector: "#appIconWhatsapp",
            instructionMarathi: "इथे व्हॉट्सॲपवर दाबा.",
            instructionEnglish: "Tap WhatsApp icon here.",
            hint: "हिरव्या चिन्हावर दाबा"
          },
          {
            screen: "wa_list",
            targetSelector: "#chatItemPapa",
            instructionMarathi: "बाबांच्या नावावर दाबा.",
            instructionEnglish: "Tap on Papa's name.",
            hint: "बाबांच्या नावावर दाबा"
          },
          {
            screen: "wa_chat",
            targetSelector: "#waInputBoxSample",
            instructionMarathi: "इथे मेसेज लिहिण्याच्या जागेवर दाबा.",
            instructionEnglish: "Tap on the message box.",
            hint: "जिथे मेसेज टाईप करतात तिथे दाबा"
          },
          {
            screen: "wa_chat",
            targetSelector: "#btnSendSampleText",
            instructionMarathi: "आता हिरव्या बाणावर दाबून मेसेज पाठवून द्या.",
            instructionEnglish: "Now tap the green arrow to send.",
            hint: "हिरव्या बटनावर दाबा"
          },
          {
            screen: "wa_chat_sent",
            targetSelector: null,
            instructionMarathi: "खूप छान! तुम्ही मेसेज पाठवायला शिकलात! ❤️",
            instructionEnglish: "Great job! Message sent successfully.",
            hint: "मेसेज पाठवला गेला आहे!"
          }
        ]
      }
    };
  }

  init() {
    this.overlayElement = document.getElementById("tutorialOverlay");
    this.attachMistakeDetector();
  }

  startTutorial(tutorialId = "whatsapp_photo") {
    const tut = this.tutorials[tutorialId] || this.tutorials.whatsapp_photo;
    this.currentTutorial = tut;
    this.currentStepIndex = 0;

    if (!this.overlayElement) {
      this.init();
    }

    this.overlayElement.classList.add("active");
    this.renderCurrentStep();
  }

  stopTutorial() {
    if (this.overlayElement) {
      this.overlayElement.classList.remove("active");
    }
    this.clearSpotlights();
    if (window.voiceEngine) {
      window.voiceEngine.stopSpeaking();
    }
  }

  renderCurrentStep() {
    const step = this.currentTutorial.steps[this.currentStepIndex];
    if (!step) return;

    const totalSteps = this.currentTutorial.steps.length;
    
    // Update step counter UI
    const stepCounterEl = document.getElementById("tutStepCounter");
    if (stepCounterEl) {
      stepCounterEl.innerText = `${this.currentTutorial.title} (${this.currentStepIndex + 1}/${totalSteps})`;
    }

    // Update voice coach text
    const coachTextEl = document.getElementById("coachInstructionText");
    const coachSubEl = document.getElementById("coachSubtext");
    if (coachTextEl) {
      coachTextEl.innerText = step.instructionMarathi;
    }
    if (coachSubEl) {
      coachSubEl.innerText = step.hint;
    }

    // Display correct simulator screen
    this.showSimulatorScreen(step.screen);

    // If final success step
    if (this.currentStepIndex === totalSteps - 1) {
      this.clearSpotlights();
      this.triggerCelebration(step.instructionMarathi);
      return;
    }

    // Apply spotlight focus ring
    this.clearSpotlights();
    if (step.targetSelector) {
      setTimeout(() => {
        const targetEl = document.querySelector(step.targetSelector);
        if (targetEl) {
          targetEl.classList.add("spotlight-active");
          targetEl.onclick = (e) => {
            e.stopPropagation();
            this.handleTargetTapped();
          };
        }
      }, 60);
    }

    // Voice Prompt
    if (window.voiceEngine && !this.isMuted) {
      window.voiceEngine.playChime("tap");
      window.voiceEngine.speak(step.instructionMarathi);
    }
  }

  showSimulatorScreen(screenName) {
    const screens = [
      "simScreenHome",
      "simScreenWaList",
      "simScreenWaChat",
      "simScreenGallery",
      "simScreenPhotoPreview",
      "simScreenDocument",
      "simScreenLocation",
      "simScreenPayment",
      "simScreenStatusTab",
      "simScreenStatusCompose"
    ];

    screens.forEach(s => {
      const el = document.getElementById(s);
      if (el) el.style.display = "none";
    });

    const attachmentSheet = document.getElementById("waAttachmentSheet");
    if (attachmentSheet) attachmentSheet.style.display = "none";

    const sentBubble = document.getElementById("waSentPhotoBubble");
    if (sentBubble) sentBubble.style.display = "none";

    const sentDocBubble = document.getElementById("waSentDocBubble");
    if (sentDocBubble) sentDocBubble.style.display = "none";

    const sentLocBubble = document.getElementById("waSentLocBubble");
    if (sentLocBubble) sentLocBubble.style.display = "none";

    const sentPayBubble = document.getElementById("waSentPayBubble");
    if (sentPayBubble) sentPayBubble.style.display = "none";

    
    const uberScreens = ["simScreenUberHome", "simScreenUberRides", "simScreenUberConfirmed"];
    uberScreens.forEach(s => {
      const el = document.getElementById(s);
      if (el) el.style.display = "none";
    });

    if (screenName === "uber_home") {
      document.getElementById("simScreenUberHome").style.display = "flex";
    } else if (screenName === "uber_rides") {
      document.getElementById("simScreenUberRides").style.display = "flex";
    } else if (screenName === "uber_confirmed") {
      document.getElementById("simScreenUberConfirmed").style.display = "flex";
    } else if (screenName === "home") {
      document.getElementById("simScreenHome").style.display = "flex";
    } else if (screenName === "wa_list") {
      document.getElementById("simScreenWaList").style.display = "flex";
      this.setWaTabActive("chats");
    } else if (screenName === "wa_status_tab" || screenName === "wa_status_posted") {
      document.getElementById("simScreenStatusTab").style.display = "flex";
      this.setWaTabActive("status");
    } else if (screenName === "status_compose") {
      document.getElementById("simScreenStatusCompose").style.display = "flex";
    } else if (screenName === "wa_chat") {
      document.getElementById("simScreenWaChat").style.display = "flex";
    } else if (screenName === "wa_chat_sheet") {
      document.getElementById("simScreenWaChat").style.display = "flex";
      if (attachmentSheet) attachmentSheet.style.display = "grid";
    } else if (screenName === "gallery") {
      document.getElementById("simScreenGallery").style.display = "flex";
    } else if (screenName === "photo_preview") {
      document.getElementById("simScreenPhotoPreview").style.display = "flex";
    } else if (screenName === "document_picker") {
      document.getElementById("simScreenDocument").style.display = "flex";
    } else if (screenName === "location_picker") {
      document.getElementById("simScreenLocation").style.display = "flex";
    } else if (screenName === "payment_screen") {
      document.getElementById("simScreenPayment").style.display = "flex";
    } else if (screenName === "wa_chat_sent") {
      document.getElementById("simScreenWaChat").style.display = "flex";
      if (sentBubble) sentBubble.style.display = "block";
    } else if (screenName === "wa_chat_doc_sent") {
      document.getElementById("simScreenWaChat").style.display = "flex";
      if (sentDocBubble) sentDocBubble.style.display = "block";
    } else if (screenName === "wa_chat_loc_sent") {
      document.getElementById("simScreenWaChat").style.display = "flex";
      if (sentLocBubble) sentLocBubble.style.display = "block";
    } else if (screenName === "wa_chat_pay_sent") {
      document.getElementById("simScreenWaChat").style.display = "flex";
      if (sentPayBubble) sentPayBubble.style.display = "block";
    }
  }

  setWaTabActive(tabName) {
    const tabChats = document.getElementById("waTabChats");
    const tabStatus = document.getElementById("waTabStatus");
    if (tabChats && tabStatus) {
      if (tabName === "status") {
        tabChats.classList.remove("active");
        tabStatus.classList.add("active");
      } else {
        tabStatus.classList.remove("active");
        tabChats.classList.add("active");
      }
    }
  }

  handleTargetTapped() {
    if (window.voiceEngine) {
      window.voiceEngine.playChime("success");
    }
    this.currentStepIndex++;
    this.renderCurrentStep();
  }

  clearSpotlights() {
    document.querySelectorAll(".spotlight-active").forEach(el => {
      el.classList.remove("spotlight-active");
    });
  }

  attachMistakeDetector() {
    const simFrame = document.getElementById("phoneSimulatorFrame");
    if (!simFrame) return;

    simFrame.addEventListener("click", (e) => {
      if (e.target.closest(".spotlight-active")) return;
      this.triggerMistakeGuidance();
    });
  }

  triggerMistakeGuidance() {
    const toast = document.getElementById("mistakeToast");
    if (!toast) return;

    toast.style.display = "flex";
    if (window.voiceEngine) {
      window.voiceEngine.playChime("gentle_alert");
      window.voiceEngine.speak("नाही आई, काळजी करू नका. जिथे पिवळा गोल चमकतोय तिथे दाबा.");
    }

    setTimeout(() => {
      toast.style.display = "none";
    }, 2800);
  }

  repeatCurrentVoice() {
    const step = this.currentTutorial.steps[this.currentStepIndex];
    if (step && window.voiceEngine) {
      window.voiceEngine.speak(step.instructionMarathi);
    }
  }

  triggerCelebration(successMsg) {
    if (window.voiceEngine) {
      window.voiceEngine.playChime("success");
      window.voiceEngine.speak(successMsg);
    }

    const modal = document.getElementById("celebrationModal");
    const descEl = document.querySelector(".celebration-desc");
    if (descEl) {
      descEl.innerText = successMsg;
    }
    if (modal) {
      modal.style.display = "flex";
    }

    if (this.currentTutorial.skillKey && window.appController) {
      window.appController.markSkillComplete(this.currentTutorial.skillKey);
    }
  }

  closeCelebration() {
    const modal = document.getElementById("celebrationModal");
    if (modal) {
      modal.style.display = "none";
    }
    this.stopTutorial();
  }
}

window.tutorialSandbox = new TutorialSandbox();
