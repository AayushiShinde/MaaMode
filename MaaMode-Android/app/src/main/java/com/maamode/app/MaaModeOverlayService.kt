package com.maamode.app

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Rect
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.WindowManager
import android.widget.FrameLayout
import android.widget.TextView
import androidx.core.app.NotificationCompat

class MaaModeOverlayService : Service() {

    private lateinit var windowManager: WindowManager
    private var spotlightView: FrameLayout? = null
    private var floatingBubbleView: FrameLayout? = null
    private lateinit var voiceCoach: VoiceCoach

    companion object {
        const val ACTION_SHOW_SPOTLIGHT = "com.maamode.SHOW_SPOTLIGHT"
        const val ACTION_HIDE_SPOTLIGHT = "com.maamode.HIDE_SPOTLIGHT"
        const val EXTRA_BOUNDS = "extra_bounds"
        const val EXTRA_INSTRUCTION = "extra_instruction"
    }

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        voiceCoach = VoiceCoach(this)
        startForegroundServiceNotification()
        createFloatingBubble()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_SHOW_SPOTLIGHT -> {
                val bounds: Rect? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    intent.getParcelableExtra(EXTRA_BOUNDS, Rect::class.java)
                } else {
                    @Suppress("DEPRECATION")
                    intent.getParcelableExtra(EXTRA_BOUNDS)
                }
                val instruction = intent.getStringExtra(EXTRA_INSTRUCTION) ?: "इथे दाबा आई"
                if (bounds != null) {
                    showSpotlightOverRect(bounds, instruction)
                }
            }
            ACTION_HIDE_SPOTLIGHT -> {
                hideSpotlight()
            }
        }
        return START_STICKY
    }

    private fun startForegroundServiceNotification() {
        val channelId = "maamode_overlay_channel"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "MaaMode Active Guidance",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }

        val notification: Notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("MaaMode सक्रिय आहे")
            .setContentText("आईसाठी स्क्रीनवर मार्गदर्शन सुरू आहे ❤️")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .build()

        startForeground(1001, notification)
    }

    private fun createFloatingBubble() {
        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = 20
            y = 200
        }

        floatingBubbleView = FrameLayout(this).apply {
            background = GradientDrawable().apply {
                shape = GradientDrawable.OVAL
                setColor(Color.parseColor("#D97706"))
                setStroke(4, Color.WHITE)
            }
            setPadding(24, 24, 24, 24)
            val icon = TextView(context).apply {
                text = "🧕"
                textSize = 28f
            }
            addView(icon)
        }

        windowManager.addView(floatingBubbleView, params)
    }

    private fun showSpotlightOverRect(bounds: Rect, instruction: String) {
        hideSpotlight()

        // Critical: FLAG_NOT_TOUCHABLE allows Mom's finger touch to pass directly
        // through the glowing circle and click the real WhatsApp / Uber button underneath!
        val params = WindowManager.LayoutParams(
            bounds.width() + 40,
            bounds.height() + 40,
            bounds.left - 20,
            bounds.top - 20,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE or
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
        }

        spotlightView = FrameLayout(this).apply {
            background = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                cornerRadius = 24f
                setColor(Color.parseColor("#1BF59E0B")) // Subtle warm glow
                setStroke(8, Color.parseColor("#F59E0B")) // Bright gold ring
            }
        }

        windowManager.addView(spotlightView, params)
        voiceCoach.speak(instruction)
    }

    private fun hideSpotlight() {
        spotlightView?.let {
            windowManager.removeView(it)
            spotlightView = null
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        hideSpotlight()
        floatingBubbleView?.let { windowManager.removeView(it) }
        voiceCoach.shutdown()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
