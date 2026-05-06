import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { ZONE_CONFIGS, ZoneId, ZONE_ORDER } from '../../types/zone';
import { ArtistData } from '../../types/artist';

// ── Layout constants ──────────────────────────────────────────
// Smaller rooms = artworks feel close and readable
const ROOM_DEPTH  = 14;
const ROOM_WIDTH  = 13;
const ROOM_HEIGHT = 6;
const ROOM_GAP    = 3;

// Larger artwork frames
const FRAME_W = 3.4;
const FRAME_H = 2.5;

function roomZ(order: number) {
  return -(order * (ROOM_DEPTH + ROOM_GAP));
}

// ── Texture loader ────────────────────────────────────────────
function useArtworkTexture(url: string): THREE.Texture {
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(url);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [url]);
  useEffect(() => () => { texture.dispose(); }, [texture]);
  return texture;
}

// ── Artwork frame ─────────────────────────────────────────────
interface ArtworkFrameProps {
  artist: ArtistData;
  position: [number, number, number];
  rotation: [number, number, number];
  onClick: (artist: ArtistData) => void;
}

function ArtworkFrame({ artist, position, rotation, onClick }: ArtworkFrameProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const texture   = useArtworkTexture(artist.media.thumbnailUrl);
  const zoneColor = ZONE_CONFIGS[artist.zone].color;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const t = hovered ? 1.05 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(t, t, t), 1 - Math.pow(0.001, delta));
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Border frame */}
      <mesh>
        <boxGeometry args={[FRAME_W + 0.2, FRAME_H + 0.18, 0.05]} />
        <meshStandardMaterial
          color={hovered ? zoneColor : '#2e2820'}
          emissive={hovered ? zoneColor : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
          roughness={0.6}
        />
      </mesh>

      {/* Image */}
      <mesh
        position={[0, 0, 0.04]}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerLeave={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'default'; }}
        onClick={(e)         => { e.stopPropagation(); onClick(artist); }}
      >
        <planeGeometry args={[FRAME_W, FRAME_H]} />
        <meshStandardMaterial map={texture} roughness={0.9} />
      </mesh>

      {/* Artwork light — close spotlight on the frame */}
      <pointLight
        position={[0, FRAME_H / 2 + 1.2, 1.8]}
        color="#ffffff"
        intensity={hovered ? 6 : 4}
        distance={5}
        decay={2}
      />

      {/* Title */}
      <Text
        position={[0, -(FRAME_H / 2 + 0.28), 0.04]}
        fontSize={0.16}
        maxWidth={FRAME_W + 0.3}
        textAlign="center"
        color={hovered ? zoneColor : '#d4c8b4'}
        anchorX="center"
        anchorY="top"
      >
        {artist.work.titleKo}
      </Text>

      {/* Artist name */}
      <Text
        position={[0, -(FRAME_H / 2 + 0.55), 0.04]}
        fontSize={0.12}
        maxWidth={FRAME_W + 0.3}
        textAlign="center"
        color="rgba(232,228,220,0.45)"
        anchorX="center"
        anchorY="top"
      >
        {artist.name.en}
      </Text>
    </group>
  );
}

// ── Zone room ─────────────────────────────────────────────────
interface ZoneRoomProps {
  zoneId: ZoneId;
  artists: ArtistData[];
  order: number;
  isMobile: boolean;
  onArtworkClick: (artist: ArtistData) => void;
}

