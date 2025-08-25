#!/usr/bin/env python3
"""
Text-to-Speech service using pyttsx3
Provides an HTTP endpoint for converting text to speech
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pyttsx3
import tempfile
import os
import threading
import time

app = Flask(__name__)
CORS(app)

# Global TTS engine
tts_engine = None
engine_lock = threading.Lock()

def initialize_tts():
    """Initialize the TTS engine with proper settings"""
    global tts_engine
    try:
        tts_engine = pyttsx3.init()
        
        # Configure voice properties
        voices = tts_engine.getProperty('voices')
        if voices:
            # Try to use a female voice if available
            for voice in voices:
                if 'female' in voice.name.lower() or 'zira' in voice.name.lower():
                    tts_engine.setProperty('voice', voice.id)
                    break
            else:
                # Use first available voice
                tts_engine.setProperty('voice', voices[0].id)
        
        # Set speech rate (words per minute)
        tts_engine.setProperty('rate', 180)  # Moderate speed
        
        # Set volume (0.0 to 1.0)
        tts_engine.setProperty('volume', 0.8)
        
        print("TTS engine initialized successfully")
        return True
    except Exception as e:
        print(f"Failed to initialize TTS engine: {e}")
        return False

def speak_text_async(text):
    """Speak text asynchronously without blocking"""
    def speak():
        with engine_lock:
            try:
                if tts_engine:
                    tts_engine.say(text)
                    tts_engine.runAndWait()
            except Exception as e:
                print(f"TTS error: {e}")
    
    # Run in a separate thread to avoid blocking
    thread = threading.Thread(target=speak)
    thread.daemon = True
    thread.start()

@app.route('/api/tts/speak', methods=['POST'])
def speak_endpoint():
    """Endpoint to speak text using TTS"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'Text is required'}), 400
        
        text = data['text'].strip()
        if not text:
            return jsonify({'error': 'Text cannot be empty'}), 400
        
        # Speak the text asynchronously
        speak_text_async(text)
        
        return jsonify({
            'success': True, 
            'message': 'Text speech started',
            'text': text
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tts/stop', methods=['POST'])
def stop_speech():
    """Stop current speech"""
    try:
        with engine_lock:
            if tts_engine:
                tts_engine.stop()
        return jsonify({'success': True, 'message': 'Speech stopped'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tts/status', methods=['GET'])
def tts_status():
    """Check TTS service status"""
    return jsonify({
        'status': 'running',
        'engine_available': tts_engine is not None,
        'message': 'TTS service is operational'
    })

if __name__ == '__main__':
    print("Starting TTS service...")
    if initialize_tts():
        print("TTS service ready on port 5001")
        app.run(host='0.0.0.0', port=5001, debug=False, threaded=True)
    else:
        print("Failed to start TTS service")
        exit(1)