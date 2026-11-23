export interface StoryChapter {
  id: string;
  number: string;
  progressRange: [number, number];
  badgeKey: string;
  titleKey: string;
  descriptionKey: string;
  actions: {
    primaryTextKey: string;
    primaryHref: string;
    secondaryTextKey?: string;
    secondaryHref?: string;
  };
}

export interface FeatureSpace {
  id: 'classroom' | 'english' | 'ai-lab';
  titleKey: string;
  subtitleKey: string;
  tagKey: string;
  themeColor: string;
  pointsKeys: string[];
  ctaTextKey: string;
  ctaHref: string;
}

export interface WorkflowStep {
  step: string;
  titleKey: string;
  descKey: string;
}

export interface AiSubjectPreview {
  id: string;
  nameKey: string;
  iconName: string;
  badgeKey: string;
  demoTitleKey: string;
  demoDescKey: string;
}

export interface PricingPlan {
  id: string;
  nameKey: string;
  priceKey: string;
  periodKey: string;
  descKey: string;
  highlighted: boolean;
  featuresKeys: string[];
  ctaKey: string;
  ctaHref: string;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'intro',
    number: '01',
    progressRange: [0.0, 0.20],
    badgeKey: 'home.chapters.ch1.badge',
    titleKey: 'home.chapters.ch1.title',
    descriptionKey: 'home.chapters.ch1.description',
    actions: {
      primaryTextKey: 'home.chapters.ch1.ctaTutor',
      primaryHref: '/tutor',
      secondaryTextKey: 'home.chapters.ch1.ctaEnglish',
      secondaryHref: '/self-study',
    },
  },
  {
    id: 'classroom',
    number: '02',
    progressRange: [0.24, 0.48],
    badgeKey: 'home.chapters.ch2.badge',
    titleKey: 'home.chapters.ch2.title',
    descriptionKey: 'home.chapters.ch2.description',
    actions: {
      primaryTextKey: 'home.chapters.ch2.cta',
      primaryHref: '/tutor',
    },
  },
];

export const FEATURE_SPACES: FeatureSpace[] = [
  {
    id: 'classroom',
    titleKey: 'home.spaces.classroom.title',
    subtitleKey: 'home.spaces.classroom.subtitle',
    tagKey: 'home.spaces.classroom.tag',
    themeColor: '#0EA5E9',
    pointsKeys: [
      'home.spaces.classroom.point1',
      'home.spaces.classroom.point2',
      'home.spaces.classroom.point3',
      'home.spaces.classroom.point4',
    ],
    ctaTextKey: 'home.spaces.classroom.cta',
    ctaHref: '/tutor',
  },
  {
    id: 'english',
    titleKey: 'home.spaces.english.title',
    subtitleKey: 'home.spaces.english.subtitle',
    tagKey: 'home.spaces.english.tag',
    themeColor: '#FF7A00',
    pointsKeys: [
      'home.spaces.english.point1',
      'home.spaces.english.point2',
      'home.spaces.english.point3',
      'home.spaces.english.point4',
    ],
    ctaTextKey: 'home.spaces.english.cta',
    ctaHref: '/self-study',
  },
  {
    id: 'ai-lab',
    titleKey: 'home.spaces.aiLab.title',
    subtitleKey: 'home.spaces.aiLab.subtitle',
    tagKey: 'home.spaces.aiLab.tag',
    themeColor: '#8B5CF6',
    pointsKeys: [
      'home.spaces.aiLab.point1',
      'home.spaces.aiLab.point2',
      'home.spaces.aiLab.point3',
      'home.spaces.aiLab.point4',
    ],
    ctaTextKey: 'home.spaces.aiLab.cta',
    ctaHref: '/student',
  },
];

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: '01',
    titleKey: 'home.workflow.step1.title',
    descKey: 'home.workflow.step1.desc',
  },
  {
    step: '02',
    titleKey: 'home.workflow.step2.title',
    descKey: 'home.workflow.step2.desc',
  },
  {
    step: '03',
    titleKey: 'home.workflow.step3.title',
    descKey: 'home.workflow.step3.desc',
  },
  {
    step: '04',
    titleKey: 'home.workflow.step4.title',
    descKey: 'home.workflow.step4.desc',
  },
];

export const AI_SUBJECTS: AiSubjectPreview[] = [
  {
    id: 'math',
    nameKey: 'home.aiSubjects.math.name',
    iconName: 'Box',
    badgeKey: 'home.aiSubjects.math.badge',
    demoTitleKey: 'home.aiSubjects.math.title',
    demoDescKey: 'home.aiSubjects.math.desc',
  },
  {
    id: 'chemistry',
    nameKey: 'home.aiSubjects.chem.name',
    iconName: 'FlaskConical',
    badgeKey: 'home.aiSubjects.chem.badge',
    demoTitleKey: 'home.aiSubjects.chem.title',
    demoDescKey: 'home.aiSubjects.chem.desc',
  },
  {
    id: 'physics',
    nameKey: 'home.aiSubjects.phys.name',
    iconName: 'Atom',
    badgeKey: 'home.aiSubjects.phys.badge',
    demoTitleKey: 'home.aiSubjects.phys.title',
    demoDescKey: 'home.aiSubjects.phys.desc',
  },
  {
    id: 'english',
    nameKey: 'home.aiSubjects.eng.name',
    iconName: 'Languages',
    badgeKey: 'home.aiSubjects.eng.badge',
    demoTitleKey: 'home.aiSubjects.eng.title',
    demoDescKey: 'home.aiSubjects.eng.desc',
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    nameKey: 'home.pricing.basic.name',
    priceKey: 'home.pricing.basic.price',
    periodKey: 'home.pricing.basic.period',
    descKey: 'home.pricing.basic.desc',
    highlighted: false,
    featuresKeys: [
      'home.pricing.basic.feat1',
      'home.pricing.basic.feat2',
      'home.pricing.basic.feat3',
      'home.pricing.basic.feat4',
      'home.pricing.basic.feat5',
    ],
    ctaKey: 'home.pricing.basic.cta',
    ctaHref: '/tutor',
  },
  {
    id: 'pro',
    nameKey: 'home.pricing.pro.name',
    priceKey: 'home.pricing.pro.price',
    periodKey: 'home.pricing.pro.period',
    descKey: 'home.pricing.pro.desc',
    highlighted: true,
    featuresKeys: [
      'home.pricing.pro.feat1',
      'home.pricing.pro.feat2',
      'home.pricing.pro.feat3',
      'home.pricing.pro.feat4',
      'home.pricing.pro.feat5',
      'home.pricing.pro.feat6',
    ],
    ctaKey: 'home.pricing.pro.cta',
    ctaHref: '/tutor',
  },
];
