import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {parse} from "mathjs";
import {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import * as THREE from "three";

// =========================================================
// Constants
// =========================================================
const SPHERE_COUNT = 2500;
const SPHERE_RADIUS = 0.2;

// =========================================================
// Sphere Field Component
// =========================================================
const SphereField = memo(
    ({
        radialFn,
        tangentFn,
        pointer,
        resetTrigger,
        noise,
        friction,
    }: {
        radialFn: (x: number) => number;
        tangentFn: (x: number) => number;
        pointer: React.MutableRefObject<THREE.Vector2>;
        resetTrigger: number;
        noise: number;
        friction: number;
    }) => {
        const meshRef = useRef<THREE.InstancedMesh>(null);
        const raycaster = useRef(new THREE.Raycaster());
        const mouseWorld = useRef(new THREE.Vector3());
        const dummy = useMemo(() => new THREE.Object3D(), []);

        const {camera, viewport} = useThree();

        // Positions: regenerated when resetTrigger changes
        const positions = useMemo(() => {
            void resetTrigger;

            return Array.from({length: SPHERE_COUNT}, () =>
                new THREE.Vector3(
                    (Math.random() - 0.5) * viewport.width,
                    (Math.random() - 0.5) * viewport.height,
                    0
                )
            );
        }, [viewport.width, viewport.height, resetTrigger]);

        const velocities = useMemo(
            () => Array.from({length: SPHERE_COUNT}, () => new THREE.Vector3()),
            []
        );

        // =========================================================
        // Frame Loop
        // =========================================================
        useFrame(() => {
            if (!meshRef.current) return;

            raycaster.current.setFromCamera(pointer.current, camera);
            raycaster.current.ray.intersectPlane(
                new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
                mouseWorld.current
            );

            for (let i = 0; i < SPHERE_COUNT; i++) {
                const current = positions[i];
                const velocity = velocities[i];

                const direction = current.clone().sub(mouseWorld.current).normalize();
                const tangent = new THREE.Vector3(-direction.y, direction.x, 0);

                const dist = mouseWorld.current.distanceTo(current);
                const accelRadial = radialFn(dist);
                const accelTangent = tangentFn(dist);
                
                velocity.addScaledVector(direction, accelRadial * 0.01);
                velocity.addScaledVector(tangent, accelTangent * 0.01);
                
                // Apply random noise
                velocity.x += (Math.random() - 0.5) * noise * 0.1;
                velocity.y += (Math.random() - 0.5) * noise * 0.1;
                
                velocity.addScaledVector(velocity, -friction);

                current.add(velocity);

                dummy.position.copy(current);
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(i, dummy.matrix);
            }

            meshRef.current.instanceMatrix.needsUpdate = true;
        });

        return (
            <instancedMesh args={[undefined, undefined, SPHERE_COUNT]} ref={meshRef}>
                <sphereGeometry args={[SPHERE_RADIUS, 8, 8]} />
                <meshStandardMaterial color="#ffffff" />
            </instancedMesh>
        );
    }
);

// =========================================================
// Hero Background Component
// =========================================================
const HeroBackground = memo(() => {
    const cameraConfig = useMemo(
        () => ({
            position: [0, 0, 30] as [number, number, number],
            fov: 75,
        }),
        []
    );

    const [showControls, setShowControls] = useState(false);
    const [radialExpr, setRadialExpr] = useState("1 / x");
    const [tangentExpr, setTangentExpr] = useState("0");

    const [radialFn, setRadialFn] = useState<(x: number) => number>(() => (x: number) => 1 / x);
    const [tangentFn, setTangentFn] = useState<(x: number) => number>(() => () => 0);
    const [noise, setNoise] = useState(0.05);      // random acceleration
    const [friction, setFriction] = useState(0.05); // damping multiplier

    // Reset trigger increments to regenerate spheres
    const [resetTrigger, setResetTrigger] = useState(0);

    // Shared pointer ref
    const pointer = useRef(new THREE.Vector2());
    const isClicked = useRef(false); // <-- useRef instead of let


    // Toggle control panel with backtick
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "`") {
                setShowControls((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Apply math functions
    const handleApply = useCallback(() => {
        try {
            const radialParsed = parse(radialExpr);
            const tangentParsed = parse(tangentExpr);

            setRadialFn(() => (x: number) => radialParsed.evaluate({x}));
            setTangentFn(() => (x: number) => tangentParsed.evaluate({x}));
        } catch (e) {
            console.error("Invalid function expression", e);
        }
    }, [radialExpr, tangentExpr]);

    // Reset spheres
    const handleReset = useCallback(() => {
        setResetTrigger((n) => n + 1);
    }, []);

    const handleCanvasMouseDown = useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            isClicked.current = true; // <-- ref current
            const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            pointer.current.set(x, y);
        },
        []
    );

    const handleCanvasMouseUp = useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            void event;
            isClicked.current = false; // <-- ref current
        },
        []
    );

    const handleCanvasMouseMove = useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (isClicked.current) { // <-- ref current
                const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                pointer.current.set(x, y);
            }
        },
        []
    );

    return (
        <div className="hero-container">
            <Canvas camera={cameraConfig} onPointerDown={handleCanvasMouseDown} onPointerMove={handleCanvasMouseMove} onPointerUp={handleCanvasMouseUp}>
                <ambientLight intensity={1.2} />
                <pointLight position={[10, 10, 10]} />
                <SphereField
                    friction={friction}
                    noise={noise}
                    pointer={pointer}
                    radialFn={radialFn}
                    resetTrigger={resetTrigger}
                    tangentFn={tangentFn}
                />

            </Canvas>

            {showControls && (
                <div className="absolute top-16 right-6 z-20 px-4 lg:px-0">
                    <div className="flex w-full max-w-sm flex-col gap-y-4 rounded-xl bg-gray-800/40 p-4 text-left shadow-lg backdrop-blur-sm">
                        <h2 className="text-lg font-semibold text-white">Force Field Controls</h2>

                        <div className="flex flex-col gap-y-2 sm:flex-row sm:gap-x-4 sm:gap-y-0">
                            <label className="flex flex-col text-sm text-gray-200 w-full">
                                Radial
                                <input
                                    className="mt-1 w-full rounded-md border border-gray-500 bg-gray-700/60 px-2 py-1 text-white focus:border-accent focus:ring-2 focus:ring-accent focus:outline-none"
                                    onChange={(e) => setRadialExpr(e.target.value)}
                                    value={radialExpr}
                                />
                            </label>

                            <label className="flex flex-col text-sm text-gray-200 w-full">
                                Tangential
                                <input
                                    className="mt-1 w-full rounded-md border border-gray-500 bg-gray-700/60 px-2 py-1 text-white focus:border-accent focus:ring-2 focus:ring-accent focus:outline-none"
                                    onChange={(e) => setTangentExpr(e.target.value)}
                                    value={tangentExpr}
                                />
                            </label>
                        </div>

                        <div className="flex w-full justify-between">
                            <button
                                className="rounded-full border-2 border-accent px-4 py-2 text-sm font-medium text-white hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ring-offset-gray-700/80 sm:text-base"
                                onClick={handleApply}
                            >
                                Apply
                            </button>
                            <button
                                className="rounded-full border-2 border-white px-4 py-2 text-sm font-medium text-white hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ring-offset-gray-700/80 sm:text-base"
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                        </div>

                        <div className="flex flex-col gap-y-4">
                            <label className="flex flex-col text-left text-sm text-gray-200">
                                Noise
                                <input
                                    className="mt-1 w-full accent-accent"
                                    max="1"
                                    min="0"
                                    onChange={(e) => setNoise(parseFloat(e.target.value))}
                                    step="0.05"
                                    type="range"
                                    value={noise}
                                />
                            </label>

                            <label className="flex flex-col text-left text-sm text-gray-200">
                                Friction
                                <input
                                    className="mt-1 w-full accent-accent"
                                    max="1"
                                    min="0"
                                    onChange={(e) => setFriction(parseFloat(e.target.value))}
                                    step="0.05"
                                    type="range"
                                    value={friction}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
});

export default HeroBackground;
