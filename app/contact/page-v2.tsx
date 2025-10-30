"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MessageCircle, 
  CircleDollarSign, 
  Info, 
  Handshake, 
  Users,
  Mail,
  Target,
  Shield,
  CheckCircle2,
  Star,
  ChevronDown,
  ArrowRight,
  Clapperboard
} from "lucide-react";

// Icon fallbacks with proper typing
interface IconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

const ChevronUp: React.FC<IconProps> = ({ className, ...props }) => (
  <ChevronDown className={`${className} rotate-180`} {...props} />
);
const Send: React.FC<IconProps> = ({ className, ...props }) => (
  <ArrowRight className={className} {...props} />
);
const Clock: React.FC<IconProps> = ({ className, ...props }) => (
  <Target className={className} {...props} />
);
const Phone: React.FC<IconProps> = ({ className, ...props }) => (
  <Mail className={className} {...props} />
);
const Video: React.FC<IconProps> = ({ className, ...props }) => (
  <Clapperboard className={className} {...props} />
);
const HelpCircle: React.FC<IconProps> = ({ className, ...props }) => (
  <Info className={className} {...props} />
);
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// TypeScript interfaces
interface IntentPath {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

interface FormConfig {
  fields: string[];
  ctaText: string;
  thankYouAction: string;
}

interface PathSelectorProps {
  onPathSelect: (pathId: string) => void;
}

interface ContactFormProps {
  path: string;
  formData: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

interface FormFieldsProps {
  fields: string[];
  formData: Record<string, string>;
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
  path: string;
}

interface TrustPanelProps {
  path: string;
}

interface ThankYouSectionProps {
  path: string;
  formData: Record<string, string>;
  onStartOver: () => void;
}

interface AlternativeContactCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  detail: string;
  action: string;
  href: string;
}

interface FAQSectionProps {
  showFAQ: boolean;
  setShowFAQ: (show: boolean) => void;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

// Intent paths configuration
const INTENT_PATHS: Record<string, IntentPath> = {
  demo: {
    id: "demo",
    title: "See a Demo",
    subtitle: "Watch how automation transforms your workflow",
    icon: Calendar,
    color: "from-blue-500 to-purple-600",
    description: "30-minute personalized walkthrough"
  },
  question: {
    id: "question", 
    title: "Ask a Question",
    subtitle: "Get expert answers from our team",
    icon: MessageCircle,
    color: "from-green-500 to-teal-600", 
    description: "Quick answers to specific questions"
  },
  pricing: {
    id: "pricing",
    title: "Get Pricing", 
    subtitle: "Custom quotes and ROI calculations",
    icon: CircleDollarSign,
    color: "from-orange-500 to-red-600",
    description: "Transparent pricing, no surprises"
  },
  support: {
    id: "support",
    title: "Get Help",
    subtitle: "Technical support and guidance", 
    icon: Info,
    color: "from-purple-500 to-pink-600",
    description: "Priority support for customers"
  },
  partnership: {
    id: "partnership",
    title: "Partner With Us",
    subtitle: "Integration and business partnerships",
    icon: Handshake, 
    color: "from-indigo-500 to-blue-600",
    description: "Strategic partnership opportunities"
  },
  careers: {
    id: "careers",
    title: "Join Our Team",
    subtitle: "Build the future of automation",
    icon: Users,
    color: "from-teal-500 to-green-600", 
    description: "Remote-first, innovative culture"
  }
};

// Import real data
import contactData from '@/lib/contact-data.json';
import LiveChatWidget from '@/components/chat/LiveChatWidget';
import CalendarBooking from '@/components/calendar/CalendarBooking';
import { ContactAnalytics } from '@/lib/analytics';
import { useABTestVariant } from '@/lib/ab-testing';
import { ContactErrorBoundary, NetworkErrorFallback } from '@/components/ui/ErrorBoundary';
import { useContactSubmission, isNetworkError, isServerError } from '@/lib/api-client';

// Use real data
const TRUST_SIGNALS = contactData.trustSignals;
const FAQ_DATA = contactData.faq;
const TESTIMONIALS = contactData.testimonials;
const COMPANY_INFO = contactData.companyInfo;

// Form field configurations by path
const FORM_CONFIGS: Record<string, FormConfig> = {
  demo: {
    fields: ["name", "email", "company", "companySize", "useCase"],
    ctaText: "Schedule My Demo",
    thankYouAction: "calendar"
  },
  question: {
    fields: ["email", "question"],
    ctaText: "Send Question", 
    thankYouAction: "resources"
  },
  pricing: {
    fields: ["email", "company", "companySize", "employees", "timeline"],
    ctaText: "Calculate My Pricing",
    thankYouAction: "pricing"
  },
  support: {
    fields: ["email", "issueType", "description", "priority"],
    ctaText: "Get Help Now",
    thankYouAction: "support"
  },
  partnership: {
    fields: ["name", "company", "email", "partnershipType", "description"],
    ctaText: "Start the Conversation", 
    thankYouAction: "followup"
  },
  careers: {
    fields: ["name", "email", "role", "experience"],
    ctaText: "Apply Now",
    thankYouAction: "careers"
  }
};

export default function ContactPageV2() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasError, setHasError] = useState(false);
  
