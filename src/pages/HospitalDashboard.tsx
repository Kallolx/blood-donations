
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import DonorCard from '@/components/DonorCard';
import { getCurrentUser, isAuthenticated, getAllDonors } from '@/utils/authService';
import { Donor } from '@/utils/types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodFilter, setBloodFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  
  // Get user data and check authentication
  useEffect(() => {
    const { role } = getCurrentUser();
    
    if (!isAuthenticated() || role !== 'hospital') {
      navigate('/login');
      return;
    }
    
    // Fetch donor data
    const fetchDonors = async () => {
      const donorData = getAllDonors();
      setDonors(donorData);
      setFilteredDonors(donorData);
    };
    
    fetchDonors();
  }, [navigate]);
  
  // Handle filtering
  useEffect(() => {
    let result = donors;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        donor =>
          donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donor.phoneNumber.includes(searchTerm)
      );
    }
    
    // Apply blood group filter
    if (bloodFilter !== 'all') {
      result = result.filter(donor => donor.bloodGroup === bloodFilter);
    }
    
    // Apply age filter
    if (ageFilter !== 'all') {
      if (ageFilter === 'under25') {
        result = result.filter(donor => donor.age < 25);
      } else if (ageFilter === '25to40') {
        result = result.filter(donor => donor.age >= 25 && donor.age <= 40);
      } else if (ageFilter === 'over40') {
        result = result.filter(donor => donor.age > 40);
      }
    }
    
    setFilteredDonors(result);
  }, [searchTerm, bloodFilter, ageFilter, donors]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle clearing filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setBloodFilter('all');
    setAgeFilter('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-8 px-4 max-w-7xl mx-auto w-full mt-16">
        <div className="animate-slide-down">
          <h1 className="text-3xl font-bold mb-2">Hospital Dashboard</h1>
          <p className="text-gray-600 mb-8">
            Find potential blood donors for your hospital.
          </p>
          
          {/* Filters */}
          <Card className="mb-6 glass-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Search and Filter
              </CardTitle>
              <CardDescription>
                Find donors based on your requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search donors..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-blood-200"
                    />
                  </div>
                </div>
                
                <div>
                  <Select
                    value={bloodFilter}
                    onValueChange={setBloodFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Blood Groups</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select
                    value={ageFilter}
                    onValueChange={setAgeFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Age Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ages</SelectItem>
                      <SelectItem value="under25">Under 25</SelectItem>
                      <SelectItem value="25to40">25 to 40</SelectItem>
                      <SelectItem value="over40">Over 40</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-3 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="text-gray-600 hover:bg-gray-100 transition-all duration-300"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Donor List */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDonors.length > 0 ? (
              filteredDonors.map((donor) => (
                <DonorCard key={donor.email} donor={donor} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 mb-2">No donors found matching your criteria.</p>
                <Button
                  variant="link"
                  onClick={handleClearFilters}
                  className="text-blood-600 hover:text-blood-800"
                >
                  Clear filters to see all donors
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HospitalDashboard;
