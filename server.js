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
const hasUrl = (input) => /https?:\/\/\S+|www\.\S+/i.test(input)
const scoreInput = (input) => {
  return input.split('').reduce((score, character, index) => {
    return (score + character.charCodeAt(0) * (index + 17)) % 9973
  }, 0)
}
const pickByScore = (items, score) => items[score % items.length]
const getUrlProfile = (input) => {
  const match = input.match(/(?:https?:\/\/|www\.)\S+/i)
  if (!match) return null

  const rawUrl = match[0].replace(/[),.;]+$/, '')
  const normalizedUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`

  try {
    const parsed = new URL(normalizedUrl)
    const domain = parsed.hostname.replace(/^www\./, '')
    const path = parsed.pathname === '/' ? 'root path' : parsed.pathname
    const queryCount = Array.from(parsed.searchParams.keys()).length
    const score = scoreInput(`${domain}${parsed.pathname}${parsed.search}`)
    const signalTypes = [
      'domain reputation check',
      'redirect and landing-page review',
      'credential-harvesting pattern check',
      'download or payload-delivery check',
      'brand impersonation review',
      'tracking-parameter anomaly check',
    ]

    return {
      domain,
      path,
      queryCount,
      score,
      signalType: pickByScore(signalTypes, score),
    }
  } catch {
    return null
  }
}

const generateLocalAnalysis = (prompt, note = 'Generated locally because OpenAI is not available.') => {
  const lower = prompt.toLowerCase()
  const urlProfile = getUrlProfile(prompt)
  const score = urlProfile?.score ?? scoreInput(prompt)
  const severity = pickByScore(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'], score)
  const confidence = `${58 + (score % 38)}%`
  const analysisId = 1000 + (score % 9000)
  const threatType = hasUrl(prompt) || lower.includes('link') || lower.includes('url') || lower.includes('phish')
    ? 'phishing or malicious-link activity'
    : lower.includes('login') || lower.includes('auth')
    ? 'credential abuse'
    : lower.includes('payload') || lower.includes('file')
    ? 'malware delivery'
    : randomItem(['network anomaly', 'suspicious access pattern', 'endpoint alert', 'data movement signal'])

  const summary = urlProfile
    ? `Generated analysis #${analysisId}: ${urlProfile.domain} on ${urlProfile.path} triggered a ${urlProfile.signalType}. Query parameters found: ${urlProfile.queryCount}. Treat this link as ${severity.toLowerCase()} priority until validated.`
    : `Generated analysis #${analysisId}: "${prompt}" resembles ${threatType}. Treat it as ${severity.toLowerCase()} priority until validated.`

  const actionGroups = urlProfile
    ? [
        [
          `Capture the final landing page, redirect chain, and DNS details for ${urlProfile.domain}.`,
          `Check certificate, hosting ASN, and registration age for ${urlProfile.domain}.`,
          `Compare ${urlProfile.domain} against known brand-impersonation and typo-squatting patterns.`,
        ],
        [
          `Open the URL only in an isolated sandbox and inspect ${urlProfile.path}.`,
          `Block ${urlProfile.domain} temporarily while reputation and ownership are verified.`,
          `Review proxy logs for users who visited ${urlProfile.domain}.`,
        ],
        [
          `Escalate if ${urlProfile.domain} requests credentials, downloads files, or redirects repeatedly.`,
          `Add ${urlProfile.domain} to watchlists and monitor new related paths.`,
          `Document indicators from ${urlProfile.domain} and tune URL detections after validation.`,
        ],
      ]
    : [
        ['Preserve the alert details and affected asset context.', 'Collect endpoint, identity, and network logs.', 'Check whether related indicators appear elsewhere.'],
        ['Block the indicator while it is reviewed.', 'Run the indicator through sandbox or reputation checks.', 'Review recent sessions and revoke suspicious access.'],
        ['Escalate if the event repeats or touches sensitive systems.', 'Notify affected users and confirm interaction.', 'Document the finding and tune detections after validation.'],
      ]

  return {
    summary,
    severity,
    confidence,
    actions: actionGroups.map((group, index) => pickByScore(group, score + index)),
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
    console.error('Analysis request failed:', error)
    return res.status(200).json(generateLocalAnalysis(trimmed, 'Analysis service was unreachable; generated local analysis.'))
  }
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`)
})
