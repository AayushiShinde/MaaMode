const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Serve static frontend assets
app.use(express.static(path.join(__dirname)));

// ElevenLabs TTS Proxy Endpoint (Secure Server-side proxy for API key)
app.post('/api/tts', async (req, res) => {
  const { text, voiceId } = req.body;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    // Graceful fallback flag if no key is supplied
    return res.status(200).json({ fallback: true, message: 'Using local client TTS' });
  }

  try {
    const targetVoice = voiceId || '21m00Tcm4TlvDq8ikWAM'; // Default warm maternal voice (Rachel / Warm Indian Persona)
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoice}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.65,
          similarity_boost: 0.85
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err, fallback: true });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    const audioBuffer = await response.arrayBuffer();
    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error('ElevenLabs proxy error:', err);
    res.status(500).json({ error: err.message, fallback: true });
  }
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', app: 'MaaMode', version: '1.0.0' });
});

// Fallback to index.html for SPA/PWA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`MaaMode server running on port ${PORT}`);
});
