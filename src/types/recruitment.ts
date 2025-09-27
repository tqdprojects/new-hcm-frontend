export interface IJob {
  _id?: string;
  tenantId: string;
  title: string;
  description: string;
  requirements: IJobRequirement[];
  responsibilities: string[];
  qualifications: IQualification[];
  department: string;
  location: string;
  branchId?: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salaryRange: ISalaryRange;
  skills: ISkill[];
  benefits: string[];
  status: JobStatus;
  priority: JobPriority;
  urgency: JobUrgency;
  postedBy: string;
  hiringManager: string;
  recruiters: string[];
  interviewPanel: string[];
  publishedAt?: Date;
  closedAt?: Date;
  applicationDeadline?: Date;
  expectedJoiningDate?: Date;
  headcount: number;
  filledPositions: number;
  applicationsCount: number;
  pipeline: IRecruitmentPipeline;
  aiSettings: IAIJobSettings;
  customFields: ICustomField[];
  tags: string[];
  isRemote: boolean;
  isUrgent: boolean;
  isConfidential: boolean;
  referralBonus?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobRequirement {
  type: 'must-have' | 'nice-to-have';
  category: 'technical' | 'soft-skill' | 'experience' | 'education' | 'certification';
  description: string;
  weight: number;
  aiMatchable: boolean;
}

export interface IQualification {
  type: 'education' | 'certification' | 'experience';
  title: string;
  institution?: string;
  level: 'required' | 'preferred';
  yearsRequired?: number;
  description: string;
}

export interface ISkill {
  name: string;
  category: 'technical' | 'soft' | 'domain';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  isRequired: boolean;
  weight: number;
  alternatives?: string[];
}

export interface ICandidate {
  _id?: string;
  tenantId: string;
  jobId: string;
  personalDetails: ICandidatePersonal;
  contactDetails: ICandidateContact;
  professionalDetails: ICandidateProfessional;
  documents: ICandidateDocument[];
  currentStage: RecruitmentStage;
  status: CandidateStatus;
  source: CandidateSource;
  referredBy?: string;
  appliedAt: Date;
  lastActivityAt: Date;
  timeline: ICandidateTimeline[];
  interviews: IInterview[];
  assessments: IAssessment[];
  feedback: ICandidateFeedback[];
  aiAnalysis: ICandidateAIAnalysis;
  scoring: ICandidateScoring;
  tags: string[];
  notes: ICandidateNote[];
  isShortlisted: boolean;
  isBlacklisted: boolean;
  blacklistReason?: string;
  expectedSalary?: number;
  noticePeriod?: number;
  availability?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICandidatePersonal {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth?: Date;
  gender?: string;
  nationality?: string;
  currentLocation: string;
  preferredLocation: string[];
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  photoUrl?: string;
}

export interface ICandidateContact {
  email: string;
  phone: string;
  alternateEmail?: string;
  alternatePhone?: string;
  address: {
    street?: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  socialProfiles: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
  };
}

export interface ICandidateProfessional {
  currentCompany?: string;
  currentDesignation?: string;
  totalExperience: number;
  relevantExperience: number;
  currentSalary?: number;
  expectedSalary?: number;
  noticePeriod?: number;
  servingNoticePeriod: boolean;
  lastWorkingDay?: Date;
  reasonForChange?: string;
  workExperience: IWorkExperience[];
  education: IEducation[];
  certifications: ICertification[];
  skills: ICandidateSkill[];
  achievements: string[];
  projects: IProject[];
}

export interface IWorkExperience {
  company: string;
  designation: string;
  department?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  teamSize?: number;
  reportingTo?: string;
  reasonForLeaving?: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  grade?: string;
  percentage?: number;
  isCompleted: boolean;
}

export interface ICertification {
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  verificationUrl?: string;
  isVerified: boolean;
}

export interface ICandidateSkill {
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  lastUsed?: Date;
  isCertified: boolean;
}

export interface IProject {
  name: string;
  description: string;
  role: string;
  technologies: string[];
  startDate: Date;
  endDate?: Date;
  teamSize?: number;
  url?: string;
  achievements: string[];
}

export interface ICandidateDocument {
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  isVerified: boolean;
  aiExtractedData?: any;
}

export interface ICandidateTimeline {
  stage: RecruitmentStage;
  status: CandidateStatus;
  timestamp: Date;
  performedBy: string;
  comments?: string;
  duration?: number;
  metadata?: any;
}

export interface IInterview {
  _id?: string;
  candidateId: string;
  jobId: string;
  type: InterviewType;
  round: number;
  scheduledAt: Date;
  duration: number;
  mode: InterviewMode;
  location?: string;
  meetingLink?: string;
  interviewers: IInterviewer[];
  status: InterviewStatus;
  feedback?: IInterviewFeedback;
  aiGuide?: IAIInterviewGuide;
  recordingUrl?: string;
  notes: string;
  rescheduledCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInterviewer {
  userId: string;
  name: string;
  role: string;
  isLead: boolean;
  feedback?: IInterviewerFeedback;
}

export interface IInterviewerFeedback {
  rating: number;
  technicalSkills: number;
  communication: number;
  problemSolving: number;
  culturalFit: number;
  experience: number;
  strengths: string[];
  weaknesses: string[];
  comments: string;
  recommendation: InterviewRecommendation;
  confidence: number;
}

export interface IInterviewFeedback {
  overallRating: number;
  interviewerFeedbacks: IInterviewerFeedback[];
  consensusRating: number;
  recommendation: InterviewRecommendation;
  nextSteps: string;
  concerns: string[];
  highlights: string[];
  aiSummary?: string;
}

export interface IAIInterviewGuide {
  questions: IAIQuestion[];
  rubric: IAIRubric[];
  focusAreas: string[];
  difficulty: string;
  estimatedDuration: number;
  competencyMapping: any[];
}

export interface IAIQuestion {
  id: string;
  question: string;
  type: 'technical' | 'behavioral' | 'situational' | 'case-study';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedAnswer: string;
  evaluationCriteria: string[];
  timeAllocation: number;
  followUpQuestions?: string[];
  codeChallenge?: ICodeChallenge;
}

export interface ICodeChallenge {
  problem: string;
  language: string[];
  difficulty: string;
  timeLimit: number;
  testCases: any[];
  solution?: string;
}

export interface IAIRubric {
  criteria: string;
  weight: number;
  levels: {
    excellent: string;
    good: string;
    average: string;
    poor: string;
  };
}

export interface IAssessment {
  _id?: string;
  candidateId: string;
  jobId: string;
  type: AssessmentType;
  title: string;
  description: string;
  duration: number;
  questions: IAssessmentQuestion[];
  status: AssessmentStatus;
  score?: number;
  maxScore: number;
  startedAt?: Date;
  completedAt?: Date;
  aiProctoring: boolean;
  results?: IAssessmentResult;
  createdAt: Date;
}

export interface IAssessmentQuestion {
  id: string;
  type: 'multiple-choice' | 'coding' | 'essay' | 'case-study';
  question: string;
  options?: string[];
  correctAnswer?: any;
  points: number;
  timeLimit?: number;
  difficulty: string;
  skills: string[];
}

export interface IAssessmentResult {
  totalScore: number;
  percentage: number;
  timeSpent: number;
  questionsAttempted: number;
  correctAnswers: number;
  skillScores: Record<string, number>;
  aiAnalysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    cheatingProbability: number;
  };
}

export interface ICandidateFeedback {
  providedBy: string;
  role: string;
  stage: RecruitmentStage;
  rating: number;
  comments: string;
  strengths: string[];
  concerns: string[];
  recommendation: 'proceed' | 'reject' | 'hold';
  timestamp: Date;
}

export interface ICandidateAIAnalysis {
  overallScore: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  culturalFitScore: number;
  salaryExpectationMatch: number;
  locationMatch: number;
  availabilityMatch: number;
  strengths: string[];
  gaps: string[];
  riskFactors: string[];
  recommendation: string;
  confidence: number;
  reasoning: string;
  competencyScores: Record<string, number>;
  predictedPerformance: number;
  retentionProbability: number;
  timeToProductivity: number;
  lastAnalyzedAt: Date;
}

export interface ICandidateScoring {
  resumeScore: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  assessmentScore?: number;
  interviewScore?: number;
  referenceScore?: number;
  totalScore: number;
  weightedScore: number;
  ranking?: number;
  percentile?: number;
  scoringCriteria: IScoringCriteria[];
  lastUpdatedAt: Date;
}

export interface IScoringCriteria {
  criteria: string;
  weight: number;
  score: number;
  maxScore: number;
  reasoning: string;
}

export interface ICandidateNote {
  id: string;
  content: string;
  type: 'general' | 'interview' | 'assessment' | 'reference' | 'concern';
  isPrivate: boolean;
  addedBy: string;
  addedAt: Date;
  tags: string[];
}

export interface IRecruitmentPipeline {
  applied: number;
  screening: number;
  assessment: number;
  interview: number;
  reference: number;
  offer: number;
  hired: number;
  rejected: number;
  withdrawn: number;
}

export interface IAIJobSettings {
  enableResumeMatching: boolean;
  enableAutoScreening: boolean;
  enableSkillAssessment: boolean;
  enableVideoInterview: boolean;
  enableReferenceCheck: boolean;
  screeningCriteria: IScreeningCriteria[];
  matchingWeights: IMatchingWeights;
  autoRejectThreshold: number;
  autoShortlistThreshold: number;
}

export interface IScreeningCriteria {
  type: 'experience' | 'education' | 'skills' | 'location' | 'salary';
  operator: 'gte' | 'lte' | 'eq' | 'contains' | 'in';
  value: any;
  weight: number;
  isRequired: boolean;
}

export interface IMatchingWeights {
  skills: number;
  experience: number;
  education: number;
  location: number;
  salary: number;
  availability: number;
}

export interface ICustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean';
  options?: string[];
  isRequired: boolean;
  defaultValue?: any;
  validation?: any;
}

// Enums
export enum EmploymentType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance',
  TEMPORARY = 'temporary'
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  PRINCIPAL = 'principal',
  DIRECTOR = 'director',
  VP = 'vp',
  C_LEVEL = 'c-level'
}

