import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
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
  UserCheck
} from 'lucide-react';
import { useTeamManagement } from '@/lib/stores/useTeamManagement';
import html2canvas from 'html2canvas';

interface Executive {
  id: string;
  name: string;
  shares: number;
  role: string;
  color: string;
}

const executiveColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#F59E0B', // Orange
  '#EF4444'  // Red
];

// 3D Meeting Room Component
const MeetingRoom3D: React.FC<{ executiveCount: number }> = ({ executiveCount }) => {
  const modelPath = `/meeting-room-${Math.min(executiveCount, 5)}.glb`;
  const { scene } = useGLTF(modelPath);
  
  return <primitive object={scene} scale={2.5} position={[0, -2, 0]} />;
};

const MeetingRoomView: React.FC = () => {
  const { teamMembers } = useTeamManagement();
  const [mode, setMode] = useState<'team' | 'simulation'>('team');
  const [sliderValue, setSliderValue] = useState([0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExec, setEditingExec] = useState<Executive | null>(null);
  const [newExec, setNewExec] = useState({ name: '', shares: 3, role: '', color: '#3B82F6' });
  const meetingRoomRef = useRef<HTMLDivElement>(null);

  // Convert team members to executives for display
  const actualExecutives: Executive[] = teamMembers
    .filter(member => member.role && ['CTO', 'COO', 'CFO', 'CMO', 'CHRO'].includes(member.role))
    .slice(0, 5) // Maximum 5 executives
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

  // Colors for different executives
  const executiveColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Calculate seat positions in a circle around the table
  const calculateSeatPosition = (index: number, total: number, radius: number) => {
    // Distribute executives evenly around the circle, avoiding the bottom position (reserved for founder)
    const totalPositions = Math.max(5, total); // Always plan for 5 positions
    const angleStep = (2 * Math.PI) / totalPositions;
    
    // Start from top and go clockwise, but skip the bottom position
    let angle = -Math.PI / 2; // Start from top (-90 degrees)
    
    // Map index to actual position, skipping bottom
    const positionMap = [0, 1, 2, 4, 3]; // Skip position 3 which would be bottom
    const actualIndex = positionMap[index % 5];
    
    angle = -Math.PI / 2 + (actualIndex * angleStep);
    
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    return { x, y };
  };

  // Determine which executives to show based on mode
  const activeExecutives = mode === 'team' ? actualExecutives : simulationExecutives;

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
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Meeting Room Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <Button 
              variant={mode === 'simulation' ? 'default' : 'outline'}
              onClick={() => setMode('simulation')}
              size="sm"
            >
              Quick Demo
            </Button>
            <Button 
              variant={mode === 'team' ? 'default' : 'outline'}
              onClick={() => setMode('team')}
              size="sm"
            >
              Team Data
            </Button>
          </div>

          {/* Simulation Mode */}
          {mode === 'simulation' && (
            <div className="space-y-2">
              <Label>Number of Executives: {sliderValue[0]}</Label>
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={5}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          )}

          {/* Team Data Display */}
          {mode === 'team' && (
            <div className="text-sm text-muted-foreground">
              Showing {actualExecutives.length} executives from your team management
            </div>
          )}

          {/* Simulation Mode Controls */}
          {mode === 'simulation' && (
            <div className="flex gap-2">
              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => {
                    setEditingExec(null);
                    setNewExec({ name: '', shares: 3, role: '', color: '#3B82F6' });
                  }}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Executive
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingExec ? 'Edit Executive' : 'Add New Executive'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingExec ? 'Modify the executive details below.' : 'Add a new executive to your board meeting.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={newExec.name}
                        onChange={(e) => setNewExec({...newExec, name: e.target.value})}
                        placeholder="Executive name"
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input
                        value={newExec.role}
                        onChange={(e) => setNewExec({...newExec, role: e.target.value})}
                        placeholder="e.g., CTO, COO, CFO"
                      />
                    </div>
                    <div>
                      <Label>Shares (%): {newExec.shares}%</Label>
                      <Slider
                        value={[newExec.shares]}
                        onValueChange={([value]) => setNewExec({...newExec, shares: value})}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={editingExec ? handleUpdateExecutive : handleAddExecutive}>
                        {editingExec ? 'Update' : 'Add'} Executive
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddModal(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button size="sm" variant="outline" onClick={exportToPNG}>
                <Download className="w-4 h-4 mr-1" />
                Export PNG
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Professional 3D Meeting Room Visualization */}
      <Card>
        <CardContent className="p-6">
          <div ref={meetingRoomRef} className="w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-lg">
            <Canvas camera={{ position: [0, 5, 8], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-10, -10, -5]} intensity={0.5} />
              
              <Suspense fallback={null}>
                <MeetingRoom3D executiveCount={activeExecutives.length} />
              </Suspense>
              
              <OrbitControls 
                enablePan={false} 
                enableZoom={true} 
                enableRotate={true}
                maxPolarAngle={Math.PI / 2}
                minDistance={5}
                maxDistance={15}
              />
            </Canvas>
            
            {/* Status Overlay */}
            <div className="absolute top-4 left-4 bg-white/95 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-gray-700">
                  {activeExecutives.length} Executive{activeExecutives.length !== 1 ? 's' : ''} Present
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <p className="text-2xl font-bold text-purple-600">{5 - activeExecutives.length}</p>
                <p className="text-xs text-gray-600">Open Positions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Features */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-700">Meeting Room Features</h4>
              <Button size="sm" variant="outline" onClick={exportToPNG}>
                <Download className="w-4 h-4 mr-2" />
                Export PNG
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p><strong>Professional 3D Models:</strong> Dynamic meeting rooms (0-5 executives)</p>
                <p><strong>Interactive View:</strong> Rotate, zoom, and explore the boardroom</p>
              </div>
              <div>
                <p><strong>Team Integration:</strong> Automatically syncs with hired executives</p>
                <p><strong>Real-time Updates:</strong> Board composition updates as team changes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingRoomView;