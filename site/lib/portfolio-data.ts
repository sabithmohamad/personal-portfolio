import type {
  ApiChatMessage,
  ChatDonePayload,
  ChatUiBlock,
  PortfolioContact,
  PortfolioExperience,
  PortfolioFaq,
  PortfolioIntent,
  PortfolioProfile,
  PortfolioProject,
} from '@/types/chat';

export const profile: PortfolioProfile = {
  name: 'Mohammad Sabith',
  shortName: 'Sabith',
  role: 'Software Engineer',
  location: 'Abu Dhabi, UAE',
  tagline: 'Software Engineer with strong React and TypeScript depth, product judgment, and measurable delivery.',
  summary:
    'Software Engineer with 3+ years of production experience, based in Abu Dhabi, UAE. Sabith specializes in React and TypeScript, has shipped production systems used by real users, and approaches frontend work with product judgment, performance awareness, and delivery discipline.',
  yearsExperience: '3+ years',
  metrics: [
    { label: 'Experience', value: '3+ years' },
    { label: 'Performance', value: '46% faster load time' },
    { label: 'Scale', value: '1,000+ weekly sessions' },
  ],
};

export const experiences: PortfolioExperience[] = [
  {
    company: 'Royal Swiss Auto Services',
    role: 'Frontend Developer',
    period: 'Dec 2023 - Present',
    location: 'Abu Dhabi, UAE',
    summary:
      'Sabith builds operations-heavy production systems with real-time workflows, performance-sensitive interfaces, and measurable business impact.',
    highlights: [
      'Built a Recovery Time Tracker with real-time driver tracking via Google Maps API.',
      'Built an E-Sign Platform with in-browser PDF display and multi-step signing workflows.',
      'Built a Warranty Management Web App with role-based access, showroom setup, vehicle make/model configuration, and warranty lifecycle workflows.',
      'Reduced page load time by 46%, from 3.9s to 2.1s, through code splitting and optimization.',
      'Improved operational efficiency by 25% and reduced trip delays by 15%.',
      'Supported live production systems handling 1,000+ weekly sessions.',
      'Replaced manual WhatsApp workflows with automated SMS updates and real-time CRM synchronization.',
      'Achieved 2-second faster data retrieval compared with legacy CRM SQL queries.',
      'Improved customer satisfaction by 50% based on user survey feedback.',
      'Set up CI/CD on Render and worked closely with PMs, backend, and CRM teams.',
    ],
    stack: ['React', 'TypeScript', 'Google Maps API', 'Supabase', 'REST APIs', 'Render', 'CI/CD'],
  },
  {
    company: 'BB Leads',
    role: 'Frontend Developer',
    period: 'Apr 2023 - Dec 2023',
    location: 'Remote',
    summary:
      'Sabith delivered responsive, accessible, and performance-minded web experiences across multiple client projects.',
    highlights: [
      'Rebuilt the corporate website in React and raised Lighthouse score from 62 to 89.',
      'Delivered responsive and accessible UI work across 5+ client projects.',
      'Implemented SEO best practices that improved organic search visibility.',
      'Managed Vercel deployments, SSL, CDN optimization, and performance monitoring.',
      'Maintained component libraries and documentation across projects.',
    ],
    stack: ['React', 'JavaScript', 'Accessibility', 'SEO', 'Vercel', 'Component Libraries'],
  },
];

export const projects: PortfolioProject[] = [
  {
    slug: 'ai-sales-manager',
    title: 'AI Sales Manager',
    eyebrow: 'AI automation system',
    description:
      'An AI-powered sales workflow that handles conversational lead support on WhatsApp, understands Manglish context, verifies payment updates through Telegram, and keeps reporting loops tight.',
    impact:
      'Shows strong system thinking by orchestrating multi-model responses, operations-friendly automations, and practical reporting without adding process overhead.',
    tech: ['OpenClaw', 'Node.js', 'WhatsApp Business API', 'Claude API', 'Groq', 'Telegram', 'Google Sheets'],
    accentFrom: '#22d3ee',
    accentTo: '#6366f1',
    visualLabel: 'AI',
    visibility: 'Personal project',
    aliases: ['ai sales manager', 'sales manager', 'openclaw', 'whatsapp', 'manglish', 'telegram', 'groq', 'claude'],
  },
  {
    slug: 'recovery-time-tracker',
    title: 'Recovery Time Tracker',
    eyebrow: 'Operations platform',
    description:
      'A real-time operations tool for recovery drivers and ops staff, built around live tracking, better visibility, and faster coordination.',
    impact: 'Improved operational efficiency by 25% and reduced trip delays by 15%.',
    tech: ['React', 'TypeScript', 'Supabase', 'Google Maps API'],
    accentFrom: '#38bdf8',
    accentTo: '#0f766e',
    visualLabel: 'RT',
    visibility: 'Live production',
    aliases: ['recovery', 'tracker', 'recovery time tracker', 'google maps', 'driver tracking'],
  },
  {
    slug: 'e-sign-platform',
    title: 'E-Sign Platform',
    eyebrow: 'Signing workflow',
    description:
      'A secure digital signing platform with in-browser PDF display, multi-step workflows, automated updates, and CRM synchronization.',
    impact: 'Cut load time by 46% and supports 1,000+ weekly sessions in production.',
    tech: ['React', 'TypeScript', 'PDF Workflows', 'REST APIs', 'Performance Optimization'],
    accentFrom: '#f59e0b',
    accentTo: '#f97316',
    visualLabel: 'ES',
    visibility: 'Live production',
    aliases: ['esign', 'e-sign', 'signature', 'pdf', 'crm', 'sms'],
  },
  {
    slug: 'task-management-dashboard',
    title: 'Task Management Dashboard',
    eyebrow: 'Productivity app',
    description:
      'A full-featured dashboard with drag-and-drop interactions, React Query, optimistic UI updates, and a polished delivery setup.',
    impact: 'Reached 95+ Lighthouse score and shipped through Vercel with CI/CD.',
    tech: ['React', 'TypeScript', 'React Query', 'Tailwind CSS', 'Vercel'],
    accentFrom: '#a78bfa',
    accentTo: '#6366f1',
    visualLabel: 'TM',
    visibility: 'Personal project',
    aliases: ['task', 'dashboard', 'task manager', 'tailwind', 'drag and drop'],
  },
];

export const skillGroups = [
  {
    label: 'Frontend',
    items: ['React', 'TypeScript', 'JavaScript ES6+', 'HTML5', 'CSS3', 'Tailwind CSS'],
  },
  {
    label: 'State and Data',
    items: ['React Query', 'Zustand', 'Context API', 'REST APIs', 'Supabase'],
  },
  {
    label: 'Tools',
    items: ['Git', 'GitHub', 'Figma', 'Docker', 'Postman', 'Firebase'],
  },
  {
    label: 'Infrastructure',
    items: ['Vercel', 'AWS S3/CloudFront', 'Supabase', 'Render', 'GitHub Actions', 'Docker'],
  },
  {
    label: 'Databases',
    items: ['PostgreSQL', 'MSSQL', 'MongoDB'],
  },
  {
    label: 'Performance',
    items: ['Code Splitting', 'Lazy Loading', 'Web Vitals', 'Lighthouse', 'Bundle Optimization'],
  },
  {
    label: 'AI and Automation',
    items: ['Prompt Engineering', 'Multi-model Routing', 'Workflow Automation'],
  },
];

export const faq: PortfolioFaq[] = [
  {
    question: 'What kind of roles fit Sabith best?',
    answer:
      'Software engineering roles with strong frontend ownership, real product work, and enough trust for engineers to take responsibility for quality and outcomes.',
  },
  {
    question: 'Where is Sabith open to work?',
    answer: 'Sabith is open to strong opportunities in any country, not just the UAE or GCC.',
  },
  {
    question: 'How should someone reach out?',
    answer: 'Email, phone, and LinkedIn all work. Email is usually the fastest route for a recruiter or hiring manager.',
  },
];

export const contact: PortfolioContact = {
  email: 'sabithmohamad1@gmail.com',
  phone: '+971-552-428-080',
  github: 'https://github.com/sabithmohamad',
  linkedin: 'https://www.linkedin.com/in/mohammad-sabith-b95841185/',
  resumeHref: '/resume.pdf',
  actions: [
    { label: 'Resume', href: '/resume.pdf', kind: 'resume', note: 'Current PDF' },
    { label: 'Email', href: 'mailto:sabithmohamad1@gmail.com', kind: 'email', note: 'sabithmohamad1@gmail.com' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mohammad-sabith-b95841185/', kind: 'external', note: 'Professional profile' },
  ],
};

export const starterPrompts = [
  'Why should I hire Sabith?',
  "What is Sabith's experience?",
  'Show me Sabith’s main projects.',
];

const followupsByIntent: Record<PortfolioIntent, string[]> = {
  about: ["What is Sabith's experience?", 'Show me Sabith’s main projects.', 'How can I contact Sabith?'],
  experience: ['What did Sabith build at Royal Swiss Auto Services?', 'Tell me about AI Sales Manager.', 'What does Sabith specialize in?'],
  projects: ['Tell me more about AI Sales Manager.', 'Tell me about the E-Sign Platform.', 'How can I contact Sabith?'],
  skills: ["What is Sabith's experience?", 'What makes Sabith a strong hire?', 'How does Sabith approach performance?'],
  resume: ['Can I get a quick summary first?', 'What are Sabith’s main projects?', 'How can I contact Sabith?'],
  contact: ['Is Sabith open to work internationally?', 'Can I see Sabith’s resume?', 'What kind of work fits Sabith best?'],
  availability: ['How can I contact Sabith?', "What is Sabith's experience?", 'Show me Sabith’s main projects.'],
  unknown: ["What is Sabith's experience?", 'Show me Sabith’s main projects.', 'Why should I hire Sabith?'],
};

const hirePatterns = [
  /\bwhy should (i|we) hire (you|sabith)\b/i,
  /\bwhy hire (you|sabith)\b/i,
  /\bwhy would (i|we) hire (you|sabith)\b/i,
  /\bwhy is (he|sabith) a good fit\b/i,
  /\bwhat makes (him|sabith) a good fit\b/i,
  /\bwhy should (i|we) choose (you|sabith)\b/i,
  /\bconvince me\b/i,
];

const specialtyPatterns = [
  /\bwhat does (he|sabith) specialize in\b/i,
  /\bwhat do you specialize in\b/i,
  /\bwhat are (his|your) specialt(?:y|ies)\b/i,
  /\bwhat are (his|your) specialit(?:y|ies)\b/i,
  /\bwhat are (his|your) specalities\b/i,
  /\bwhat are you best at\b/i,
  /\bwhat is (he|sabith) best at\b/i,
  /\bwhat is (his|your) edge\b/i,
  /\bwhat do (you|he|sabith) bring to a team\b/i,
  /\bwhat kind of engineer are you\b/i,
  /\bwhat kind of engineer is (he|sabith)\b/i,
];

const intentMatchers: Array<{ intent: PortfolioIntent; patterns: RegExp[] }> = [
  {
    intent: 'resume',
    patterns: [/\bresume\b/i, /\bcv\b/i, /\bdownload\b/i],
  },
  {
    intent: 'contact',
    patterns: [/\bcontact\b/i, /\bemail\b/i, /\bphone\b/i, /\bcall\b/i, /\breach\b/i, /\blinkedin\b/i],
  },
  {
    intent: 'availability',
    patterns: [/\bavailable\b/i, /\bavailability\b/i, /\bopen to work\b/i, /\bfreelance\b/i, /\brelocat/i, /\bglobal\b/i, /\bworldwide\b/i, /\bany country\b/i],
  },
  {
    intent: 'projects',
    patterns: [
      /\bproject/i,
      /\bbuild/i,
      /\bwork samples?\b/i,
      /\be-sign\b/i,
      /\brecovery\b/i,
      /\bdashboard\b/i,
      /\bai sales manager\b/i,
      /\bopenclaw\b/i,
      /\bwhatsapp\b/i,
      /\bmanglish\b/i,
      /\btelegram\b/i,
    ],
  },
  {
    intent: 'skills',
    patterns: [
      /\bskill/i,
      /\bstack\b/i,
      /\btech\b/i,
      /\btools\b/i,
      /\bspeciali[sz]e/i,
      /\bspecialt(?:y|ies)\b/i,
      /\bspecialit(?:y|ies)\b/i,
      /\bspecalities\b/i,
      /\bfrontend\b/i,
      /\bsoftware engineer\b/i,
    ],
  },
  {
    intent: 'experience',
    patterns: [
      /\bexperience\b/i,
      /\bcareer\b/i,
      /\bwork history\b/i,
      /\byears\b/i,
      /\bcurrent role\b/i,
      /\broyal swiss\b/i,
      /\bbb leads\b/i,
      /\btime period\b/i,
      /\bwhich period\b/i,
      /\bdates?\b/i,
      /\bwhen did\b/i,
    ],
  },
  {
    intent: 'about',
    patterns: [/\babout\b/i, /\bwho are you\b/i, /\bwho is sabith\b/i, /\btell me about (him|sabith|yourself)\b/i, /\bintroduce (him|sabith|yourself)\b/i],
  },
];

const blockedPatterns = [
  /\bignore (all|the|your) (previous|above|prior) instructions\b/i,
  /\bsystem prompt\b/i,
  /\breveal (your|the) prompt\b/i,
  /\bbypass\b/i,
  /\bmalware\b/i,
  /\bexploit\b/i,
  /\bcredit card\b/i,
  /\bsexual\b/i,
  /\bhate speech\b/i,
];

const joinList = (items: string[]) => {
  if (items.length <= 1) {
    return items[0] ?? '';
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
};

export const isHirePrompt = (message: string) => hirePatterns.some(pattern => pattern.test(message));

export const isSpecialtyPrompt = (message: string) => specialtyPatterns.some(pattern => pattern.test(message));

export const prefersGroundedVoice = (message: string) => isHirePrompt(message) || isSpecialtyPrompt(message);

const isAiIdentityPrompt = (message: string) => /\b(ai|gemini|gpt|chatgpt|codex|bot|robot)\b/i.test(message);
const isCasualReactionPrompt = (message: string) =>
  /\b(haha|hahah|hehe|lol|lmao|nice|cool|great|awesome|okay|ok|alright|sounds good|got it|thanks|thank you|perfect)\b/i.test(
    message,
  );

const pickReply = (message: string, variants: string[]) => {
  const seed = message
    .toLowerCase()
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return variants[seed % variants.length] ?? variants[0] ?? '';
};

const playfulRedirect = (message: string) => {
  const compactTopic = message.replace(/\s+/g, ' ').trim().slice(0, 42);

  if (isAiIdentityPrompt(message)) {
    return pickReply(message, [
      `There is definitely some machine help here, but this assistant is really here to talk about Sabith. The more interesting question is what he has shipped and why teams trust him with product work.`,
      `This page has an AI engine under the hood, but the subject is still Sabith. It is much more useful discussing his experience, projects, and hiring fit than starting a model family tree.`,
      `Think of it as Sabith's portfolio with a very caffeinated digital colleague attached. Happy to talk about the work, the results, or why he might be worth hiring.`,
    ]);
  }

  if (/\b(weather|football|cricket|stocks|bitcoin|movie|song|recipe)\b/i.test(message)) {
    return pickReply(message, [
      `That topic is outside Sabith's portfolio lane. This assistant is much stronger on shipped software, product judgment, and frontend-heavy systems than weather or market predictions.`,
      `If this page starts giving stock picks, Sabith probably needs to revoke its deployment rights. It is much better used for experience, projects, or hiring-fit questions.`,
      `This assistant stays in its lane on purpose: Sabith's work, strengths, and trajectory. For everything else, the internet already has enough loud opinions.`,
    ]);
  }

  if (/\bjoke\b/i.test(message)) {
    return pickReply(message, [
      `Sabith's idea of comedy is usually cutting seconds off a page before anyone schedules a meeting about performance. If useful, this assistant can switch back to the serious version and talk about his work.`,
      `The safest joke here is that loading spinners and legacy workflows are both slightly afraid of Sabith. Happy to talk about the real projects behind that.`,
      `Most of the humor in Sabith's world comes from watching performance debt disappear. If helpful, this assistant can turn that into actual project examples.`,
    ]);
  }

  if (/\b(can you|could you|help me with|tell me about)\b/i.test(message) && compactTopic) {
    return pickReply(message, [
      `"${compactTopic}" is a bit outside this assistant's lane. It becomes much sharper when the topic is Sabith's experience, projects, or why he might be a strong hire.`,
      `This assistant could improvise on "${compactTopic}", but it is significantly more useful when the conversation stays on Sabith's work, systems thinking, and product impact.`,
      `That topic sits outside the portfolio scope. For the high-signal version, ask about Sabith's shipped work, engineering strengths, or fit.`,
    ]);
  }

  return pickReply(message, [
    `That is a little outside the portfolio scope. This assistant is intentionally tuned to talk about Sabith's work, strengths, and hiring fit, not to become a universal answer machine.`,
    `This page keeps the signal narrow on purpose: Sabith's experience, projects, and what he brings to a team. That is where the answers will be strongest.`,
    `That question steps outside Sabith's portfolio lane. The better use of this assistant is asking about his experience, projects, specialties, or availability.`,
  ]);
};

export const isBlockedPrompt = (message: string) => blockedPatterns.some(pattern => pattern.test(message));

export const detectIntent = (message: string): PortfolioIntent => {
  const trimmed = message.trim();

  if (!trimmed) {
    return 'unknown';
  }

  if (isHirePrompt(trimmed)) {
    return 'experience';
  }

  for (const { intent, patterns } of intentMatchers) {
    if (patterns.some(pattern => pattern.test(trimmed))) {
      return intent;
    }
  }

  if (/\b(hello|hi|hey)\b/i.test(trimmed)) {
    return 'about';
  }

  return 'unknown';
};

export const getReferencedProjects = (message: string) => {
  const lowered = message.toLowerCase();
  const focused = projects.filter(project => project.aliases.some(alias => lowered.includes(alias)));

  if (focused.length > 0) {
    return focused;
  }

  if (/\bone project\b|\ba project\b|\bsingle project\b/.test(lowered)) {
    const defaultSingle = projects.find(project => project.slug === 'recovery-time-tracker') ?? projects[0];
    return defaultSingle ? [defaultSingle] : projects;
  }

  return projects;
};

const getReferencedExperience = (message: string) => {
  const lowered = message.toLowerCase();

  if (lowered.includes('bb leads')) {
    return experiences.filter(experience => experience.company === 'BB Leads');
  }

  if (lowered.includes('royal swiss') || lowered.includes('recovery') || lowered.includes('e-sign')) {
    return experiences.filter(experience => experience.company === 'Royal Swiss Auto Services');
  }

  return experiences;
};

const getProjectTimelineNote = (project: PortfolioProject) => {
  switch (project.slug) {
    case 'recovery-time-tracker':
    case 'e-sign-platform':
      return 'Built at Royal Swiss Auto Services (Dec 2023 - Present).';
    case 'ai-sales-manager':
    case 'task-management-dashboard':
      return 'Personal project work built and iterated independently.';
    default:
      return '';
  }
};

export const getUiBlocksForIntent = (intent: PortfolioIntent, message: string): ChatUiBlock[] => {
  if (isHirePrompt(message)) {
    return [];
  }

  switch (intent) {
    case 'about':
      return [];
    case 'experience':
      return [
        {
          type: 'timeline',
          title: 'Recent experience',
          items: getReferencedExperience(message).map(experience => ({
            title: `${experience.role} - ${experience.company}`,
            meta: `${experience.period} - ${experience.location}`,
            summary: experience.summary,
          })),
        },
      ];
    case 'projects':
      return [
        {
          type: 'projects',
          title: 'Selected work',
          items: getReferencedProjects(message).map(project => ({
            title: project.title,
            eyebrow: project.eyebrow,
            description: project.description,
            impact: project.impact,
            tech: project.tech,
            accentFrom: project.accentFrom,
            accentTo: project.accentTo,
            visualLabel: project.visualLabel,
            visibility: project.visibility,
          })),
        },
      ];
    case 'skills':
      return [
        {
          type: 'skills',
          title: 'Core strengths',
          groups: skillGroups,
        },
      ];
    case 'resume':
      return [];
    case 'contact':
      return [];
    case 'availability':
      return [];
    default:
      return [];
  }
};

export const getSuggestedFollowups = (intent: PortfolioIntent) => followupsByIntent[intent];

export const buildDonePayload = (intent: PortfolioIntent, message: string): ChatDonePayload => ({
  intent,
  uiBlocks: intent === 'projects' ? getUiBlocksForIntent(intent, message).filter(block => block.type === 'projects') : [],
  suggestedFollowups: [],
});

export const generateFallbackAnswer = (intent: PortfolioIntent, message: string) => {
  if (isHirePrompt(message)) {
    return `The case for hiring Sabith is that he brings more than clean UI implementation. He tends to operate in the overlap between product judgment and frontend execution, which means he pays attention to how the interface feels, how the data moves, where performance starts to drag, and whether the solution actually reduces friction for the people using it.\n\nThat shows up in outcomes, not just tech choices: 25% higher operational efficiency, a 46% load-time improvement on a production signing flow, and systems supporting 1,000+ weekly sessions. He is the kind of engineer who helps a team ship something calmer, faster, and easier to trust after launch.`;
  }

  switch (intent) {
    case 'about':
      return `This is Sabith's portfolio assistant. Sabith is a Software Engineer with ${profile.yearsExperience} of production experience, based in ${profile.location}, with strong depth in React and TypeScript.\n\nThe short version is that he has shipped real systems used by real users, cares about product quality and performance, and is currently open to strong opportunities in any country.`;
    case 'experience': {
      const focusedExperience = getReferencedExperience(message);
      const lead = focusedExperience[0];

      if (!lead) {
        return `Sabith has ${profile.yearsExperience} of production experience, with a background centered on React, TypeScript, performance optimization, and workflow-heavy product interfaces. His recent work spans internal systems, SEO/performance improvements, and production-grade frontend delivery.`;
      }

      return `Sabith has ${profile.yearsExperience} of production experience, and his recent work at ${lead.company} is a strong example of how he operates. He has been building real-time and workflow-heavy products, improving performance, and shipping interfaces that affect day-to-day business operations.\n\nA few concrete outcomes are 25% higher operational efficiency, 15% fewer trip delays, a 46% load-time improvement, and production systems handling 1,000+ weekly sessions.`;
    }
    case 'projects': {
      const focusedProjects = getReferencedProjects(message);

      if (focusedProjects.length === 1) {
        const [project] = focusedProjects;
        const timelineNote = getProjectTimelineNote(project);
        const timelineLine = timelineNote ? ` ${timelineNote}` : '';
        return `${project.title} is one of the clearest examples of Sabith's work. ${project.description}${timelineLine}\n\nHe built it with ${joinList(project.tech)} and the outcome was clear: ${project.impact}`;
      }

      return `The main projects worth starting with are ${joinList(
        focusedProjects.map(project => project.title),
      )}. Together they show production delivery, performance work, operational workflow design, and practical system thinking across both internal platforms and AI-assisted workflows.\n\nIf there is one to go deeper on first, AI Sales Manager is the best lens on Sabith's system-level thinking, while the Royal Swiss products are the strongest proof of production impact.`;
    }
    case 'skills':
      if (isSpecialtyPrompt(message)) {
        return `Sabith's strongest lane is software engineering with heavy frontend ownership, especially when the product has real data, messy workflows, performance constraints, and users who actually depend on it.\n\nIn practical terms, that means React and TypeScript systems, API-heavy interfaces, performance tuning, and turning complicated operational requirements into something clearer and more reliable for both users and the team maintaining it.`;
      }

      return `Sabith's core strengths are React, TypeScript, product-focused frontend engineering, and performance-minded delivery. He is especially strong when a team needs someone who can take a workflow with real business complexity and turn it into a clean, usable product without losing engineering discipline.`;
    case 'resume':
      return `The latest resume is available directly from the resume action on the page. If helpful, this assistant can also give a short recruiter-friendly summary before someone opens the PDF.`;
    case 'contact':
      return `The best ways to reach Sabith are email at ${contact.email}, phone at ${contact.phone}, and LinkedIn at ${contact.linkedin}.\n\nIf there is genuine hiring interest, reaching out directly is the right move. This assistant can also summarize the most relevant work first if that helps.`;
    case 'availability':
      return `Sabith is open to strong opportunities in any country. He is especially interested in teams doing real product work with a solid stack, good engineering standards, and genuine ownership rather than maintenance-only roles.`;
    default:
      if (isCasualReactionPrompt(message)) {
        return pickReply(message, [
          `Love that. Want a quick take on Sabith's strongest hiring edge, or should this assistant jump into his top project first?`,
          `Nice. If helpful, this assistant can keep going with either Sabith's current role impact or his best project breakdown.`,
          `Perfect. Next move can be a short "why hire Sabith" summary or a project-by-project walkthrough, your call.`,
        ]);
      }

      return playfulRedirect(message);
  }
};

export const buildIntentContext = (intent: PortfolioIntent, message: string) => {
  const sections = [
    `Identity:\n- You are Sabith's personal AI portfolio assistant.\n- Always refer to Sabith in third person.\n- If asked who you are, say you are Sabith's portfolio assistant.\n- If asked who Sabith is, say he is a Software Engineer based in ${profile.location}.`,
    `Profile:\n- Name: ${profile.name}\n- Role: ${profile.role}\n- Location: ${profile.location}\n- Summary: ${profile.summary}`,
    `What Sabith is looking for:\n- Strong software engineering opportunities\n- Real product work with a good stack\n- Teams where growth and ownership are real\n- Open to work in any country`,
  ];

  if (intent === 'about' || intent === 'experience' || isHirePrompt(message)) {
    const focused = getReferencedExperience(message);
    sections.push(
      `Experience:\n${focused
        .map(
          experience =>
            `- ${experience.role} at ${experience.company} (${experience.period}, ${experience.location})\n  Summary: ${experience.summary}\n  Highlights: ${experience.highlights.join('; ')}\n  Stack: ${experience.stack.join(', ')}`,
        )
        .join('\n')}`,
    );
  }

  if (intent === 'projects' || isHirePrompt(message)) {
    const focused = getReferencedProjects(message);
    sections.push(
      `Projects:\n${focused
        .map(
          project =>
            `- ${project.title}: ${project.description}\n  Impact: ${project.impact}\n  Tech: ${project.tech.join(', ')}\n  Visibility: ${project.visibility}`,
        )
        .join('\n')}`,
    );
  }

  if (intent === 'unknown') {
    sections.push(
      `Useful project references:\n${projects
        .slice(0, 4)
        .map(project => `- ${project.title}: ${project.description} Impact: ${project.impact}`)
        .join('\n')}`,
    );
    sections.push(
      `Useful experience references:\n${experiences
        .map(experience => `- ${experience.role} at ${experience.company} (${experience.period})`)
        .join('\n')}`,
    );
  }

  if (intent === 'skills' || isHirePrompt(message)) {
    sections.push(`Skills:\n${skillGroups.map(group => `- ${group.label}: ${group.items.join(', ')}`).join('\n')}`);
  }

  if (intent === 'resume' || intent === 'contact' || intent === 'availability' || isHirePrompt(message)) {
    sections.push(
      `Contact:\n- Email: ${contact.email}\n- Phone: ${contact.phone}\n- LinkedIn: ${contact.linkedin}\n- GitHub: ${contact.github}\n- Resume: ${contact.resumeHref}`,
    );
  }

  sections.push(`FAQ:\n${faq.map(item => `- ${item.question}: ${item.answer}`).join('\n')}`);

  return sections.join('\n\n');
};

export const buildConversationTranscript = (messages: ApiChatMessage[]) =>
  messages
    .slice(-6)
    .map(message => `${message.role === 'user' ? 'User' : 'Assistant'}: ${message.content}`)
    .join('\n');
