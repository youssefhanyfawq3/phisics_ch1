import React from 'react';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

export interface Section {
  title: string;
  content: string;
  points?: string[];
  important?: string;
  law?: string; // For mathematical formulas
  warning?: string; // For common mistakes
  examTrick?: string; // Specific exam tips
}

export interface LessonContent {
  id: string;
  title: string;
  description: string;
  sections: Section[];
  simulationType?: 'WIRE' | 'OHM' | 'SERIES_PARALLEL' | 'CLOSED_CIRCUIT' | 'KIRCHHOFF';
  quiz: QuizData;
  summary?: string[];
}

export interface SimulationState {
  voltage: number;
  resistance: number;
}

export interface WireState {
  length: number;
  area: number;
}

export interface CircuitState {
  r1: number;
  r2: number;
  r3: number;
  isSeries: boolean;
  vb: number;
  internalR: number; // r
  externalR: number; // R variable
}
import React from 'react';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

export interface Section {
  title: string;
  content: string;
  analogy?: string; // New field for simple explanations
  points?: string[];
  important?: string;
  law?: string; // For mathematical formulas
  warning?: string; // For common mistakes
  examTrick?: string; // Specific exam tips
}

export interface LessonContent {
  id: string;
  title: string;
  description: string;
  sections: Section[];
  simulationType?: 'WIRE' | 'OHM' | 'SERIES_PARALLEL' | 'CLOSED_CIRCUIT' | 'KIRCHHOFF';
  quiz: QuizData;
  summary?: string[];
}

export interface SimulationState {
  voltage: number;
  resistance: number;
}

export interface WireState {
  length: number;
  area: number;
}

export interface CircuitState {
  r1: number;
  r2: number;
  r3: number;
  isSeries: boolean;
  vb: number;
  internalR: number; // r
  externalR: number; // R variable
}