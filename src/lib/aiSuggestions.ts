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

const ACADEMICS_ADMIN: SuggestionCategory = {
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
};

const ATTENDANCE_ADMIN: SuggestionCategory = {
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
};

const FINANCE_ADMIN: SuggestionCategory = {
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
};

const WELLBEING_ADMIN: SuggestionCategory = {
  id: "wellbeing",
  label: "Wellbeing",
  iconName: "Heart",
  chipColor: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
  tabActive: "bg-rose-500 text-white",
  questions: [
    "Which students need counselling support?",
    "What are the top parent concerns?",
    "Which teachers need wellbeing support?",
    "Summarize today's school activity",
  ],
};

const SCHOOL_IMPROVEMENT_ADMIN: SuggestionCategory = {
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
};

const MIND_BODY_SOUL: SuggestionCategory = {
  id: "mind_body_soul",
  label: "Mind·Body·Soul",
  iconName: "Sparkles",
  chipColor: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
  tabActive: "bg-gradient-to-r from-indigo-500 to-violet-500 text-white",
  questions: [
    "Which students may need wellbeing support?",
    "Recommend mindfulness activities for the school",
    "Which students may be socially isolated?",
    "How can we strengthen school culture?",
    "Suggest physical wellbeing initiatives",
    "Generate a holistic development report",
  ],
};

const ADMISSIONS_ADMIN: SuggestionCategory = {
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
};

export const roleSuggestions: Record<string, RoleSuggestionConfig> = {
  admin: {
    categories: [
      SCHOOL_IMPROVEMENT_ADMIN,
      ACADEMICS_ADMIN,
      ATTENDANCE_ADMIN,
      FINANCE_ADMIN,
      ADMISSIONS_ADMIN,
      WELLBEING_ADMIN,
      MIND_BODY_SOUL,
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
          "Summarize today's incidents in Grades 1–4",
          "What should I focus on this week?",
          "Recommend targeted interventions",
        ],
      },
      {
        id: "mind_body_soul",
        label: "Mind·Body·Soul",
        iconName: "Sparkles",
        chipColor: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
        tabActive: "bg-gradient-to-r from-indigo-500 to-violet-500 text-white",
        questions: [
          "Which students may need wellbeing support?",
          "Suggest social-emotional learning activities",
          "How can we improve student confidence?",
          "Create a mind-body-soul growth summary",
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
      {
        id: "mind_body_soul",
        label: "Mind·Body·Soul",
        iconName: "Sparkles",
        chipColor: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
        tabActive: "bg-gradient-to-r from-indigo-500 to-violet-500 text-white",
        questions: [
          "Which students may need wellbeing support?",
          "Suggest social-emotional learning activities",
          "Recommend leadership opportunities",
          "How can we improve student confidence?",
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
      {
        id: "mind_body_soul",
        label: "Mind·Body·Soul",
        iconName: "Sparkles",
        chipColor: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
        tabActive: "bg-gradient-to-r from-indigo-500 to-violet-500 text-white",
        questions: [
          "Which students show signs of exam stress?",
          "Recommend mindfulness activities",
          "Which students show exceptional character growth?",
          "Suggest community service projects for Grade 12",
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
          "Recommend differentiated learning activities",
        ],
      },
      {
        id: "attendance",
        label: "Attendance",
        iconName: "UserCheck",
        chipColor: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        tabActive: "bg-amber-500 text-white",
        questions: [
          "Who has missing homework?",
          "Which students are frequently absent?",
          "Generate class attendance summary",
          "Which parents should I contact about attendance?",
        ],
      },
      {
        id: "parent_engagement",
        label: "Parents",
        iconName: "Users",
        chipColor: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
        tabActive: "bg-sky-500 text-white",
        questions: [
          "Which parents should I contact?",
          "Generate revision strategies for parents",
          "Suggest engagement techniques",
          "Create intervention plans for at-risk families",
        ],
      },
      {
        id: "wellbeing",
        label: "Wellbeing",
        iconName: "Heart",
        chipColor: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
        tabActive: "bg-rose-500 text-white",
        questions: [
          "Is any student showing signs of stress?",
          "Which students may be socially isolated?",
          "Recommend wellbeing check-ins this week",
          "How can I improve class engagement?",
        ],
      },
      {
        id: "mind_body_soul",
        label: "Mind·Body·Soul",
        iconName: "Sparkles",
        chipColor: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
        tabActive: "bg-gradient-to-r from-indigo-500 to-violet-500 text-white",
        questions: [
          "Suggest mindfulness activities for my class",
          "Which students show exceptional character growth?",
          "Recommend leadership opportunities for students",
          "How can I strengthen classroom culture?",
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
          "What wellbeing concerns should I know about?",
          "How can I support learning at home?",
          "How can I improve study habits?",
          "What activities should my child participate in?",
        ],
      },
      {
        id: "mind_body_soul",
        label: "Mind·Body·Soul",
        iconName: "Sparkles",
        chipColor: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
        tabActive: "bg-gradient-to-r from-indigo-500 to-violet-500 text-white",
        questions: [
          "How can parents support emotional wellbeing?",
          "Is my child showing signs of stress?",
          "What mindfulness habits help students?",
          "How can I encourage my child's confidence?",
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
          "What are my strongest subjects?",
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
          "How can I improve attendance?",
        ],
      },
      {
        id: "mind_body_soul",
        label: "Mind·Body·Soul",
        iconName: "Sparkles",
        chipColor: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
        tabActive: "bg-gradient-to-r from-indigo-500 to-violet-500 text-white",
        questions: [
          "How can I reduce exam stress?",
          "Recommend a study-break routine",
          "What mindfulness techniques help students?",
          "How can I build more confidence?",
          "Suggest physical activity habits that improve focus",
        ],
      },
    ],
  },
};
