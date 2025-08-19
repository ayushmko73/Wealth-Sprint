import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
    { id: '2', name: 'Marcus Rodriguez', shares: 3, role: 'COO', color: '#10B981' }
  ]);
  const [mode, setMode] = useState<'slider' | 'data'>('data');
  const [sliderValue, setSliderValue] = useState([2]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExec, setEditingExec] = useState<Executive | null>(null);
  const [newExec, setNewExec] = useState({ name: '', shares: 3, role: '', color: '#3B82F6' });
  const meetingRoomRef = useRef<HTMLDivElement>(null);

  // Colors for different executives
  const executiveColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Calculate seat positions in a circle
  const calculateSeatPosition = (index: number, total: number, radius: number) => {
    // Start from bottom (270 degrees) and go clockwise, skip bottom position for founder
    const startAngle = -Math.PI / 2; // -90 degrees (bottom)
    const angleStep = (2 * Math.PI) / (total + 1); // +1 to account for founder seat
    const angle = startAngle + (index + 1) * angleStep; // +1 to skip founder position
    
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
            className="relative w-full max-w-md mx-auto aspect-square bg-gray-50 rounded-lg overflow-hidden"
          >
            <svg width="400" height="400" className="w-full h-full">
              {/* Room Background */}
              <circle 
                cx={centerX} 
                cy={centerY} 
                r="180" 
                fill="#f1f5f9" 
                stroke="#e2e8f0" 
                strokeWidth="2"
              />
              
              {/* Meeting Table */}
              <circle 
                cx={centerX} 
                cy={centerY} 
                r="80" 
                fill="#d97706" 
                stroke="#92400e" 
                strokeWidth="3"
              />
              
              {/* Table Center Hole */}
              <circle 
                cx={centerX} 
                cy={centerY} 
                r="25" 
                fill="#374151" 
                stroke="#1f2937" 
                strokeWidth="2"
              />

              {/* Founder Seat (Always at bottom) */}
              <g transform={`translate(${centerX}, ${centerY + radius + 50})`}>
                {/* Chair */}
                <rect x="-25" y="-15" width="50" height="30" rx="5" fill="#1f2937" />
                {/* Person */}
                <circle cx="0" cy="-25" r="15" fill="#fbbf24" />
                {/* Badge */}
                <rect x="-20" y="-45" width="40" height="12" rx="6" fill="#059669" />
                <text x="0" y="-37" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">
                  FOUNDER
                </text>
                {/* Name */}
                <text x="0" y="20" textAnchor="middle" fontSize="10" fill="#374151" fontWeight="bold">
                  You
                </text>
              </g>

              {/* Executive Seats */}
              {activeExecutives.map((exec, index) => {
                const position = calculateSeatPosition(index, activeExecutives.length, radius);
                const seatX = centerX + position.x;
                const seatY = centerY + position.y;
                
                return (
                  <g key={exec.id} transform={`translate(${seatX}, ${seatY})`}>
                    {/* Chair */}
                    <rect x="-20" y="-12" width="40" height="24" rx="4" fill="#1f2937" />
                    {/* Person */}
                    <circle cx="0" cy="-20" r="12" fill={exec.color} />
                    {/* Shares Badge */}
                    <rect x="-15" y="-35" width="30" height="10" rx="5" fill="#3b82f6" />
                    <text x="0" y="-28" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">
                      {exec.shares}%
                    </text>
                    {/* Name */}
                    <text x="0" y="15" textAnchor="middle" fontSize="8" fill="#374151" fontWeight="bold">
                      {exec.name}
                    </text>
                    {/* Role */}
                    <text x="0" y="25" textAnchor="middle" fontSize="7" fill="#6b7280">
                      {exec.role}
                    </text>
                  </g>
                );
              })}

              {/* Empty Seat Placeholders (when in data mode and fewer than 5 executives) */}
              {mode === 'data' && activeExecutives.length < 5 && 
                Array.from({ length: 5 - activeExecutives.length }).map((_, index) => {
                  const totalIndex = activeExecutives.length + index;
                  const position = calculateSeatPosition(totalIndex, 5, radius);
                  const seatX = centerX + position.x;
                  const seatY = centerY + position.y;
                  
                  return (
                    <g key={`empty-${index}`} transform={`translate(${seatX}, ${seatY})`} opacity="0.3">
                      {/* Empty Chair */}
                      <rect x="-20" y="-12" width="40" height="24" rx="4" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,3" />
                      <text x="0" y="0" textAnchor="middle" fontSize="10" fill="#9ca3af">
                        Empty
                      </text>
                    </g>
                  );
                })
              }
            </svg>
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