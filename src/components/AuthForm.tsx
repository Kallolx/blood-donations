import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { UserRole, SignUpData, LoginData, bloodGroups, urgencyLevels } from '@/utils/types';
import { signUp, login } from '@/utils/authService';
import { Loader2, Heart, Hospital } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'signup';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>('donor');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [urgency, setUrgency] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let success = false;
      
      if (type === 'signup') {
        const baseData = {
          email,
          password,
          role,
        };
        
        let signupData: SignUpData;
        
        if (role === 'donor') {
          signupData = {
            ...baseData,
            name,
            bloodGroup,
            age: Number(age),
            phoneNumber,
            role: 'donor',
          };
        } else {
          signupData = {
            ...baseData,
            name,
            address,
            bloodGroup,
            quantity: Number(quantity),
            urgency,
            role: 'hospital',
          };
        }
        
        success = await signUp(signupData);
      } else {
        const loginData: LoginData = {
          email,
          password,
          role,
        };
        
        success = await login(loginData);
      }
      
      if (success) {
        if (role === 'donor') {
          navigate('/donor-dashboard');
        } else {
          navigate('/hospital-dashboard');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 sm:px-6 sm:py-12 flex flex-col items-center justify-center bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-dmsans text-gray-900 mb-3">
            {type === 'login' ? 'Welcome Back' : 'Join BloodLink'}
          </h1>
          <p className="text-gray-600 font-poppins">
            {type === 'login'
              ? 'Sign in to continue saving lives'
              : 'Create an account to start making a difference'}
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/80 border-blood-100/20 shadow-xl shadow-blood-500/5">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex justify-center space-x-4">
              <Button
                type="button"
                variant={role === 'donor' ? 'default' : 'outline'}
                className={`flex-1 ${role === 'donor' ? 'bg-blood-500 hover:bg-blood-600' : ''}`}
                onClick={() => setRole('donor')}
              >
                <Heart className={`h-4 w-4 mr-2 ${role === 'donor' ? 'text-white' : 'text-blood-500'}`} />
                Donor
              </Button>
              <Button
                type="button"
                variant={role === 'hospital' ? 'default' : 'outline'}
                className={`flex-1 ${role === 'hospital' ? 'bg-blood-500 hover:bg-blood-600' : ''}`}
                onClick={() => setRole('hospital')}
              >
                <Hospital className={`h-4 w-4 mr-2 ${role === 'hospital' ? 'text-white' : 'text-blood-500'}`} />
                Hospital
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 transition-all duration-300 focus:ring-2 focus:ring-blood-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 transition-all duration-300 focus:ring-2 focus:ring-blood-200"
                />
              </div>

              {type === 'signup' && (
                <div className="space-y-4 animate-fade-down">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      {role === 'donor' ? 'Full Name' : 'Hospital Name'}
                    </Label>
                    <Input
                      id="name"
                      placeholder={role === 'donor' ? 'John Doe' : 'City General Hospital'}
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 transition-all duration-300 focus:ring-2 focus:ring-blood-200"
                    />
                  </div>

                  {role === 'donor' ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bloodGroup" className="text-sm font-medium text-gray-700">Blood Group</Label>
                          <Select
                            value={bloodGroup}
                            onValueChange={setBloodGroup}
                          >
                            <SelectTrigger id="bloodGroup" className="h-11">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {bloodGroups.map((group) => (
                                <SelectItem key={group} value={group}>{group}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="age" className="text-sm font-medium text-gray-700">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            placeholder="25"
                            required
                            min={18}
                            value={age}
                            onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                            className="h-11 transition-all duration-300 focus:ring-2 focus:ring-blood-200"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          placeholder="+1 (555) 000-0000"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="h-11 transition-all duration-300 focus:ring-2 focus:ring-blood-200"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium text-gray-700">Hospital Address</Label>
                        <Input
                          id="address"
                          placeholder="123 Medical Center Dr"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="h-11 transition-all duration-300 focus:ring-2 focus:ring-blood-200"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bloodGroup" className="text-sm font-medium text-gray-700">Blood Needed</Label>
                          <Select
                            value={bloodGroup}
                            onValueChange={setBloodGroup}
                          >
                            <SelectTrigger id="bloodGroup" className="h-11">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {bloodGroups.map((group) => (
                                <SelectItem key={group} value={group}>{group}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity (ml)</Label>
                          <Input
                            id="quantity"
                            type="number"
                            placeholder="500"
                            required
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                            className="h-11 transition-all duration-300 focus:ring-2 focus:ring-blood-200"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="urgency" className="text-sm font-medium text-gray-700">Urgency Level</Label>
                        <Select
                          value={urgency}
                          onValueChange={(value) => setUrgency(value as 'High' | 'Medium' | 'Low')}
                        >
                          <SelectTrigger id="urgency" className="h-11">
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent>
                            {urgencyLevels.map((level) => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-11 bg-blood-500 hover:bg-blood-600 transition-all duration-300 mt-6"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>{type === 'login' ? 'Sign In' : 'Create Account'}</span>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-4 pb-6 text-center">
            <div className="w-full text-sm text-gray-600">
              {type === 'login' ? (
                <div>
                  New to BloodLink?{' '}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-semibold text-blood-600 hover:text-blood-800"
                    onClick={() => navigate('/signup')}
                  >
                    Create an account
                  </Button>
                </div>
              ) : (
                <div>
                  Already have an account?{' '}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-semibold text-blood-600 hover:text-blood-800"
                    onClick={() => navigate('/login')}
                  >
                    Sign in
                  </Button>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;
