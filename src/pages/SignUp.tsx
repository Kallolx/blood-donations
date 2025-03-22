import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { signUp } from '@/utils/authService';
import { Loader2 } from 'lucide-react';
import { UserRole } from '@/utils/types';
import Navbar from '@/components/Navbar';

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'donor' as UserRole
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await signUp(formData);
      if (success) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
      <div className="mt-20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card className="border-blood-100/20 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold font-dmsans text-gray-900">
              Create an Account
            </CardTitle>
            <CardDescription className="text-gray-500 font-poppins">
              Join us in saving lives through blood donation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="h-11"
                />
              </div>


              <Button
                type="submit"
                className="w-full h-11 bg-blood-600 hover:bg-blood-700 text-white font-dmsans"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>

              <p className="text-center text-sm text-gray-500 font-poppins">
                Already have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-blood-600 hover:text-blood-800"
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </Button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default SignUp;
