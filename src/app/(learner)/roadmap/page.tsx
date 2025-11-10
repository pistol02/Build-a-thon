import React from 'react';
import RoadmapComponent from '@/components/custom/roadmap';

export const metadata = {
  title: 'Learning Roadmap | LearnByte',
  description: 'Create personalized learning roadmaps based on your skill goals and aspirations',
};

export default function RoadmapPage() {
  return (
    <main>
      <RoadmapComponent />
    </main>
  );
}
