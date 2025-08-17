import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Calculator,
  TrendingUp,
  Building2,
  DollarSign,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  PieChart,
  LineChart,
  FileText,
  Download,
  Share2,
  X,
  ChevronRight,
  Lightbulb,
  Target,
  Shield,
  Calendar,
  Users,
  Zap,
  ArrowRight,
  PlayCircle,
  BookOpen,
  MousePointer2,
  Eye,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Deal {
  id: string;
  type: 'sector' | 'stock' | 'acquisition' | 'joint_venture' | 'banking' | 'crypto';
  sector?: 'fast_food' | 'tech' | 'healthcare' | 'ecommerce' | 'real_estate' | 'renewable_energy';
  title: string;
  tagline: string;
  description: string;
  company: string;
  investmentRequired: number;
  expectedROI: number;
  riskLevel: 'low' | 'medium' | 'high';
  liquidity: 'high' | 'medium' | 'low';
  timeHorizon: number;
  cashflowMonthly: number;
  status: 'available' | 'active' | 'completed' | 'pending';
  timelineStage: 'initiation' | 'growth' | 'maturity' | 'exit';
  timeline: string;
  requirements: {
    minSectors: number;
    specificSectors?: string[];
    minNetWorth?: number;
    minReputation?: number;
  };
  benefits: string[];
  risks: string[];
  keyFactors: { [key: string]: string };
  termsConditions: string[];
  financials: {
    projections: { month: number; revenue: number; profit: number }[];
    breakEvenMonths: number;
  };
  aiInsight?: string;
}

interface OpportunitiesModalsProps {
  selectedDeal: Deal | null;
  showModal: boolean;
  showDeepDive: boolean;
  showTutorial: boolean;
  setShowModal: (show: boolean) => void;
  setShowDeepDive: (show: boolean) => void;
  setShowTutorial: (show: boolean) => void;
  onInvest: (deal: Deal) => void;
}