function ZoneRoom({ zoneId, artists, order, isMobile, onArtworkClick }: ZoneRoomProps) {
  const cfg    = ZONE_CONFIGS[zoneId];
  const z      = roomZ(order);
  const wallC  = useMemo(() => new THREE.Color(cfg.wallColor),  [cfg.wallColor]);
  const floorC = useMemo(() => new THREE.Color(cfg.floorColor), [cfg.floorColor]);
  const lightC = useMemo(() => new THREE.Color(cfg.lightColor), [cfg.lightColor]);

  // Mobile: show only back wall (2 artworks), avoid clipping on narrow screens
  const slots: { pos: [number, number, number]; rot: [number, number, number] }[] = isMobile
    ? [
        { pos: [-2.2, 1.8, z - ROOM_DEPTH / 2 + 0.3], rot: [0, 0, 0] },
        { pos: [ 2.2, 1.8, z - ROOM_DEPTH / 2 + 0.3], rot: [0, 0, 0] },
      ]
    : [
        { pos: [-3.0, 1.8, z - ROOM_DEPTH / 2 + 0.3], rot: [0, 0, 0] },
        { pos: [ 3.0, 1.8, z - ROOM_DEPTH / 2 + 0.3], rot: [0, 0, 0] },
        { pos: [-ROOM_WIDTH / 2 + 0.3, 1.8, z - 1.5], rot: [0,  Math.PI / 2, 0] },
        { pos: [ ROOM_WIDTH / 2 - 0.3, 1.8, z - 1.5], rot: [0, -Math.PI / 2, 0] },
      ];

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, z]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color={floorC} roughness={0.95} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_HEIGHT, z]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color={wallC} roughness={1} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, ROOM_HEIGHT / 2, z - ROOM_DEPTH / 2]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={wallC} roughness={0.95} />
      </mesh>

      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, z]}>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={wallC} roughness={0.95} />
      </mesh>

      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, z]}>
        <planeGeometry args={[ROOM_DEPTH, ROOM_HEIGHT]} />
        <meshStandardMaterial color={wallC} roughness={0.95} />
      </mesh>

      {/* Zone ceiling wash — main fill light */}
      <pointLight
        position={[0, ROOM_HEIGHT - 0.5, z]}
        color={lightC}
        intensity={cfg.lightIntensity}
        distance={22}
        decay={2}
      />

      {/* Back-wall focused light */}
      <pointLight
        position={[0, ROOM_HEIGHT - 0.5, z - ROOM_DEPTH / 2 + 2]}
        color={lightC}
        intensity={cfg.lightIntensity * 0.8}
        distance={14}
        decay={2}
      />

      {/* Side fill lights */}
      <pointLight position={[-ROOM_WIDTH / 2 + 1, ROOM_HEIGHT / 2, z]} color={lightC} intensity={8} distance={10} decay={2} />
      <pointLight position={[ ROOM_WIDTH / 2 - 1, ROOM_HEIGHT / 2, z]} color={lightC} intensity={8} distance={10} decay={2} />

      {/* Floor accent stripe at entrance */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, z + ROOM_DEPTH / 2 - 0.8]}>
        <planeGeometry args={[ROOM_WIDTH, 0.08]} />
        <meshStandardMaterial color={cfg.color} emissive={cfg.color} emissiveIntensity={1.2} />
      </mesh>

      {/* Artworks */}
      {artists.slice(0, slots.length).map((artist, i) => (
        <ArtworkFrame
          key={artist.id}
          artist={artist}
          position={slots[i].pos}
          rotation={slots[i].rot}
          onClick={onArtworkClick}
        />
      ))}
    </group>
  );
}

// ── Lobby floor ───────────────────────────────────────────────
function LobbyFloor() {
  const totalLen = ZONE_ORDER.length * (ROOM_DEPTH + ROOM_GAP) + 20;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -(totalLen / 2) + 10]}>
      <planeGeometry args={[ROOM_WIDTH, totalLen]} />
      <meshStandardMaterial color="#0a0a0a" roughness={1} />
    </mesh>
  );
}

// ── Zone portal disc in lobby ─────────────────────────────────
interface ZonePortalProps {
  zoneId: ZoneId;
  order: number;
  visited: boolean;
  isMobile: boolean;
  onClick: () => void;
}

function ZonePortal({ zoneId, order, visited, isMobile, onClick }: ZonePortalProps) {
  const cfg     = ZONE_CONFIGS[zoneId];
  const z       = roomZ(order) + ROOM_DEPTH / 2 - 1;
  const discRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!discRef.current) return;
    discRef.current.position.y = 0.06 + Math.sin(clock.elapsedTime * 1.5 + order * 1.2) * 0.05;
  });

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color:             new THREE.Color(cfg.color),
        emissive:          new THREE.Color(cfg.color),
        emissiveIntensity: hovered ? 1.6 : visited ? 1.0 : 0.5,
        roughness:         0.2,
      }),
    [cfg.color, hovered, visited],
  );

  const spread = isMobile ? 1.8 : 2.8;

  return (
    <group position={[0, 0, z]}>
      <mesh
        ref={discRef}
        rotation={[-Math.PI / 2, 0, 0]}
        material={mat}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerLeave={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'default'; }}
        onClick={(e)         => { e.stopPropagation(); onClick(); }}
      >
        <circleGeometry args={[isMobile ? 0.55 : 0.7, 40]} />
      </mesh>

      <pointLight
        position={[0, 0.6, 0]}
        color={cfg.color}
        intensity={hovered ? 8 : visited ? 5 : 3}
        distance={isMobile ? 5 : 7}
        decay={2}
      />

      <Text
        position={[0, 0.55, 0]}
        fontSize={isMobile ? 0.19 : 0.22}
        color={cfg.color}
        anchorX="center"
        anchorY="bottom"
        maxWidth={isMobile ? 4 : 6}
      >
        {visited ? `✓ ${cfg.emoji} ${cfg.labelKo}` : `${cfg.emoji} ${cfg.labelKo}`}
      </Text>
    </group>
  );
}

// ── Camera rig ────────────────────────────────────────────────
interface CameraRigProps {
  targetZ: number;
  targetY: number;
  targetFov: number;
}

function CameraRig({ targetZ, targetY, targetFov }: CameraRigProps) {
  const { camera } = useThree();
  const posZ   = useRef((camera as THREE.PerspectiveCamera).position.z);
  const posY   = useRef((camera as THREE.PerspectiveCamera).position.y);
  const curFov = useRef((camera as THREE.PerspectiveCamera).fov);

  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.005, delta);
    posZ.current   += (targetZ   - posZ.current)   * k;
    posY.current   += (targetY   - posY.current)   * k;
    curFov.current += (targetFov - curFov.current) * k;

    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(0, posY.current, posZ.current);
    cam.fov = curFov.current;
    cam.updateProjectionMatrix();

    // Look straight at the artworks, not down
    cam.lookAt(0, posY.current, posZ.current - 6);
  });

  return null;
}

// ── Viewport size detector ────────────────────────────────────
function useIsMobile() {
  const { size } = useThree();
  return size.width < 640;
}

function SceneContent({
  artistsByZone,
  activeZone,
  visitedZones,
  onZoneSelect,
  onArtworkClick,
}: GallerySceneProps) {
  const isMobile = useIsMobile();

  const LOBBY_Z  = isMobile ? 10 : 12;
  const ZONE_FOV = isMobile ? 82 : 68;
  const LOBBY_FOV = isMobile ? 90 : 75;

  const targetZ = activeZone !== null
    ? roomZ(ZONE_ORDER.indexOf(activeZone)) + ROOM_DEPTH / 2 - (isMobile ? 1 : 2)
    : LOBBY_Z;
  const targetY   = activeZone !== null ? 1.8 : 2.4;
  const targetFov = activeZone !== null ? ZONE_FOV : LOBBY_FOV;

  return (
    <>
      <CameraRig targetZ={targetZ} targetY={targetY} targetFov={targetFov} />

      {/* Bright global ambient — key fix for darkness */}
      <ambientLight intensity={0.55} color="#e8e4dc" />

      {/* Warm lobby light */}
      <pointLight position={[0, 5, LOBBY_Z - 2]} color="#c8a882" intensity={12} distance={20} decay={2} />

      <LobbyFloor />

      {ZONE_ORDER.map((id, i) => (
        <ZonePortal
          key={id}
          zoneId={id}
          order={i}
          visited={visitedZones.has(id)}
          isMobile={isMobile}
          onClick={() => onZoneSelect(id)}
        />
      ))}

      {ZONE_ORDER.map((id, i) => (
        <ZoneRoom
          key={id}
          zoneId={id}
          artists={artistsByZone[id] ?? []}
          order={i}
          isMobile={isMobile}
          onArtworkClick={onArtworkClick}
        />
      ))}
    </>
  );
}

// ── Main export ───────────────────────────────────────────────
export interface GallerySceneProps {
  artistsByZone: Record<ZoneId, ArtistData[]>;
  activeZone: ZoneId | null;
  visitedZones: Set<ZoneId>;
  onZoneSelect: (id: ZoneId) => void;
  onArtworkClick: (artist: ArtistData) => void;
}

const INITIAL_FOV = 75;
const INITIAL_Z   = 12;

export function GalleryScene(props: GallerySceneProps) {
  return (
    <Canvas
      shadows={false}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,        // brighter exposure
      }}
      style={{ background: '#080808' }}
      onPointerMissed={() => {/* no-op */}}
    >
      <PerspectiveCamera
        makeDefault
        fov={INITIAL_FOV}
        near={0.1}
        far={300}
        position={[0, 2.4, INITIAL_Z]}
      />

      <SceneContent {...props} />
    </Canvas>
  );
}