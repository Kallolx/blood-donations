
import { Donor } from '@/utils/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { User, Phone, Droplet } from 'lucide-react';

interface DonorCardProps {
  donor: Donor;
}

const DonorCard = ({ donor }: DonorCardProps) => {
  // Function to get blood badge class
  const getBloodBadgeClass = (bloodGroup: string) => {
    const group = bloodGroup.replace('+', '-pos').replace('-', '-neg');
    return `blood-badge blood-badge-${group}`;
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md glass-panel">
      <CardHeader className="p-4 bg-gradient-to-r from-blood-50 to-white border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1.5 rounded-full shadow-sm">
              <User className="h-5 w-5 text-blood-500" />
            </div>
            <h3 className="font-medium text-gray-900">{donor.name}</h3>
          </div>
          <div className={getBloodBadgeClass(donor.bloodGroup)}>
            <Droplet className="h-3 w-3" />
            {donor.bloodGroup}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-sm">
            <span className="text-gray-500 block">Age</span>
            <span className="font-medium">{donor.age} years</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500 block">Contact</span>
            <div className="flex items-center space-x-1 font-medium">
              <Phone className="h-3 w-3 text-gray-400" />
              <span>{donor.phoneNumber}</span>
            </div>
          </div>
          <div className="text-sm col-span-2">
            <span className="text-gray-500 block">Email</span>
            <span className="font-medium">{donor.email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonorCard;
