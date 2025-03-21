
import { Hospital } from '@/utils/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Building2, MapPin, Droplet, Activity } from 'lucide-react';

interface HospitalCardProps {
  hospital: Hospital;
}

const HospitalCard = ({ hospital }: HospitalCardProps) => {
  // Function to get blood badge class
  const getBloodBadgeClass = (bloodGroup: string) => {
    const group = bloodGroup.replace('+', '-pos').replace('-', '-neg');
    return `blood-badge blood-badge-${group}`;
  };

  // Function to get urgency class
  const getUrgencyClass = (urgency: string) => {
    return `urgency-${urgency.toLowerCase()}`;
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md glass-panel">
      <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-white border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1.5 rounded-full shadow-sm">
              <Building2 className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="font-medium text-gray-900">{hospital.name}</h3>
          </div>
          <div className={getUrgencyClass(hospital.urgency)}>
            <Activity className="h-3 w-3 inline mr-1" />
            {hospital.urgency} Urgency
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-3">
          <div className="text-sm">
            <span className="text-gray-500 block">Address</span>
            <div className="flex items-start space-x-1 font-medium">
              <MapPin className="h-3 w-3 text-gray-400 mt-1 flex-shrink-0" />
              <span>{hospital.address}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-sm">
              <span className="text-gray-500 block">Needed Blood</span>
              <div className={getBloodBadgeClass(hospital.bloodGroup)}>
                <Droplet className="h-3 w-3" />
                {hospital.bloodGroup}
              </div>
            </div>
            <div className="text-sm">
              <span className="text-gray-500 block">Required Quantity</span>
              <span className="font-medium">{hospital.quantity} ml</span>
            </div>
          </div>
          <div className="text-sm">
            <span className="text-gray-500 block">Contact</span>
            <span className="font-medium">{hospital.email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalCard;
