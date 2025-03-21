
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Droplet, Users, Hospital, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-4 pt-16 pb-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto w-full text-center space-y-6 animate-slide-up">
          <div className="inline-flex items-center justify-center p-2 bg-blood-50 rounded-full mb-4">
            <Droplet className="h-6 w-6 text-blood-500" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-blood-700 via-blood-600 to-blood-500 bg-clip-text text-transparent">
            Connect. Donate. Save Lives.
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A streamlined platform connecting blood donors with hospitals in need, making the donation process efficient and life-saving.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="bg-blood-500 hover:bg-blood-600 text-white transition-all duration-300 group"
              onClick={() => navigate('/signup')}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blood-200 text-blood-700 hover:bg-blood-50 transition-all duration-300"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-blood-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blood-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Donors</h3>
              <p className="text-gray-600">
                Register as a blood donor, provide your blood type and contact information, and connect with hospitals in need.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Hospital className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Hospitals</h3>
              <p className="text-gray-600">
                Register your facility, specify blood types needed, quantities required, and urgency levels to find donors quickly.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Droplet className="h-6 w-6 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Matching</h3>
              <p className="text-gray-600">
                Our system instantly connects donors with compatible blood types to hospitals in need, saving precious time.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-blood-500 to-blood-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-6">Ready to make a difference?</h3>
          <p className="text-blood-50 mb-8 max-w-2xl mx-auto">
            Join our platform today and become part of a network saving lives through blood donation.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blood-600 hover:bg-blood-50 transition-all duration-300"
            onClick={() => navigate('/signup')}
          >
            Sign Up Now
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Droplet className="h-5 w-5 text-blood-500" />
            <span className="text-white font-semibold">BloodLink</span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} BloodLink. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
