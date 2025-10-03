import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";

function SparkParticles() {
  const ref = useRef();
  const positions = useMemo(() => {
    const count = 1200;
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      array[i3] = (Math.random() - 0.5) * 6;
      array[i3 + 1] = (Math.random() - 0.5) * 4;
      array[i3 + 2] = Math.random() * -6;
    }
    return array;
  }, []);

  useFrame((state) => {
    const { clock } = state;
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.12) * 0.45;
    ref.current.rotation.x = Math.cos(clock.elapsedTime * 0.08) * 0.25;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#7dd3fc"
        size={0.045}
        sizeAttenuation
        depthWrite={false}
        blending={2}
      />
    </Points>
  );
}

export default function HeroScene({ className }) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      className={className}
    >
      <color attach="background" args={["transparent"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 4]} intensity={1.2} color="#60a5fa" />
      <SparkParticles />
    </Canvas>
  );
}