export const RESULT_VERSION = '1.1.0';

const clean = (value, fallback = '') => {
  const text = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
  return text || fallback;
};

const asArray = (value) => Array.isArray(value) ? value : value ? [value] : [];

const categoryLabels = {
  messages: 'calls and messages',
  scheduling: 'scheduling',
  'follow-up': 'customer or lead follow-up',
  quotes: 'quotes and estimates',
  data: 'data entry and system updates',
  retrieval: 'information retrieval',
  reports: 'reports and status updates',
  marketing: 'marketing and content',
  onboarding: 'customer or employee onboarding',
  coordination: 'team and vendor coordination',
  quality: 'checking and quality control',
  other: 'other recurring work'
};

const categoryKeywords = {
  messages: ['call', 'message', 'inbox', 'answer', 'phone'],
  scheduling: ['schedule', 'calendar', 'appointment', 'book'],
  'follow-up': ['follow', 'lead', 'customer', 'prospect', 'reply'],
  quotes: ['quote', 'estimate', 'proposal', 'bid'],
  data: ['data', 'entry', 'record', 'system', 'update'],
  retrieval: ['find', 'search', 'retrieve', 'information', 'lookup'],
  reports: ['report', 'status', 'summary', 'dashboard'],
  marketing: ['marketing', 'content', 'website', 'social', 'post'],
  onboarding: ['onboard', 'intake', 'new customer', 'new employee'],
  coordination: ['coordinate', 'vendor', 'team', 'handoff', 'dispatch'],
  quality: ['check', 'correct', 'review', 'quality', 'approve']
};

const triggerLabels = {
  message: 'an inbound call or message arrives',
  form: 'a form is submitted',
  email: 'an email arrives',
  meeting: 'a meeting ends or creates a next step',
  sale: 'a sale or payment is recorded',
  record: 'a record or status changes',
  time: 'the scheduled time or day arrives',
  forgotten: 'someone notices a forgotten item',
  other: 'the agreed trigger occurs'
};

const infoLabels = {
  request: 'the original request or form',
  conversation: 'the relevant email, call, or message',
  customer: 'customer or contact history',
  policy: 'approved pricing, rules, or policies',
  calendar: 'the current calendar or availability',
  records: 'current records or job status',
  owner: 'information currently held by the owner',
  other: 'the other approved source information'
};

const trustLabels = {
  approval: 'manager approval before sensitive actions',
  visibility: 'visibility into every action',
  rules: 'clear rules and boundaries',
  examples: 'examples of correct work',
  questions: 'questions whenever the worker is uncertain',
  escalation: 'escalation for exceptions',
  takeover: 'a way for the manager to take over',
  sample: 'a small test before wider use'
};

const profileRules = [
  ['quality-control-trap', 'Quality-Control Trap', (a, c) => a.timeAllocation === 'checking' || c.includes('quality')],
  ['owner-as-switchboard', 'Owner-as-Switchboard', (a, c) => a.timeAllocation === 'answering' || c.some((item) => ['messages', 'scheduling', 'coordination'].includes(item))],
  ['follow-up-coordinator', 'Follow-Up Coordinator', (_a, c) => c.some((item) => ['follow-up', 'quotes'].includes(item))],
  ['information-bottleneck', 'Information Bottleneck', (a, c, info) => info.includes('owner') || a.judgment === 'mostly-judgment' || c.some((item) => ['retrieval', 'reports', 'data'].includes(item))],
  ['marketing-backlog', 'Marketing Backlog', (a, c) => a.timeAllocation === 'selling' || c.includes('marketing')],
  ['admin-anchor', 'Admin Anchor', () => true]
];

function listText(values, labels, fallback) {
  const items = asArray(values).map((value) => labels[value]).filter(Boolean);
  if (!items.length) return fallback;
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
}

function responsibilityScore(title, answers, categories, info) {
  const normalized = title.toLowerCase();
  let score = 1;
  categories.forEach((category) => {
    if ((categoryKeywords[category] || []).some((word) => normalized.includes(word))) score += 4;
  });
  const timeMatches = {
    answering: ['messages', 'scheduling', 'coordination'],
    selling: ['follow-up', 'quotes', 'marketing'],
    checking: ['quality', 'reports'],
    planning: ['reports', 'marketing', 'coordination'],
    firefighting: ['messages', 'scheduling', 'coordination']
  }[answers.timeAllocation] || [];
  if (categories.some((category) => timeMatches.includes(category) && (categoryKeywords[category] || []).some((word) => normalized.includes(word)))) score += 2;
  if (answers.trigger && !['forgotten', 'other'].includes(answers.trigger)) score += 2;
  if (clean(answers.correctResult).length >= 12) score += 2;
  if (info.length && !info.every((item) => ['owner', 'other'].includes(item))) score += 2;
  if (answers.judgment === 'rules') score += 2;
  if (answers.judgment === 'mixed') score += 1;
  return score;
}

