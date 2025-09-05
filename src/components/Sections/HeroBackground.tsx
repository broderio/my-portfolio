import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {FC, memo, RefObject,useMemo, useRef} from "react";
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
        startTime,
        canvasRef
    }: {
        radialFn: (x: number, t: number) => number;
        tangentFn: (x: number, t: number) => number;
        pointer: React.MutableRefObject<THREE.Vector2 | null>;
        resetTrigger: number;
        noise: number;
        friction: number;
        startTime: React.MutableRefObject<number | null>;
        canvasRef: RefObject<HTMLCanvasElement>;
    }) => {
        const meshRef = useRef<THREE.InstancedMesh>(null);
        const raycaster = useRef(new THREE.Raycaster());
        const mouseWorld = useRef(new THREE.Vector3());
        const dummy = useMemo(() => new THREE.Object3D(), []);

        const {camera, viewport} = useThree();

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
        useFrame(() => {
            if (!canvasRef.current) return;
            if (!meshRef.current) return;

            if (!pointer.current) {
                const {clientWidth, clientHeight} = canvasRef.current;
                pointer.current = new THREE.Vector2(clientWidth / 2, clientHeight / 2);
                console.log(pointer.current)
            }

            const t =
                startTime.current !== null
                    ? (performance.now() - startTime.current) / 1000
                    : 0;

            // Convert pointer from screen coords to NDC [-1, 1]
            const ndcPointer = new THREE.Vector2(
                (pointer.current.x / window.innerWidth) * 2 - 1,
                -(pointer.current.y / window.innerHeight) * 2 + 1
            );

            // console.log(ndcPointer.x, ndcPointer.y)

            raycaster.current.setFromCamera(ndcPointer, camera);
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
                const accelRadial = radialFn(dist, t);
                const accelTangent = tangentFn(dist, t);

                velocity.addScaledVector(direction, accelRadial * 0.01);
                velocity.addScaledVector(tangent, accelTangent * 0.01);

                // Random noise
                velocity.x += (Math.random() - 0.5) * noise * 0.1;
                velocity.y += (Math.random() - 0.5) * noise * 0.1;

                // Friction
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
type HeroBackgroundProps = {
    friction: number;
    noise: number;
    pointer: React.MutableRefObject<THREE.Vector2 | null>;
    radialFn: (x: number, t: number) => number;
    tangentFn: (x: number, t: number) => number;
    resetTrigger: number;
    startTime: React.MutableRefObject<number | null>;
    canvasRef: RefObject<HTMLCanvasElement>;
};

const HeroBackground: FC<HeroBackgroundProps> = memo(({
    friction,
    noise,
    pointer,
    radialFn,
    tangentFn,
    resetTrigger,
    startTime,
    canvasRef,
}) => {
    const cameraConfig = useMemo(
        () => ({
            position: [0, 0, 30] as [number, number, number],
            fov: 75,
        }),
        []
    );

    return (
        <Canvas
            camera={cameraConfig}
            ref={canvasRef}
        >
            <ambientLight intensity={1.2} />
            <pointLight position={[10, 10, 10]} />
            <SphereField
                canvasRef={canvasRef}
                friction={friction}
                noise={noise}
                pointer={pointer}
                radialFn={radialFn}
                resetTrigger={resetTrigger}
                startTime={startTime}
                tangentFn={tangentFn}
            />
        </Canvas>
    );
});

HeroBackground.displayName = "HeroBackground";
export default HeroBackground;
