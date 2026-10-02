package com.maamode.app

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            MaaModeMainScreen(
                onEnableOverlay = { requestOverlayPermission() },
                onEnableAccessibility = { openAccessibilitySettings() },
                onLaunchWhatsApp = { launchAppWithOverlay("com.whatsapp") },
                onLaunchUber = { launchAppWithOverlay("com.ubercab") }
            )
        }
    }

    private fun requestOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(this)) {
                val intent = Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:$packageName")
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
        // Start floating overlay service
        val serviceIntent = Intent(this, MaaModeOverlayService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }

        // Launch target app (WhatsApp or Uber)
        val launchIntent = packageManager.getLaunchIntentForPackage(targetPackage)
        if (launchIntent != null) {
            startActivity(launchIntent)
        } else {
            Toast.makeText(this, "$targetPackage फोनमध्ये सापडले नाही!", Toast.LENGTH_SHORT).show()
        }
    }
}

@Composable
fun MaaModeMainScreen(
    onEnableOverlay: () -> Unit,
    onEnableAccessibility: () -> Unit,
    onLaunchWhatsApp: () -> Unit,
    onLaunchUber: () -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color(0xFFFFFDF9)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Header
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "नमस्कार आई ❤️",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color(0xFF1E1B4B)
                )
                Text(
                    text = "MaaMode - स्क्रीनवर थेट मदत",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFFD97706),
                    modifier = Modifier.padding(top = 4.dp)
                )
            }

            // Permission Setup Cards
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Card(
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF3C7))
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Text(
                            text = "१. स्क्रीनवर दिसण्याची परवानगी",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF92400E)
                        )
                        Text(
                            text = "व्हॉट्सॲप आणि उबरवर पिवळा गोल दाखवण्यासाठी ही परवानगी लागते.",
                            fontSize = 14.sp,
                            color = Color(0xFF78350F),
                            modifier = Modifier.padding(top = 4.dp)
                        )
                        Button(
                            onClick = onEnableOverlay,
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD97706)),
                            shape = RoundedCornerShape(50),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = 10.dp)
                        ) {
                            Text("परवानगी चालू करा", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        }
                    }
                }

                Card(
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFE0F2FE))
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Text(
                            text = "२. स्क्रीन वाचण्याची परवानगी",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF0369A1)
                        )
                        Text(
                            text = "स्क्रीनवरील बटण ओळखण्यासाठी ॲक्सेसिबिलिटी चालू करा.",
                            fontSize = 14.sp,
                            color = Color(0xFF075985),
                            modifier = Modifier.padding(top = 4.dp)
                        )
                        Button(
                            onClick = onEnableAccessibility,
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0284C7)),
                            shape = RoundedCornerShape(50),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = 10.dp)
                        ) {
                            Text("ॲक्सेसिबिलिटी उघडा", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        }
                    }
                }
            }

            // Real App Guidance Launchers
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Button(
                    onClick = onLaunchWhatsApp,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF25D366)),
                    shape = RoundedCornerShape(50),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(64.dp)
                ) {
                    Text(
                        text = "💬 व्हॉट्सॲप उघडा व मदत घ्या",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color.White
                    )
                }

                Button(
                    onClick = onLaunchUber,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF000000)),
                    shape = RoundedCornerShape(50),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(64.dp)
                ) {
                    Text(
                        text = "🛺 उबर उघडा व रिक्षा बुक करा",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color.White
                    )
                }
            }
        }
    }
}
