import { Canvas } from "@react-three/fiber";

export default function HeroScene() {
  console.log("🎬 HeroScene rendering");
  
  return (
    <div style={{ width: "100%", height: "100%", background: "#1a1a2e" }}>
      <Canvas
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl, scene }) => {
          console.log("✅ Three.js Canvas created!");
          console.log("WebGL version:", gl.capabilities.isWebGL2 ? "WebGL2" : "WebGL1");
          console.log("Renderer:", gl.info.render);
        }}
        onError={(error) => {
          console.error("❌ Three.js error:", error);
        }}
      >
        <color attach="background" args={["#0f172a"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </Canvas>
    </div>
  );
}