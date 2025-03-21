
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HospitalCard from '@/components/HospitalCard';
import { getCurrentUser, isAuthenticated, getAllHospitals } from '@/utils/authService';
import { Hospital } from '@/utils/types';
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

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodFilter, setBloodFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  
  // Get user data and check authentication
  useEffect(() => {
    const { role } = getCurrentUser();
    
    if (!isAuthenticated() || role !== 'donor') {
      navigate('/login');
      return;
    }
    
    // Fetch hospital data
    const fetchHospitals = async () => {
      const hospitalData = getAllHospitals();
      setHospitals(hospitalData);
      setFilteredHospitals(hospitalData);
    };
    
    fetchHospitals();
  }, [navigate]);
  
  // Handle filtering
  useEffect(() => {
    let result = hospitals;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        hospital =>
          hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply blood group filter
    if (bloodFilter !== 'all') {
      result = result.filter(hospital => hospital.bloodGroup === bloodFilter);
    }
    
    // Apply urgency filter
    if (urgencyFilter !== 'all') {
      result = result.filter(hospital => hospital.urgency === urgencyFilter);
    }
    
    setFilteredHospitals(result);
  }, [searchTerm, bloodFilter, urgencyFilter, hospitals]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle clearing filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setBloodFilter('all');
    setUrgencyFilter('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-8 px-4 max-w-7xl mx-auto w-full mt-16">
        <div className="animate-slide-down">
          <h1 className="text-3xl font-bold mb-2">Donor Dashboard</h1>
          <p className="text-gray-600 mb-8">
            Find hospitals in need of blood donations.
          </p>
          
          {/* Filters */}
          <Card className="mb-6 glass-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Search and Filter
              </CardTitle>
              <CardDescription>
                Find hospitals based on your preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search hospitals..."
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
                    value={urgencyFilter}
                    onValueChange={setUrgencyFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Urgency Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Urgency Levels</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-4 flex justify-end">
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
          
          {/* Hospital List */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredHospitals.length > 0 ? (
              filteredHospitals.map((hospital) => (
                <HospitalCard key={hospital.email} hospital={hospital} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 mb-2">No hospitals found matching your criteria.</p>
                <Button
                  variant="link"
                  onClick={handleClearFilters}
                  className="text-blood-600 hover:text-blood-800"
                >
                  Clear filters to see all hospitals
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorDashboard;