export enum JobStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  PAUSED = 'paused',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on-hold'
}

export enum JobPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum JobUrgency {
  NORMAL = 'normal',
  URGENT = 'urgent',
  IMMEDIATE = 'immediate'
}

export enum CandidateStatus {
  APPLIED = 'applied',
  SCREENING = 'screening',
  ASSESSMENT = 'assessment',
  INTERVIEW = 'interview',
  REFERENCE_CHECK = 'reference-check',
  OFFER_EXTENDED = 'offer-extended',
  OFFER_ACCEPTED = 'offer-accepted',
  OFFER_DECLINED = 'offer-declined',
  HIRED = 'hired',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
  ON_HOLD = 'on-hold'
}

export enum RecruitmentStage {
  APPLICATION = 'application',
  RESUME_SCREENING = 'resume-screening',
  PHONE_SCREENING = 'phone-screening',
  ASSESSMENT = 'assessment',
  TECHNICAL_INTERVIEW = 'technical-interview',
  BEHAVIORAL_INTERVIEW = 'behavioral-interview',
  FINAL_INTERVIEW = 'final-interview',
  REFERENCE_CHECK = 'reference-check',
  BACKGROUND_CHECK = 'background-check',
  OFFER_DISCUSSION = 'offer-discussion',
  OFFER_NEGOTIATION = 'offer-negotiation',
  HIRED = 'hired'
}

