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

const fallbackAnalysis = (prompt) => {
  const lower = prompt.toLowerCase()
  if (lower.includes('brute') || lower.includes('auth') || lower.includes('login')) {
    return {
      summary: 'Multiple failed logins and authentication attempts indicate a brute-force or credential-stuffing attack. The user should verify account lockouts and source reputation.',
      severity: 'HIGH',
      confidence: '82%',
      actions: [
        'Block or throttle source IPs associated with failed authentication.',
        'Enable MFA and enforce strong credentials for the impacted accounts.',
        'Review logs for lateral movement and suspicious sessions.',
      ],
      note: 'OPENAI_API_KEY is not configured; using local fallback analysis.',
    }
  }

  if (lower.includes('payload') || lower.includes('encrypted') || lower.includes('exfiltration')) {
    return {
      summary: 'Encrypted outbound payloads are suspicious and often indicate exfiltration or a covert data transfer channel. Investigate the destination and process owner immediately.',
      severity: 'CRITICAL',
      confidence: '91%',
      actions: [
        'Isolate the host and capture network session data.',
        'Check for file staging, compression, or unusual encryption tooling.',
        'Notify incident response and preserve evidence for forensic review.',
      ],
      note: 'OPENAI_API_KEY is not configured; using local fallback analysis.',
    }
  }

  if (lower.includes('link') || lower.includes('url') || lower.includes('phish') || lower.includes('suspicious')) {
    return {
      summary: 'A suspicious link can indicate phishing, credential theft, or malware delivery. Treat the URL as untrusted until the sender, domain reputation, and redirect chain are verified.',
      severity: 'HIGH',
      confidence: '78%',
      actions: [
        'Do not open the link on a primary device or authenticated browser session.',
        'Check the domain age, sender identity, redirects, and URL reputation in a sandboxed tool.',
        'If the link was clicked, rotate credentials and review recent account activity.',
      ],
      note: 'OPENAI_API_KEY is not configured; using local fallback analysis.',
    }
  }

  return {
    summary: 'The input appears suspicious but does not match a strong known threat signature. Investigate correlating alerts and asset context for better triage.',
    severity: 'MEDIUM',
    confidence: '64%',
    actions: [
      'Collect supporting logs and compare with recent baseline activity.',
      'Validate source identity and check for anomalous access patterns.',
      'Escalate to the security team if additional indicators are found.',
    ],
    note: 'OPENAI_API_KEY is not configured; using local fallback analysis.',
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
      return res.status(200).json({
        ...fallbackAnalysis(trimmed),
        summary: 'OpenAI request failed. Showing fallback analysis instead.',
        note: 'Fallback response due to OpenAI API error. Verify OPENAI_API_KEY in your deployment environment.',
      })
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
