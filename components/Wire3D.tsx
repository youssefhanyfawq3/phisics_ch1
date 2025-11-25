import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

interface Wire3DProps {
  length: number;
  area: number;
}

const WireMesh: React.FC<Wire3DProps> = ({ length, area }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const resistanceValue = (length / (area * area)).toFixed(2);

  useFrame((state) => {
    if (meshRef.current) {
       meshRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group>
      <mesh 
        ref={meshRef} 
        rotation={[0, 0, Math.PI / 2]} 
        position={[0, 0, 0]}
      >
        <cylinderGeometry args={[area * 0.5, area * 0.5, length * 4, 32]} />
        <meshPhysicalMaterial 
          color="#b45309" 
          emissive="#78350f"
          emissiveIntensity={0.2}
          metalness={0.9} 
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      <ElectronFlow length={length} area={area} />
      
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          position={[0, 2.2, 0]}
          color="#fbbf24"
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/cairo/v20/SLXgc1nY6HkvangtZmpcMw.woff"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          {`R ∝ L/A² ≈ ${resistanceValue} Ω`}
        </Text>
      </Float>
    </group>
  );
};

const ElectronFlow: React.FC<{length: number, area: number}> = ({ length, area }) => {
  const count = 40;
  const particles = useMemo(() => {
    const temp = [];
    for(let i=0; i<count; i++) {
        temp.push({
            x: (Math.random() - 0.5) * length * 4,
            y: (Math.random() - 0.5) * area * 0.6,
            z: (Math.random() - 0.5) * area * 0.6,
            speed: 0.03 + Math.random() * 0.05,
            size: 0.03 + Math.random() * 0.04
        })
    }
    return temp;
  }, [length, area]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if(groupRef.current) {
        groupRef.current.children.forEach((child, i) => {
            const p = particles[i];
            child.position.x += p.speed;
            if (child.position.x > (length * 2)) {
                child.position.x = -(length * 2);
            }
        });
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 2]}>
        {particles.map((p, i) => (
            <mesh key={i} position={[p.x, p.y, p.z]}>
                <sphereGeometry args={[p.size, 8, 8]} />
                <meshBasicMaterial color="#fcd34d" toneMapped={false} />
            </mesh>
        ))}
    </group>
  );
};

const Wire3D: React.FC<Wire3DProps> = (props) => {
  return (
    <div className="w-full h-80 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800/50 relative group">
      <div className="absolute top-3 right-3 z-10 bg-black/50 backdrop-blur border border-white/10 p-2 rounded-lg text-[10px] text-slate-300 flex items-center gap-2 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
        Interactive 3D View
      </div>
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={3} color="#fbbf24" />
        <pointLight position={[-10, -10, -5]} intensity={2} color="#38bdf8" />
        <spotLight position={[0, 5, 0]} intensity={1} angle={0.5} penumbra={1} />
        <WireMesh {...props} />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
};

export default Wire3D;