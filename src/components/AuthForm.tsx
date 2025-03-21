
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
        // Redirect based on role
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
    <Card className="w-full max-w-md mx-auto glass-panel animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {type === 'login' ? 'Welcome Back' : 'Create an Account'}
        </CardTitle>
        <CardDescription className="text-center">
          {type === 'login'
            ? 'Enter your credentials to access your account'
            : 'Fill in the details below to create your account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">I am a</Label>
            <Select
              value={role}
              onValueChange={(value: UserRole) => setRole(value)}
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="donor">Blood Donor</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="transition-all duration-300 focus:ring-2 focus:ring-blood-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="transition-all duration-300 focus:ring-2 focus:ring-blood-200"
            />
          </div>

          {/* Additional fields for signup */}
          {type === 'signup' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">
                  {role === 'donor' ? 'Full Name' : 'Hospital Name'}
                </Label>
                <Input
                  id="name"
                  placeholder={role === 'donor' ? 'Your full name' : 'Hospital name'}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="transition-all duration-300 focus:ring-2 focus:ring-blood-200"
                />
              </div>

              {role === 'donor' ? (
                // Donor-specific fields
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select
                      value={bloodGroup}
                      onValueChange={setBloodGroup}
                    >
                      <SelectTrigger id="bloodGroup" className="w-full">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Your age"
                      required
                      min={18}
                      value={age}
                      onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                      className="transition-all duration-300 focus:ring-2 focus:ring-blood-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="Your phone number"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="transition-all duration-300 focus:ring-2 focus:ring-blood-200"
                    />
                  </div>
                </>
              ) : (
                // Hospital-specific fields
                <>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Hospital address"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="transition-all duration-300 focus:ring-2 focus:ring-blood-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group Needed</Label>
                    <Select
                      value={bloodGroup}
                      onValueChange={setBloodGroup}
                    >
                      <SelectTrigger id="bloodGroup" className="w-full">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Required Quantity (ml)</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Required quantity"
                      required
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                      className="transition-all duration-300 focus:ring-2 focus:ring-blood-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select
                      value={urgency}
                      onValueChange={(value) => setUrgency(value as 'High' | 'Medium' | 'Low')}
                    >
                      <SelectTrigger id="urgency" className="w-full">
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                      <SelectContent>
                        {urgencyLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </>
          )}

          <Button 
            type="submit" 
            className="w-full bg-blood-500 hover:bg-blood-600 transition-all duration-300"
            disabled={loading}
          >
            {loading ? 
              'Processing...' : 
              type === 'login' ? 'Sign In' : 'Create Account'
            }
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-center text-sm">
          {type === 'login' ? (
            <div>
              Don't have an account?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto text-blood-600 hover:text-blood-800"
                onClick={() => navigate('/signup')}
              >
                Sign up
              </Button>
            </div>
          ) : (
            <div>
              Already have an account?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto text-blood-600 hover:text-blood-800"
                onClick={() => navigate('/login')}
              >
                Log in
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