  const formRef = useRef<HTMLDivElement>(null);
  const pathSelectorRef = useRef<HTMLDivElement>(null);
  
  // API hooks
  const { submitForm, loading: isSubmitting, error: apiError } = useContactSubmission();
  
  // A/B testing hooks
  const { config: headlineConfig, isInTest: isInHeadlineTest } = useABTestVariant('contact_headline');
  
  // Initialize analytics tracking
  useEffect(() => {
    ContactAnalytics.trackPageView();
    ContactAnalytics.trackScrollDepth();
    ContactAnalytics.trackTimeOnPage();
    
    // Track performance after page load
    setTimeout(() => {
      ContactAnalytics.trackPagePerformance();
    }, 1000);
  }, []);

  // Handle path selection
  const handlePathSelect = (pathId: string) => {
    setSelectedPath(pathId);
    setFormData({});
    setErrors({});
    
    // Track path selection
    ContactAnalytics.trackPathSelected(pathId);
    
    // Smooth scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    const isFirstInput = !formData[field];
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Track form start on first input
    if (isFirstInput && selectedPath && value) {
      ContactAnalytics.trackFormStarted(selectedPath);
    }
    
    // Track field completion
    if (value && selectedPath) {
      ContactAnalytics.trackFieldCompleted(selectedPath, field);
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Form validation
  const validateForm = () => {
    if (!selectedPath) return {};
    
    const config = FORM_CONFIGS[selectedPath];
    const newErrors: Record<string, string> = {};
    
    config.fields.forEach(field => {
      const value = formData[field] || '';
      
      if (field === 'email' && (!value || !value.includes('@'))) {
        newErrors.email = "Please enter a valid work email";
      } else if (field === 'question' && (!value || value.length < 10)) {
        newErrors.question = "Please provide at least 10 characters";
      } else if (['name', 'company', 'description'].includes(field) && !value.trim()) {
        newErrors[field] = `Please enter your ${field}`;
      }
    });
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Track form errors
      Object.entries(validationErrors).forEach(([field, error]) => {
        ContactAnalytics.trackFormError(selectedPath!, 'validation_error', field);
      });
      
      return;
    }
    
    // Clear previous errors
    setErrors({});
    setHasError(false);
    
    try {
      const response = await submitForm(selectedPath!, formData);
      
      if (response.success) {
        // Track successful submission
        const responseData = response as { referenceNumber: string; leadScore?: number; routing?: { priority: string } };
        ContactAnalytics.trackFormSubmitted(
          selectedPath!,
          responseData.referenceNumber,
          responseData.leadScore,
          responseData.routing?.priority
        );
        
        // Store reference number for thank you page
        setFormData(prev => ({ ...prev, referenceNumber: responseData.referenceNumber }));
        setIsSubmitted(true);
      } else {
        // Handle API errors
        const errorMessage = response.error || 'Something went wrong. Please try again.';
        
        if (isNetworkError({ message: errorMessage })) {
          setHasError(true);
        } else if (isServerError({ message: errorMessage })) {
          setErrors({ general: 'Our servers are experiencing issues. Please try again in a few minutes.' });
        } else {
          setErrors({ general: errorMessage });
        }
        
        // Track submission error
        ContactAnalytics.trackFormError(selectedPath!, 'submission_error');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Submission error:', error);
      
      // Handle unexpected errors
      if (error instanceof Error && isNetworkError(error)) {
        setHasError(true);
      } else {
        setErrors({ general: errorMessage });
      }
      
      ContactAnalytics.trackFormError(selectedPath!, 'unexpected_error');
    }
  };

  // Reset to path selector
  const resetToPathSelector = () => {
    setSelectedPath(null);
    setFormData({});
    setErrors({});
    setIsSubmitted(false);
    
    setTimeout(() => {
      if (pathSelectorRef.current) {
        pathSelectorRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Error boundary fallback
  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <NetworkErrorFallback 
          onRetry={() => {
            setHasError(false);
            setErrors({});
            window.location.reload();
          }}
          message="Failed to connect to our servers. Please check your internet connection and try again."
        />
      </div>
    );
  }

  return (
    <ContactErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header Section */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {headlineConfig?.headline || "Let's Build Your"}
            {!headlineConfig?.headline && (
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Automation Success
              </span>
            )}
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            {headlineConfig?.subheadline || "Get personalized guidance from our automation experts. Whether you need a demo, have questions, or want pricing - we'll help you find the perfect solution."}
          </p>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400 mb-12">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>2-hour response time</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>SOC 2 certified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>10,000+ companies trust us</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <AnimatePresence mode="wait">
          {!selectedPath && !isSubmitted && (
            <PathSelector 
              ref={pathSelectorRef}
              onPathSelect={handlePathSelect} 
            />
          )}
          
          {selectedPath && !isSubmitted && (
            <ContactForm
              ref={formRef}
              path={selectedPath}
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onBack={resetToPathSelector}
              isSubmitting={isSubmitting}
              errors={errors}
            />
          )}
          
          {isSubmitted && selectedPath && (
            <ThankYouSection 
              path={selectedPath}
              formData={formData}
              onStartOver={resetToPathSelector}
            />
          )}
        </AnimatePresence>

        {/* Alternative Contact Methods */}
        {!selectedPath && <AlternativeContactMethods />}

        {/* FAQ Section */}
        <FAQSection showFAQ={showFAQ} setShowFAQ={setShowFAQ} />
      </div>
      
      {/* Live Chat Widget */}
      <LiveChatWidget position="bottom-right" theme="dark" primaryColor="#3b82f6" />
      </div>
    </ContactErrorBoundary>
  );
}

// Path Selector Component
const PathSelector = React.forwardRef<HTMLDivElement, PathSelectorProps>(({ onPathSelect }, ref) => (
  <motion.div 
    ref={ref}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="max-w-6xl mx-auto"
  >
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-white mb-4">
        What brings you here today?
      </h2>
      <p className="text-gray-300">
        Choose the option that best matches your needs
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.values(INTENT_PATHS).map((path) => (
        <PathCard 
          key={path.id}
          path={path}
          onClick={() => onPathSelect(path.id)}
        />
      ))}
    </div>
  </motion.div>
));
PathSelector.displayName = 'PathSelector';

// Path Card Component
const PathCard = ({ path, onClick }: { path: IntentPath; onClick: () => void }) => {
  const Icon = path.icon;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full hover:border-white/20 transition-all duration-300">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${path.color} flex items-center justify-center mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">{path.title}</h3>
        <p className="text-gray-300 mb-3">{path.subtitle}</p>
        <p className="text-sm text-gray-400">{path.description}</p>
        
        <div className="mt-4 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
          <span className="text-sm font-medium">Continue</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

// Contact Form Component  
const ContactForm = React.forwardRef<HTMLDivElement, ContactFormProps>(({ 
  path, 
  formData, 
  onInputChange, 
  onSubmit, 
  onBack, 
  isSubmitting, 
  errors 
}, ref) => {
  const pathConfig = INTENT_PATHS[path];
  const formConfig = FORM_CONFIGS[path];
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-white transition-colors mr-4"
              >
                ← Back
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">{pathConfig.title}</h2>
                <p className="text-gray-300">{pathConfig.subtitle}</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <FormFields 
                fields={formConfig.fields}
                formData={formData}
                onChange={onInputChange}
                errors={errors}
                path={path}
              />
              
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {formConfig.ctaText}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Trust Panel */}
        <div className="space-y-6">
          <TrustPanel path={path} />
        </div>
      </div>
    </motion.div>
  );
});
ContactForm.displayName = 'ContactForm';

// Form Fields Component
const FormFields = ({ fields, formData, onChange, errors, path }: FormFieldsProps) => {
  const renderField = (field: string) => {
    const commonProps = {
      value: formData[field] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(field, e.target.value),
      error: errors[field],
      className: "bg-white/5 border-white/10 text-white placeholder-gray-400"
    };

    switch (field) {
      case 'name':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <input
              {...commonProps}
              placeholder="John Smith"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400"
            />
            {errors[field] && <p className="text-red-400 text-sm mt-1">{errors[field]}</p>}
          </div>
        );
      case 'email':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Work Email
            </label>
            <input
              {...commonProps}
              type="email"
              placeholder="john@company.com"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400"
            />
            {errors[field] && <p className="text-red-400 text-sm mt-1">{errors[field]}</p>}
          </div>
        );
      case 'company':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company Name
            </label>
            <input
              {...commonProps}
              placeholder="Acme Corp"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400"
            />
            {errors[field] && <p className="text-red-400 text-sm mt-1">{errors[field]}</p>}
          </div>
        );
      case 'companySize':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company Size
            </label>
            <select
              value={formData[field] || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(field, e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
            >
              <option value="">Select size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-1000">201-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>
        );
      case 'question':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Question
            </label>
            <textarea
              value={formData[field] || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(field, e.target.value)}
              placeholder="How can we help you today?"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none"
            />
            {errors[field] && <p className="text-red-400 text-sm mt-1">{errors[field]}</p>}
          </div>
        );
      // Add other field types as needed...
      default:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              {...commonProps}
              placeholder={`Enter your ${field}`}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400"
            />
            {errors[field] && <p className="text-red-400 text-sm mt-1">{errors[field]}</p>}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {fields.map(field => (
        <div key={field}>
          {renderField(field)}
        </div>
      ))}
    </div>
  );
};

