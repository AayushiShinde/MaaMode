package com.maamode.app

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.graphics.Rect
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class MaaModeAccessibilityService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        val rootNode = rootInActiveWindow ?: return
        val packageName = event?.packageName?.toString() ?: ""

        when (packageName) {
            "com.whatsapp" -> handleWhatsAppGuidance(rootNode)
            "com.ubercab" -> handleUberGuidance(rootNode)
        }
    }

    private fun handleWhatsAppGuidance(rootNode: AccessibilityNodeInfo) {
        // Step 1: Look for contact "बाबा" on chat list
        val papaContact = findNodeByText(rootNode, "बाबा")
        if (papaContact != null) {
            highlightNode(papaContact, "आता बाबांच्या नावावर दाबा आई.")
            return
        }

        // Step 2: Inside chat, look for paperclip attachment button
        val attachBtn = findNodeByContentDescription(rootNode, "Attach")
            ?: findNodeByViewId(rootNode, "com.whatsapp:id/input_attach_button")
        if (attachBtn != null && isNodeVisible(attachBtn)) {
            highlightNode(attachBtn, "आता खाली पिनच्या चिन्हावर दाबा.")
            return
        }

        // Step 3: Inside attachment sheet, look for Gallery
        val galleryBtn = findNodeByText(rootNode, "Gallery")
            ?: findNodeByText(rootNode, "गॅलरी")
        if (galleryBtn != null) {
            highlightNode(galleryBtn, "गॅलरीवर दाबा आणि फोटो निवडा.")
            return
        }

        // Step 4: Look for green Send button
        val sendBtn = findNodeByViewId(rootNode, "com.whatsapp:id/send")
            ?: findNodeByContentDescription(rootNode, "Send")
        if (sendBtn != null) {
            highlightNode(sendBtn, "हिरव्या बटनावर दाबून पाठवून द्या!")
            return
        }
    }

    private fun handleUberGuidance(rootNode: AccessibilityNodeInfo) {
        // Step 1: Look for "Where to?" box
        val whereToBox = findNodeByText(rootNode, "Where to?")
            ?: findNodeByText(rootNode, "कुठे जायचे आहे?")
        if (whereToBox != null) {
            highlightNode(whereToBox, "कुठे जायचे आहे तिथे दाबा.")
            return
        }

        // Step 2: Look for Uber Auto option
        val autoOption = findNodeByText(rootNode, "Uber Auto")
            ?: findNodeByText(rootNode, "Auto")
        if (autoOption != null) {
            highlightNode(autoOption, "इथे रिक्षा (Uber Auto) निवडा.")
            return
        }

        // Step 3: Look for Confirm button
        val confirmBtn = findNodeByText(rootNode, "Confirm Auto")
            ?: findNodeByText(rootNode, "Confirm")
        if (confirmBtn != null) {
            highlightNode(confirmBtn, "खाली काळ्या बटनावर दाबून रिक्षा पक्की करा.")
            return
        }
    }

    private fun highlightNode(node: AccessibilityNodeInfo, instruction: String) {
        val rect = Rect()
        node.getBoundsInScreen(rect)
        if (rect.width() > 0 && rect.height() > 0) {
            val intent = Intent(this, MaaModeOverlayService::class.java).apply {
                action = MaaModeOverlayService.ACTION_SHOW_SPOTLIGHT
                putExtra(MaaModeOverlayService.EXTRA_BOUNDS, rect)
                putExtra(MaaModeOverlayService.EXTRA_INSTRUCTION, instruction)
            }
            startService(intent)
        }
    }

    private fun isNodeVisible(node: AccessibilityNodeInfo): Boolean {
        val rect = Rect()
        node.getBoundsInScreen(rect)
        return rect.width() > 0 && rect.height() > 0
    }

    private fun findNodeByText(node: AccessibilityNodeInfo, text: String): AccessibilityNodeInfo? {
        val list = node.findAccessibilityNodeInfosByText(text)
        return list.firstOrNull()
    }

    private fun findNodeByViewId(node: AccessibilityNodeInfo, viewId: String): AccessibilityNodeInfo? {
        val list = node.findAccessibilityNodeInfosByViewId(viewId)
        return list.firstOrNull()
    }

    private fun findNodeByContentDescription(node: AccessibilityNodeInfo, desc: String): AccessibilityNodeInfo? {
        if (node.contentDescription?.toString()?.contains(desc, ignoreCase = true) == true) {
            return node
        }
        for (i in 0 until node.childCount) {
            val child = node.getChild(i) ?: continue
            val result = findNodeByContentDescription(child, desc)
            if (result != null) return result
        }
        return null
    }

    override fun onInterrupt() {}
}
