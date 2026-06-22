// ─── General quick-question categories (used by category tabs) ─────────────────
export type CategoryId =
  | "academics"
  | "attendance"
  | "wellbeing"
  | "parent_engagement"
  | "admissions"
  | "finance"
  | "school_improvement"
  | "mind_body_soul";

export interface SuggestionCategory {
  id: CategoryId;
  label: string;
  iconName: "BookOpen" | "UserCheck" | "Heart" | "Users" | "TrendingUp" | "DollarSign" | "Building2" | "Sparkles";
  chipColor: string;
  tabActive: string;
  questions: string[];
}

export interface RoleSuggestionConfig {
  categories: SuggestionCategory[];
}

// ─── Mind • Body • Soul ─────────────────────────────────────────────────────────
export type MbsMode = "mind" | "body" | "soul";

export interface MbsChips {
  mind: string[];
  body: string[];
  soul: string[];
}

export const roleMbsChips: Record<string, MbsChips> = {
  admin: {
    mind: [
      "Which students need academic intervention?",
      "Which grade is performing below expectations?",
      "What are the biggest academic risks this month?",
      "Summarize school-wide academic performance.",
      "Which subjects require additional support?",
    ],
    body: [
      "Which students have concerning attendance patterns?",
      "How healthy is overall student engagement?",
      "What wellbeing trends should we monitor?",
      "Which grades show reduced participation?",
      "Generate a student health and attendance overview.",
    ],
    soul: [
      "Which students may need wellbeing support?",
      "How can we strengthen school culture?",
      "Suggest a character-building initiative.",
      "Which students show exceptional leadership potential?",
      "Generate a holistic student development report.",
    ],
  },
  vp1: {
    mind: [
      "Which classes in Grades 1–4 are underperforming?",
      "Show academic concerns in my division.",
      "Which students need additional support?",
      "What academic trends should I focus on this month?",
    ],
    body: [
      "Which classes in Grades 1–4 have attendance concerns?",
      "Which groups show reduced engagement?",
      "Suggest healthy classroom practices for young learners.",
      "How can I improve energy and participation in early years?",
    ],
    soul: [
      "Which groups in my division may benefit from mentoring?",
      "How can we improve student wellbeing in Grades 1–4?",
      "Suggest character-building activities for primary students.",
      "Which students show exceptional social development?",
    ],
  },
  vp2: {
    mind: [
      "Which classes in Grades 5–8 are underperforming?",
      "Show academic concerns in my division.",
      "Which students need additional support?",
      "What academic trends should I focus on this month?",
    ],
    body: [
      "Which classes in Grades 5–8 have attendance concerns?",
      "Which groups show reduced engagement?",
      "How can we support student health and wellness?",
      "Suggest physical activity initiatives for upper primary.",
    ],
    soul: [
      "Which groups in Grades 5–8 may benefit from mentoring?",
      "How can we improve student wellbeing in my division?",
      "Suggest leadership opportunities for Grades 5–8.",
      "How can we build a stronger sense of community?",
    ],
  },
  vp3: {
    mind: [
      "Which classes in Grades 9–12 are underperforming?",
      "Show academic concerns in my division.",
      "Which secondary students need intervention?",
      "What exam readiness concerns should I address?",
    ],
    body: [
      "Which secondary students have attendance concerns?",
      "How can we support exam-season wellness?",
      "Which groups show stress or reduced engagement?",
      "Suggest healthy study habits for secondary students.",
    ],
    soul: [
      "Which secondary students may need wellbeing support?",
      "How can we build leadership in Grades 9–12?",
      "Suggest community service opportunities.",
      "How can we strengthen school culture in secondary?",
    ],
  },
  teacher: {
    mind: [
      "Which students in my class are falling behind?",
      "How can I improve engagement in my lessons?",
      "Suggest differentiated instruction strategies.",
      "Which students need extra academic support?",
      "Help me create a class revision plan.",
    ],
    body: [
      "Which students may be struggling with attendance?",
      "How can I improve classroom energy and participation?",
      "Suggest healthy classroom practices for my students.",
      "Which students seem disengaged or fatigued?",
    ],
    soul: [
      "How can I build empathy in my classroom?",
      "Suggest a wellbeing activity for my students.",
      "How can I support student confidence this term?",
      "Which students may benefit from peer mentoring?",
    ],
  },
  parent: {
    mind: [
      "How can I support my child academically at home?",
      "What study habits should we work on together?",
      "Which subject needs the most attention?",
      "How can I help my child prepare for exams?",
    ],
    body: [
      "How can I help my child maintain healthy routines?",
      "How much sleep should students get during exams?",
      "How can I reduce my child's screen-time dependence?",
      "What physical activities support better focus?",
    ],
    soul: [
      "How can I strengthen my child's confidence?",
      "How do I encourage resilience in my child?",
      "How can I support my child's emotional wellbeing at home?",
      "How do I help my child build stronger friendships?",
    ],
  },
  student: {
    mind: [
      "Create a study plan for me.",
      "Which subject needs the most improvement?",
      "How should I prepare for my upcoming exams?",
      "What are my academic strengths?",
      "Suggest revision tips for my weakest subject.",
    ],
    body: [
      "How can I stay focused and energized through the day?",
      "What healthy habits improve my learning?",
      "How can I balance studies and exercise?",
      "What should I eat to improve concentration?",
    ],
    soul: [
      "How can I become more confident?",
      "How can I manage exam stress?",
      "How can I become a better leader?",
      "How can I build stronger friendships?",
      "How do I stay motivated when things feel hard?",
    ],
  },
};

