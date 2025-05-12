
"use client";

import Image from 'next/image';
import type { FC } from 'react';

interface TemplateItemProps {
  id: number;
  title: string;
  imageUrl: string;
  dataAiHint: string;
}

const TemplateItem: FC<TemplateItemProps> = ({ title, imageUrl, dataAiHint }) => {
  return (
    <div className="flex-shrink-0 w-48 h-36 bg-card border border-border rounded-lg shadow-lg p-3 mx-3 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
      <div className="w-full h-20 relative mb-2 overflow-hidden rounded-md">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="transform group-hover:scale-105 transition-transform duration-300"
          data-ai-hint={dataAiHint}
        />
      </div>
      <p className="text-xs font-medium text-center text-foreground truncate w-full">
        {title}
      </p>
    </div>
  );
};

interface TemplateRowProps {
  templates: TemplateItemProps[];
  direction?: 'left' | 'right';
  speed?: string;
}

const TemplateRow: FC<TemplateRowProps> = ({ templates, direction = 'left', speed = '30s' }) => {
  const duplicatedTemplates = [...templates, ...templates, ...templates]; // Duplicate more for smoother long scroll
  
  const animationClass = direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right';

  return (
    <div className="overflow-hidden w-full my-3">
      <div 
        className={`flex ${animationClass}`} 
        style={{ animationDuration: speed }}
      >
        {duplicatedTemplates.map((template, index) => (
          <TemplateItem key={`${template.id}-${index}`} {...template} />
        ))}
      </div>
    </div>
  );
};

const templates: TemplateItemProps[] = [
  { id: 1, title: 'Marketing Email Copy', imageUrl: 'https://picsum.photos/160/90?random=1', dataAiHint: 'email marketing' },
  { id: 2, title: 'Product Description', imageUrl: 'https://picsum.photos/160/90?random=2', dataAiHint: 'ecommerce product' },
  { id: 3, title: 'Blog Post Outline', imageUrl: 'https://picsum.photos/160/90?random=3', dataAiHint: 'blog writing' },
  { id: 4, title: 'Social Media Ad', imageUrl: 'https://picsum.photos/160/90?random=4', dataAiHint: 'social ad' },
  { id: 5, title: 'Website Headline', imageUrl: 'https://picsum.photos/160/90?random=5', dataAiHint: 'website copy' },
  { id: 6, title: 'Sales Pitch Script', imageUrl: 'https://picsum.photos/160/90?random=6', dataAiHint: 'sales script' },
  { id: 7, title: 'Video Script Intro', imageUrl: 'https://picsum.photos/160/90?random=7', dataAiHint: 'video script' },
  
  { id: 8, title: 'SEO Keyword Ideas', imageUrl: 'https://picsum.photos/160/90?random=8', dataAiHint: 'seo keyword' },
  { id: 9, title: 'Landing Page Content', imageUrl: 'https://picsum.photos/160/90?random=9', dataAiHint: 'landing page' },
  { id: 10, title: 'Newsletter Snippet', imageUrl: 'https://picsum.photos/160/90?random=10', dataAiHint: 'newsletter email' },
  { id: 11, title: 'Creative Story Plot', imageUrl: 'https://picsum.photos/160/90?random=11', dataAiHint: 'story writing' },
  { id: 12, title: 'Resume Summary', imageUrl: 'https://picsum.photos/160/90?random=12', dataAiHint: 'resume professional' },
  { id: 13, title: 'Cover Letter Hook', imageUrl: 'https://picsum.photos/160/90?random=13', dataAiHint: 'cover letter' },
  { id: 14, title: 'Presentation Outline', imageUrl: 'https://picsum.photos/160/90?random=14', dataAiHint: 'presentation business' },

  { id: 15, title: 'Code Snippet Explanation', imageUrl: 'https://picsum.photos/160/90?random=15', dataAiHint: 'code programming' },
  { id: 16, title: 'Recipe Instructions', imageUrl: 'https://picsum.photos/160/90?random=16', dataAiHint: 'recipe food' },
  { id: 17, title: 'Fitness Plan Summary', imageUrl: 'https://picsum.photos/160/90?random=17', dataAiHint: 'fitness health' },
  { id: 18, title: 'Travel Itinerary Idea', imageUrl: 'https://picsum.photos/160/90?random=18', dataAiHint: 'travel plan' },
  { id: 19, title: 'Song Lyric Theme', imageUrl: 'https://picsum.photos/160/90?random=19', dataAiHint: 'music song' },
  { id: 20, title: 'Game Concept Pitch', imageUrl: 'https://picsum.photos/160/90?random=20', dataAiHint: 'game design' },
  { id: 21, title: 'Educational Quiz Question', imageUrl: 'https://picsum.photos/160/90?random=21', dataAiHint: 'education quiz' },
];

const TemplateGallery: FC = () => {
  return (
    <div className="pt-6 border-t border-border mt-6">
      <h3 className="text-xl font-semibold text-center mb-6 text-primary">
        Explore FormFlow Templates
      </h3>
      <TemplateRow templates={templates.slice(0, 7)} direction="left" speed="60s" />
      <TemplateRow templates={templates.slice(7, 14)} direction="right" speed="75s" />
      <TemplateRow templates={templates.slice(14, 21)} direction="left" speed="65s" />
    </div>
  );
};

export default TemplateGallery;
