import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Download, 
  User,
  Crown,
  UserCheck,
  MessageCircle,
  Send,
  X,
  Play
} from 'lucide-react';
import { useTeamManagement } from '@/lib/stores/useTeamManagement';
import { useAudio } from '@/lib/stores/useAudio';
import html2canvas from 'html2canvas';

interface Executive {
  id: string;
  name: string;
  shares: number;
  role: string;
  color: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  isSystem?: boolean;
}

// Enhanced Text-to-Speech utility function
const speakText = async (text: string): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Cancel any existing speech first
      window.speechSynthesis.cancel();
      
      // Wait a moment for cancellation to complete, then start new speech
      setTimeout(() => {
        try {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.85; // Slightly slower for clarity
          utterance.pitch = 1.0;
          utterance.volume = 0.9; // Slightly louder
          
          // Set a professional voice if available
          const voices = window.speechSynthesis.getVoices();
          const professionalVoice = voices.find(voice => 
            voice.name.includes('Microsoft') || 
            voice.name.includes('Google') ||
            voice.lang.includes('en-US')
          );
          if (professionalVoice) {
            utterance.voice = professionalVoice;
          }
          
          utterance.onend = () => {
            console.log('✓ Speech completed:', text.slice(0, 30) + '...');
            resolve();
          };
          
          utterance.onerror = (error) => {
            console.error('Speech synthesis error:', error);
            resolve(); // Still resolve to continue the flow
          };
          
          console.log('🎤 Speaking:', text.slice(0, 30) + '...');
          window.speechSynthesis.speak(utterance);
          
        } catch (error) {
          console.error('Speech synthesis failed:', error);
          resolve();
        }
      }, 200); // Increased delay for more reliable cancellation
    } else {
      console.log('Speech synthesis not available, simulating...');
      // Simulate speech duration based on text length
      setTimeout(resolve, Math.max(1000, text.length * 50));
    }
  });
};

const executiveColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#F59E0B', // Orange
  '#EF4444'  // Red
];

// 2D Meeting Room Component with Image
const MeetingRoom2D: React.FC<{ executives: Executive[] }> = ({ executives }) => {
  // Calculate positions for executives around the table based on actual chair positions in image
  const calculatePosition = (index: number, total: number) => {
    // Predefined positions matching the chairs in the meeting room image
    const chairPositions = [
      { x: 50, y: 25 },   // Top center
      { x: 75, y: 35 },   // Top right
      { x: 85, y: 50 },   // Right side
      { x: 75, y: 65 },   // Bottom right  
      { x: 25, y: 65 },   // Bottom left
      { x: 15, y: 50 },   // Left side
      { x: 25, y: 35 },   // Top left
    ];
    
    // Select position based on index, cycling through available positions
    const position = chairPositions[index % chairPositions.length];
    return { x: `${position.x}%`, y: `${position.y}%` };
  };

  return (
    <div className="relative w-full h-full">
      {/* Meeting room image */}
      <img 
        src="/images/meeting-room-top-view.webp" 
        alt="Meeting room top view"
        className="w-full h-full object-contain rounded-lg"
      />
      
    </div>
  );
};