// Trust Panel Component
const TrustPanel = ({ path }: TrustPanelProps) => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
    <h3 className="text-lg font-semibold text-white mb-4">Why you can trust us</h3>
    
    <div className="space-y-4 text-sm">
      <div className="flex items-start gap-3">
        <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-white font-medium">Fast Response</p>
          <p className="text-gray-300">{TRUST_SIGNALS.responseTime}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-white font-medium">Secure & Private</p>
          <p className="text-gray-300">{TRUST_SIGNALS.privacy}</p>
        </div>
      </div>
      
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-white font-medium">No Pressure</p>
          <p className="text-gray-300">{TRUST_SIGNALS.noPressure}</p>
        </div>
      </div>
    </div>

    {/* Testimonial */}
    <div className="mt-6 pt-6 border-t border-white/10">
      <div className="flex gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
      </div>
      <blockquote className="text-gray-300 text-sm italic mb-3">
        "{TESTIMONIALS[0].quote}"
      </blockquote>
      <cite className="text-gray-400 text-sm not-italic">
        <strong>{TESTIMONIALS[0].author}</strong><br />
        {TESTIMONIALS[0].title}, {TESTIMONIALS[0].company}
      </cite>
    </div>
  </div>
);

// Alternative Contact Methods Component
const AlternativeContactMethods = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-4xl mx-auto mt-16"
  >
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">
        Prefer a different way to connect?
      </h2>
      <p className="text-gray-300">Choose whatever works best for you</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <AlternativeContactCard
        icon={MessageCircle}
        title="Live Chat"
        description="Chat with us now"
        detail="Average response: 2 min"
        action="Start Chat"
        href="#chat"
      />
      <AlternativeContactCard
        icon={Phone}
        title="Call Us"
        description={COMPANY_INFO.phone}
        detail={COMPANY_INFO.businessHours}
        action="Call Now"
        href={`tel:${COMPANY_INFO.phone.replace(/[^0-9+]/g, '')}`}
      />
      <AlternativeContactCard
        icon={Calendar}
        title="Schedule a Call"
        description="Pick a time that works"
        detail="15 or 30 minute slots"
        action="View Calendar"
        href="#calendar"
      />
      <AlternativeContactCard
        icon={Mail}
        title="Email Us"
        description={COMPANY_INFO.email}
        detail="We'll respond within 2 hours"
        action="Send Email"
        href={`mailto:${COMPANY_INFO.email}`}
      />
    </div>
  </motion.div>
);

// Alternative Contact Card Component
const AlternativeContactCard = ({ icon: Icon, title, description, detail, action, href }: AlternativeContactCardProps) => (
  <motion.a
    href={href}
    whileHover={{ scale: 1.02, y: -2 }}
    className="block bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300"
  >
    <Icon className="w-8 h-8 text-blue-400 mb-3" />
    <h3 className="text-white font-semibold mb-1">{title}</h3>
    <p className="text-gray-300 mb-2">{description}</p>
    <p className="text-gray-400 text-sm mb-3">{detail}</p>
    <div className="text-blue-400 text-sm font-medium">{action} →</div>
  </motion.a>
);

// FAQ Section Component  
const FAQSection = ({ showFAQ, setShowFAQ }: FAQSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-3xl mx-auto mt-16"
  >
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      <button
        onClick={() => setShowFAQ(!showFAQ)}
        className="w-full flex items-center justify-between text-left"
      >
        <h2 className="text-2xl font-bold text-white">
          Common Questions Before You Reach Out
        </h2>
        {showFAQ ? (
          <ChevronUp className="w-6 h-6 text-gray-400" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {showFAQ && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-4"
          >
            {FAQ_DATA.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
);

// FAQ Item Component
const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-white/10 last:border-b-0 pb-4 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left py-2"
      >
        <h3 className="text-white font-medium pr-4">{question}</h3>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="text-gray-300 mt-2 pr-8">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Thank You Section Component
const ThankYouSection = ({ path, formData, onStartOver }: ThankYouSectionProps) => {
  const pathConfig = INTENT_PATHS[path];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto text-center"
    >
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Got it! We've received your message.
        </h2>
        
        <div className="text-gray-300 mb-8 space-y-2">
          <p><strong>What happens next:</strong></p>
          <ol className="text-left max-w-md mx-auto space-y-1">
            <li>1. You'll receive a confirmation email within 2 minutes</li>
            <li>2. One of our team members will review your inquiry</li>
            <li>3. Expect a personalized response within 2 hours</li>
          </ol>
        </div>

        <div className="bg-white/5 rounded-xl p-6 mb-8">
          <p className="text-gray-300 mb-2">Your reference number:</p>
          <p className="text-2xl font-mono text-blue-400">#{formData.referenceNumber || 'AI' + Date.now().toString().slice(-6)}</p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-300">While you wait, would you like to:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="secondary" size="sm">
              📚 Browse our help center
            </Button>
            <Button variant="secondary" size="sm">
              🎥 Watch a 2-minute overview
            </Button>
            <Button variant="secondary" size="sm">
              📅 Schedule a follow-up call
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <button
            onClick={onStartOver}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Start over with a different question
          </button>
        </div>
      </div>
    </motion.div>
  );
};