export function getSubmissionState(value, now = Date.now()) {
  if (!value) return { status: 'idle', submissionId: '' };
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    if (parsed.status === 'submitting' && Number(parsed.startedAt) && now - Number(parsed.startedAt) > 120000) {
      return { status: 'idle', submissionId: '' };
    }
    return ['submitting', 'submitted'].includes(parsed.status)
      ? { status: parsed.status, submissionId: String(parsed.submissionId || '') }
      : { status: 'idle', submissionId: '' };
  } catch {
    return { status: 'idle', submissionId: '' };
  }
}

export const canSubmit = (state) => !state || state.status === 'idle';

export function deriveResult(answers = {}) {
  const categories = asArray(answers.categories);
  const info = asArray(answers.requiredInfo);
  const controls = asArray(answers.trustControls);
  const responsibilities = asArray(answers.delegateFirst).map((item) => clean(item)).filter(Boolean);
  if (!responsibilities.length) responsibilities.push(clean(answers.unwantedTask, 'the recurring work that keeps returning to you'));

  const ranked = responsibilities
    .map((title, index) => ({ title, index, score: responsibilityScore(title, answers, categories, info) }))
    .sort((a, b) => b.score - a.score || a.index - b.index);
  const best = ranked[0];
  const profile = profileRules.find(([, , matches]) => matches(answers, categories, info));
  const trigger = triggerLabels[answers.trigger] || triggerLabels.other;
  const expectedResult = clean(answers.correctResult, 'the work is completed accurately and recorded');
  const requiredInfo = listText(info, infoLabels, 'the approved source information');
  const recurringWork = listText(categories, categoryLabels, 'this repeatable responsibility');
  const judgment = {
    rules: 'Complete the standard work using the approved rules',
    mixed: 'Complete standard work and ask the manager for judgment calls',
    'mostly-judgment': 'Prepare the work, then route judgment calls to the manager'
  }[answers.judgment] || 'Follow the documented rules and escalate exceptions';
  const approvalPoints = listText(controls, trustLabels, 'manager review of actions and exceptions');
  const returnedTime = clean(answers.returnedTime, 'direction, customers, and improvement');

  return {
    version: RESULT_VERSION,
    profile: { id: profile[0], label: profile[1] },
    bestResponsibility: {
      title: best.title,
      score: best.score,
      rationale: `This responsibility ranked highest because your answers connect it to ${recurringWork}. It has a recognizable trigger, a defined outcome, identified inputs, and a clear boundary between worker rules and manager judgment.`
    },
    prompts: [
      `Process-mapping prompt:
Help me map the process for ${best.title}. The work starts when ${trigger}. A correct result is: ${expectedResult}. The required information is ${requiredInfo}. Ask me one question at a time until we have documented the standard steps, decision points, approval points, and exceptions. Finish with a checklist a dependable worker could follow.`,
      `Daily-assistance prompt:
Act as my daily assistant for ${best.title}. Use ${requiredInfo}. Start when ${trigger}. Your goal is: ${expectedResult}. ${judgment}. Show me what you completed, what information is missing, what needs my approval, and every exception that needs my decision. Never invent missing facts.`,
      `Delegation and job-description prompt:
Write a practical job description for a worker responsible for ${best.title}. Include the trigger (${trigger}), required information (${requiredInfo}), standard actions, expected result (${expectedResult}), manager approval points (${approvalPoints}), and exception rules. Separate repeatable worker tasks from manager direction and judgment. Include a small-test plan and a definition of done.`
    ],
    blueprint: {
      jobTitle: `AI Employee for ${best.title}`,
      trigger,
      requiredInfo,
      standardActions: `Review the required information, complete the repeatable steps for ${best.title}, record each action, show the work performed, and flag missing information.`,
      expectedResult,
      managerApprovalPoints: approvalPoints,
      exceptionRules: `${judgment}. Escalate missing information, conflicting instructions, uncertainty, unusual requests, and any action outside the approved rules.`,
      returnedTime
    }
  };
}
