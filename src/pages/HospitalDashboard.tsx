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
import { Filter, Search, Loader2, AlertCircle, Users, Heart, Clock, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodFilter, setBloodFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const isAuth = await isAuthenticated();
        const { role } = await getCurrentUser();
        
        if (!isAuth || role !== 'hospital') {
          navigate('/login');
          return;
        }
        
        const donorData = await getAllDonors();
        setDonors(donorData);
        setFilteredDonors(donorData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthAndFetchData();
  }, [navigate]);
  
  useEffect(() => {
    let result = donors;
    
    if (searchTerm) {
      result = result.filter(
        donor =>
          donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donor.phoneNumber.includes(searchTerm)
      );
    }
    
    if (bloodFilter !== 'all') {
      result = result.filter(donor => donor.bloodGroup === bloodFilter);
    }
    
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
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setBloodFilter('all');
    setAgeFilter('all');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blood-600 mx-auto mb-4" />
          <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4 font-medium">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blood-500 hover:bg-blood-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-6 sm:py-8 px-4 max-w-7xl mx-auto w-full mt-16">
        <div className="animate-slide-down space-y-6">
          {/* Dashboard Header */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold font-dmsans mb-2">Hospital Dashboard</h1>
            <p className="text-gray-600 font-poppins">
              Find and connect with potential blood donors in your area.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
              <CardContent className="p-4">
                <Users className="h-5 w-5 text-blood-500 mb-2" />
                <p className="text-2xl font-bold text-blood-700">{donors.length}</p>
                <p className="text-sm text-gray-600">Active Donors</p>
              </CardContent>
            </Card>
            <Card className="bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
              <CardContent className="p-4">
                <Heart className="h-5 w-5 text-blood-500 mb-2" />
                <p className="text-2xl font-bold text-blood-700">
                  {donors.filter(d => d.lastDonation === null).length}
                </p>
                <p className="text-sm text-gray-600">Available Now</p>
              </CardContent>
            </Card>
            <Card className="bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
              <CardContent className="p-4">
                <Clock className="h-5 w-5 text-blood-500 mb-2" />
                <p className="text-2xl font-bold text-blood-700">15m</p>
                <p className="text-sm text-gray-600">Avg. Response</p>
              </CardContent>
            </Card>
            <Card className="bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
              <CardContent className="p-4">
                <Activity className="h-5 w-5 text-blood-500 mb-2" />
                <p className="text-2xl font-bold text-blood-700">98%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Search and Filters */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg sm:text-xl flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Search and Filter
                </CardTitle>
                <CardDescription className="hidden sm:block">
                  Find donors based on your requirements
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden"
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search donors by name or phone..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-blood-200"
                  />
                </div>
                
                <div className={`grid gap-4 sm:grid-cols-2 ${showFilters ? 'block' : 'hidden sm:grid'}`}>
                  <Select
                    value={bloodFilter}
                    onValueChange={setBloodFilter}
                  >
                    <SelectTrigger>
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
                  
                  <Select
                    value={ageFilter}
                    onValueChange={setAgeFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Age Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ages</SelectItem>
                      <SelectItem value="under25">Under 25</SelectItem>
                      <SelectItem value="25to40">25 to 40</SelectItem>
                      <SelectItem value="over40">Over 40</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="sm:col-span-2 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="text-gray-600 hover:bg-gray-100 transition-all duration-300"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Donor List */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDonors.length > 0 ? (
              filteredDonors.map((donor) => (
                <DonorCard key={donor.email} donor={donor} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 sm:py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
