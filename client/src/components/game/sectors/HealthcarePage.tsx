import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Star,
  Users,
  Heart,
  Stethoscope,
  Building2,
  Award,
  Clock,
  Activity,
  UserCheck,
  Microscope,
  Pill,
  Briefcase
} from 'lucide-react';
import { useWealthSprintGame } from '@/lib/stores/useWealthSprintGame';

interface HealthcareFacility {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  establishmentCost: number;
  established: boolean;
  monthlyRevenue: number;
  monthlyExpenses: number;
  patientCapacity: number;
  currentPatients: number;
  reputation: number;
  specialization: string;
  staffCount: number;
  equipmentLevel: number;
  qualityOfCare: number;
  qualityDecreaseDate?: Date;
}

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  cost: number;
  duration: string;
  completed: boolean;
  revenueBoost: number;
  reputationBoost: number;
  category: 'equipment' | 'treatment' | 'efficiency';
}

interface HealthcarePageProps {
  onBack: () => void;
}

const HealthcarePage: React.FC<HealthcarePageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { financialData, updateFinancialData } = useWealthSprintGame();

  // Add icons back to facilities after loading
  const addIconsToFacilities = (facilitiesData: HealthcareFacility[]): HealthcareFacility[] => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'general_hospital': <Building2 className="h-5 w-5" />,
      'specialty_clinic': <Stethoscope className="h-5 w-5" />,
      'diagnostic_center': <Activity className="h-5 w-5" />,
      'pharmacy_chain': <Pill className="h-5 w-5" />,
      'research_lab': <Microscope className="h-5 w-5" />
    };
    
    return facilitiesData.map(facility => ({
      ...facility,
      icon: iconMap[facility.id] || <Building2 className="h-5 w-5" />
    }));
  };

  // Load saved facilities data on component mount
  const loadSavedFacilities = (): HealthcareFacility[] => {
    try {
      const saved = localStorage.getItem('healthcareFacilities');
      if (saved) {
        const parsedFacilities = JSON.parse(saved);
        // Ensure dates are properly reconstructed and add icons back
        const facilitiesWithDates = parsedFacilities.map((facility: any) => ({
          ...facility,
          qualityDecreaseDate: facility.qualityDecreaseDate ? new Date(facility.qualityDecreaseDate) : undefined
        }));
        return addIconsToFacilities(facilitiesWithDates);
      }
    } catch (error) {
      console.warn('Failed to load saved healthcare facilities:', error);
    }
    // Return default facilities if no saved data
    return addIconsToFacilities([
      {
        id: 'general_hospital',
        name: 'General Hospital',
        icon: <Building2 className="h-5 w-5" />,
        description: 'Multi-specialty hospital with emergency care',
        establishmentCost: 250000,
        established: true, // Starting facility
        monthlyRevenue: 180000,
        monthlyExpenses: 120000,
        patientCapacity: 200,
        currentPatients: 150,
        reputation: 80,
        specialization: 'General Medicine',
        staffCount: 45,
        equipmentLevel: 75,
        qualityOfCare: 82
      },
      {
        id: 'specialty_clinic',
        name: 'Specialty Clinic',
        icon: <Stethoscope className="h-5 w-5" />,
        description: 'Cardiology and neurology focused clinic',
        establishmentCost: 180000,
        established: false,
        monthlyRevenue: 140000,
        monthlyExpenses: 85000,
        patientCapacity: 80,
        currentPatients: 0,
        reputation: 85,
        specialization: 'Cardiology & Neurology',
        staffCount: 20,
        equipmentLevel: 80,
        qualityOfCare: 88
      },
      {
        id: 'diagnostic_center',
        name: 'Diagnostic Center',
        icon: <Activity className="h-5 w-5" />,
        description: 'Advanced imaging and lab services',
        establishmentCost: 320000,
        established: false,
        monthlyRevenue: 220000,
        monthlyExpenses: 130000,
        patientCapacity: 300,
        currentPatients: 0,
        reputation: 90,
        specialization: 'Diagnostics & Imaging',
        staffCount: 35,
        equipmentLevel: 95,
        qualityOfCare: 92
      },
      {
        id: 'pharmacy_chain',
        name: 'Pharmacy Chain',
        icon: <Pill className="h-5 w-5" />,
        description: 'Network of retail pharmacies',
        establishmentCost: 150000,
        established: false,
        monthlyRevenue: 100000,
        monthlyExpenses: 60000,
        patientCapacity: 1000,
        currentPatients: 0,
        reputation: 75,
        specialization: 'Pharmaceuticals',
        staffCount: 25,
        equipmentLevel: 60,
        qualityOfCare: 78
      },
      {
        id: 'research_lab',
        name: 'Research Laboratory',
        icon: <Microscope className="h-5 w-5" />,
        description: 'Medical research and drug development',
        establishmentCost: 500000,
        established: false,
        monthlyRevenue: 300000,
        monthlyExpenses: 200000,
        patientCapacity: 50,
        currentPatients: 0,
        reputation: 95,
        specialization: 'Medical Research',
        staffCount: 60,
        equipmentLevel: 98,
        qualityOfCare: 95
      }
    ]);
  };
  
  const [facilities, setFacilities] = useState<HealthcareFacility[]>(loadSavedFacilities);

  // Save facilities data whenever facilities state changes (excluding non-serializable icon)
  useEffect(() => {
    const serializableFacilities = facilities.map(facility => ({
      ...facility,
      icon: null // Remove non-serializable icon
    }));
    localStorage.setItem('healthcareFacilities', JSON.stringify(serializableFacilities));
  }, [facilities]);

  // Quality recovery system - gradually increase quality for established facilities
  useEffect(() => {
    const qualityRecoveryInterval = setInterval(() => {
      setFacilities(currentFacilities => {
        return currentFacilities.map(facility => {
          if (facility.established && facility.qualityOfCare < 95) {
            // Increase quality by 1-2 points every 15 seconds, max 95%
            const qualityIncrease = Math.floor(Math.random() * 2) + 1;
            return {
              ...facility,
              qualityOfCare: Math.min(95, facility.qualityOfCare + qualityIncrease)
            };
          }
          return facility;
        });
      });
    }, 15000); // Every 15 seconds

    return () => clearInterval(qualityRecoveryInterval);
  }, []);

  // Monthly profit auto-transfer to bank account
  useEffect(() => {
    const monthlyTransferInterval = setInterval(() => {
      const establishedFacilities = facilities.filter(facility => facility.established);
      if (establishedFacilities.length > 0) {
        // Calculate total monthly profit
        let totalProfit = 0;
        establishedFacilities.forEach(facility => {
          let adjustedRevenue = facility.monthlyRevenue;
          // Quality affects revenue
          if (facility.qualityOfCare < 60) {
            adjustedRevenue *= 0.7; // 30% reduction for poor quality
          } else if (facility.qualityOfCare > 85) {
            adjustedRevenue *= 1.3; // 30% increase for excellent quality
          }
          totalProfit += (adjustedRevenue - facility.monthlyExpenses);
        });

        // Transfer profit to bank account
        if (totalProfit > 0) {
          updateFinancialData({
            bankBalance: financialData.bankBalance + totalProfit
          });
          
          console.log(`Monthly Healthcare profit transferred: ₹${totalProfit.toLocaleString()}`);
        }
      }
    }, 35000); // 35 seconds for testing

    return () => clearInterval(monthlyTransferInterval);
  }, [facilities, financialData.bankBalance, updateFinancialData]);

  const [researchProjects] = useState<ResearchProject[]>([
    {
      id: 'ai_diagnostics',
      title: 'AI-Powered Diagnostics',
      description: 'Implement machine learning for faster, more accurate diagnoses',
      cost: 150000,
      duration: '6 months',
      completed: false,
      revenueBoost: 25,
      reputationBoost: 15,
      category: 'equipment'
    },
    {
      id: 'telemedicine',
      title: 'Telemedicine Platform',
      description: 'Remote consultation and monitoring system',
      cost: 80000,
      duration: '4 months',
      completed: false,
      revenueBoost: 20,
      reputationBoost: 10,
      category: 'efficiency'
    },
    {
      id: 'robotic_surgery',
      title: 'Robotic Surgery System',
      description: 'Precision surgery with robotic assistance',
      cost: 400000,
      duration: '12 months',
      completed: false,
      revenueBoost: 40,
      reputationBoost: 25,
      category: 'equipment'
    },
    {
      id: 'gene_therapy',
      title: 'Gene Therapy Research',
      description: 'Breakthrough treatments using gene modification',
      cost: 600000,
      duration: '18 months',
      completed: false,
      revenueBoost: 60,
      reputationBoost: 40,
      category: 'treatment'
    }
  ]);

  // Calculate quality-adjusted revenue
  const calculateQualityAdjustedRevenue = (facility: HealthcareFacility) => {
    if (!facility.established) return 0;
    let adjustedRevenue = facility.monthlyRevenue;
    if (facility.qualityOfCare < 60) {
      adjustedRevenue *= 0.7; // 30% reduction for poor quality
    } else if (facility.qualityOfCare > 85) {
      adjustedRevenue *= 1.3; // 30% increase for excellent quality
    }
    return adjustedRevenue;
  };

  const currentMetrics = {
    totalRevenue: facilities.reduce((sum, f) => sum + calculateQualityAdjustedRevenue(f), 0),
    totalExpenses: facilities.filter(f => f.established).reduce((sum, f) => sum + f.monthlyExpenses, 0),
    netProfit: facilities.reduce((sum, f) => sum + (calculateQualityAdjustedRevenue(f) - (f.established ? f.monthlyExpenses : 0)), 0),
    establishedFacilities: facilities.filter(f => f.established).length,
    totalPatients: facilities.filter(f => f.established).reduce((sum, f) => sum + f.currentPatients, 0),
    averageReputation: facilities.filter(f => f.established).reduce((sum, f) => sum + f.reputation, 0) / Math.max(facilities.filter(f => f.established).length, 1),
    totalStaff: facilities.filter(f => f.established).reduce((sum, f) => sum + f.staffCount, 0)
  };

  const establishFacility = (facilityId: string) => {
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility || facility.established) return;
    
    // Check if player has sufficient funds
    if (financialData.bankBalance < facility.establishmentCost) {
      alert("⚠️ Insufficient funds to establish this facility.");
      return;
    }
    
    // Deduct money and establish facility
    updateFinancialData({
      bankBalance: financialData.bankBalance - facility.establishmentCost
    });
    
    // Update facilities with quality decrease and establishment
    setFacilities(prev => 
      prev.map(f => 
        f.id === facilityId ? { 
          ...f, 
          established: true,
          qualityOfCare: Math.max(f.qualityOfCare - 15, 40), // Quality decreases by 15 points, min 40
          currentPatients: Math.floor(f.patientCapacity * 0.6), // Start with 60% capacity
          qualityDecreaseDate: new Date()
        } : f
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-3 md:p-6">
      <div className="mb-4 md:mb-6">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-blue-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Business</span>
          </Button>
          
          {/* Bank Balance Display */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-2 md:p-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
              <div>
                <p className="text-xs md:text-sm text-green-700">Bank Balance</p>
                <p className="text-sm md:text-lg font-bold text-green-800">₹{financialData.bankBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Title Section */}
        <div className="flex items-center gap-3">
          <div className="p-2 md:p-3 rounded-full bg-blue-500 text-white text-lg md:text-xl">
            🏥
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Healthcare Empire</h1>
            <p className="text-sm md:text-base text-gray-600">Build comprehensive healthcare solutions</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-2 gap-3 mb-4 md:mb-6 md:gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
              <div>
                <p className="text-xs md:text-sm text-green-700">Monthly Revenue</p>
                <p className="text-sm md:text-lg font-bold text-green-800">₹{currentMetrics.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              <div>
                <p className="text-xs md:text-sm text-blue-700">Net Profit</p>
                <p className="text-sm md:text-lg font-bold text-blue-800">₹{currentMetrics.netProfit.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              <div>
                <p className="text-xs md:text-sm text-purple-700">Patients Served</p>
                <p className="text-sm md:text-lg font-bold text-purple-800">{currentMetrics.totalPatients.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
              <div>
                <p className="text-xs md:text-sm text-orange-700">Avg Reputation</p>
                <p className="text-sm md:text-lg font-bold text-orange-800">{Math.round(currentMetrics.averageReputation)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger value="overview" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="facilities" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Facilities</TabsTrigger>
          <TabsTrigger value="research" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Research</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Healthcare Network Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{currentMetrics.establishedFacilities}</p>
                    <p className="text-sm text-gray-600">Active Facilities</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{currentMetrics.totalStaff}</p>
                    <p className="text-sm text-gray-600">Total Staff</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{currentMetrics.totalPatients}</p>
                    <p className="text-sm text-gray-600">Patients/Month</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{Math.round(currentMetrics.averageReputation)}%</p>
                    <p className="text-sm text-gray-600">Reputation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-4">
          <div className="space-y-4">
            {facilities.map((facility) => (
              <Card 
                key={facility.id} 
                className={`transition-all duration-200 ${
                  facility.established 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${facility.established ? 'bg-green-500' : 'bg-gray-400'} text-white`}>
                        {facility.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{facility.name}</h3>
                        <p className="text-sm text-gray-600">{facility.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {facility.established ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => establishFacility(facility.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Establish ₹{facility.establishmentCost.toLocaleString()}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Specialization:</span>
                      <span className="font-medium text-blue-600">{facility.specialization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Revenue:</span>
                      <span className="font-medium text-green-600">₹{facility.monthlyRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Expenses:</span>
                      <span className="font-medium text-red-600">₹{facility.monthlyExpenses.toLocaleString()}</span>
                    </div>
                    {facility.established && (
                      <>
                        <div className="flex justify-between">
                          <span>Patient Capacity:</span>
                          <span className="font-medium text-blue-600">{facility.currentPatients}/{facility.patientCapacity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quality of Care:</span>
                          <span className={`font-medium ${facility.qualityOfCare >= 80 ? 'text-green-600' : facility.qualityOfCare >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {facility.qualityOfCare}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Staff Count:</span>
                          <span className="font-medium text-purple-600">{facility.staffCount}</span>
                        </div>
                      </>
                    )}
                    <hr />
                    <div className="flex justify-between font-bold">
                      <span>Net Profit:</span>
                      <span className="text-green-600">
                        ₹{facility.established 
                          ? (calculateQualityAdjustedRevenue(facility) - facility.monthlyExpenses).toLocaleString()
                          : (facility.monthlyRevenue - facility.monthlyExpenses).toLocaleString()
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="research" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Microscope className="h-5 w-5 text-blue-500" />
                Research & Development
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {researchProjects.map((project) => (
                  <Card key={project.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-600">{project.description}</p>
                        </div>
                        <Badge 
                          variant={project.completed ? "default" : "secondary"}
                          className={project.completed ? "bg-green-100 text-green-800" : ""}
                        >
                          {project.completed ? 'Completed' : 'Available'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                        <div>Cost: ₹{project.cost.toLocaleString()}</div>
                        <div>Duration: {project.duration}</div>
                        <div>Revenue Boost: +{project.revenueBoost}%</div>
                        <div>Reputation: +{project.reputationBoost}%</div>
                      </div>
                      
                      {!project.completed && (
                        <Button 
                          className="mt-3 w-full" 
                          size="sm"
                          disabled={financialData.bankBalance < project.cost}
                        >
                          Start Research ₹{project.cost.toLocaleString()}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Patient Satisfaction</h4>
                      <div className="flex items-center gap-2">
                        <Progress value={Math.round(currentMetrics.averageReputation)} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{Math.round(currentMetrics.averageReputation)}%</span>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Revenue Growth</h4>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">+12% this month</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Facility Performance</h4>
                    <div className="space-y-2">
                      {facilities.filter(f => f.established).map(facility => (
                        <div key={facility.id} className="flex justify-between items-center">
                          <span className="text-sm">{facility.name}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={facility.qualityOfCare} className="w-20 h-2" />
                            <span className="text-xs font-medium w-8">{facility.qualityOfCare}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthcarePage;