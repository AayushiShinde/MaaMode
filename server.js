const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static assets from MaaMode-Web directory
const webDir = path.join(__dirname, 'MaaMode-Web');
app.use(express.static(webDir));

// ElevenLabs TTS Proxy Endpoint
app.post('/api/tts', async (req, res) => {
  const { text, voiceId } = req.body;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ fallback: true, message: 'Using local client TTS' });
  }

  try {
    const targetVoice = voiceId || '21m00Tcm4TlvDq8ikWAM';
    const url = 'https://api.elevenlabs.io/v1/text-to-speech/' + encodeURIComponent(targetVoice);
    const response = await fetch(url, {
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

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', app: 'MaaMode', version: '1.0.0' });
});

// Fallback to MaaMode-Web/index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(webDir, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('MaaMode server running on port ' + PORT);
});
