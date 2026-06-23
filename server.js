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

const randomItem = (items) => items[Math.floor(Math.random() * items.length)]

const generateLocalAnalysis = (prompt, note = 'Generated locally because OpenAI is not available.') => {
  const lower = prompt.toLowerCase()
  const severity = randomItem(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'])
  const confidence = `${Math.floor(58 + Math.random() * 38)}%`
  const score = Math.floor(1000 + Math.random() * 9000)
  const threatType = lower.includes('link') || lower.includes('url') || lower.includes('phish')
    ? 'phishing or malicious-link activity'
    : lower.includes('login') || lower.includes('auth')
    ? 'credential abuse'
    : lower.includes('payload') || lower.includes('file')
    ? 'malware delivery'
    : randomItem(['network anomaly', 'suspicious access pattern', 'endpoint alert', 'data movement signal'])

  return {
    summary: `Generated analysis #${score}: "${prompt}" resembles ${threatType}. Treat it as ${severity.toLowerCase()} priority until validated.`,
    severity,
    confidence,
    actions: [
      randomItem(['Preserve the alert details and affected asset context.', 'Collect endpoint, identity, and network logs.', 'Check whether related indicators appear elsewhere.']),
      randomItem(['Block the indicator while it is reviewed.', 'Run the indicator through sandbox or reputation checks.', 'Review recent sessions and revoke suspicious access.']),
      randomItem(['Escalate if the event repeats or touches sensitive systems.', 'Notify affected users and confirm interaction.', 'Document the finding and tune detections after validation.']),
    ],
    note,
  }
}

app.post('/api/analyze', async (req, res) => {
  const { prompt } = req.body || {}
  const trimmed = String(prompt || '').trim()

  if (!trimmed) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(200).json(generateLocalAnalysis(trimmed, 'OPENAI_API_KEY is not configured; generated local analysis.'))
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
      return res.status(200).json(generateLocalAnalysis(trimmed, 'OpenAI request failed; generated local analysis.'))
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
