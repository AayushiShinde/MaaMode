package com.maamode.app

import android.content.Context
import android.speech.tts.TextToSpeech
import java.util.Locale

class VoiceCoach(context: Context) : TextToSpeech.OnInitListener {
    private var tts: TextToSpeech = TextToSpeech(context, this)
    private var isReady = false

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val mrLocale = Locale("mr", "IN")
            val result = tts.setLanguage(mrLocale)
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                // Fallback to Hindi
                tts.setLanguage(Locale("hi", "IN"))
            }
            tts.setSpeechRate(0.88f) // Calm, gentle pace for Mom
            tts.setPitch(1.08f)      // Warm and friendly
            isReady = true
        }
    }

    fun speak(text: String) {
        if (isReady) {
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "MaaModeUtterance")
        }
    }

    fun shutdown() {
        tts.stop()
        tts.shutdown()
    }
}
