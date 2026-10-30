"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const W = 1.5; // page width
const H = 2.0; // page height
const OPEN = 0.2; // V-angle of each half toward the camera
const SEGMENTS = 28;

/* ─────────── Canvas textures ─────────── */

const LINES = [
  "لغتي العربية، وفي حروفها ذاكرة أمة",
  "الكلمة الطيبة كشجرة طيبة أصلها ثابت",
  "ومن الحروف تُبنى الجملة، ومن الجمل يُبنى المعنى",
  "العلم نورٌ، والقراءة سراجه الذي لا ينطفئ",
  "أنا البحر في أحشائه الدرّ كامنٌ",
  "فبالكلمة نفكّر، وبها نحلم، وبها نكون",
];

function paperTexture(fontFamily: string, seed: number) {
  const c = document.createElement("canvas");
  c.width = 768;
  c.height = 1024;
  const g = c.getContext("2d")!;
  // base
  const grad = g.createRadialGradient(384, 420, 120, 384, 512, 760);
  grad.addColorStop(0, "#F7F0DC");
  grad.addColorStop(1, "#DCCBA2");
  g.fillStyle = grad;
  g.fillRect(0, 0, c.width, c.height);
  // fibres / grain
  const img = g.getImageData(0, 0, c.width, c.height);
  let r = seed * 9301 + 49297;
  const rand = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rand() - 0.5) * 22;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n * 0.8;
  }
  g.putImageData(img, 0, 0);
  // ornamental frame
  g.strokeStyle = "rgba(138,21,56,.55)";
  g.lineWidth = 3;
  g.strokeRect(46, 46, c.width - 92, c.height - 92);
  g.lineWidth = 1;
  g.strokeRect(58, 58, c.width - 116, c.height - 116);
  // header
  g.direction = "rtl";
  g.textAlign = "center";
  g.fillStyle = "#8A1538";
  g.font = `700 64px ${fontFamily}`;
  g.fillText(seed % 2 ? "عربي١٠٠" : "البيان", c.width / 2, 170);
  g.fillStyle = "rgba(138,21,56,.8)";
  g.fillText("۞", c.width / 2, 240);
  // body text
  g.textAlign = "right";
  g.fillStyle = "rgba(40,32,20,.78)";
  g.font = `400 30px ${fontFamily}`;
  for (let i = 0; i < 14; i++) {
    const line = LINES[(i + seed) % LINES.length];
    g.fillText(line, c.width - 96, 320 + i * 48, c.width - 192);
  }
  // age stains
  for (let i = 0; i < 6; i++) {
    const x = rand() * c.width;
    const y = rand() * c.height;
    const s = g.createRadialGradient(x, y, 0, x, y, 60 + rand() * 120);
    s.addColorStop(0, "rgba(140,105,50,.08)");
    s.addColorStop(1, "rgba(140,105,50,0)");
    g.fillStyle = s;
    g.fillRect(0, 0, c.width, c.height);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function glyphTexture(ch: string, fontFamily: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.direction = "rtl";
  g.font = `800 76px ${fontFamily}`;
  g.shadowColor = "rgba(138,21,56,.35)";
  g.shadowBlur = 10;
  g.fillStyle = "#8A1538";
  g.fillText(ch, 64, 68);
  g.shadowBlur = 6;
  g.fillText(ch, 64, 68);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ─────────── Book parts ─────────── */

function Half({ side, map }: { side: 1 | -1; map: THREE.Texture }) {
  // side 1 = right half, -1 = left half; rotate so outer edge leans toward camera
  return (
    <group rotation={[0, -side * OPEN, 0]}>
      {/* page surface */}
      <mesh position={[(side * W) / 2, 0, 0.001]} receiveShadow>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={map} roughness={0.92} metalness={0} />
      </mesh>
      {/* page block */}
      <mesh position={[(side * W) / 2, 0, -0.045]} castShadow receiveShadow>
        <boxGeometry args={[W, H, 0.09]} />
        <meshStandardMaterial color="#E6D8B5" roughness={0.95} />
      </mesh>
      {/* leather cover */}
      <mesh position={[side * (W / 2 + 0.03), 0, -0.11]} castShadow>
        <boxGeometry args={[W + 0.1, H + 0.12, 0.04]} />
        <meshStandardMaterial color="#7A1231" roughness={0.5} metalness={0.15} />
      </mesh>
      {/* gilt edge line */}
      <mesh position={[side * (W + 0.075), 0, -0.088]}>
        <boxGeometry args={[0.012, H + 0.12, 0.005]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

function FlutterPage({ map, phase, speed, reduced }: { map: THREE.Texture; phase: number; speed: number; reduced: boolean }) {
  const geo = useMemo(() => new THREE.PlaneGeometry(W, H, SEGMENTS, 1), []);
  const base = useMemo(() => {
    // store each vertex's arc length along the page (0..W) and its y
    const pos = geo.attributes.position;
    const s = new Float32Array(pos.count);
    const y = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      s[i] = pos.getX(i) + W / 2;
      y[i] = pos.getY(i);
    }
    return { s, y };
  }, [geo]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const wave = reduced ? 0.15 : Math.sin(t * speed + phase);
    // smoothstep plateau → page rests on a stack, then turns
    const x = THREE.MathUtils.clamp((0.5 + 0.5 * wave - 0.25) / 0.5, 0, 1);
    const p = x * x * (3 - 2 * x);
    const dir = Math.cos(t * speed + phase) >= 0 ? 1 : -1;
    // Arabic books turn from left to right: p=0 left stack, p=1 right stack
    const a0 = Math.PI - OPEN - p * (Math.PI - 2 * OPEN);
    const bend = (reduced ? 0.25 : 0.95) * Math.sin(p * Math.PI) * dir;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    // integrate the curl along the page so it stays inextensible
    const ds = W / SEGMENTS;
    const px = new Float32Array(SEGMENTS + 1);
    const pz = new Float32Array(SEGMENTS + 1);
    for (let k = 1; k <= SEGMENTS; k++) {
      const u = (k - 0.5) / SEGMENTS;
      const a = a0 + bend * u * u;
      px[k] = px[k - 1] + Math.cos(a) * ds;
      pz[k] = pz[k - 1] + Math.sin(a) * ds;
    }
    for (let i = 0; i < pos.count; i++) {
      const k = Math.round((base.s[i] / W) * SEGMENTS);
      const ripple = Math.sin(t * 2.2 + base.y[i] * 1.5 + phase) * 0.012 * (base.s[i] / W);
      pos.setXYZ(i, px[k], base.y[i], pz[k] + 0.006 + ripple);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  // the back of the leaf gets a mirrored copy of the texture so text never reads backwards
  const backMap = useMemo(() => {
    const t = map.clone();
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.x = -1;
    t.needsUpdate = true;
    return t;
  }, [map]);

  return (
    <group>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial map={map} side={THREE.FrontSide} roughness={0.9} />
      </mesh>
      <mesh geometry={geo}>
        <meshStandardMaterial map={backMap} side={THREE.BackSide} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Book({ font, reduced }: { font: string; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const maps = useMemo(() => [paperTexture(font, 1), paperTexture(font, 2), paperTexture(font, 3)], [font]);
  const { pointer } = useThree();

  useFrame(({ clock }, dt) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const targetY = reduced ? 0 : Math.sin(t * 0.18) * 0.45 + pointer.x * 0.25;
    const targetX = -0.42 + (reduced ? 0 : pointer.y * 0.08);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 2, dt);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 2, dt);
  });

  useEffect(() => () => maps.forEach((m) => m.dispose()), [maps]);

  return (
    <group ref={group} rotation={[-0.42, 0, 0]}>
      <Half side={1} map={maps[0]} />
      <Half side={-1} map={maps[1]} />
      {/* spine */}
      <mesh position={[0, 0, -0.1]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, H + 0.12, 16, 1, false, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color="#5C0E25" roughness={0.5} />
      </mesh>
      <FlutterPage map={maps[2]} phase={0} speed={0.55} reduced={reduced} />
      {!reduced && <FlutterPage map={maps[0]} phase={2.1} speed={0.47} reduced={reduced} />}
      {!reduced && <FlutterPage map={maps[1]} phase={4.0} speed={0.62} reduced={reduced} />}
    </group>
  );
}

/* ─────────── Floating glyphs ─────────── */

const GLYPHS = ["ء", "،", "؛", "؟", "!", "ض", "ع", "ل", "غ", "ة", "ق", "ن", "«", "»", "ك", "ب"];

function Glyphs({ font, reduced, count = 46 }: { font: string; reduced: boolean; count?: number }) {
  const textures = useMemo(() => GLYPHS.map((g) => glyphTexture(g, font)), [font]);
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        tex: i % GLYPHS.length,
        x: (Math.random() - 0.5) * 9,
        y: (Math.random() - 0.5) * 6,
        z: (Math.random() - 0.5) * 4 - 0.5,
        s: 0.18 + Math.random() * 0.32,
        v: 0.08 + Math.random() * 0.18,
        sway: Math.random() * Math.PI * 2,
      })),
    [count]
  );
  const refs = useRef<(THREE.Sprite | null)[]>([]);

  useFrame(({ clock }, dt) => {
    if (reduced) return;
    const t = clock.getElapsedTime();
    items.forEach((it, i) => {
      const s = refs.current[i];
      if (!s) return;
      it.y += it.v * dt;
      if (it.y > 3.4) it.y = -3.4;
      s.position.set(it.x + Math.sin(t * 0.4 + it.sway) * 0.25, it.y, it.z);
      (s.material as THREE.SpriteMaterial).rotation = Math.sin(t * 0.3 + it.sway) * 0.4;
      (s.material as THREE.SpriteMaterial).opacity = 0.2 + 0.4 * Math.sin(Math.PI * ((it.y + 3.4) / 6.8));
    });
  });

  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  return (
    <group>
      {items.map((it, i) => (
        <sprite
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[it.x, it.y, it.z]}
          scale={[it.s, it.s, it.s]}
        >
          <spriteMaterial map={textures[it.tex]} transparent depthWrite={false} opacity={0.6} />
        </sprite>
      ))}
    </group>
  );
}

/* ─────────── Scene ─────────── */

export default function BookScene({ reduced }: { reduced: boolean }) {
  const [font, setFont] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => {
      if (!alive) return;
      // next/font hashes family names; read what the body actually uses
      setFont(getComputedStyle(document.body).fontFamily || "serif");
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden>
      {font && (
        <Canvas
          shadows
          dpr={[1, 1.75]}
          frameloop={visible ? "always" : "never"}
          camera={{ position: [0, 0.5, 6.6], fov: 38 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.55} color="#FFFFFF" />
          <hemisphereLight args={["#FFFFFF", "#F3E6EA", 0.45]} />
          <directionalLight
            position={[3, 5, 4]}
            intensity={2.1}
            color="#FFF4DC"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0004}
          />
          <pointLight position={[-3, 1, -2]} intensity={8} color="#E8B4C2" distance={10} />
          <pointLight position={[2.5, -1.5, 2]} intensity={3} color="#FFFFFF" distance={8} />
          <Float speed={reduced ? 0 : 1.2} rotationIntensity={reduced ? 0 : 0.15} floatIntensity={reduced ? 0 : 0.5}>
            <Book font={font} reduced={reduced} />
          </Float>
          <Glyphs font={font} reduced={reduced} />
          <ContactShadows position={[0, -1.7, 0]} opacity={0.25} scale={9} blur={2.8} far={3} color="#5C0E25" />
        </Canvas>
      )}
    </div>
  );
}
