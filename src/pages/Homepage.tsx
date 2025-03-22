import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/bg.jpg")',
          zIndex: -1,
        }}
      >
      </div>
      <div className="flex flex-col">        
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8 py-16 sm:py-20">
            {/* Hero Content */}
            <div className="animate-fade-up space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-black/10 backdrop-blur-sm rounded-full mx-auto">
                <span className="text-sm font-medium font-dmsans text-black">
                  Every Drop Counts
                </span>
              </div>
              
              <h1 className="text-4xl -tracking-[0.04em] sm:text-5xl md:text-6xl font-bold font-dmsans leading-tight text-black">
                Your Blood Donation
                <span className="block mt-2 text-blood-500">
                  Saves Lives Today
                </span>
              </h1>
              
              <p className="text-xl sm:text-xl text-gray-600 font-dmsans max-w-2xl mx-auto">
                Connect instantly with hospitals in need. Join our network of lifesavers and make a difference in someone's life through efficient blood donation management.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="w-full sm:w-auto font-dmsans bg-blood-500 hover:bg-blood-600 text-white transition-all duration-300 group text-lg h-14 px-8"
                >
                  Become a Lifesaver
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto font-dmsans border-black/20 text-black hover:bg-white hover:text-red-500 transition-all duration-300 text-lg h-14 px-8"
                >
                  Hospital Login
                </Button>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-6 mt-20 text-center text-black/60">
          <p className="text-sm font-poppins">
            © {new Date().getFullYear()} BloodLink. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

export default Homepage; 