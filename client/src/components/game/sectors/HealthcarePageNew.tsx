import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Heart, 
  Activity, 
  Stethoscope,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  Building2,
  Pill,
  Brain,
  Shield,
  Target,
  Zap
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';
import { toast } from 'sonner';
import SectorTeamSection from './SectorTeamSection';

interface HealthcarePageProps {
  onBack: () => void;
}

interface HealthcareService {
  id: string;
  name: string;
  description: string;
  cost: number;
  patientCapacity: string;
  revenuePerPatient: string;
  active: boolean;
}

interface MedicalTechnology {
  id: string;
  name: string;
  description: string;
  cost: number;
  efficiency: string;
  accuracy: string;
  active: boolean;
}

interface HealthcareProgram {
  id: string;
  name: string;
  description: string;
  cost: number;
  impact: string;
  duration: string;
  active: boolean;
}

const HealthcarePageNew: React.FC<HealthcarePageProps> = ({ onBack }) => {
  const { financialData } = useWealthSprintGame();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [clinicName] = useState('HealthCare Plus');
  const [patientSatisfaction] = useState(87);
  
  // Healthcare services
  const [healthcareServices, setHealthcareServices] = useState<HealthcareService[]>([
    {
      id: 'general_medicine',
      name: 'General Medicine',
      description: 'Primary care and routine health checkups',
      cost: 300000,
      patientCapacity: '100/day',
      revenuePerPatient: '₹500-1000',
      active: false
    },
    {
      id: 'specialized_care',
      name: 'Specialized Care',
      description: 'Cardiology, neurology, and other specialties',
      cost: 600000,
      patientCapacity: '50/day',
      revenuePerPatient: '₹2000-5000',
      active: false
    },
    {
      id: 'emergency_care',
      name: 'Emergency Care',
      description: '24/7 emergency and trauma services',
      cost: 800000,
      patientCapacity: '24/7',
      revenuePerPatient: '₹3000-10000',
      active: false
    }
  ]);

  // Medical technology
  const [medicalTechnology, setMedicalTechnology] = useState<MedicalTechnology[]>([
    {
      id: 'diagnostic_imaging',
      name: 'Advanced Diagnostic Imaging',
      description: 'MRI, CT scan, and ultrasound equipment',
      cost: 1000000,
      efficiency: 'High',
      accuracy: '95%+',
      active: false
    },
    {
      id: 'telemedicine',
      name: 'Telemedicine Platform',
      description: 'Remote consultation and monitoring system',
      cost: 400000,
      efficiency: 'Very High',
      accuracy: '85%+',
      active: false
    },
    {
      id: 'lab_automation',
      name: 'Laboratory Automation',
      description: 'Automated testing and analysis systems',
      cost: 700000,
      efficiency: 'Excellent',
      accuracy: '99%+',
      active: false
    }
  ]);

  // Healthcare programs
  const [healthcarePrograms, setHealthcarePrograms] = useState<HealthcareProgram[]>([
    {
      id: 'preventive_care',
      name: 'Preventive Care Program',
      description: 'Health screenings and wellness programs',
      cost: 250000,
      impact: 'High',
      duration: 'Ongoing',
      active: false
    },
    {
      id: 'mental_health',
      name: 'Mental Health Services',
      description: 'Counseling and psychiatric care',
      cost: 350000,
      impact: 'Very High',
      duration: 'Long-term',
      active: false
    }
  ]);

  const activeServices = healthcareServices.filter(s => s.active);
  const activeTechnology = medicalTechnology.filter(t => t.active);
  const activePrograms = healthcarePrograms.filter(p => p.active);
  const finalRevenue = 100000 + (activeServices.length * 40000) + (activeTechnology.length * 25000) + (activePrograms.length * 15000);

  const checkFunds = (amount: number) => {
    if (financialData.bankBalance < amount) {
      toast.error(`Insufficient funds! Need ₹${amount.toLocaleString()}`);
      return false;
    }
    return true;
  };

  const launchService = (serviceId: string) => {
    const service = healthcareServices.find(s => s.id === serviceId);
    if (!service) return;

    if (!checkFunds(service.cost)) return;

    const { investInBusinessSector } = useWealthSprintGame.getState();
    
    const success = investInBusinessSector('healthcare', 'Healthcare', `Launched ${service.name}`, service.cost);
    
    if (success) {
      setHealthcareServices(prev => 
        prev.map(s => 
          s.id === serviceId ? { ...s, active: true } : s
        )
      );
      toast.success(`🏥 ${service.name} launched successfully!`);
    }
  };

  const deployTechnology = (techId: string) => {
    const tech = medicalTechnology.find(t => t.id === techId);
    if (!tech) return;

    if (!checkFunds(tech.cost)) return;

    const { investInBusinessSector } = useWealthSprintGame.getState();
    
    const success = investInBusinessSector('healthcare', 'Healthcare', `Deployed ${tech.name}`, tech.cost);
    
    if (success) {
      setMedicalTechnology(prev => 
        prev.map(t => 
          t.id === techId ? { ...t, active: true } : t
        )
      );
      toast.success(`⚡ ${tech.name} deployed!`);
    }
  };

  const launchProgram = (programId: string) => {
    const program = healthcarePrograms.find(p => p.id === programId);
    if (!program) return;

    if (!checkFunds(program.cost)) return;

    const { investInBusinessSector } = useWealthSprintGame.getState();
    
    const success = investInBusinessSector('healthcare', 'Healthcare', `Launched ${program.name}`, program.cost);
    
    if (success) {
      setHealthcarePrograms(prev => 
        prev.map(p => 
          p.id === programId ? { ...p, active: true } : p
        )
      );
      toast.success(`💚 ${program.name} launched!`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Blue Header */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="px-4 py-4">
          {/* Main Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="p-2 bg-white bg-opacity-15 rounded-lg">
                <div className="text-2xl">🏥</div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{clinicName}</h1>
                <p className="text-blue-200 text-sm">Healthcare Management • Healing communities, building health</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-15 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 text-white text-sm">
                <DollarSign className="w-4 h-4" />
                <span>Budget: ₹{(financialData.bankBalance / 100000).toFixed(1)}L</span>
              </div>
            </div>
          </div>

          {/* Business Summary */}
          <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-blue-200 text-xs">Active Services</div>
                <div className="text-white font-bold text-lg">{activeServices.length}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Technology</div>
                <div className="text-green-300 font-bold text-lg">{activeTechnology.length}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Satisfaction</div>
                <div className="text-yellow-300 font-bold text-lg">{patientSatisfaction}%</div>
              </div>
              <div className="text-center">
                <div className="text-blue-200 text-xs">Total Investment</div>
                <div className="text-orange-300 font-bold text-lg">₹0.0L</div>
              </div>
            </div>
          </div>

          {/* Horizontal Tabs Menu */}
          <div className="bg-blue-700 rounded-lg p-1">
            <div className="flex overflow-x-auto scrollbar-hide gap-1">
              {[
                { id: 'overview', label: 'Overview', icon: Star },
                { id: 'services', label: 'Services', icon: Heart },
                { id: 'technology', label: 'Technology', icon: Activity },
                { id: 'programs', label: 'Programs', icon: Shield },
                { id: 'team', label: 'Team', icon: Users }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant="ghost"
                    size="sm"
                    className={`flex-shrink-0 transition-all duration-200 ${
                      isActive 
                        ? 'bg-white text-blue-800 hover:bg-white hover:text-blue-800' 
                        : 'bg-transparent text-white hover:bg-white hover:bg-opacity-20'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-700">Monthly Revenue</p>
                    <p className="text-lg font-bold text-blue-800">₹{finalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700">Services</p>
                    <p className="text-lg font-bold text-green-800">{activeServices.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-700">Satisfaction</p>
                    <p className="text-lg font-bold text-purple-800">{patientSatisfaction}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-orange-700">Programs</p>
                    <p className="text-lg font-bold text-orange-800">{activePrograms.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-600" />
              Healthcare Services ({activeServices.length} active)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthcareServices.map((service) => (
                <Card key={service.id} className={`border transition-all hover:shadow-lg ${service.active ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{service.name}</h4>
                      {service.active && <Badge className="bg-green-600 text-white text-xs">Active</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="font-medium">{service.patientCapacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue/Patient:</span>
                        <span className="font-medium text-green-600">{service.revenuePerPatient}</span>
                      </div>
                    </div>
                    {!service.active && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Setup Cost:</span>
                          <span className="font-bold text-blue-600">₹{service.cost.toLocaleString()}</span>
                        </div>
                        <Button 
                          onClick={() => launchService(service.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={financialData.bankBalance < service.cost}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Launch Service
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Technology Tab */}
        {activeTab === 'technology' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Medical Technology ({activeTechnology.length} deployed)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {medicalTechnology.map((tech) => (
                <Card key={tech.id} className={`border transition-all hover:shadow-lg ${tech.active ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{tech.name}</h4>
                      {tech.active && <Badge className="bg-green-600 text-white text-xs">Active</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{tech.description}</p>
                    {!tech.active && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Investment Cost:</span>
                          <span className="font-bold text-blue-600">₹{tech.cost.toLocaleString()}</span>
                        </div>
                        <Button 
                          onClick={() => deployTechnology(tech.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={financialData.bankBalance < tech.cost}
                        >
                          <Activity className="w-4 h-4 mr-2" />
                          Deploy Technology
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Programs Tab */}
        {activeTab === 'programs' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Healthcare Programs ({activePrograms.length} active)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthcarePrograms.map((program) => (
                <Card key={program.id} className={`border transition-all hover:shadow-lg ${program.active ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{program.name}</h4>
                      {program.active && <Badge className="bg-green-600 text-white text-xs">Active</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                    {!program.active && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Program Cost:</span>
                          <span className="font-bold text-blue-600">₹{program.cost.toLocaleString()}</span>
                        </div>
                        <Button 
                          onClick={() => launchProgram(program.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={financialData.bankBalance < program.cost}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Launch Program
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <SectorTeamSection sectorId="healthcare" />
        )}

      </div>
    </div>
  );
};

export default HealthcarePageNew;