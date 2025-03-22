import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bloodGroups } from '@/utils/types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';
import Navbar from '@/components/Navbar';
import { getCurrentUser } from '@/utils/authService';

const Donate = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    age: '',
    phoneNumber: ''
  });

  // Fetch user email on component mount
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserEmail = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUserEmail(user.email);
      }
    };
    
    fetchUserEmail();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail) {
      toast.error("User email not found. Please try logging in again.");
      return;
    }

    // Validate form data
    if (!formData.name || !formData.bloodGroup || !formData.age || !formData.phoneNumber) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Insert into blood_donations table
      const { error } = await supabase
        .from('blood_donations')
        .insert({
          email: userEmail,
          name: formData.name,
          blood_group: formData.bloodGroup,
          age: parseInt(formData.age),
          phone_number: formData.phoneNumber
        });

      if (error) throw error;

      toast.success("Thank you for your donation submission!");
      
      // Reset form
      setFormData({
        name: '',
        bloodGroup: '',
        age: '',
        phoneNumber: ''
      });
    } catch (error: any) {
      console.error('Donation error:', error);
      toast.error(error.message || 'Failed to submit donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 font-dmsans">Donate Blood, Save Lives</h1>
          <p className="mt-2 text-lg text-gray-600 font-poppins">Every donation can save up to three lives</p>
        </div>

        <Card className="border-blood-100/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 font-dmsans">Donation Form</CardTitle>
            <CardDescription className="text-gray-500 font-poppins">
              Please provide your details to register as a blood donor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
                  required
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select your blood group" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="25"
                    className="h-11"
                    min="18"
                    max="65"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+1 555-123-4567"
                    className="h-11"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-blood-600 hover:bg-blood-700 text-white font-dmsans"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Donation'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Donate; 