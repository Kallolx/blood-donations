import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  BarChart4, 
  Clock, 
  Droplet, 
  Heart, 
  Users, 
  Building2, 
  ArrowUpRight, 
  Loader2,
  RefreshCw,
  Phone,
  Mail,
  Filter,
  Check,
  PlusCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import Navbar from '@/components/Navbar';
import { supabase } from '@/utils/supabaseClient';
import { getCurrentUser, getUserRole } from '@/utils/authService';
import { toast } from 'sonner';

interface DonationStats {
  total: number;
  recent: number;
  matched: number;
}

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

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [stats, setStats] = useState<DonationStats>({ total: 0, recent: 0, matched: 0 });
  const [donations, setDonations] = useState<BloodDonation[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [myDonations, setMyDonations] = useState<BloodDonation[]>([]);
  const [myRequests, setMyRequests] = useState<BloodRequest[]>([]);
  const [urgentRequests, setUrgentRequests] = useState<BloodRequest[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getCurrentUser();
      const role = getUserRole();
      
      if (user?.email) {
        setUserEmail(user.email);
        setUserRole(role);
        await loadDashboardData(user.email, role || 'donor');
      } else {
        navigate('/login');
      }
    };

    fetchUserData();

    // Set up real-time listeners
    const donationsSubscription = supabase
      .channel('blood_donations_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'blood_donations' 
      }, payload => {
        console.log('Blood donation change received!', payload);
        refreshData();
        toast.info('New blood donation information available!');
      })
      .subscribe();

    const requestsSubscription = supabase
      .channel('blood_requests_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'blood_requests' 
      }, payload => {
        console.log('Blood request change received!', payload);
        refreshData();
        if (payload.eventType === 'INSERT') {
          toast.info('New blood request submitted!');
        }
      })
      .subscribe();

    return () => {
      donationsSubscription.unsubscribe();
      requestsSubscription.unsubscribe();
    };
  }, [navigate]);

  const loadDashboardData = async (email: string, role: string) => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [
        donationsResult,
        requestsResult,
        myDonationsResult,
        myRequestsResult,
        urgentRequestsResult
      ] = await Promise.all([
        supabase.from('blood_donations').select('*').order('created_at', { ascending: false }),
        supabase.from('blood_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('blood_donations').select('*').eq('email', email).order('created_at', { ascending: false }),
        supabase.from('blood_requests').select('*').eq('email', email).order('created_at', { ascending: false }),
        supabase.from('blood_requests').select('*').eq('urgency', 'High').order('created_at', { ascending: false })
      ]);

      if (donationsResult.error) throw donationsResult.error;
      if (requestsResult.error) throw requestsResult.error;
      if (myDonationsResult.error) throw myDonationsResult.error;
      if (myRequestsResult.error) throw myRequestsResult.error;
      if (urgentRequestsResult.error) throw urgentRequestsResult.error;

      setDonations(donationsResult.data || []);
      setRequests(requestsResult.data || []);
      setMyDonations(myDonationsResult.data || []);
      setMyRequests(myRequestsResult.data || []);
      setUrgentRequests(urgentRequestsResult.data || []);

      // Calculate statistics
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const totalDonations = donationsResult.data?.length || 0;
      const recentDonations = donationsResult.data?.filter(
        d => new Date(d.created_at) > oneWeekAgo
      ).length || 0;
      
      // Calculate matched donations (simplified example)
      // In a real app, you'd have a more sophisticated matching algorithm
      let matchedCount = 0;
      requestsResult.data?.forEach(request => {
        const matchingDonations = donationsResult.data?.filter(
          d => d.blood_group === request.blood_group
        );
        if (matchingDonations && matchingDonations.length > 0) {
          matchedCount++;
        }
      });

      setStats({
        total: totalDonations,
        recent: recentDonations,
        matched: matchedCount
      });
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    if (userEmail && userRole) {
      setRefreshing(true);
      await loadDashboardData(userEmail, userRole);
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin text-blood-600 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-dmsans">
                {userRole === 'donor' ? 'Donor Dashboard' : 'Hospital Dashboard'}
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back! Here's what's happening with blood donations today.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2 flex items-center"
                onClick={refreshData}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                size="sm" 
                className="bg-blood-600 hover:bg-blood-700 flex items-center"
                onClick={() => navigate(userRole === 'donor' ? '/donate' : '/hospitals')}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                {userRole === 'donor' ? 'Add Donation' : 'Add Request'}
              </Button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card className="border-blood-100/20 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center">
                <div className="rounded-full p-3 bg-blood-100 mr-4">
                  <Heart className="h-6 w-6 text-blood-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Donations</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-blood-100/20 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center">
                <div className="rounded-full p-3 bg-blue-100 mr-4">
                  <BarChart4 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Recent Donations</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.recent}</h3>
                  <span className="text-xs text-gray-500">Last 7 days</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-blood-100/20 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center">
                <div className="rounded-full p-3 bg-green-100 mr-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Potential Matches</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.matched}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Urgent Requests Scrollable Row */}
          {urgentRequests.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 font-dmsans flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                  Urgent Blood Needs
                </h2>
              </div>
              
              <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex space-x-4">
                  {urgentRequests.map(request => (
                    <Card key={request.id} className="w-[300px] border-red-200 shadow-sm hover:shadow-md transition-shadow flex-shrink-0">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-bold text-gray-900">{request.name}</CardTitle>
                          <Badge variant="outline" className={getUrgencyColor(request.urgency)}>
                            {request.urgency}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">{request.address}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Needs:</span>
                            <Badge className={`ml-2 ${getBloodGroupColor(request.blood_group)}`}>
                              {request.blood_group}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Units: </span>
                            <span className="font-bold">{request.quantity}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between items-center text-xs text-gray-500">
                        <span>{formatDate(request.created_at)}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blood-600 hover:text-blood-700 hover:bg-blood-50 p-0 h-8"
                          onClick={() => window.location.href = `mailto:${request.email}`}
                        >
                          Contact
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="your-activity" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="your-activity" className="font-dmsans">Your's</TabsTrigger>
              <TabsTrigger value="available-donations" className="font-dmsans">Available</TabsTrigger>
              <TabsTrigger value="recent-requests" className="font-dmsans">Recent</TabsTrigger>
            </TabsList>
            
            {/* Your Activity Tab */}
            <TabsContent value="your-activity">
              {userRole === 'donor' ? (
                // For Donor
                myDonations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myDonations.map(donation => (
                      <Card key={donation.id} className="border-blood-100/20 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-bold text-gray-900">Your Donation</CardTitle>
                            <Badge className={getBloodGroupColor(donation.blood_group)}>
                              {donation.blood_group}
                            </Badge>
                          </div>
                          <CardDescription>Registered on {formatDate(donation.created_at)}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Name</p>
                              <p className="font-semibold">{donation.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Age</p>
                              <p className="font-semibold">{donation.age} years</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Phone</p>
                              <p className="font-semibold">{donation.phone_number}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Email</p>
                              <p className="font-semibold truncate">{donation.email}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2 border-t">
                          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/donate')}>
                            Update Information
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <Droplet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Donations Yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-4">
                      You haven't submitted any blood donation information yet. Start saving lives today!
                    </p>
                    <Button onClick={() => navigate('/donate')} className="bg-blood-600 hover:bg-blood-700">
                      Submit Donation Info
                    </Button>
                  </div>
                )
              ) : (
                // For Hospital
                myRequests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myRequests.map(request => (
                      <Card key={request.id} className="border-blood-100/20 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-bold text-gray-900">Your Request</CardTitle>
                            <div className="flex space-x-2">
                              <Badge className={getBloodGroupColor(request.blood_group)}>
                                {request.blood_group}
                              </Badge>
                              <Badge variant="outline" className={getUrgencyColor(request.urgency)}>
                                {request.urgency}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription>Submitted on {formatDate(request.created_at)}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Hospital</p>
                              <p className="font-semibold">{request.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Units Needed</p>
                              <p className="font-semibold">{request.quantity}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm font-medium text-gray-500">Address</p>
                              <p className="font-semibold">{request.address}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2 border-t">
                          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/hospitals')}>
                            Manage Request
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Requests Yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-4">
                      You haven't submitted any blood requests yet. Need blood for your hospital?
                    </p>
                    <Button onClick={() => navigate('/hospitals')} className="bg-blood-600 hover:bg-blood-700">
                      Request Blood
                    </Button>
                  </div>
                )
              )}
            </TabsContent>
            
            {/* Available Donations Tab */}
            <TabsContent value="available-donations">
              {donations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {donations.map(donation => (
                    <Card key={donation.id} className="border-blood-100/20 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-bold text-gray-900 font-dmsans">
                            {donation.name}
                          </CardTitle>
                          <Badge className={getBloodGroupColor(donation.blood_group)}>
                            {donation.blood_group}
                          </Badge>
                        </div>
                        <CardDescription>Age: {donation.age} years</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 text-gray-500 mr-2" />
                            <span>{donation.phone_number}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="truncate">{donation.email}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 border-t flex justify-between items-center">
                        <span className="text-xs text-gray-500">{formatDate(donation.created_at)}</span>
                        {userRole === 'hospital' && (
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-blood-600 border-blood-200 hover:bg-blood-50"
                              onClick={() => window.location.href = `tel:${donation.phone_number}`}
                            >
                              <Phone className="h-3 w-3 mr-1" /> Call
                            </Button>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Donations Available</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    There are currently no blood donations in the system.
                  </p>
                </div>
              )}
            </TabsContent>
            
            {/* Recent Requests Tab */}
            <TabsContent value="recent-requests">
              {requests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {requests.map(request => (
                    <Card key={request.id} className="border-blood-100/20 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-bold text-gray-900 font-dmsans">
                            {request.name}
                          </CardTitle>
                          <Badge variant="outline" className={getUrgencyColor(request.urgency)}>
                            {request.urgency}
                          </Badge>
                        </div>
                        <CardDescription>{request.address}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="text-sm font-medium text-gray-500 mr-2">Needs:</span>
                            <Badge className={getBloodGroupColor(request.blood_group)}>
                              {request.blood_group}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500 mr-1">Units:</span>
                            <span className="font-bold">{request.quantity}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="truncate">{request.email}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 border-t flex justify-between items-center">
                        <span className="text-xs text-gray-500">{formatDate(request.created_at)}</span>
                        {userRole === 'donor' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-blood-600 border-blood-200 hover:bg-blood-50"
                            onClick={() => window.location.href = `mailto:${request.email}`}
                          >
                            <Mail className="h-3 w-3 mr-1" /> Contact
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Blood Requests</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    There are currently no blood requests in the system.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <footer className="py-6 mt-12 text-center text-gray-500">
          <p className="text-sm font-poppins">
            © {new Date().getFullYear()} BloodLink. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

export default Dashboard; 