export enum CandidateSource {
  WEBSITE = 'website',
  LINKEDIN = 'linkedin',
  INDEED = 'indeed',
  GLASSDOOR = 'glassdoor',
  REFERRAL = 'referral',
  RECRUITER = 'recruiter',
  WALK_IN = 'walk-in',
  CAMPUS = 'campus',
  HEADHUNTING = 'headhunting',
  SOCIAL_MEDIA = 'social-media',
  JOB_FAIR = 'job-fair',
  AGENCY = 'agency'
}

export enum InterviewType {
  PHONE_SCREENING = 'phone-screening',
  VIDEO_SCREENING = 'video-screening',
  TECHNICAL = 'technical',
  BEHAVIORAL = 'behavioral',
  CASE_STUDY = 'case-study',
  PRESENTATION = 'presentation',
  PANEL = 'panel',
  FINAL = 'final',
  CULTURAL_FIT = 'cultural-fit',
  EXECUTIVE = 'executive'
}

export enum InterviewMode {
  IN_PERSON = 'in-person',
  VIDEO_CALL = 'video-call',
  PHONE = 'phone',
  HYBRID = 'hybrid'
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no-show'
}

export enum InterviewRecommendation {
  STRONG_HIRE = 'strong-hire',
  HIRE = 'hire',
  LEAN_HIRE = 'lean-hire',
  LEAN_NO_HIRE = 'lean-no-hire',
  NO_HIRE = 'no-hire',
  STRONG_NO_HIRE = 'strong-no-hire'
}

export enum AssessmentType {
  TECHNICAL = 'technical',
  APTITUDE = 'aptitude',
  PERSONALITY = 'personality',
  COGNITIVE = 'cognitive',
  DOMAIN = 'domain',
  CODING = 'coding',
  CASE_STUDY = 'case-study',
  PRESENTATION = 'presentation'
}

export enum AssessmentStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export enum DocumentType {
  RESUME = 'resume',
  COVER_LETTER = 'cover-letter',
  PORTFOLIO = 'portfolio',
  CERTIFICATE = 'certificate',
  REFERENCE_LETTER = 'reference-letter',
  ID_PROOF = 'id-proof',
  ADDRESS_PROOF = 'address-proof',
  SALARY_SLIP = 'salary-slip',
  OFFER_LETTER = 'offer-letter',
  RELIEVING_LETTER = 'relieving-letter',
  OTHER = 'other'
}