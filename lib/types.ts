export interface MSForm {
  id: string
  title: string
  description: string
  formUrl: string
  createdAt: string
  category: string
  responsesCount: number
}

export type FormCategory = "Course Evaluation" | "Customer Satisfaction" | "Employee Survey" | "Workshops" | "Events" | "Other"

export const FORM_CATEGORIES: FormCategory[] = [
  "Course Evaluation",
  "Customer Satisfaction", 
  "Employee Survey",
  "Workshops",
  "Events",
  "Other"
]

export interface FormTemplate {
  id: string
  title: string
  description: string
  category: FormCategory
  questions: string[]
  icon: string
  templateUrl: string
}

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: "course-evaluation",
    title: "Course Evaluation",
    description: "Comprehensive form to evaluate training courses and instructor performance",
    category: "Course Evaluation",
    icon: "graduation",
    templateUrl: "",
    questions: [
      "How satisfied are you with the course content?",
      "How would you rate the instructor's performance?",
      "Was the training material clear and understandable?",
      "To what extent did the course meet your expectations?",
      "Would you recommend this course to others?",
      "What are your suggestions for improving the course?"
    ]
  },
  {
    id: "customer-satisfaction",
    title: "Customer Satisfaction",
    description: "Measure customer satisfaction with products and services",
    category: "Customer Satisfaction",
    icon: "smile",
    templateUrl: "",
    questions: [
      "How would you rate your overall experience with us?",
      "How satisfied are you with the product/service quality?",
      "How would you rate our response time to your requests?",
      "Was your issue resolved satisfactorily?",
      "How likely are you to recommend us to others?",
      "What can we improve?"
    ]
  },
  {
    id: "employee-survey",
    title: "Employee Survey",
    description: "Measure employee satisfaction and work environment",
    category: "Employee Survey",
    icon: "users",
    templateUrl: "",
    questions: [
      "How satisfied are you with the work environment?",
      "Do you feel appreciated by management?",
      "How would you rate team communication?",
      "Do you have the tools needed to do your job?",
      "How clear are your work objectives?",
      "What are your suggestions for improving the work environment?"
    ]
  },
  {
    id: "workshop-feedback",
    title: "Workshop Feedback",
    description: "Evaluation form for interactive workshops",
    category: "Workshops",
    icon: "wrench",
    templateUrl: "",
    questions: [
      "How would you rate the workshop organization?",
      "Was the content practical and useful?",
      "How engaging was the facilitator with participants?",
      "Was the allocated time sufficient?",
      "What did you benefit from the most?",
      "What topics would you like to see in the future?"
    ]
  },
  {
    id: "event-feedback",
    title: "Event Feedback",
    description: "Collect participant feedback on events and conferences",
    category: "Events",
    icon: "calendar",
    templateUrl: "",
    questions: [
      "How would you rate the event organization?",
      "What did you think of the speakers' quality?",
      "Was the venue appropriate?",
      "How would you rate the hospitality and services?",
      "Did the event meet your expectations?",
      "Will you attend our future events?"
    ]
  },
  {
    id: "product-feedback",
    title: "New Product Feedback",
    description: "Collect customer feedback on new products",
    category: "Other",
    icon: "package",
    templateUrl: "",
    questions: [
      "How did you hear about this product?",
      "What is your first impression of the product?",
      "Does the product meet your needs?",
      "How would you rate the product's price compared to its quality?",
      "What features would you like to add?",
      "Would you buy this product again?"
    ]
  }
]
