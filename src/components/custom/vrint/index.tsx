import React from 'react';

const VRclassroom = () => {
  return (
    <div className="container relative h-[600px] w-full overflow-hidden rounded-xl shadow-xl">
      <iframe
        src="https://framevr.io/classroomiterative-bytes"
        title="VR Classroom - Iterative Bytes"
        allow="camera; microphone; fullscreen; vr"
        allowFullScreen
        className="h-full w-full border-0"
        // Recommended security attributes
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-modals allow-forms"
      />
    </div>
  );
};

export default VRclassroom;