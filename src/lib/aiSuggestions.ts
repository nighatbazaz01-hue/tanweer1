// ─── General quick-question categories (used by category tabs) ─────────────────
export type CategoryId =
  | "academics"
  | "attendance"
  | "wellbeing"
  | "parent_engagement"
  | "admissions"
  | "finance"
  | "school_improvement"
  | "mind_body_soul"
  | "interventions"
  | "leadership";

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
export type MbsMode = "mind" | "body" | "soul" | "holistic";

export interface MbsChips {
  mind: string[];
  body: string[];
  soul: string[];
}

export const roleMbsChips: Record<string, MbsChips> = {
  admin: {
    mind: [
      "Which students need academic intervention right now?",
      "Which grade is performing below expectations this term?",
      "What are the biggest academic risks this month?",
      "Summarize school-wide academic performance.",
      "Which subjects require additional teacher support?",
      "Show me the top 5 at-risk students this term.",
      "Which classes have the highest grade variance?",
      "What percentage of students are on track for end-of-year targets?",
      "Which teachers are struggling with student engagement?",
      "Generate a board-ready academic performance overview.",
    ],
    body: [
      "Which students have concerning attendance patterns?",
      "How healthy is overall student engagement?",
      "What wellbeing trends should we monitor this term?",
      "Which grades show reduced participation in activities?",
      "Generate a student health and attendance overview.",
      "Which students have missed more than 15% of school days?",
      "What is the school-wide attendance trend this month?",
      "Which extracurricular programmes have the lowest enrolment?",
      "How does student wellness compare to last term?",
      "Recommend a school-wide physical wellbeing initiative.",
    ],
    soul: [
      "Which students may need wellbeing or counselling support?",
      "How can we strengthen school culture this term?",
      "Suggest a character-building initiative for the whole school.",
      "Which students show exceptional leadership potential?",
      "Generate a holistic student development report.",
      "How is our school belonging score tracking?",
      "Which students show signs of social isolation?",
      "Recommend a peer mentoring programme structure.",
      "How can we better celebrate student achievements?",
      "What soul-building activities should we prioritise this month?",
    ],
  },

  vp1: {
    mind: [
      "Which classes in Grades 1–4 are underperforming?",
      "Show academic concerns in my division this term.",
      "Which primary students need additional support urgently?",
      "What academic trends should I focus on this month?",
      "Which Grade 4 students need intervention before secondary transition?",
      "Show me the lowest-performing sections in my division.",
      "Which subjects show the most variance in early years?",
      "How can I support teachers with differentiated instruction?",
      "Which students are excelling and could benefit from extension?",
      "Generate a divisional academic summary for my records.",
    ],
    body: [
      "Which classes in Grades 1–4 have attendance concerns?",
      "Which student groups show reduced engagement this week?",
      "Suggest healthy classroom practices for young learners.",
      "How can I improve energy and participation in early years?",
      "Which primary students have attendance below 85%?",
      "What physical activity programmes work best for Grades 1–4?",
      "How can I support students returning after illness?",
      "Which Grade 3–4 students show signs of physical fatigue?",
      "Suggest morning routines that boost early-year engagement.",
      "How do I support student wellness during exam periods?",
    ],
    soul: [
      "Which groups in my division may benefit from peer mentoring?",
      "How can we improve student wellbeing in Grades 1–4?",
      "Suggest character-building activities for primary students.",
      "Which students show exceptional social development?",
      "How can I build stronger classroom communities in early years?",
      "Which Grade 1–2 students show signs of separation anxiety?",
      "Suggest morning circle activities that build belonging.",
      "How can teachers model emotional literacy for young students?",
      "Which students could benefit from a buddy system?",
      "How should I recognise and celebrate character in assemblies?",
    ],
  },

  vp2: {
    mind: [
      "Which classes in Grades 5–8 are underperforming this term?",
      "Show academic concerns in my division.",
      "Which students need additional academic support?",
      "What academic trends should I focus on this month?",
      "Which Grade 8 students are at risk before secondary transition?",
      "Show me the subjects with highest failure rates in Grades 5–8.",
      "Which sections have the widest performance spread?",
      "How can I help teachers address learning gaps in my division?",
      "Which students went from average to at-risk this term?",
      "Generate a mid-term academic review for my division.",
    ],
    body: [
      "Which classes in Grades 5–8 have attendance concerns?",
      "Which student groups show reduced engagement this week?",
      "How can we support student health and wellness in upper primary?",
      "Suggest physical activity initiatives for Grades 5–8.",
      "Which students have attendance below 85% in my division?",
      "How are sports and extracurricular activities tracking?",
      "What are the top health risks to monitor in Grades 5–8?",
      "How can I reduce lunchtime behavioural incidents?",
      "Which students seem physically or emotionally fatigued?",
      "Suggest a divisional wellness check-in process.",
    ],
    soul: [
      "Which groups in Grades 5–8 may benefit from peer mentoring?",
      "How can we improve student wellbeing in my division?",
      "Suggest leadership opportunities for Grades 5–8.",
      "How can we build a stronger sense of community?",
      "Which students show early leadership traits worth nurturing?",
      "How can we reduce bullying and social exclusion in Grades 6–7?",
      "Suggest assembly themes that build character for this age group.",
      "Which students could benefit from a student leadership role?",
      "How should I support Grade 8 students facing social pressures?",
      "Recommend a mentoring structure for upper primary students.",
    ],
  },

  vp3: {
    mind: [
      "Which classes in Grades 9–12 are underperforming?",
      "Show academic concerns in secondary this term.",
      "Which secondary students need urgent intervention?",
      "What exam readiness concerns should I address now?",
      "Which Grade 12 students are at risk of failing their finals?",
      "Which subjects show the most inconsistency in Grades 9–12?",
      "How is Grade 10 exam preparation tracking?",
      "Which students have declined academically since last term?",
      "Generate an exam-readiness report for Grades 11–12.",
      "Which teachers in secondary need additional resources?",
    ],
    body: [
      "Which secondary students have attendance concerns?",
      "How can we support exam-season wellness in Grades 9–12?",
      "Which student groups show stress or reduced engagement?",
      "Suggest healthy study habits for secondary students.",
      "Which Grade 12 students are at risk of burnout?",
      "How is sports participation tracking in secondary?",
      "Which students show signs of exam anxiety that needs addressing?",
      "Suggest a daily wellness routine for secondary students.",
      "How can I support students during high-pressure exam weeks?",
      "Which students have had 3+ absences in the past 2 weeks?",
    ],
    soul: [
      "Which secondary students may need wellbeing support?",
      "How can we build leadership in Grades 9–12?",
      "Suggest community service opportunities for senior students.",
      "How can we strengthen school culture in secondary?",
      "Which Grade 11–12 students show exceptional leadership?",
      "How can we reduce exam-season anxiety school-wide?",
      "Suggest a mentoring programme pairing Grade 12 with Grade 9.",
      "Which students would benefit from a student council role?",
      "How can I help Grade 12 students build post-school resilience?",
      "Recommend a soul-building activity for secondary assemblies.",
    ],
  },

  teacher: {
    mind: [
      "Which students in my class are falling behind?",
      "How can I improve engagement in my lessons?",
      "Suggest differentiated instruction strategies for my class.",
      "Which students need extra academic support this week?",
      "Help me create a class revision plan for upcoming exams.",
      "Which students have the most homework overdue?",
      "Which lesson structures work best for Grade 10 students?",
      "How can I use formative assessment more effectively?",
      "Which student pairs work well for collaborative learning?",
      "Suggest 3 low-stakes ways to check comprehension this week.",
    ],
    body: [
      "Which students in my class may be struggling with attendance?",
      "How can I improve classroom energy and participation?",
      "Suggest healthy classroom practices for Grade 10 students.",
      "Which students seem disengaged or fatigued in class?",
      "How can I structure lessons to maintain focus for longer?",
      "Which students could benefit from movement breaks?",
      "How should I support a student returning after illness?",
      "What are signs of exam stress I should watch for?",
      "Suggest a 5-minute classroom energiser activity.",
      "How can I help students balance study load and wellbeing?",
    ],
    soul: [
      "How can I build empathy and belonging in my classroom?",
      "Suggest a wellbeing activity for my students this week.",
      "How can I support student confidence during exam season?",
      "Which students may benefit from peer mentoring?",
      "How can I make every student feel valued in my class?",
      "Which students show leadership potential I should nurture?",
      "How do I handle a student who seems socially withdrawn?",
      "Suggest a weekly ritual that builds classroom culture.",
      "How can I encourage a growth mindset in Grade 10?",
      "What do I do if a student seems emotionally distressed?",
    ],
  },

  parent: {
    mind: [
      "How can I support my child academically at home?",
      "What study habits should we work on together?",
      "Which subject needs the most attention this term?",
      "How can I help my child prepare for upcoming exams?",
      "What is the best way to review homework together?",
      "How can I tell if my child is struggling academically?",
      "What online resources help most for Physics revision?",
      "How much study time is appropriate for a 15-year-old?",
      "How do I motivate my child when they feel demotivated?",
      "What should I ask at the next parent-teacher meeting?",
    ],
    body: [
      "How can I help my child maintain healthy routines?",
      "How much sleep should students get during exam season?",
      "How can I reduce my child's screen-time dependence?",
      "What physical activities support better focus?",
      "How can I ensure my child eats well during exam week?",
      "What are signs my child is physically burnt out?",
      "How much exercise does a teenager need each day?",
      "How can I create a calming bedtime routine for my child?",
      "What foods help improve concentration and memory?",
      "How can I support my child's energy through the school day?",
    ],
    soul: [
      "How can I strengthen my child's confidence?",
      "How do I encourage resilience when my child fails or struggles?",
      "How can I support my child's emotional wellbeing at home?",
      "How do I help my child build stronger friendships?",
      "How can I reduce exam anxiety at home?",
      "What do I do if my child seems withdrawn or unhappy?",
      "How can I praise my child in ways that build real confidence?",
      "How do I talk to my child about pressure and expectations?",
      "What leadership opportunities should my child try at school?",
      "How can I make home a safe space for my child to talk?",
    ],
  },

  student: {
    mind: [
      "Create a study plan for my upcoming exams.",
      "Which subject needs the most improvement?",
      "How should I prepare for Physics this week?",
      "What are my academic strengths I can build on?",
      "Suggest revision tips for my weakest subject.",
      "How can I improve my class rank this term?",
      "Help me organise my revision schedule for next week.",
      "How do I approach a topic I completely don't understand?",
      "What's the most effective way to revise for Chemistry?",
      "How can I stop procrastinating on my English essay?",
    ],
    body: [
      "How can I stay focused and energized through the school day?",
      "What healthy habits will improve my learning?",
      "How can I balance studying and getting enough exercise?",
      "What should I eat to improve concentration?",
      "How much sleep do I really need before an exam?",
      "What do I do when I feel mentally exhausted from studying?",
      "How can I manage my energy across a full school day?",
      "What's the best way to take breaks while studying?",
      "How do I avoid getting sick during exam season?",
      "What can I do in 10 minutes to reset my focus?",
    ],
    soul: [
      "How can I become more confident in class?",
      "How can I manage exam stress when it feels overwhelming?",
      "How can I become a better leader among my peers?",
      "How can I build stronger friendships at school?",
      "How do I stay motivated when I feel like giving up?",
      "What can I do when I fail a test or make a big mistake?",
      "How do I deal with a difficult classmate or conflict?",
      "How can I contribute more to my school community?",
      "What habits should I build now that will help me in life?",
      "How can I develop a growth mindset this term?",
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
  holistic: [
    { label: "Create Full Intervention",  iconName: "ClipboardList", color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"  },
    { label: "Schedule Parent Meeting",   iconName: "Calendar",       color: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100" },
    { label: "Assign Support Mentor",     iconName: "UserPlus",       color: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100" },
    { label: "Monitor All Dimensions",    iconName: "Activity",       color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
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
          "Generate a school health summary for the board",
          "What are the biggest operational risks this month?",
          "Which teachers need professional development support?",
          "Summarize board-ready performance metrics for Q2",
          "How are we performing against our annual targets?",
          "What are the top 3 priorities for school improvement?",
          "Which departments need additional resources?",
          "How does our school compare to last year's benchmarks?",
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
          "Which students have declining performance trends?",
          "Which classes need academic intervention this month?",
          "Show academic performance across all grades",
          "What subjects have the highest failure rates?",
          "Which grade has the lowest average performance?",
          "Which students improved most significantly this term?",
          "Generate a subject-level performance breakdown",
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
          "Recommend actions to improve school-wide attendance",
          "Which grades have the lowest attendance this month?",
          "Generate a school-wide attendance summary",
          "Which students have chronic absenteeism?",
          "Which days of the week have the most absences?",
          "How does this month's attendance compare to last month?",
          "Which grade shows the most improved attendance?",
        ],
      },
      {
        id: "finance",
        label: "Finance",
        iconName: "DollarSign",
        chipColor: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
        tabActive: "bg-emerald-600 text-white",
        questions: [
          "Show fee collection trends for this month",
          "Which students have overdue fees over 30 days?",
          "Generate a fee collection vs target report",
          "What are the biggest financial risks to address?",
          "How many families are on payment plans?",
          "Which grade level has the highest default rate?",
          "Predict next month's fee collection shortfall",
          "Which students should receive financial support?",
        ],
      },
      {
        id: "admissions",
        label: "Admissions",
        iconName: "TrendingUp",
        chipColor: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
        tabActive: "bg-sky-500 text-white",
        questions: [
          "Show the admissions funnel for this month",
          "How many leads converted to enrolments this term?",
          "What is the predicted enrolment for next term?",
          "Which grade levels have remaining capacity?",
          "Which lead sources are converting best?",
          "What is our admissions conversion rate vs last year?",
          "Which enrolled students haven't completed onboarding?",
          "Suggest strategies to improve lead-to-enrolment conversion",
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
          "Which students in Grades 1–4 need academic intervention?",
          "Show the lowest-performing sections in my division",
          "Which students show declining engagement this month?",
          "What are the top academic risks in my division?",
          "Which Grade 4 students need attention before secondary?",
          "Which teachers need support with differentiated instruction?",
          "Generate a divisional academic summary",
          "Which subjects need more focus in early years?",
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
          "Which students in my division need parent meetings?",
          "Recommend targeted attendance interventions",
          "Show attendance trends for my division this month",
          "Which students have below 85% attendance?",
          "Which days have the highest absence rate?",
          "What are the main absence reasons in early years?",
          "Which families should be contacted about attendance?",
        ],
      },
      {
        id: "wellbeing",
        label: "Wellbeing",
        iconName: "Heart",
        chipColor: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
        tabActive: "bg-rose-500 text-white",
        questions: [
          "Which teachers in my division need classroom support?",
          "What should I prioritise this week for my division?",
          "Recommend targeted interventions for primary students",
          "Summarize recent incidents or concerns in Grades 1–4",
          "Which students show social or emotional challenges?",
          "How can I support student transitions into school?",
          "Which students need referral to the school counsellor?",
          "Suggest a wellbeing initiative for early years",
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
          "Which students in Grades 5–8 need academic intervention?",
          "Show low-performing sections in my division",
          "Which students show declining engagement?",
          "What are the top academic risks this month?",
          "Which Grade 8 students are at risk before secondary?",
          "Which subjects have the most variance in Grades 5–8?",
          "Generate a mid-term academic review for my division",
          "Which students improved most significantly this term?",
        ],
      },
      {
        id: "attendance",
        label: "Attendance",
        iconName: "UserCheck",
        chipColor: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        tabActive: "bg-amber-500 text-white",
        questions: [
          "Compare attendance across Grades 5–8 classes",
          "Which students need parent meetings this week?",
          "Recommend targeted attendance interventions",
          "Summarize today's attendance incidents",
          "Which students are at risk of chronic absenteeism?",
          "How does this week's attendance compare to last week?",
          "Which Grade 7 students are showing attendance decline?",
          "What parent outreach should I prioritise today?",
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
          "Show parent engagement levels in my division",
          "Which classes have the lowest parent engagement?",
          "Recommend a parent outreach strategy for my division",
          "Which families haven't responded to recent communications?",
          "What topics should I cover in the next parent information night?",
          "Which students would benefit most from parent meetings?",
          "Generate a parent communication plan for at-risk students",
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
          "Which students in Grades 9–12 need academic intervention?",
          "Show exam readiness across secondary grades",
          "Which students show declining performance?",
          "What are the top academic risks for secondary this term?",
          "Which Grade 12 students are at risk of failing finals?",
          "Which subjects have highest failure rates in secondary?",
          "Generate an exam-readiness report for Grades 11–12",
          "Which students declined since last term?",
        ],
      },
      {
        id: "attendance",
        label: "Attendance",
        iconName: "UserCheck",
        chipColor: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        tabActive: "bg-amber-500 text-white",
        questions: [
          "Compare attendance across Grades 9–12 classes",
          "Which secondary students need parent meetings?",
          "Recommend targeted attendance interventions",
          "Summarize today's secondary attendance concerns",
          "Which Grade 12 students have attendance below 85%?",
          "Which days have highest absence rates in secondary?",
          "How does exam season affect secondary attendance?",
          "Which families need urgent attendance outreach?",
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
          "Which secondary students need parent-teacher meetings?",
          "Show parent concerns in the secondary division",
          "Recommend parent outreach for at-risk secondary students",
          "How can I improve parent engagement in Grades 9–12?",
          "Which Grade 12 families need exam readiness briefings?",
          "What should I communicate to parents about exam season?",
          "Generate a parent communication plan for secondary",
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
          "Which students in my class need extra support?",
          "Summarize my class performance this term",
          "Which students are at risk of falling behind?",
          "Suggest a lesson improvement plan for this week",
          "Which students have the most missing assignments?",
          "How can I differentiate instruction for my struggling students?",
          "Help me design a revision class for upcoming exams",
          "Which students improved most significantly this term?",
        ],
      },
      {
        id: "attendance",
        label: "Homework",
        iconName: "UserCheck",
        chipColor: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        tabActive: "bg-amber-500 text-white",
        questions: [
          "Who has missing homework in my class?",
          "Which students are frequently absent this month?",
          "Generate a class attendance and submission summary",
          "Which parents should I contact this week?",
          "Which students have submitted all assignments on time?",
          "What's the best way to re-engage a student after absences?",
          "Which homework tasks have the lowest completion rate?",
          "Suggest strategies to improve homework submission rates",
        ],
      },
      {
        id: "parent_engagement",
        label: "Parents",
        iconName: "Users",
        chipColor: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
        tabActive: "bg-sky-500 text-white",
        questions: [
          "Message Aarav's parents about Physics performance",
          "Generate revision strategies I can share with parents",
          "Suggest parent engagement techniques for this term",
          "Create an intervention communication for at-risk families",
          "What should I tell parents at the next parent-teacher meeting?",
          "Draft a message to parents about upcoming exams",
          "Which parents haven't responded to my recent messages?",
          "How can I involve parents more in homework support?",
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
          "How is my child performing overall this term?",
          "What are my child's academic strengths?",
          "What areas need improvement this month?",
          "Give me a weekly learning summary for Aarav",
          "Which subject needs the most attention right now?",
          "How can I help Aarav with Physics at home?",
          "What is Aarav's current grade rank in class?",
          "What resources can help with Chemistry revision?",
        ],
      },
      {
        id: "attendance",
        label: "Schedule",
        iconName: "UserCheck",
        chipColor: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        tabActive: "bg-amber-500 text-white",
        questions: [
          "Is Aarav attending school regularly?",
          "What homework needs attention this week?",
          "Show upcoming exams for Aarav this month",
          "Are there any missing or overdue assignments?",
          "What's Aarav's attendance record this term?",
          "What important dates should I know about?",
          "What is the exam schedule for the next 2 weeks?",
          "Which homework is highest priority right now?",
        ],
      },
      {
        id: "wellbeing",
        label: "Wellbeing",
        iconName: "Heart",
        chipColor: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
        tabActive: "bg-rose-500 text-white",
        questions: [
          "How can I best support Aarav's learning at home?",
          "How can I help build better study habits together?",
          "What school activities should Aarav participate in?",
          "What wellbeing concerns should I be aware of?",
          "How do I support Aarav's emotional health during exams?",
          "What are healthy screen-time limits for teenagers?",
          "How can I make home a good study environment?",
          "How do I know if Aarav is stressed or struggling?",
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
          "How can I improve my grades this term?",
          "Create a study plan for my upcoming exams",
          "Which subjects need the most attention?",
          "How can I best prepare for my next exam?",
          "What revision method works best for Physics?",
          "How do I approach topics I don't understand?",
          "Which of my subjects has improved most?",
          "How can I move up in my class ranking?",
        ],
      },
      {
        id: "attendance",
        label: "Homework",
        iconName: "UserCheck",
        chipColor: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        tabActive: "bg-amber-500 text-white",
        questions: [
          "Help me manage my homework this week",
          "What should I focus on most urgently today?",
          "Give me revision tips for my next exam",
          "Suggest study resources for Chemistry",
          "Which assignments are highest priority?",
          "Help me plan my revision for next 5 days",
          "What's the best way to review past papers?",
          "How do I avoid leaving homework to the last minute?",
        ],
      },
    ],
  },
};
