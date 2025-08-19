import React, { useState, useRef } from 'react';
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

const MeetingRoomView: React.FC = () => {
  const { teamMembers } = useTeamManagement();
  const [executives, setExecutives] = useState<Executive[]>([
    { id: '1', name: 'Sarah Chen', shares: 4, role: 'CTO', color: '#3B82F6' },
    { id: '2', name: 'Marcus Rodriguez', shares: 3, role: 'COO', color: '#10B981' },
    { id: '3', name: 'Jennifer Liu', shares: 3, role: 'CFO', color: '#8B5CF6' }
  ]);
  const [mode, setMode] = useState<'slider' | 'data'>('data');
  const [sliderValue, setSliderValue] = useState([2]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExec, setEditingExec] = useState<Executive | null>(null);
  const [newExec, setNewExec] = useState({ name: '', shares: 3, role: '', color: '#3B82F6' });
  const meetingRoomRef = useRef<HTMLDivElement>(null);

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

  const handleAddExecutive = () => {
    if (newExec.name.trim() && newExec.role.trim()) {
      const executive: Executive = {
        ...newExec,
        id: Date.now().toString(),
        color: executiveColors[executives.length % executiveColors.length]
      };
      setExecutives([...executives, executive]);
      setNewExec({ name: '', shares: 3, role: '', color: '#3B82F6' });
      setShowAddModal(false);
    }
  };

  const handleEditExecutive = (exec: Executive) => {
    setEditingExec(exec);
    setNewExec({ name: exec.name, shares: exec.shares, role: exec.role, color: exec.color });
    setShowAddModal(true);
  };

  const handleUpdateExecutive = () => {
    if (editingExec && newExec.name.trim() && newExec.role.trim()) {
      setExecutives(executives.map(exec => 
        exec.id === editingExec.id 
          ? { ...exec, ...newExec }
          : exec
      ));
      setEditingExec(null);
      setNewExec({ name: '', shares: 3, role: '', color: '#3B82F6' });
      setShowAddModal(false);
    }
  };

  const handleRemoveExecutive = (id: string) => {
    setExecutives(executives.filter(exec => exec.id !== id));
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

  const activeExecutives = mode === 'slider' 
    ? executives.slice(0, sliderValue[0])
    : executives;

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
              variant={mode === 'slider' ? 'default' : 'outline'}
              onClick={() => setMode('slider')}
              size="sm"
            >
              Quick Demo
            </Button>
            <Button 
              variant={mode === 'data' ? 'default' : 'outline'}
              onClick={() => setMode('data')}
              size="sm"
            >
              Team Data
            </Button>
          </div>

          {/* Slider Mode */}
          {mode === 'slider' && (
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

          {/* Data Mode Controls */}
          {mode === 'data' && (
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

      {/* Meeting Room Visualization */}
      <Card>
        <CardContent className="p-6">
          <div 
            ref={meetingRoomRef}
            className="relative w-full max-w-lg mx-auto aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-lg"
            style={{
              backgroundImage: `url('/meeting-room.webp')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
            
            {/* Founder Position - Bottom Center */}
            <div 
              className="absolute flex flex-col items-center transform -translate-x-1/2"
              style={{ 
                left: '50%', 
                bottom: '5%'
              }}
            >
              <div className="relative mb-1">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-2xl border-4 border-white flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center">
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-600 to-green-700 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg border-2 border-white">
                  FOUNDER
                </div>
              </div>
              <div className="bg-white/96 px-4 py-2 rounded-lg shadow-xl border border-gray-200 backdrop-blur-sm">
                <p className="text-sm font-bold text-gray-900">You</p>
                <p className="text-xs font-medium text-emerald-700">CEO & Owner</p>
              </div>
            </div>

            {/* Executive Positions */}
            {activeExecutives.map((exec, index) => {
              const position = calculateSeatPosition(index, activeExecutives.length, 130);
              const seatX = 50 + (position.x / 300) * 100; // Convert to percentage with better scaling
              const seatY = 50 + (position.y / 300) * 100; // Convert to percentage with better scaling
              
              // Professional avatar styles based on role
              const getAvatarStyle = (role: string) => {
                const styles = {
                  'CTO': { bg: 'from-blue-500 to-blue-700', icon: 'tech' },
                  'COO': { bg: 'from-green-500 to-green-700', icon: 'ops' },
                  'CFO': { bg: 'from-purple-500 to-purple-700', icon: 'finance' },
                  'CMO': { bg: 'from-pink-500 to-pink-700', icon: 'marketing' },
                  'CHRO': { bg: 'from-orange-500 to-orange-700', icon: 'hr' }
                };
                return styles[role as keyof typeof styles] || { bg: 'from-gray-500 to-gray-700', icon: 'exec' };
              };

              const avatarStyle = getAvatarStyle(exec.role);
              
              return (
                <div 
                  key={exec.id}
                  className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    left: `${seatX}%`, 
                    top: `${seatY}%`
                  }}
                >
                  <div className="relative mb-1">
                    <div 
                      className={`w-16 h-16 rounded-full shadow-xl border-4 border-white bg-gradient-to-br ${avatarStyle.bg} flex items-center justify-center`}
                    >
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg border-2 border-white">
                      {exec.shares}%
                    </div>
                  </div>
                  <div className="bg-white/96 px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-center min-w-max backdrop-blur-sm">
                    <p className="text-sm font-bold text-gray-900">{exec.name.split(' ')[0]}</p>
                    <p className="text-xs font-medium text-blue-700">{exec.role}</p>
                  </div>
                </div>
              );
            })}

            {/* Empty Seat Placeholders */}
            {mode === 'data' && activeExecutives.length < 5 && 
              Array.from({ length: 5 - activeExecutives.length }).map((_, index) => {
                const totalIndex = activeExecutives.length + index;
                const position = calculateSeatPosition(totalIndex, 5, 130);
                const seatX = 50 + (position.x / 300) * 100;
                const seatY = 50 + (position.y / 300) * 100;
                
                return (
                  <div 
                    key={`empty-${index}`}
                    className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 transition-opacity cursor-pointer"
                    style={{ 
                      left: `${seatX}%`, 
                      top: `${seatY}%`
                    }}
                  >
                    <div className="w-14 h-14 rounded-full border-3 border-dashed border-gray-400 bg-white/70 flex items-center justify-center mb-1 hover:border-blue-400 transition-colors">
                      <Plus className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="bg-white/80 px-2 py-1 rounded text-center shadow-sm">
                      <p className="text-xs text-gray-600 font-medium">Open Seat</p>
                    </div>
                  </div>
                );
              })
            }

            {/* Meeting Table Label */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-white/95 px-5 py-3 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 mb-1">Executive Board</p>
                  <p className="text-sm text-blue-700 font-medium">Strategic Planning</p>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xs text-gray-600">Meeting in Session</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive List */}
      {mode === 'data' && executives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Executive Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {executives.map((exec) => (
                <div key={exec.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: exec.color }}
                    >
                      <UserCheck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{exec.name}</p>
                      <p className="text-sm text-gray-600">{exec.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{exec.shares}% shares</Badge>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleEditExecutive(exec)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleRemoveExecutive(exec.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Instructions */}
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Quick Demo Mode:</strong> Use the slider to simulate different team sizes</p>
            <p><strong>Team Data Mode:</strong> Add, edit, and manage your actual executive team</p>
            <p><strong>Export:</strong> Download the meeting room visualization as a high-resolution PNG</p>
            <p><strong>Founder Position:</strong> Always shown at the bottom as the company owner</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingRoomView;