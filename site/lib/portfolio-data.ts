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
  role: 'Frontend Engineer',
  location: 'Abu Dhabi, UAE',
  tagline: 'Builds fast, product-minded React and TypeScript experiences with real business impact.',
  summary:
    'Frontend Engineer with 3+ years of experience building modern React and TypeScript products. Strong in performance optimization, API-heavy workflows, UI systems, and shipping features that improve how teams and customers actually work.',
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
    role: 'Frontend Developer / Software Engineer',
    period: 'Dec 2023 - Present',
    location: 'Abu Dhabi, UAE',
    summary:
      'Building internal products for operations-heavy workflows, with a focus on performance, live data, and practical business outcomes.',
    highlights: [
      'Architected a Recovery Time Tracker in React and TypeScript for recovery drivers and operations staff with live location visibility.',
      'Improved operational efficiency by 25% and reduced trip delays by 15% through better rendering and API data flows.',
      'Built an E-Sign platform with in-browser PDF workflows, automated SMS updates, and CRM sync.',
      'Reduced page load time from 3.9s to 2.1s on the E-Sign platform through code splitting and optimization.',
      'Supported a workflow that handles 1,000+ weekly sessions.',
    ],
    stack: ['React', 'TypeScript', 'React Query', 'Supabase', 'Google Maps API', 'REST APIs', 'Render'],
  },
  {
    company: 'BB Leads',
    role: 'Frontend Developer',
    period: 'Apr 2023 - Dec 2023',
    location: 'Remote',
    summary:
      'Delivered responsive, performance-focused websites and product UI work across client projects in collaboration with design and backend teams.',
    highlights: [
      'Rebuilt a corporate website in React and improved Lighthouse performance from 62 to 89.',
      'Shipped accessible, mobile-first interfaces across multiple client projects.',
      'Implemented SEO improvements including structured data, semantic HTML, and meta optimization.',
      'Managed deployments, domains, SSL, and CDN setup using Vercel.',
    ],
    stack: ['React', 'JavaScript', 'SEO', 'Accessibility', 'Vercel', 'Google Analytics'],
  },
];

export const projects: PortfolioProject[] = [
  {
    slug: 'recovery-time-tracker',
    title: 'Recovery Time Tracker',
    eyebrow: 'Internal operations platform',
    description:
      'A real-time tracking workspace for recovery drivers and operations staff, with live location views and session-aware data access.',
    impact: 'Improved operational efficiency by 25% and helped reduce trip delays by 15%.',
    tech: ['React', 'TypeScript', 'React Query', 'Supabase', 'Google Maps API'],
    accentFrom: '#38bdf8',
    accentTo: '#0f766e',
    visualLabel: 'RTT',
    visibility: 'Internal product',
    aliases: ['recovery', 'tracker', 'recovery time tracker', 'google maps'],
  },
  {
    slug: 'e-sign-platform',
    title: 'E-Sign Platform',
    eyebrow: 'Internal digital signing flow',
    description:
      'A secure document-signing experience with in-browser PDF review, multi-step flows, automated notifications, and CRM synchronization.',
    impact: 'Cut page load time from 3.9s to 2.1s and supports 1,000+ weekly sessions.',
    tech: ['React', 'TypeScript', 'REST APIs', 'Workflow UX', 'Performance Optimization'],
    accentFrom: '#f59e0b',
    accentTo: '#f97316',
    visualLabel: 'ES',
    visibility: 'Internal product',
    aliases: ['esign', 'e-sign', 'signature', 'pdf', 'crm', 'sms'],
  },
  {
    slug: 'task-management-dashboard',
    title: 'Task Management Dashboard',
    eyebrow: 'Personal product build',
    description:
      'A task-focused dashboard with drag-and-drop flows, optimistic updates, local persistence, and polished performance.',
    impact: 'Reached 95+ Lighthouse performance and shipped through automated Vercel deployment.',
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
    items: ['React', 'TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Responsive Design', 'Tailwind CSS'],
  },
  {
    label: 'Data and State',
    items: ['React Query', 'Context API', 'Zustand', 'REST APIs', 'Server State Management'],
  },
  {
    label: 'Delivery',
    items: ['Vercel', 'Render', 'AWS S3/CloudFront', 'CI/CD', 'GitHub Actions', 'Supabase'],
  },
  {
    label: 'Strengths',
    items: ['Performance Optimization', 'Component Design', 'Accessibility', 'SEO', 'Cross-team Collaboration'],
  },
];

