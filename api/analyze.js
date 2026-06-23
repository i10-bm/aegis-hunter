const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_MODEL = 'gpt-4o-mini'

const buildSystemPrompt = () => `You are an autonomous cybersecurity analyst. When given a network event or incident description, return JSON only with the following keys: summary, severity, confidence, actions. Severity should be one of CRITICAL, HIGH, MEDIUM, LOW, INFO, or ERROR. Confidence should be a percent string like 87%. Actions should be an array of concise remediation steps. Do not include any extra text outside the JSON.`

const getJsonBody = async (req) => {
  if (req.body && typeof req.body === 'object') {
    return req.body
  }

  if (typeof req.body === 'string') {
    return JSON.parse(req.body || '{}')
  }

  if (typeof req.json === 'function') {
    return req.json()
  }

  return {}
}

const randomItem = (items) => items[Math.floor(Math.random() * items.length)]

const fallbackAnalysis = (prompt, note = 'Generated locally because OpenAI is not available.') => {
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = await getJsonBody(req)
  const trimmed = String(prompt || '').trim()

  if (!trimmed) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  if (!OPENAI_API_KEY) {
    return res.status(200).json(fallbackAnalysis(trimmed))
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: `Analyze this network event and return JSON only: "${trimmed}"` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 400,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('OpenAI API error:', errorBody)
      return res.status(200).json(fallbackAnalysis(trimmed, 'OpenAI request failed; generated local analysis.'))
    }

    const result = await response.json()
    const content = result?.choices?.[0]?.message?.content || ''

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch {
      const cleaned = content.trim().replace(/^\uFEFF/, '')
      parsed = JSON.parse(cleaned)
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('OpenAI response did not contain valid JSON.')
    }

    const output = {
      summary: String(parsed.summary || 'No summary provided.'),
      severity: String(parsed.severity || 'INFO').toUpperCase(),
      confidence: String(parsed.confidence || 'N/A'),
      actions: Array.isArray(parsed.actions) ? parsed.actions.map(String) : ['No remediation steps provided.'],
      note: parsed.note ? String(parsed.note) : undefined,
    }

    return res.status(200).json(output)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return res.status(500).json({ error: message })
  }
}
