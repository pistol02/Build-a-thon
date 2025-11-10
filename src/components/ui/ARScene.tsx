import React, { useEffect, useRef } from 'react';

interface ARSceneProps {
  videoId: string | null;
  topic: string;
}

const ARScene: React.FC<ARSceneProps> = ({ videoId, topic }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!videoId || !sceneRef.current) return;
    
    // Create a simple AR-like experience without external dependencies
    const arContainer = document.createElement('div');
    arContainer.className = 'ar-container';
    arContainer.style.position = 'relative';
    arContainer.style.width = '100%';
    arContainer.style.height = '100vh';
    arContainer.style.overflow = 'hidden';
    arContainer.style.background = 'linear-gradient(to bottom, #87CEEB, #E0F7FF)';
    
    // Create a "floor" element
    const floor = document.createElement('div');
    floor.className = 'ar-floor';
    floor.style.position = 'absolute';
    floor.style.bottom = '0';
    floor.style.left = '0';
    floor.style.width = '100%';
    floor.style.height = '40%';
    floor.style.background = 'linear-gradient(to bottom, #8cbc8c, #3a5f3a)';
    floor.style.transform = 'perspective(500px) rotateX(60deg)';
    floor.style.transformOrigin = 'bottom';
    arContainer.appendChild(floor);
    
    // Create video container
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';
    videoContainer.style.position = 'absolute';
    videoContainer.style.top = '50%';
    videoContainer.style.left = '50%';
    videoContainer.style.transform = 'translate(-50%, -50%)';
    videoContainer.style.width = '80%';
    videoContainer.style.maxWidth = '600px';
    videoContainer.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)';
    videoContainer.style.borderRadius = '8px';
    videoContainer.style.overflow = 'hidden';
    
    // Create topic label
    const topicLabel = document.createElement('div');
    topicLabel.className = 'topic-label';
    topicLabel.style.position = 'absolute';
    topicLabel.style.top = '10px';
    topicLabel.style.left = '0';
    topicLabel.style.width = '100%';
    topicLabel.style.textAlign = 'center';
    topicLabel.style.color = 'white';
    topicLabel.style.padding = '10px';
    topicLabel.style.fontSize = '24px';
    topicLabel.style.fontWeight = 'bold';
    topicLabel.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.5)';
    topicLabel.textContent = `AR Classroom: ${topic}`;
    videoContainer.appendChild(topicLabel);
    
    // Create the iframe for YouTube
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.width = '100%';
    iframe.style.height = '340px';
    iframe.style.border = 'none';
    videoContainer.appendChild(iframe);
    
    // Add the video container to the AR container
    arContainer.appendChild(videoContainer);
    
    // Add AR instructions
    const instructions = document.createElement('div');
    instructions.className = 'ar-instructions';
    instructions.style.position = 'absolute';
    instructions.style.bottom = '20px';
    instructions.style.left = '0';
    instructions.style.width = '100%';
    instructions.style.textAlign = 'center';
    instructions.style.color = 'white';
    instructions.style.padding = '10px';
    instructions.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    instructions.style.fontSize = '16px';
    instructions.innerHTML = `
      <p>Move your device to explore the AR classroom</p>
      <p>Tap and drag to reposition the video</p>
    `;
    arContainer.appendChild(instructions);
    
    // Add AR objects (decorative elements)
    const addARObject = (x: number, y: number, size: number, color: string) => {
      const object = document.createElement('div');
      object.className = 'ar-object';
      object.style.position = 'absolute';
      object.style.left = `${x}%`;
      object.style.top = `${y}%`;
      object.style.width = `${size}px`;
      object.style.height = `${size}px`;
      object.style.borderRadius = '50%';
      object.style.backgroundColor = color;
      object.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
      arContainer.appendChild(object);
      
      // Add simple animation
      let angle = 0;
      const radius = 20;
      const animate = () => {
        angle += 0.01;
        const newX = parseInt(object.style.left) + Math.sin(angle) * radius;
        const newY = parseInt(object.style.top) + Math.cos(angle) * radius;
        object.style.left = `${newX}%`;
        object.style.top = `${newY}%`;
        requestAnimationFrame(animate);
      };
      
      animate();
    };
    
    // Add some decorative AR elements
    addARObject(20, 30, 20, 'rgba(255, 0, 0, 0.5)');
    addARObject(80, 25, 25, 'rgba(0, 0, 255, 0.5)');
    addARObject(60, 70, 15, 'rgba(0, 255, 0, 0.5)');
    
    // Make the video draggable for interaction
    let isDragging = false;
    let startX = 0, startY = 0;
    let offsetX = 0, offsetY = 0;
    
    videoContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      offsetX = videoContainer.offsetLeft;
      offsetY = videoContainer.offsetTop;
      videoContainer.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      videoContainer.style.left = `${offsetX + dx}px`;
      videoContainer.style.top = `${offsetY + dy}px`;
      videoContainer.style.transform = 'none';
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
      videoContainer.style.cursor = 'grab';
    });
    
    // Add touch support
    videoContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      offsetX = videoContainer.offsetLeft;
      offsetY = videoContainer.offsetTop;
    });
    
    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      
      videoContainer.style.left = `${offsetX + dx}px`;
      videoContainer.style.top = `${offsetY + dy}px`;
      videoContainer.style.transform = 'none';
    });
    
    document.addEventListener('touchend', () => {
      isDragging = false;
    });
    
    // Device orientation for AR effect
    window.addEventListener('deviceorientation', (e) => {
      if (e.beta && e.gamma) {
        const tiltX = Math.min(Math.max(e.gamma, -20), 20) / 40;
        const tiltY = Math.min(Math.max(e.beta - 45, -20), 20) / 40;
        
        arContainer.style.perspective = '1000px';
        floor.style.transform = `perspective(500px) rotateX(60deg) rotateY(${tiltX * 10}deg)`;
        
        if (!isDragging) {
          videoContainer.style.transform = `translate(-50%, -50%) rotateX(${tiltY * 10}deg) rotateY(${-tiltX * 10}deg)`;
        }
      }
    });
    
    // Add everything to the scene
    sceneRef.current.appendChild(arContainer);
    
    // Store iframe reference
    iframeRef.current = iframe;
    
    // Cleanup function
    return () => {
      if (sceneRef.current) {
        sceneRef.current.removeChild(arContainer);
      }
      iframeRef.current = null;
    };
  }, [videoId, topic]);

  return (
    <div className="ar-scene" ref={sceneRef} style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
      {!videoId && <div className="text-center p-4">No video selected</div>}
    </div>
  );
};

export default ARScene;
