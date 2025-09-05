import {memo} from 'react';

type ControlsProps = {
    radialExpr: string;
    setRadialExpr: (v: string) => void;
    tangentExpr: string;
    setTangentExpr: (v: string) => void;
    noise: number;
    setNoise: (v: number) => void;
    friction: number;
    setFriction: (v: number) => void;
    applyFunctions: (radial: string, tangent: string) => void;
    reset: () => void;
};

const HeroBackgroundControls = memo(
    ({
        radialExpr,
        setRadialExpr,
        tangentExpr,
        setTangentExpr,
        noise,
        setNoise,
        friction,
        setFriction,
        applyFunctions,
        reset,
    }: ControlsProps) => {
        return (
            <div className="h-full w-full max-w-sm flex flex-col gap-y-4 rounded-xl bg-gray-800/40 p-4 text-left shadow-lg backdrop-blur-sm">
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

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between w-full">
                    <button
                        className="rounded-full border-2 border-accent px-4 py-2 text-sm font-medium text-white hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ring-offset-gray-700/80 sm:text-base"
                        onClick={() => applyFunctions(radialExpr, tangentExpr)}
                    >
                        Apply
                    </button>
                    <button
                        className="rounded-full border-2 border-white px-4 py-2 text-sm font-medium text-white hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ring-offset-gray-700/80 sm:text-base"
                        onClick={reset}
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
        );
    }
);

HeroBackgroundControls.displayName = "HeroBackgroundControls";
export default HeroBackgroundControls;