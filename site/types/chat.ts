export type PortfolioIntent =
  | 'about'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'resume'
  | 'contact'
  | 'availability'
  | 'unknown';

export type MessageRole = 'user' | 'assistant';

export type MessageStatus = 'streaming' | 'done' | 'error';

export interface ApiChatMessage {
  role: MessageRole;
  content: string;
}

export interface ChatMessage extends ApiChatMessage {
  id: string;
  status?: MessageStatus;
  uiBlocks?: ChatUiBlock[];
  suggestedFollowups?: string[];
}

export interface MetricItem {
  label: string;
  value: string;
}

export interface TimelineItem {
  title: string;
  meta: string;
  summary: string;
}

export interface ActionItem {
  label: string;
  href: string;
  kind: 'email' | 'resume' | 'external';
  note?: string;
}

export interface ProjectCardItem {
  title: string;
  eyebrow: string;
  description: string;
  impact: string;
  tech: string[];
  accentFrom: string;
  accentTo: string;
  visualLabel: string;
  visibility: string;
}

export interface SkillGroupItem {
  label: string;
  items: string[];
}

export type ChatUiBlock =
  | {
      type: 'metrics';
      title: string;
      items: MetricItem[];
    }
  | {
      type: 'timeline';
      title: string;
      items: TimelineItem[];
    }
  | {
      type: 'projects';
      title: string;
      items: ProjectCardItem[];
    }
  | {
      type: 'skills';
      title: string;
      groups: SkillGroupItem[];
    }
  | {
      type: 'actions';
      title: string;
      items: ActionItem[];
    };

export interface PortfolioProfile {
  name: string;
  shortName: string;
  role: string;
  location: string;
  tagline: string;
  summary: string;
  yearsExperience: string;
  metrics: MetricItem[];
}

export interface PortfolioExperience {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  stack: string[];
}

export interface PortfolioProject {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  impact: string;
  tech: string[];
  accentFrom: string;
  accentTo: string;
  visualLabel: string;
  visibility: string;
  aliases: string[];
}

export interface PortfolioFaq {
  question: string;
  answer: string;
}

export interface PortfolioContact {
  email: string;
  github: string;
  linkedin: string;
  resumeHref: string;
  actions: ActionItem[];
}

export interface ChatDonePayload {
  intent: PortfolioIntent;
  uiBlocks: ChatUiBlock[];
  suggestedFollowups: string[];
}
