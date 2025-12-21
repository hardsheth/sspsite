import React, { createContext, useContext, useState, ReactNode } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface SpeechContextType {
  activeField: string | null;
  setActiveField: (field: string | null) => void;
  transcript: string;
  resetTranscript: () => void;
  startListening: (fieldName: string) => void;
  stopListening: () => void;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export const SpeechProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [activeField, setActiveField] = useState<string | null>(null);

  const startListening = (fieldName: string) => {
    if (activeField && activeField !== fieldName) {
      stopListening();
    }
    setActiveField(fieldName);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setActiveField(null);
    resetTranscript();
  };

  return (
    <SpeechContext.Provider value={{ activeField, setActiveField, transcript, resetTranscript, startListening, stopListening }}>
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error('useSpeech must be used within a SpeechProvider');
  }
  return context;
};