export const faq: PortfolioFaq[] = [
  {
    question: 'What kind of roles fit Sabith best?',
    answer:
      'Frontend engineering roles where product quality, performance, and collaboration matter, especially React and TypeScript teams shipping real user-facing workflows.',
  },
  {
    question: 'Can this assistant answer unrelated questions?',
    answer:
      "No. It is intentionally limited to Sabith's background, projects, experience, skills, resume, and contact details.",
  },
  {
    question: 'How should someone reach out?',
    answer: 'Email is the quickest path, and LinkedIn is also available for professional conversations.',
  },
];

export const contact: PortfolioContact = {
  email: 'sabithmohamad1@gmail.com',
  github: 'https://github.com/sabithmohamad',
  linkedin: 'https://www.linkedin.com/in/mohammad-sabith-b95841185/',
  resumeHref: '/resume.pdf',
  actions: [
    { label: 'Resume', href: '/resume.pdf', kind: 'resume', note: 'Current PDF' },
    { label: 'Email', href: 'mailto:sabithmohamad1@gmail.com', kind: 'email', note: 'Best for direct outreach' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mohammad-sabith-b95841185/', kind: 'external', note: 'Professional profile' },
    { label: 'GitHub', href: 'https://github.com/sabithmohamad', kind: 'external', note: 'Code and repositories' },
  ],
};

export const starterPrompts = [
  'Why should I hire you?',
  'What is your experience?',
  'Show me your main projects.',
];

const followupsByIntent: Record<PortfolioIntent, string[]> = {
  about: ['What is your experience?', 'Show me your main projects.', 'How can I contact you?'],
  experience: ['What did you build at Royal Swiss Auto Services?', 'Show me your main projects.', 'What do you specialize in?'],
  projects: ['Tell me more about the E-Sign Platform.', 'What stack do you use most?', 'How can I contact you?'],
  skills: ['What is your experience?', 'Show me your main projects.', 'How do you approach performance?'],
  resume: ['Can I get a quick summary first?', 'What are your main projects?', 'How can I contact you?'],
  contact: ['Can I see your resume?', 'What kind of work do you do?', 'Show me your projects.'],
  availability: ['What is your experience?', 'How can I contact you?', 'Show me your main projects.'],
  unknown: ['What is your experience?', 'Show me your main projects.', 'Why should I hire you?'],
};

const hirePatterns = [
  /\bwhy should (i|we) hire you\b/i,
  /\bwhy hire you\b/i,
  /\bwhy would (i|we) hire you\b/i,
  /\bwhy are you a good fit\b/i,
  /\bwhat makes you a good fit\b/i,
  /\bwhy should (i|we) choose you\b/i,
  /\bconvince me\b/i,
];

const intentMatchers: Array<{ intent: PortfolioIntent; patterns: RegExp[] }> = [
  {
    intent: 'resume',
    patterns: [/\bresume\b/i, /\bcv\b/i, /\bdownload\b/i],
  },
  {
    intent: 'contact',
    patterns: [/\bcontact\b/i, /\bemail\b/i, /\breach\b/i, /\blinkedin\b/i, /\bgithub\b/i],
  },
  {
    intent: 'availability',
    patterns: [/\bavailable\b/i, /\bavailability\b/i, /\bopen to work\b/i, /\bfreelance\b/i, /\brelocat/i],
  },
  {
    intent: 'projects',
    patterns: [/\bproject/i, /\bbuild/i, /\bwork samples?\b/i, /\be-sign\b/i, /\brecovery\b/i, /\bdashboard\b/i],
  },
  {
    intent: 'skills',
    patterns: [/\bskill/i, /\bstack\b/i, /\btech\b/i, /\btools\b/i, /\bspeciali[sz]e/i, /\bfrontend\b/i],
  },
  {
    intent: 'experience',
    patterns: [/\bexperience\b/i, /\bcareer\b/i, /\bwork history\b/i, /\byears\b/i, /\bcurrent role\b/i, /\broyal swiss\b/i, /\bbb leads\b/i],
  },
  {
    intent: 'about',
    patterns: [/\babout\b/i, /\bwho are you\b/i, /\btell me about yourself\b/i, /\bintroduce yourself\b/i],
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

const isHirePrompt = (message: string) => hirePatterns.some(pattern => pattern.test(message));

const isAiIdentityPrompt = (message: string) => /\b(ai|gemini|gpt|chatgpt|codex|bot|robot)\b/i.test(message);

const pickReply = (message: string, variants: string[]) => {
  const seed = message
    .toLowerCase()
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return variants[seed % variants.length] ?? variants[0] ?? '';
};

const playfulRedirect = (message: string) => {
  if (isAiIdentityPrompt(message)) {
    return pickReply(message, [
      `Call me Sabith with a fast silicon intern in the back room. The point of this page is still my work, so ask me about experience, projects, or why I might be a strong fit.`,
      `Under the hood there is definitely some machine help, but the voice you are talking to is Sabith. I would rather talk about shipped work than start a model census.`,
      `Think of it as Sabith in presentation mode with an AI co-pilot quietly carrying the cables. Ask me about my experience, products, or why I might be worth hiring.`,
    ]);
  }

  if (/\b(weather|football|cricket|stocks|bitcoin|movie|song|recipe)\b/i.test(message)) {
    return pickReply(message, [
      `I could fake being a universal oracle, but this page is much better at frontend engineering than weather, markets, or cricket predictions. Ask me about my work instead.`,
      `That topic is outside my portfolio lane. If I start giving stock tips here, somebody should probably revoke my deploy access. Ask me about experience, projects, or fit.`,
      `I stay in my lane here: shipped frontend work, product judgment, performance, and hiring fit. For everything else, the internet has enough confident strangers already.`,
    ]);
  }

  if (/\bjoke\b/i.test(message)) {
    return pickReply(message, [
      `My favorite joke is still shaving seconds off a dashboard before someone suggests a meeting about it. If you want the serious version, ask me about the products I built.`,
      `I work in frontend, so my comedy mostly looks like fixing performance before the loading spinner gets promoted. Ask me about the actual shipped work.`,
      `The punchline is usually performance debt. If you want something more useful, ask me about my projects, experience, or why I would be a good fit.`,
    ]);
  }

  return pickReply(message, [
    `That is a little outside my portfolio lane. If I answered everything on earth, I would need a much bigger navbar. Ask me about my experience, projects, skills, or hiring fit.`,
    `I keep this page focused on my work. The shorter version is: ask me about what I built, how I work, or why I might be worth a conversation.`,
    `I am intentionally opinionated here: less random trivia, more signal about my work. Ask me about experience, projects, skills, or why I would be a strong hire.`,
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
  return focused.length > 0 ? focused : projects;
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

export const getUiBlocksForIntent = (intent: PortfolioIntent, message: string): ChatUiBlock[] => {
  if (isHirePrompt(message)) {
    return [
      { type: 'metrics', title: 'Why I am a strong fit', items: profile.metrics },
      { type: 'actions', title: 'Next step', items: contact.actions.slice(0, 2) },
    ];
  }

  switch (intent) {
    case 'about':
      return [{ type: 'metrics', title: 'Quick snapshot', items: profile.metrics }];
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
        { type: 'metrics', title: 'Impact highlights', items: profile.metrics },
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
      return [{ type: 'actions', title: 'Resume and links', items: contact.actions.slice(0, 2) }];
    case 'contact':
      return [{ type: 'actions', title: 'Direct contact', items: contact.actions }];
    case 'availability':
      return [{ type: 'actions', title: 'Best next step', items: contact.actions.slice(0, 3) }];
    default:
      return [];
  }
};

export const getSuggestedFollowups = (intent: PortfolioIntent) => followupsByIntent[intent];

export const buildDonePayload = (intent: PortfolioIntent, message: string): ChatDonePayload => ({
  intent,
  uiBlocks: getUiBlocksForIntent(intent, message),
  suggestedFollowups: getSuggestedFollowups(intent),
});

export const generateFallbackAnswer = (intent: PortfolioIntent, message: string) => {
  if (isHirePrompt(message)) {
    return `You should hire me if you need a frontend engineer who combines product thinking with strong execution. I work confidently in React and TypeScript, I care about performance, and I focus on building interfaces that feel clean for users while still being practical for the team maintaining them.\n\nMy recent work is backed by outcomes, not just features: 25% higher operational efficiency, a 46% load-time improvement on a signing workflow, and products supporting 1,000+ weekly sessions. That mix of engineering quality, speed, and business impact is where I add the most value.`;
  }

  switch (intent) {
    case 'about':
      return `I'm Mohammad Sabith, a frontend engineer with ${profile.yearsExperience} building React and TypeScript products. Most of my recent work centers on performance, API-heavy workflows, and interfaces that create visible business impact.\n\nMy strongest story is product-focused frontend work: internal platforms, measurable performance gains, and collaborative delivery with designers, backend teams, and operations stakeholders.`;
    case 'experience': {
      const focusedExperience = getReferencedExperience(message);
      const lead = focusedExperience[0];

      if (!lead) {
        return `I have ${profile.yearsExperience} of frontend experience, mainly in React and TypeScript. My recent work spans internal operations tools, digital workflow products, performance optimization, and client-facing product delivery.`;
      }

      return `I have ${profile.yearsExperience} of frontend experience, with recent work at ${lead.company}. In that role, I focused on modern React and TypeScript products, real-time or API-driven workflows, and shipping features that improved how teams actually operate.\n\nA few concrete outcomes are 25% higher operational efficiency, a 46% improvement in page load time on a signing workflow, and products supporting 1,000+ weekly sessions.`;
    }
    case 'projects': {
      const focusedProjects = getReferencedProjects(message);

      if (focusedProjects.length === 1) {
        const [project] = focusedProjects;
        return `${project.title} is one of the strongest examples of my work. ${project.description} The main result was that it ${project.impact.toLowerCase()}\n\nThe stack was centered on ${joinList(project.tech)}, and the product work stayed focused on practical outcomes rather than extra complexity.`;
      }

      return `The three projects I'd highlight first are ${joinList(
        focusedProjects.map(project => project.title),
      )}. Together they show a mix of internal product work, workflow design, performance optimization, and polished frontend execution.\n\nIf you want, I can go deeper into any one of them and break down the problem, stack, and outcome.`;
    }
    case 'skills':
      return `My core stack is React, TypeScript, JavaScript, and modern frontend architecture. I'm especially strong in performance optimization, API integration, responsive UI work, and building interfaces that are clean for users but practical for the team maintaining them.\n\nI also work comfortably with React Query, Tailwind CSS, Vercel, Render, Supabase, and the deployment and collaboration pieces around production delivery.`;
    case 'resume':
      return `You can open the latest resume directly from the resume action on the page. If you want a quick summary first, I can also give you the short version of my experience, strengths, and current project highlights right here.`;
    case 'contact':
      return `The fastest way to reach me is by email at ${contact.email}. You can also use LinkedIn if that is more convenient.\n\nIf you want, I can also point you to the resume or summarize the work that is most relevant before you reach out.`;
    case 'availability':
      return `The best way to discuss current availability is to reach out directly by email or LinkedIn. That keeps the conversation accurate and up to date while still giving you a quick path to my resume and project background.`;
    default:
      return playfulRedirect(message);
  }
};

export const buildIntentContext = (intent: PortfolioIntent, message: string) => {
  const sections = [
    `Identity:\n- You are Mohammad Sabith.\n- Speak in first person.\n- If asked who you are, say you are Mohammad Sabith, a frontend engineer based in ${profile.location}.`,
    `Profile:\n- Name: ${profile.name}\n- Role: ${profile.role}\n- Location: ${profile.location}\n- Summary: ${profile.summary}`,
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

  if (intent === 'skills' || isHirePrompt(message)) {
    sections.push(`Skills:\n${skillGroups.map(group => `- ${group.label}: ${group.items.join(', ')}`).join('\n')}`);
  }

  if (intent === 'resume' || intent === 'contact' || intent === 'availability' || isHirePrompt(message)) {
    sections.push(
      `Contact:\n- Email: ${contact.email}\n- LinkedIn: ${contact.linkedin}\n- GitHub: ${contact.github}\n- Resume: ${contact.resumeHref}`,
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
