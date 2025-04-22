import { ActivitySquare, BarChart as ChartBar, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    id: 1,
    title: "Know Your Risk",
    description: "Complete your health profile to get an accurate assessment of your diabetes risk based on your medical history, lifestyle, and personal factors.",
    icon: ActivitySquare,
    color: "text-blue-600",
    bg: "bg-blue-100"
  },
  {
    id: 2,
    title: "Track Your Progress",
    description: "Log your daily food intake and health metrics to see how your choices affect your risk level in real-time with personalized feedback.",
    icon: ChartBar,
    color: "text-teal-600",
    bg: "bg-teal-100"
  },
  {
    id: 3,
    title: "Simulate & Prevent",
    description: "Use our AI simulator to see how different food choices affect your diabetes risk before you eat, helping you make smarter decisions.",
    icon: Brain,
    color: "text-purple-600",
    bg: "bg-purple-100"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const HowItWorksSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-600 mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Digital Twin for Diabetes Prevention</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            DiaTwin creates a personalized model of your health to predict and prevent diabetes with AI-powered insights.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature) => (
            <motion.div 
              key={feature.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              variants={itemVariants}
            >
              <div className="p-8">
                <div className={`${feature.bg} ${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-6`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-16 text-center">
          <div className="animate-pulse inline-block px-6 py-3 text-sm font-medium rounded-full bg-blue-600 text-white">
            Get Started Today
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;