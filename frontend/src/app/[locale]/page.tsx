import fs from 'fs';
import path from 'path';
import { HomeNavbar } from '@/components/home/home-navbar';
import { ClassroomScrollCanvas } from '@/components/home/classroom-scroll-canvas';
import { DualSpaceShowcase } from '@/components/home/dual-space-showcase';
import { AiLabWorkflow } from '@/components/home/ai-lab-workflow';
import { PricingSection } from '@/components/home/pricing-section';
import { HomeFooter } from '@/components/home/home-footer';

export default function HomePage() {
  // Read actual frames from public/images/home/classroom-scroll/ on the server
  let framePaths: string[] = [];
  try {
    const dirPath = path.join(
      process.cwd(),
      'public',
      'images',
      'home',
      'classroom-scroll'
    );
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      framePaths = files
        .filter((file) => /\.(webp|png|jpe?g|avif|svg)$/i.test(file))
        .sort((a, b) =>
          a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
        )
        .map((file) => `/images/home/classroom-scroll/${file}`);
    }
  } catch (error) {
    console.error('Safe fallback: unable to read classroom-scroll frames:', error);
    framePaths = [];
  }

  return (
    <div className="relative min-h-screen bg-[#F8FBFF] overflow-x-clip">
      {/* 1. Fixed Top Glass Navbar */}
      <HomeNavbar />

      {/* 2. Scrollytelling Classroom Sequence (The Penguin Walking into 3D Classroom) */}
      <ClassroomScrollCanvas framePaths={framePaths} />

      {/* 3. Dual-Space Showcase (Teaching Hub vs. Open English Hub) */}
      <DualSpaceShowcase />

      {/* 4. AI Interactive Toolkit & 4-Step Standardized Workflow */}
      <AiLabWorkflow />

      {/* 5. Simple & Transparent Pricing Section */}
      <PricingSection />

      {/* 6. Deep Slate Footer */}
      <HomeFooter />
    </div>
  );
}
