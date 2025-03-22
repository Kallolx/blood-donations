import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bloodGroups } from '@/utils/types';
import { toast } from 'sonner';
import { Loader2, PlusCircle, X, Phone, Mail, UserRound, Heart } from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';
import Navbar from '@/components/Navbar';
import { getCurrentUser } from '@/utils/authService';

const urgencyLevels = ["High", "Medium", "Low"];

interface BloodDonation {
  id: string;
  email: string;
  name: string;
  blood_group: string;
  age: number;
  phone_number: string;
  created_at: string;
}

interface BloodRequest {
  id: string;
  email: string;
  name: string;
  address: string;
  blood_group: string;
  quantity: number;
  urgency: string;
  created_at: string;
}

const Hospitals = () => {
  const [loading, setLoading] = useState(false);
  const [loadingDonations, setLoadingDonations] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [donations, setDonations] = useState<BloodDonation[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    bloodGroup: '',
    quantity: '',
    urgency: 'Medium'
  });

  // Fetch user email and blood donations on component mount
  useEffect(() => {
    const fetchUserEmail = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUserEmail(user.email);
      }
    };
    
    fetchUserEmail();
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoadingDonations(true);
    try {
      const { data, error } = await supabase
        .from('blood_donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setDonations(data as BloodDonation[]);
    } catch (error: any) {
      console.error('Error fetching donations:', error);
      toast.error(error.message || 'Failed to fetch blood donations');
    } finally {
      setLoadingDonations(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail) {
      toast.error("User email not found. Please try logging in again.");
      return;
    }

    // Validate form data
    if (!formData.name || !formData.address || !formData.bloodGroup || !formData.quantity || !formData.urgency) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Insert into blood_requests table
      const { error } = await supabase
        .from('blood_requests')
        .insert({
          email: userEmail,
          name: formData.name,
          address: formData.address,
          blood_group: formData.bloodGroup,
          quantity: parseInt(formData.quantity),
          urgency: formData.urgency
        });

      if (error) throw error;

      toast.success("Blood request submitted successfully!");
      
      // Reset form and hide it
      setFormData({
        name: '',
        address: '',
        bloodGroup: '',
        quantity: '',
        urgency: 'Medium'
      });
      setShowForm(false);
    } catch (error: any) {
      console.error('Request error:', error);
      toast.error(error.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getBloodGroupColor = (group: string) => {
    switch (group.charAt(0)) {
      case 'A': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'B': return 'bg-green-100 text-green-800 border-green-200';
      case 'O': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'AB': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-dmsans">Available Blood Donors</h1>
            <p className="mt-2 text-lg text-gray-600 font-poppins">Find and contact blood donors for your hospital needs</p>
          </div>
          
          <Button 
            onClick={() => setShowForm(!showForm)} 
            className={`${showForm ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-blood-600 text-white hover:bg-blood-700'}`}
          >
            {showForm ? (
              <><X className="h-5 w-5 mr-2" /> Cancel</>
            ) : (
              <><PlusCircle className="h-5 w-5 mr-2" /> New Request</>
            )}
          </Button>
        </div>

        {showForm && (
          <Card className="border-blood-100/20 shadow-xl mb-10">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 font-dmsans">Blood Request Form</CardTitle>
              <CardDescription className="text-gray-500 font-poppins">
                Request blood donations for your hospital or medical facility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Hospital/Facility Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="City General Hospital"
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Medical Center Dr, City, State"
                      className="h-11"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group Needed</Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
                      required
                    >
                      <SelectTrigger className="h-11">
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
                    <Label htmlFor="quantity">Quantity (units)</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="3"
                      className="h-11"
                      min="1"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                      required
                    >
                      <SelectTrigger className="h-11">
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
                    'Submit Request'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {loadingDonations ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-blood-600" />
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blood donors available at the moment.</p>
            <Button 
              onClick={() => setShowForm(true)} 
              className="mt-4 bg-blood-600 text-white hover:bg-blood-700"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Create Request
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <Card key={donation.id} className="border-blood-100/20 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-gray-900 font-dmsans">
                      <div className="flex items-center">
                        <UserRound className="h-5 w-5 mr-2 text-gray-600" />
                        {donation.name}
                      </div>
                    </CardTitle>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getBloodGroupColor(donation.blood_group)}`}>
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{donation.blood_group}</span>
                    </div>
                  </div>
                  <CardDescription className="text-gray-500 font-poppins mt-1">
                    Donor Age: {donation.age} years
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-800">{donation.phone_number}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-800">{donation.email}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 text-sm text-gray-500 border-t border-gray-100 flex justify-between items-center">
                  <span>Registered on {formatDate(donation.created_at)}</span>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-blood-600 border-blood-200 hover:bg-blood-50"
                      onClick={() => window.location.href = `tel:${donation.phone_number}`}
                    >
                      <Phone className="h-4 w-4 mr-1" /> Call
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-blood-600 border-blood-200 hover:bg-blood-50"
                      onClick={() => window.location.href = `mailto:${donation.email}`}
                    >
                      <Mail className="h-4 w-4 mr-1" /> Email
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hospitals; 