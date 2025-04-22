import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "I didn't know I was pre-diabetic. DiaTwin showed me the risk and helped me reverse it with simple lifestyle changes!",
    name: "Meena K.",
    title: "Teacher, 42",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
    rating: 5
  },
  {
    id: 2,
    quote: "The 'What-If' simulator is incredible. I can see exactly how my food choices impact my health before I even eat. Game-changer!",
    name: "James R.",
    title: "Software Engineer, 38",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    rating: 5
  },
  {
    id: 3,
    quote: "As someone with a family history of diabetes, this app gives me peace of mind. I've reduced my risk score by 30% in three months.",
    name: "Sarah T.",
    title: "Accountant, 45",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    rating: 4
  },
  {
    id: 4,
    quote: "The personalized recommendations are spot-on. My doctor was impressed with how my blood glucose levels improved.",
    name: "Michael P.",
    title: "Retired, 65",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
    rating: 5
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<number | null>(null);
  
  const goToNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  const goToPrev = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  // Auto-rotate testimonials
  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      goToNext();
    }, 5000);
    
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Pause auto-rotation on hover
  const handleMouseEnter = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  const handleMouseLeave = () => {
    if (intervalRef.current === null) {
      intervalRef.current = window.setInterval(() => {
        goToNext();
      }, 5000);
    }
  };

  return (
    <section 
      className="py-16 bg-blue-600 relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-white text-blue-600 mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">What Our Users Say</h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Real people experiencing real results with DiaTwin.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div 
            className="relative overflow-hidden bg-white rounded-2xl shadow-xl h-auto md:h-64"
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="w-full flex-shrink-0 p-8 md:p-10"
                >
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                      
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <button 
              onClick={goToPrev}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-blue-600 hover:bg-blue-50 transition focus:outline-none"
              disabled={isAnimating}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <button 
              onClick={goToNext}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-blue-600 hover:bg-blue-50 transition focus:outline-none"
              disabled={isAnimating}
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 mx-1 rounded-full ${
                currentIndex === index ? 'bg-white' : 'bg-white bg-opacity-30'
              } transition-all duration-300`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;