// ─── Mind • Body • Soul quick actions ──────────────────────────────────────────
export interface MbsQuickAction {
  label: string;
  iconName: "ClipboardList" | "Calendar" | "UserPlus" | "Activity" | "Heart" | "Star" | "Users" | "BookOpen";
  color: string;
}

export const MBS_ACTIONS: Record<MbsMode, MbsQuickAction[]> = {
  mind: [
    { label: "Create Intervention Plan",  iconName: "ClipboardList", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"    },
    { label: "Schedule Parent Meeting",   iconName: "Calendar",       color: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100" },
    { label: "Assign Academic Mentor",    iconName: "UserPlus",       color: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100" },
    { label: "Monitor Progress",          iconName: "Activity",       color: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100"         },
  ],
  body: [
    { label: "Wellbeing Check-In",        iconName: "Heart",          color: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"     },
    { label: "Counsellor Referral",       iconName: "UserPlus",       color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100" },
    { label: "Teacher Follow-Up",         iconName: "BookOpen",       color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"  },
    { label: "Schedule Health Review",    iconName: "Calendar",       color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
  ],
  soul: [
    { label: "Leadership Opportunity",    iconName: "Star",           color: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100" },
    { label: "Community Service",         iconName: "Users",          color: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100" },
    { label: "Peer Mentoring Program",    iconName: "UserPlus",       color: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"     },
    { label: "Schedule Counselling",      iconName: "Calendar",       color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
  ],
};

// ─── General role suggestions (category tabs below MBS) ────────────────────────
export const roleSuggestions: Record<string, RoleSuggestionConfig> = {
  admin: {
    categories: [
      {
        id: "school_improvement",
        label: "School",
        iconName: "Building2",
        chipColor: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
        tabActive: "bg-violet-600 text-white",
        questions: [
          "Generate a school health summary",
          "What are the biggest operational risks?",
          "Which teachers need support?",
          "Summarize board-ready performance metrics",
        ],
      },
      {
        id: "academics",
        label: "Academics",
        iconName: "BookOpen",
        chipColor: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
        tabActive: "bg-blue-600 text-white",
        questions: [
          "Which students are currently at academic risk?",
          "Which students have declining performance?",
          "Which classes need intervention this month?",
          "Show academic performance across all grades",
        ],
      },
      {
        id: "attendance",
        label: "Attendance",
        iconName: "UserCheck",
        chipColor: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        tabActive: "bg-amber-500 text-white",
        questions: [
          "Show attendance trends across all grades",
          "Recommend actions to improve attendance",
          "Which grades have the lowest attendance?",
          "Generate school-wide attendance summary",
        ],
      },
      {
        id: "finance",
        label: "Finance",
        iconName: "DollarSign",
        chipColor: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
        tabActive: "bg-emerald-600 text-white",
        questions: [
          "Show fee collection trends",
          "Which students have overdue fees?",
          "Generate fee collection vs target report",
          "What are the biggest financial risks?",
        ],
      },
      {
        id: "admissions",
        label: "Admissions",
        iconName: "TrendingUp",
        chipColor: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
        tabActive: "bg-sky-500 text-white",
        questions: [
          "Show admissions funnel this month",
          "How many leads converted to enrolments?",
          "What is the predicted enrolment for next term?",
          "Which grade levels have capacity?",
        ],
      },
    ],
  },

  vp1: {
    categories: [
      {
        id: "academics",
        label: "Academics",
        iconName: "BookOpen",
        chipColor: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
        tabActive: "bg-blue-600 text-white",
        questions: [
          "Which students in my grades need intervention?",
          "Show low-performing sections in Grades 1–4",
          "Which students show declining engagement?",
          "Show upcoming academic risks",
        ],
      },
      {
        id: "attendance",
        label: "Attendance",
        iconName: "UserCheck",
        chipColor: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        tabActive: "bg-amber-500 text-white",
        questions: [
          "Compare attendance across Grades 1–4 classes",
          "Which students need parent meetings?",
          "Recommend targeted attendance interventions",
          "Show attendance trends for my division",
        ],
      },
      {
        id: "wellbeing",
        label: "Wellbeing",
        iconName: "Heart",
        chipColor: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
        tabActive: "bg-rose-500 text-white",
        questions: [
          "Which teachers need classroom support?",
          "What should I focus on this week?",
          "Recommend targeted interventions",
          "Summarize today's incidents in Grades 1–4",
        ],
      },
    ],
  },

  vp2: {
    categories: [
      {
        id: "academics",
        label: "Academics",
        iconName: "BookOpen",
        chipColor: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
        tabActive: "bg-blue-600 text-white",
        questions: [
          "Which students in Grades 5–8 need intervention?",
          "Show low-performing sections",
          "Which students show declining engagement?",
          "Show upcoming academic risks in my division",
        ],
      },
      {
        id: "attendance",
        label: "Attendance",
        iconName: "UserCheck",
        chipColor: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        tabActive: "bg-amber-500 text-white",
        questions: [
          "Compare attendance across Grades 5–8",
          "Which students need parent meetings?",
          "Recommend targeted attendance interventions",
          "Summarize today's incidents",
        ],
      },
      {
        id: "parent_engagement",
        label: "Parents",
        iconName: "Users",
        chipColor: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
        tabActive: "bg-sky-500 text-white",
        questions: [
          "Which parents should be contacted this week?",
          "Show parent satisfaction in my division",
          "Which classes have low parent engagement?",
          "Recommend parent outreach strategy",
        ],
      },
    ],
  },

  vp3: {
    categories: [
      {
        id: "academics",
        label: "Academics",
        iconName: "BookOpen",
        chipColor: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
        tabActive: "bg-blue-600 text-white",
        questions: [
          "Which students in Grades 9–12 need intervention?",
          "Show exam readiness across secondary grades",
          "Which students show declining engagement?",
          "Show upcoming academic risks",
        ],
      },
      {
        id: "attendance",
        label: "Attendance",
        iconName: "UserCheck",
        chipColor: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        tabActive: "bg-amber-500 text-white",
        questions: [
          "Compare attendance across Grades 9–12",
          "Which students need parent meetings?",
          "Recommend targeted attendance interventions",
          "Summarize today's secondary incidents",
        ],
      },
      {
        id: "parent_engagement",
        label: "Parents",
        iconName: "Users",
        chipColor: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
        tabActive: "bg-sky-500 text-white",
        questions: [
          "Which parents should be contacted this week?",
          "Which students need parent-teacher meetings?",
          "Show parent concerns in secondary division",
          "Recommend parent outreach for at-risk students",
        ],
      },
    ],
  },

  teacher: {
    categories: [
      {
        id: "academics",
        label: "Academics",
        iconName: "BookOpen",
        chipColor: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
        tabActive: "bg-blue-600 text-white",
        questions: [
          "Which students need extra support?",
          "Summarize my class performance",
          "Which students are at risk of falling behind?",
          "Suggest a lesson improvement plan",
        ],
      },
      {
        id: "attendance",
        label: "Homework",
        iconName: "UserCheck",
        chipColor: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        tabActive: "bg-amber-500 text-white",
        questions: [
          "Who has missing homework?",
          "Which students are frequently absent?",
          "Generate class attendance summary",
          "Which parents should I contact?",
        ],
      },
      {
        id: "parent_engagement",
        label: "Parents",
        iconName: "Users",
        chipColor: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
        tabActive: "bg-sky-500 text-white",
        questions: [
          "Message Aarav's parents about Physics",
          "Generate revision strategies for parents",
          "Suggest parent engagement techniques",
          "Create intervention plans for at-risk families",
        ],
      },
    ],
  },

  parent: {
    categories: [
      {
        id: "academics",
        label: "Academics",
        iconName: "BookOpen",
        chipColor: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
        tabActive: "bg-blue-600 text-white",
        questions: [
          "How is my child performing overall?",
          "What are my child's strengths?",
          "What areas need improvement?",
          "Give me a weekly learning summary",
        ],
      },
      {
        id: "attendance",
        label: "Attendance",
        iconName: "UserCheck",
        chipColor: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        tabActive: "bg-amber-500 text-white",
        questions: [
          "Is my child attending regularly?",
          "What homework needs attention?",
          "Show upcoming exams this month",
          "Are there any missed assignments?",
        ],
      },
      {
        id: "wellbeing",
        label: "Wellbeing",
        iconName: "Heart",
        chipColor: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
        tabActive: "bg-rose-500 text-white",
        questions: [
          "How can I support learning at home?",
          "How can I improve study habits?",
          "What activities should my child participate in?",
          "What wellbeing concerns should I know about?",
        ],
      },
    ],
  },

  student: {
    categories: [
      {
        id: "academics",
        label: "Academics",
        iconName: "BookOpen",
        chipColor: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
        tabActive: "bg-blue-600 text-white",
        questions: [
          "How can I improve my grades?",
          "Create a study plan for me",
          "What subjects need more attention?",
          "How can I prepare for exams?",
        ],
      },
      {
        id: "attendance",
        label: "Homework",
        iconName: "UserCheck",
        chipColor: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        tabActive: "bg-amber-500 text-white",
        questions: [
          "Help me manage my homework",
          "What should I focus on this week?",
          "Give me revision tips",
          "Suggest learning resources",
        ],
      },
    ],
  },
};
