import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface GorkAIProps {
  className?: string;
}

export default function GorkAI({ className }: GorkAIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDragEnd = (event: any, info: any) => {
    setPosition({ x: info.point.x, y: info.point.y });
  };

  const gorkMessages = [
    "I notice you're making quick decisions. What emotions are driving this choice?",
    "Your spending pattern shows avoidance. What are you trying not to think about?",
    "This financial loop seems familiar. Ready to try a different business angle?",
    "Your XP suggests growth, but your soul depth needs attention. How are you feeling?",
    "I see hesitation in your choices. What outcome are you most afraid of?"
  ];

  const [currentMessage] = useState(
    gorkMessages[Math.floor(Math.random() * gorkMessages.length)]
  );

  return (
    <>
      {/* Draggable GORK Icon */}
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
          background: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          cursor: 'grab',
          border: '2px solid #e2e8f0'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={className}
      >
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white">
          <Brain className="w-6 h-6" />
        </div>
      </motion.div>

      {/* GORK Chat Interface */}
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
          <Card className="bg-white/95 backdrop-blur-sm border shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    GORK AI
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Your emotional financial advisor
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* GORK Message */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {currentMessage}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2"
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
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => {
                    // Add analysis logic here
                  }}
                >
                  <Brain className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-xs">Analyze spending patterns</span>
                </Button>
              </div>

              {/* Insights */}
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Emotional State:</span>
                  <span className="text-orange-600">Focused</span>
                </div>
                <div className="flex justify-between">
                  <span>Financial Loop:</span>
                  <span className="text-green-600">Breaking</span>
                </div>
                <div className="flex justify-between">
                  <span>Growth XP:</span>
                  <span className="text-blue-600">+24</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </>
  );
}