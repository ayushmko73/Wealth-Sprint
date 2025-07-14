import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface SageAIProps {
  className?: string;
}

export default function SageAI({ className }: SageAIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDragEnd = (event: any, info: any) => {
    setPosition({ x: info.point.x, y: info.point.y });
  };

  const sageMessages = [
    "I notice you're making quick decisions. What emotions are driving this choice?",
    "Your spending pattern shows avoidance. What are you trying not to think about?",
    "This financial loop seems familiar. Ready to try a different business angle?",
    "Your XP suggests growth, but your soul depth needs attention. How are you feeling?",
    "I see hesitation in your choices. What outcome are you most afraid of?"
  ];

  const [currentMessage] = useState(
    sageMessages[Math.floor(Math.random() * sageMessages.length)]
  );

  return (
    <>
      {/* Draggable Sage Icon */}
      <motion.div
        drag
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        initial={{ bottom: 20, right: 20 }}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'rgba(15, 23, 42, 0.85)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          cursor: 'grab',
          border: '1px solid rgba(51, 65, 85, 0.6)',
          backdropFilter: 'blur(8px)'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={className}
      >
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full text-slate-200">
          <Brain className="w-5 h-5" />
        </div>
      </motion.div>

      {/* Sage Chat Interface */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: 'fixed',
            bottom: 100,
            right: 20,
            zIndex: 1001,
            width: 320,
            maxHeight: 400
          }}
        >
          <Card className="bg-slate-900/95 backdrop-blur-sm border-slate-700 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-slate-200" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-200">
                    Sage AI
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-400">
                Your emotional financial advisor
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sage Message */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-3 border border-slate-600">
                <p className="text-sm text-slate-200 leading-relaxed">
                  {currentMessage}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-slate-200"
                  onClick={() => {
                    // Add reflection logic here
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-xs">Start emotional reflection</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-slate-200"
                  onClick={() => {
                    // Add analysis logic here
                  }}
                >
                  <Brain className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-xs">Analyze spending patterns</span>
                </Button>
              </div>

              {/* Insights */}
              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Emotional State:</span>
                  <span className="text-orange-400">Focused</span>
                </div>
                <div className="flex justify-between">
                  <span>Financial Loop:</span>
                  <span className="text-green-400">Breaking</span>
                </div>
                <div className="flex justify-between">
                  <span>Growth XP:</span>
                  <span className="text-blue-400">+24</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </>
  );
}