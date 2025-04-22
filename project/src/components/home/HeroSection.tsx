import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowDown } from 'lucide-react';

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Animation for the background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Create particles
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(59, 130, 246, ${Math.random() * 0.3})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const particles: Particle[] = [];
    const createParticles = () => {
      const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 20000));
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    
    createParticles();
    
    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 - distance/1000})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      connectParticles();
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);
  
  // Scroll to authentication section
  const scrollToAuth = () => {
    const authSection = document.getElementById('auth-section');
    if (authSection) {
      authSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />
      
      <div 
        className="container mx-auto px-4 py-16 md:py-24 relative z-10 text-center"
        style={{ zIndex: 1 }}
      >
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
            <Activity size={48} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
          Know Your Risk. Control Your Future.
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
          Live Smart with DiaTwin.
        </h2>
        
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
          AI-powered Digital Twin model personalized to predict, track, and reduce your diabetes risk in real-time.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-16">
          <Link 
            to="/auth?mode=signup" 
            className="px-8 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Create Account
          </Link>
          
          <Link 
            to="/auth" 
            className="px-8 py-3 rounded-full bg-white text-blue-600 font-medium border border-blue-200 hover:border-blue-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Sign In
          </Link>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
          <button 
            onClick={scrollToAuth}
            className="text-blue-600 hover:text-blue-800 transition"
            aria-label="Scroll down"
          >
            <ArrowDown size={32} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;