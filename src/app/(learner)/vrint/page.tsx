// app/page.tsx
import VRclassroom from '@/components/custom/vrint';

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">VR Classroom</h1>
      <VRclassroom />
    </main>
  );
}