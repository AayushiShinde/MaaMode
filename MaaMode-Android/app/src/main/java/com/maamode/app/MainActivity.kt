package com.maamode.app

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.view.Gravity
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast

class MainActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val scroll = ScrollView(this).apply {
            setBackgroundColor(Color.parseColor("#FFFDF9"))
            isFillViewport = true
        }

        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(40, 50, 40, 50)
            gravity = Gravity.CENTER_HORIZONTAL
        }

        // Title
        val title = TextView(this).apply {
            text = "नमस्कार आई ❤️"
            textSize = 28f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.parseColor("#1E1B4B"))
            gravity = Gravity.CENTER
        }
        layout.addView(title)

        val subtitle = TextView(this).apply {
            text = "MaaMode - स्क्रीनवर थेट मदत"
            textSize = 16f
            setTextColor(Color.parseColor("#D97706"))
            gravity = Gravity.CENTER
            setPadding(0, 8, 0, 40)
        }
        layout.addView(subtitle)

        // Permission Card 1: Overlay
        val card1 = createCard(
            "१. स्क्रीनवर दिसण्याची परवानगी",
            "व्हॉट्सॲप आणि उबरवर पिवळा गोल दाखवण्यासाठी ही परवानगी लागते.",
            "परवानगी चालू करा",
            "#D97706",
            "#FEF3C7"
        ) {
            requestOverlayPermission()
        }
        layout.addView(card1)

        // Spacer
        layout.addView(TextView(this).apply { height = 24 })

        // Permission Card 2: Accessibility
        val card2 = createCard(
            "२. स्क्रीन वाचण्याची परवानगी",
            "स्क्रीनवरील बटण ओळखण्यासाठी ॲक्सेसिबिलिटी चालू करा.",
            "ॲक्सेसिबिलिटी उघडा",
            "#0284C7",
            "#E0F2FE"
        ) {
            openAccessibilitySettings()
        }
        layout.addView(card2)

        // Spacer
        layout.addView(TextView(this).apply { height = 40 })

        // Action Button: WhatsApp
        val btnWhatsApp = Button(this).apply {
            text = "💬 व्हॉट्सॲप उघडा व मदत घ्या"
            textSize = 18f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
            background = GradientDrawable().apply {
                cornerRadius = 60f
                setColor(Color.parseColor("#25D366"))
            }
            height = 160
            setOnClickListener {
                launchAppWithOverlay("com.whatsapp")
            }
        }
        layout.addView(btnWhatsApp)

        // Spacer
        layout.addView(TextView(this).apply { height = 20 })

        // Action Button: Uber
        val btnUber = Button(this).apply {
            text = "🛺 उबर उघडा व रिक्षा बुक करा"
            textSize = 18f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
            background = GradientDrawable().apply {
                cornerRadius = 60f
                setColor(Color.parseColor("#000000"))
            }
            height = 160
            setOnClickListener {
                launchAppWithOverlay("com.ubercab")
            }
        }
        layout.addView(btnUber)

        scroll.addView(layout)
        setContentView(scroll)
    }

    private fun createCard(
        titleText: String,
        descText: String,
        btnText: String,
        btnColor: String,
        bgColor: String,
        onClick: () -> Unit
    ): LinearLayout {
        return LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(30, 30, 30, 30)
            background = GradientDrawable().apply {
                cornerRadius = 32f
                setColor(Color.parseColor(bgColor))
            }

            val t = TextView(context).apply {
                text = titleText
                textSize = 18f
                typeface = Typeface.DEFAULT_BOLD
                setTextColor(Color.parseColor("#111827"))
            }
            addView(t)

            val d = TextView(context).apply {
                text = descText
                textSize = 14f
                setTextColor(Color.parseColor("#4B5563"))
                setPadding(0, 8, 0, 20)
            }
            addView(d)

            val b = Button(context).apply {
                text = btnText
                textSize = 15f
                typeface = Typeface.DEFAULT_BOLD
                setTextColor(Color.WHITE)
                background = GradientDrawable().apply {
                    cornerRadius = 50f
                    setColor(Color.parseColor(btnColor))
                }
                setOnClickListener { onClick() }
            }
            addView(b)
        }
    }

    private fun requestOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(this)) {
                val intent = Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:")
                )
                startActivity(intent)
            } else {
                Toast.makeText(this, "परवानगी आधीच चालू आहे! ✓", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun openAccessibilitySettings() {
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        startActivity(intent)
        Toast.makeText(this, "MaaMode शोधा आणि 'चालू' (ON) करा", Toast.LENGTH_LONG).show()
    }

    private fun launchAppWithOverlay(targetPackage: String) {
        val serviceIntent = Intent(this, MaaModeOverlayService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }

        val launchIntent = packageManager.getLaunchIntentForPackage(targetPackage)
        if (launchIntent != null) {
            startActivity(launchIntent)
        } else {
            Toast.makeText(this, " फोनमध्ये सापडले नाही!", Toast.LENGTH_SHORT).show()
        }
    }
}