// Meeting Chat Component
const MeetingChatInterface: React.FC<{ 
  executives: Executive[], 
  onClose: () => void,
  isActive: boolean 
}> = ({ executives, onClose, isActive }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isGreeting, setIsGreeting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && executives.length > 0 && chatMessages.length === 0) {
      startMeetingGreetings();
    }
  }, [isActive, executives]);

  // Disable auto-scroll behavior completely
  // useEffect(() => {
  //   chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [chatMessages]);

  const startMeetingGreetings = async () => {
    setIsGreeting(true);
    
    // Add system message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      sender: 'System',
      message: 'Meeting started. Officers are joining...',
      timestamp: new Date(),
      isSystem: true
    };
    setChatMessages([welcomeMessage]);

    // Seat position descriptions based on the highlighted areas in the image
    const seatComments = [
      "Good morning Sir! I've taken my position at the head of the table, ready to lead this discussion.",
      "Sir, I'm positioned to your right side - perfect spot to provide strategic insights.",
      "Hello Sir! I'm seated on the right side of the room, ready to support our agenda.",
      "Good morning Sir! I've taken the seat on the lower right - excellent view of the presentation screen.",
      "Sir, I'm positioned on the left side here - ready to collaborate with the team.",
      "Hello Sir! I'm seated on the left side with a great view of everyone around the table.",
      "Good morning Sir! I've taken the upper left position - perfect angle to observe the team dynamics."
    ];

    // Greetings from each executive with seating comments
    for (let i = 0; i < executives.length; i++) {
      const exec = executives[i];
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const seatComment = seatComments[i % seatComments.length];
      const greeting: ChatMessage = {
        id: `greeting-${exec.id}`,
        sender: exec.name,
        message: `${seatComment} ${exec.name}, ${exec.role} reporting for duty from this strategic position.`,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, greeting]);
      await speakText(greeting.message);
    }

    // Final agenda question
    await new Promise(resolve => setTimeout(resolve, 1000));
    const agendaMessage: ChatMessage = {
      id: 'agenda',
      sender: executives[0]?.name || 'Executive',
      message: "Sir, what's today's agenda for the meeting?",
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, agendaMessage]);
    await speakText(agendaMessage.message);
    setIsGreeting(false);
  };

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'CEO (You)',
        message: inputMessage,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      setInputMessage('');
      
      // Simulate executive response
      setTimeout(() => {
        const responses = [
          "Understood, sir. We'll implement this immediately.",
          "That's a great point, sir. Let me take note of that.",
          "Excellent strategy, sir. I'll coordinate with my team.",
          "Yes sir, we can definitely work on that.",
          "Good thinking, sir. This aligns with our goals."
        ];
        
        const randomExec = executives[Math.floor(Math.random() * executives.length)];
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        const replyMessage: ChatMessage = {
          id: `reply-${Date.now()}`,
          sender: randomExec.name,
          message: response,
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, replyMessage]);
        speakText(response);
      }, 2000);
    }
  };

  return (
    <div className="h-96 flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-blue-50">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">Executive Meeting</h3>
          <Badge variant="outline" className="bg-green-100 text-green-700">
            {executives.length} Officers Present
          </Badge>
        </div>

      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'CEO (You)' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.isSystem
                  ? 'bg-gray-200 text-gray-700 text-center mx-auto'
                  : msg.sender === 'CEO (You)'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 shadow-sm border'
              }`}
            >
              <div className="flex flex-col">
                {!msg.isSystem && (
                  <div className="text-xs opacity-70 mb-1">
                    {msg.sender}
                  </div>
                )}
                <div className="text-sm">{msg.message}</div>
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
              }
            }}
            onFocus={(e) => {
              // Prevent automatic scrolling when input is focused
              e.preventDefault();
            }}
            placeholder={isGreeting ? "Officers are greeting..." : "Type your message..."}
            disabled={isGreeting}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={isGreeting || !inputMessage.trim()}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const MeetingRoomView: React.FC = () => {
  const { teamMembers, addTeamMember } = useTeamManagement();
  const { stopBackgroundMusic } = useAudio();
  const [mode, setMode] = useState<'team' | 'simulation'>('team');
  const [sliderValue, setSliderValue] = useState([0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExec, setEditingExec] = useState<Executive | null>(null);
  const [newExec, setNewExec] = useState({ name: '', shares: 3, role: '', color: '#3B82F6' });
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const meetingRoomRef = useRef<HTMLDivElement>(null);

  // Initialize with 3 executive officers for testing
  useEffect(() => {
    const initializeExecutives = () => {
      const existingExecutives = teamMembers.filter(member => 
        member.role && ['CTO', 'COO', 'CFO', 'CMO', 'CHRO'].includes(member.role)
      );

      if (existingExecutives.length < 3) {
        const executiveRoles = [
          { name: 'Sarah Johnson', role: 'CTO', salary: 180000 },
          { name: 'Michael Chen', role: 'COO', salary: 170000 },
          { name: 'Emma Rodriguez', role: 'CFO', salary: 165000 }
        ];

        executiveRoles.forEach((exec, index) => {
          if (!teamMembers.find(member => member.role === exec.role)) {
            addTeamMember({
              id: `exec-${exec.role.toLowerCase()}`,
              name: exec.name,
              role: exec.role,
              department: 'Executive',
              salary: exec.salary,
              experience: 8 + index,
              avatar: `👔`,
              stats: {
                loyalty: 85 + (index * 5),
                impact: 80 + (index * 3),
                energy: 90,
                mood: 'motivated'
              },
              joinDate: new Date(),
              skills: ['Leadership', 'Strategic Planning', 'Team Management'],
              achievements: [`Senior ${exec.role}`, 'Strategic Leadership'],
              personality: {
                type: 'Professional Executive',
                motivationTriggers: ['Company Growth', 'Strategic Success'],
                weakSpots: ['Perfectionism', 'High Pressure']
              },
              emotionalTrait: 'Calm under pressure',
              loopVulnerability: 'none',
              clarityContribution: 80,
              hiddenDynamics: {
                trustWithFounder: 85,
                creativeFulfillment: 75,
                burnoutRisk: 20,
                isHidingStruggles: false
              },
              seniority: 'Chief',
              status: 'Neutral',
              assignedSector: '',
              promotionHistory: [],
              isCEO: false
            });
          }
        });
      }
    };

    initializeExecutives();
  }, [teamMembers, addTeamMember]);

  // Convert team members to executives for display
  const actualExecutives: Executive[] = teamMembers
    .filter(member => member.role && ['CTO', 'COO', 'CFO', 'CMO', 'CHRO'].includes(member.role))
    .slice(0, 3) // Maximum 3 executives as requested
    .map((member, index) => ({
      id: member.id,
      name: member.name,
      shares: 3 + Math.floor(Math.random() * 3), // Random shares between 3-5%
      role: member.role || 'Executive',
      color: executiveColors[index % executiveColors.length]
    }));

  // Get simulation executives for slider mode
  const simulationExecutives: Executive[] = Array.from({ length: sliderValue[0] }, (_, index) => ({
    id: `sim-${index}`,
    name: ['Alex Chen', 'Jordan Smith', 'Taylor Brown', 'Morgan Davis', 'Casey Wilson'][index],
    shares: 3 + (index % 3),
    role: ['CTO', 'COO', 'CFO', 'CMO', 'CHRO'][index],
    color: executiveColors[index % executiveColors.length]
  }));



  // Calculate seat positions in a circle around the table
  const calculateSeatPosition = (index: number, total: number, radius: number) => {
    // Create fixed positions around the table, avoiding top center (reserved for founder)
    const fixedPositions = [
      { angle: Math.PI / 6, label: 'top-right' },        // 30 degrees
      { angle: Math.PI / 2, label: 'right' },            // 90 degrees  
      { angle: 5 * Math.PI / 6, label: 'bottom-right' }, // 150 degrees
      { angle: 7 * Math.PI / 6, label: 'bottom-left' },  // 210 degrees
      { angle: 3 * Math.PI / 2, label: 'left' },         // 270 degrees
      { angle: 11 * Math.PI / 6, label: 'top-left' }     // 330 degrees
    ];
    
    // Use the position based on index
    const position = fixedPositions[index % fixedPositions.length];
    const x = Math.cos(position.angle) * radius;
    const y = Math.sin(position.angle) * radius;
    
    return { x, y };
  };

  // Determine which executives to show based on mode
  const activeExecutives = mode === 'team' ? actualExecutives : simulationExecutives;

  const startMeeting = () => {
    if (activeExecutives.length === 0) {
      alert('No executives available for the meeting. Please hire executives from Team Management first.');
      return;
    }
    
    // Stop background music using the audio store
    try {
      stopBackgroundMusic();
      console.log('Background music stopped successfully');
    } catch (error) {
      console.error('Failed to stop background music:', error);
    }
    setIsMeetingActive(true);
  };

  const endMeeting = () => {
    // Stop any ongoing speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsMeetingActive(false);
  };

  const handleAddExecutive = () => {
    // This feature is disabled when using team mode - executives come from team management
    if (mode === 'simulation') {
      setShowAddModal(false);
    }
  };

  const handleEditExecutive = (exec: Executive) => {
    // This feature is disabled when using team mode
    if (mode === 'simulation') {
      setEditingExec(exec);
      setNewExec({ name: exec.name, shares: exec.shares, role: exec.role, color: exec.color });
      setShowAddModal(true);
    }
  };

  const handleUpdateExecutive = () => {
    // This feature is disabled when using team mode
    setShowAddModal(false);
  };

  const handleRemoveExecutive = (id: string) => {
    // This feature is disabled when using team mode
    console.log('Remove executive:', id);
  };

  const exportToPNG = async () => {
    if (meetingRoomRef.current) {
      try {
        const canvas = await html2canvas(meetingRoomRef.current, {
          scale: 2,
          backgroundColor: 'transparent',
          useCORS: true
        });
        
        const link = document.createElement('a');
        link.download = 'meeting-room.png';
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        console.error('Export failed:', error);
      }
    }
  };



  const radius = 120;
  const centerX = 200;
  const centerY = 200;

  return (
    <div className="space-y-6">
      {/* Start Meeting Button - positioned below header and above image */}
      <Card>
        <CardContent className="p-4 text-center">
          {!isMeetingActive ? (
            <Button 
              onClick={startMeeting}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg"
              disabled={activeExecutives.length === 0}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Meeting
            </Button>
          ) : (
            <Button 
              onClick={endMeeting}
              variant="destructive"
              size="lg"
              className="px-8 py-3 text-lg font-semibold rounded-xl shadow-lg"
            >
              <X className="w-5 h-5 mr-2" />
              End Meeting
            </Button>
          )}
          
          {activeExecutives.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              No executives available. Please check Team Management section.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Meeting Room Visualization - Always Visible */}
      <Card>
        <CardContent className="p-6">
          <div ref={meetingRoomRef} className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-lg">
            <MeetingRoom2D executives={isMeetingActive ? activeExecutives : []} />
            
            {/* Status Overlay */}
            <div className="absolute top-4 left-4 bg-white/95 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${isMeetingActive ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <p className="text-sm font-medium text-gray-700">
                  {isMeetingActive ? 'Meeting In Progress' : `${activeExecutives.length} Executive${activeExecutives.length !== 1 ? 's' : ''} Available`}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface - Only when meeting is active */}
      {isMeetingActive && (
        <Card>
          <CardContent className="p-6">
            <MeetingChatInterface 
              executives={activeExecutives} 
              onClose={endMeeting}
              isActive={isMeetingActive}
            />
          </CardContent>
        </Card>
      )}

      {/* Board Composition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Board Composition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Founder Card */}
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900">You (Founder)</p>
                    <Badge className="bg-emerald-600 text-white">CEO & Owner</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Controlling interest & leadership</p>
                </div>
              </div>
            </div>

            {/* Executive Cards */}
            {activeExecutives.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Executive Team ({activeExecutives.length}/5)</h4>
                {activeExecutives.map((exec, index) => {
                  const getRoleColor = (role: string) => {
                    const colors = {
                      'CTO': 'bg-blue-100 text-blue-800 border-blue-200',
                      'COO': 'bg-green-100 text-green-800 border-green-200',
                      'CFO': 'bg-purple-100 text-purple-800 border-purple-200',
                      'CMO': 'bg-pink-100 text-pink-800 border-pink-200',
                      'CHRO': 'bg-orange-100 text-orange-800 border-orange-200'
                    };
                    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
                  };

                  return (
                    <div key={exec.id} className={`p-3 border rounded-lg ${getRoleColor(exec.role)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: exec.color }}
                          >
                            {exec.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold">{exec.name}</p>
                            <p className="text-sm opacity-75">{exec.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{exec.shares}%</p>
                          <p className="text-xs opacity-75">shares</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="font-medium">No executives hired yet</p>
                <p className="text-sm">Hire executives from Team Management to populate the board</p>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{activeExecutives.length + 1}</p>
                <p className="text-xs text-gray-600">Total Members</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {activeExecutives.reduce((sum, exec) => sum + exec.shares, 0)}%
                </p>
                <p className="text-xs text-gray-600">Executive Shares</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{3 - activeExecutives.length}</p>
                <p className="text-xs text-gray-600">Open Positions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingRoomView;