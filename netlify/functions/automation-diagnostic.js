const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const MAX_MESSAGE_CHARS = 1200;
const buckets = new Map();

const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};

const systemPrompt = `You are the YourOS Automation Diagnostic, a concise public-facing AI assistant on youros.app.

Your job: help business owners identify the first workflow, follow-up, spreadsheet, or admin process they should automate.

YourOS can help with:
- AI automation services
- Custom workflow automation
- AppSheet and custom internal apps
- Replacing messy spreadsheets with working systems
- AI assistants and website chatbots
- Integrations between the tools the business already uses
- Practical systems that free owners from repetitive admin work

Rules:
- Keep answers short, practical, and specific. Aim for 3-6 bullets or 2 short paragraphs.
- Start by naming the likely automation opportunity.
- Ask at most one follow-up question when needed.
- Do not quote prices, promise guaranteed outcomes, or claim YourOS can do something outside custom software, automation, AI assistants, workflow systems, integrations, and AppSheet-style apps.
- Do not collect sensitive personal data, passwords, payment details, health info, legal facts, or private customer records.
- If the user asks for legal, medical, tax, regulated, offensive, or unrelated help, politely decline and pivot back to business automation.
- If the fit looks real, end with a soft CTA: “Worth mapping this out in a free strategy session.”`;

function getClientIp(event) {
  return event.headers['x-nf-client-connection-ip']
    || event.headers['client-ip']
    || event.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || 'unknown';
}

function rateLimit(ip) {
  const now = Date.now();
  const bucket = buckets.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + WINDOW_MS;
  }
  bucket.count += 1;
  buckets.set(ip, bucket);
  return bucket.count <= MAX_REQUESTS_PER_WINDOW;
}

function fallbackResponse(message = 'Worth mapping this out in a free strategy session. Tell us what work keeps repeating, and we’ll help identify what should run without you.') {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ reply: message, fallback: true }),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const ip = getClientIp(event);
  if (!rateLimit(ip)) {
    return fallbackResponse('I’m getting a lot of requests right now. Worth a 20-minute conversation — book a free strategy session and we’ll map this out with you.');
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const message = String(payload.message || '').trim().slice(0, MAX_MESSAGE_CHARS);
  if (!message) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Message required' }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fallbackResponse();
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 450,
        },
      }),
    });

    if (!response.ok) {
      return fallbackResponse('I’m having trouble thinking clearly for a second. The short answer: if a task repeats, delays revenue, or lives in a messy spreadsheet, it’s a strong automation candidate. Worth a free strategy session.');
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();

    if (!reply) return fallbackResponse();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    return fallbackResponse('Something glitched, but the principle is simple: start with the work that repeats every week, slows follow-up, or keeps the owner in the weeds. Worth mapping this out in a free strategy session.');
  }
};
