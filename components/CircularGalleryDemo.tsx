'use client';

import CircularGallery from './CircularGallery';

export default function CircularGalleryDemo() {
  return (
    <div style={{ height: '600px', position: 'relative', width: '100%' }}>
      <CircularGallery 
        bend={2} 
        textColor="#000000" 
        borderRadius={0.05} 
        scrollEase={0.2} 
        scrollSpeed={3}
      />
    </div>
  );
}
