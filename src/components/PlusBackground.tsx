import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useEffect, useState } from 'react';

export default function PlusBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <Particles
      id="plus-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      options={{
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        interactivity: {
          detectsOn: 'window',
          events: {
            onHover: { enable: true, mode: 'attract' },
          },
          modes: {
            attract: { distance: 200, duration: 0.4, speed: 3 },
          },
        },
        particles: {
          number: { value: 80, density: { enable: true } },
          color: { value: '#96bfcf' },
          shape: { type: 'circle' },
          opacity: { value: 0.45 },
          size: { value: { min: 2, max: 4 } },
          move: {
            enable: true,
            speed: 0.4,
            direction: 'none',
            random: true,
            outModes: { default: 'bounce' },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