const OpportunitiesModals: React.FC<OpportunitiesModalsProps> = ({
  selectedDeal,
  showModal,
  showDeepDive,
  showTutorial,
  setShowModal,
  setShowDeepDive,
  setShowTutorial,
  onInvest
}) => {
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Format currency helper
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toLocaleString()}`;
  };

  // Get risk color
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Investment Opportunities",
      content: "This is your gateway to premium investment deals. Each opportunity is carefully curated and analyzed by our AI system.",
      icon: <Target className="w-8 h-8 text-blue-600" />
    },
    {
      title: "Understanding Deal Cards",
      content: "Each card shows key metrics: investment required, expected ROI, monthly cashflow, and risk level. Trending deals have special badges.",
      icon: <Eye className="w-8 h-8 text-green-600" />
    },
    {
      title: "AI-Powered Insights",
      content: "Our AI analyzes market conditions, team backgrounds, and financial projections to provide intelligent investment recommendations.",
      icon: <Brain className="w-8 h-8 text-purple-600" />
    },
    {
      title: "Filtering & Sorting",
      content: "Use the search and filters to find deals that match your criteria. Sort by ROI, investment amount, risk level, or timeline.",
      icon: <BookOpen className="w-8 h-8 text-orange-600" />
    },
    {
      title: "Investment Actions",
      content: "Use 'Invest Now' for quick decisions, 'Deep Dive' for detailed analysis, or save deals for later consideration.",
      icon: <MousePointer2 className="w-8 h-8 text-red-600" />
    }
  ];

  // Investment Modal
  const InvestmentModal = () => (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            {selectedDeal?.title}
          </DialogTitle>
        </DialogHeader>

        {selectedDeal && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">{formatCurrency(selectedDeal.investmentRequired)}</div>
                  <div className="text-sm text-blue-600">Investment Required</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-900">{selectedDeal.expectedROI}%</div>
                  <div className="text-sm text-green-600">Expected ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-900">{formatCurrency(selectedDeal.cashflowMonthly)}</div>
                  <div className="text-sm text-purple-600">Monthly Cashflow</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-900">{selectedDeal.timeHorizon}m</div>
                  <div className="text-sm text-orange-600">Time Horizon</div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
                <TabsTrigger value="terms">Terms</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      Company Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">Company:</span> {selectedDeal.company}
                      </div>
                      <div>
                        <span className="font-medium">Timeline:</span> {selectedDeal.timeline}
                      </div>
                      <div>
                        <span className="font-medium">Current Stage:</span> 
                        <Badge className="ml-2 capitalize">{selectedDeal.timelineStage}</Badge>
                      </div>
                      <div>
                        <span className="font-medium">Risk Level:</span> 
                        <Badge className={`ml-2 ${getRiskColor(selectedDeal.riskLevel)}`}>
                          {selectedDeal.riskLevel}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Liquidity:</span> 
                        <Badge className="ml-2 capitalize">{selectedDeal.liquidity}</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      Key Benefits
                    </h3>
                    <ul className="space-y-2">
                      {selectedDeal.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700">{selectedDeal.description}</p>
                </div>

                {selectedDeal.aiInsight && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                    <h4 className="font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      AI Investment Analysis
                    </h4>
                    <p className="text-indigo-700 text-sm">{selectedDeal.aiInsight}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="financials" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Financial Projections
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-sm font-semibold text-blue-800 mb-2">Break-even Analysis</div>
                      <div className="text-lg font-bold text-blue-900">
                        {selectedDeal.financials.breakEvenMonths} months to break-even
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border p-3 text-left">Timeline</th>
                            <th className="border p-3 text-right">Revenue</th>
                            <th className="border p-3 text-right">Profit</th>
                            <th className="border p-3 text-right">ROI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedDeal.financials.projections.map((projection, index) => (
                            <tr key={index}>
                              <td className="border p-3 font-medium">Month {projection.month}</td>
                              <td className="border p-3 text-right">{formatCurrency(projection.revenue)}</td>
                              <td className="border p-3 text-right font-semibold text-green-700">
                                {formatCurrency(projection.profit)}
                              </td>
                              <td className="border p-3 text-right font-bold text-blue-700">
                                {((projection.profit * 12) / selectedDeal.investmentRequired * 100).toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Key Financial Factors</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(selectedDeal.keyFactors).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium text-gray-800">{key}</div>
                        <div className="text-gray-600">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="risks" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Risk Assessment
                  </h3>
                  
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border-2 ${getRiskColor(selectedDeal.riskLevel)}`}>
                      <div className="font-semibold mb-2">Overall Risk Level: {selectedDeal.riskLevel.toUpperCase()}</div>
                      <div className="text-sm">
                        This investment carries {selectedDeal.riskLevel} risk based on market analysis, 
                        financial projections, and industry factors.
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Identified Risk Factors</h4>
                      <ul className="space-y-3">
                        {selectedDeal.risks.map((risk, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-red-800">{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">Risk Mitigation Strategies</h4>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        <li>• Diversify your portfolio across multiple sectors</li>
                        <li>• Monitor monthly performance reports</li>
                        <li>• Maintain emergency liquidity reserves</li>
                        <li>• Regular strategy reviews with investment advisors</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="terms" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    Terms & Conditions
                  </h3>
                  
                  <div className="space-y-3">
                    {selectedDeal.termsConditions.map((term, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <ChevronRight className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-800">{term}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                    <h4 className="font-semibold text-blue-800 mb-2">Requirements</h4>
                    <div className="text-blue-700 text-sm space-y-1">
                      <div>Minimum sectors owned: {selectedDeal.requirements.minSectors}</div>
                      {selectedDeal.requirements.minNetWorth && (
                        <div>Minimum net worth: {formatCurrency(selectedDeal.requirements.minNetWorth)}</div>
                      )}
                      {selectedDeal.requirements.minReputation && (
                        <div>Minimum reputation score: {selectedDeal.requirements.minReputation}</div>
                      )}
                      {selectedDeal.requirements.specificSectors && (
                        <div>Required sectors: {selectedDeal.requirements.specificSectors.join(', ')}</div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              <Button
                onClick={() => onInvest(selectedDeal)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Invest {formatCurrency(selectedDeal.investmentRequired)}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setShowDeepDive(true);
                }}
                className="px-6 py-3 rounded-xl border-2"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Deep Dive
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowModal(false)}
                className="px-6 py-3 rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // Deep Dive Modal
  const DeepDiveModal = () => (
    <Dialog open={showDeepDive} onOpenChange={setShowDeepDive}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Calculator className="w-8 h-8 text-purple-600" />
            Financial Deep Dive: {selectedDeal?.title}
          </DialogTitle>
        </DialogHeader>

        {selectedDeal && (
          <div className="space-y-6">
            {/* Advanced Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  ROI Analysis
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-blue-900">{selectedDeal.expectedROI}%</div>
                    <div className="text-sm text-blue-600">Expected Annual ROI</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-blue-800">
                      {((selectedDeal.expectedROI / 100) * selectedDeal.investmentRequired).toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-600">Annual Profit Estimate</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200">
                <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Cashflow Projection
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-green-900">{formatCurrency(selectedDeal.cashflowMonthly)}</div>
                    <div className="text-sm text-green-600">Monthly Cashflow</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-800">
                      {formatCurrency(selectedDeal.cashflowMonthly * 12)}
                    </div>
                    <div className="text-sm text-green-600">Annual Cashflow</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-xl border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Timeline Analysis
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-purple-900">{selectedDeal.timeHorizon}</div>
                    <div className="text-sm text-purple-600">Months to Maturity</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-purple-800">
                      {selectedDeal.financials.breakEvenMonths}
                    </div>
                    <div className="text-sm text-purple-600">Months to Break-even</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Calculator */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-gray-600" />
                Investment Calculator
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Amount
                  </label>
                  <input
                    type="number"
                    value={investmentAmount || selectedDeal.investmentRequired}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={`Minimum: ${formatCurrency(selectedDeal.investmentRequired)}`}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-600">Projected Annual Return</div>
                    <div className="text-xl font-bold text-green-600">
                      {formatCurrency((investmentAmount || selectedDeal.investmentRequired) * (selectedDeal.expectedROI / 100))}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-600">Monthly Cashflow</div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency((investmentAmount || selectedDeal.investmentRequired) / selectedDeal.investmentRequired * selectedDeal.cashflowMonthly)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario Analysis */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Scenario Analysis
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Optimistic Scenario</h4>
                  <div className="space-y-2 text-sm">
                    <div>ROI: {(selectedDeal.expectedROI * 1.3).toFixed(1)}%</div>
                    <div>Cashflow: {formatCurrency(selectedDeal.cashflowMonthly * 1.3)}/mo</div>
                    <div>Break-even: {Math.max(1, selectedDeal.financials.breakEvenMonths - 2)} months</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Expected Scenario</h4>
                  <div className="space-y-2 text-sm">
                    <div>ROI: {selectedDeal.expectedROI}%</div>
                    <div>Cashflow: {formatCurrency(selectedDeal.cashflowMonthly)}/mo</div>
                    <div>Break-even: {selectedDeal.financials.breakEvenMonths} months</div>
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Conservative Scenario</h4>
                  <div className="space-y-2 text-sm">
                    <div>ROI: {(selectedDeal.expectedROI * 0.7).toFixed(1)}%</div>
                    <div>Cashflow: {formatCurrency(selectedDeal.cashflowMonthly * 0.7)}/mo</div>
                    <div>Break-even: {selectedDeal.financials.breakEvenMonths + 4} months</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="flex gap-4 pt-4 border-t">
              <Button
                onClick={() => {
                  // Generate PDF logic would go here
                  alert('PDF report generated successfully!');
                }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Generate CSV logic would go here
                  alert('CSV data exported successfully!');
                }}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Export CSV
              </Button>
              <Button
                onClick={() => onInvest(selectedDeal)}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Proceed with Investment
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // Tutorial Modal
  const TutorialModal = () => (
    <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            Investment Opportunities Tutorial
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="flex gap-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === tutorialStep ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <motion.div
            key={tutorialStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center space-y-4"
          >
            <div className="flex justify-center">
              {tutorialSteps[tutorialStep].icon}
            </div>
            <h3 className="text-xl font-semibold">{tutorialSteps[tutorialStep].title}</h3>
            <p className="text-gray-600 leading-relaxed">{tutorialSteps[tutorialStep].content}</p>
          </motion.div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
              disabled={tutorialStep === 0}
            >
              Previous
            </Button>
            
            {tutorialStep < tutorialSteps.length - 1 ? (
              <Button
                onClick={() => setTutorialStep(tutorialStep + 1)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => setShowTutorial(false)}
                className="bg-green-600 hover:bg-green-700"
              >
                Get Started
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <InvestmentModal />
      <DeepDiveModal />
      <TutorialModal />
    </>
  );
};

export default OpportunitiesModals;