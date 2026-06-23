import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const port = process.env.PORT || process.env.API_PORT || 3001

app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

app.post('/api/analyze', async (req, res) => {
  const { prompt } = req.body || {}
  const trimmed = String(prompt || '').trim()

  if (!trimmed) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  if (!process.env.OPENAI_API_KEY) {
    const lower = trimmed.toLowerCase()
    if (lower.includes('link') || lower.includes('url') || lower.includes('phish') || lower.includes('suspicious')) {
      return res.status(200).json({
        summary: 'A suspicious link can indicate phishing, credential theft, or malware delivery. Treat the URL as untrusted until the sender, domain reputation, and redirect chain are verified.',
        severity: 'HIGH',
        confidence: '78%',
        actions: [
          'Do not open the link on a primary device or authenticated browser session.',
          'Check the domain age, sender identity, redirects, and URL reputation in a sandboxed tool.',
          'If the link was clicked, rotate credentials and review recent account activity.',
        ],
        note: 'OPENAI_API_KEY is not configured; using local fallback analysis.',
      })
    }

    return res.status(200).json({
      summary: 'Local fallback: no OpenAI API key configured. Enter a detailed event for better results.',
      severity: 'INFO',
      confidence: '55%',
      actions: [
        'Configure OPENAI_API_KEY in .env or the deployment environment.',
        'Use a descriptive network event or threat scenario.',
      ],
    })
  }

  try {
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an autonomous cybersecurity analyst. Return JSON only with summary, severity, confidence, and actions.',
          },
          {
            role: 'user',
            content: `Analyze this network event and return JSON only: "${trimmed}"`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 400,
      }),
    })

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text()
      console.error('OpenAI request failed:', errorText)
      return res.status(200).json({
        summary: 'OpenAI request failed. Showing fallback analysis instead.',
        severity: 'INFO',
        confidence: '55%',
        actions: [
          'Verify your OPENAI_API_KEY in Railway environment variables.',
          'Replace the current key with a valid OpenAI API key.',
          'Re-deploy the application after updating the key.',
        ],
        note: 'Fallback response due to OpenAI error.',
      })
    }

    const data = await openAiResponse.json()
    const content = data?.choices?.[0]?.message?.content || ''
    let parsed
    try {
      parsed = JSON.parse(content)
    } catch {
      parsed = JSON.parse(content.trim().replace(/^\uFEFF/, ''))
    }

    return res.status(200).json({
      summary: String(parsed.summary || 'No summary'),
      severity: String(parsed.severity || 'INFO').toUpperCase(),
      confidence: String(parsed.confidence || 'N/A'),
      actions: Array.isArray(parsed.actions) ? parsed.actions.map(String) : [],
      note: String(parsed.note || ''),
    })
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' })
  }
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`)
})
