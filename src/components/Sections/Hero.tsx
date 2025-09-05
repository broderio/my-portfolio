import {ChevronDownIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {parse} from 'mathjs';
import {FC, memo, useCallback, useEffect, useRef, useState} from 'react';
import * as THREE from 'three';

import {heroData, SectionId} from '../../data/data';
import Section from '../Layout/Section';
import Socials from '../Socials';
import HeroBackground from './HeroBackground';
import HeroBackgroundControls from './HeroBackgroundControls';

const Hero: FC = memo(() => {
  const {name, description, actions} = heroData;
  const [showControls, setShowControls] = useState(false);

  // =========================================================
  // State for physics
  // =========================================================
  const [radialExpr, setRadialExpr] = useState('sin(2t - x)');
  const [tangentExpr, setTangentExpr] = useState('0');

  const [radialFn, setRadialFn] = useState<(x: number, t: number) => number>(() => (x: number, t: number) => Math.sin(2*t - x));
  const [tangentFn, setTangentFn] = useState<(x: number, t: number) => number>(() => () => 0);

  const [noise, setNoise] = useState(0.5);
  const [friction, setFriction] = useState(0.05);

  const [resetTrigger, setResetTrigger] = useState(0);

  // Pointer state (shared with background)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef<THREE.Vector2 | null>(null);

  // =========================================================
  // Handlers
  // =========================================================
  const startTime = useRef<number | null>(null);

  const applyFunctions = useCallback(
    (radial: string, tangent: string) => {
      try {
        const radialParsed = parse(radial);
        const tangentParsed = parse(tangent);

        setRadialFn(() => (x: number, t: number) => radialParsed.evaluate({x, t}));
        setTangentFn(() => (x: number, t: number) => tangentParsed.evaluate({x, t}));
        startTime.current = performance.now(); // reset timer
      } catch (e) {
        console.error('Invalid function expression', e);
      }
    },
    []
  );

  // Pointer drag state
  const isDragging = useRef(false);
  useEffect(() => {
    if (!canvasRef.current) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (!canvasRef.current) return;

      const target = e.target as HTMLElement;
      if (target.closest('.hero-ui')) return;

      // Only update if click is inside the canvas
      const rect = canvasRef.current.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        isDragging.current = true;
        pointer.current?.set(e.clientX - rect.left, e.clientY - rect.top);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      pointer.current?.set(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleResize = () => {
      if (!canvasRef.current) return;
      const {clientWidth, clientHeight} = canvasRef.current;
      pointer.current?.set(clientWidth / 2, clientHeight / 2);
      console.log(clientWidth / 2, clientHeight / 2)
    };

    startTime.current = performance.now(); // reset timer

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize)
    };
  }, []);



  const reset = useCallback(() => {
    setResetTrigger((n) => n + 1);
    startTime.current = performance.now(); // reset timer
  }, []);

  // =========================================================
  // Toggle controls with backtick
  // =========================================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`') {
        setShowControls((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // =========================================================
  // Render
  // =========================================================
  return (
    <Section noPadding sectionId={SectionId.Hero}>
      <div className="relative flex h-screen w-full items-center justify-center">
        {/* Background */}
        <div className="absolute z-0 h-full w-full">
          <HeroBackground
            canvasRef={canvasRef}
            friction={friction}
            noise={noise}
            pointer={pointer}
            radialFn={radialFn}
            resetTrigger={resetTrigger}
            startTime={startTime}
            tangentFn={tangentFn}
          />
        </div>

        {/* Foreground grid */}
        <div
          className={classNames(
            'relative z-10 grid h-full w-full items-center justify-center px-4 lg:px-8',
            showControls ? 'grid-cols-3 gap-6' : 'grid-cols-1'
          )}
        >
          {/* Hero content */}
          <div
            className={classNames(
              'hero-ui flex flex-col items-center gap-y-6 rounded-xl bg-gray-800/40 p-6 text-center shadow-lg backdrop-blur-sm',
              showControls ? 'col-span-2' : 'col-span-1 max-w-screen-lg mx-auto'
            )}
          >
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-7xl">{name}</h1>
            {description}
            <div className="flex gap-x-4 text-neutral-100">
              <Socials />
            </div>
            <div className="flex w-full justify-center gap-x-4">
              {actions.map(({href, text, primary, Icon}) => (
                <a
                  className={classNames(
                    'flex gap-x-2 rounded-full border-2 bg-none px-4 py-2 text-sm font-medium text-white ring-offset-gray-700/80 hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-base',
                    primary ? 'border-accent ring-accent' : 'border-white ring-white'
                  )}
                  href={href}
                  key={text}
                >
                  {text}
                  {Icon && <Icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />}
                </a>
              ))}
            </div>
          </div>

          {/* Controls */}
          {showControls && (
            <div className="hero-ui col-span-1 flex items-center">
              <HeroBackgroundControls
                applyFunctions={applyFunctions}
                friction={friction}
                noise={noise}
                radialExpr={radialExpr}
                reset={reset}
                setFriction={setFriction}
                setNoise={setNoise}
                setRadialExpr={setRadialExpr}
                setTangentExpr={setTangentExpr}
                tangentExpr={tangentExpr}
              />
            </div>
          )}
        </div>

        {/* Scroll down button */}
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <a
            className="rounded-full bg-white p-1 ring-white ring-offset-2 ring-offset-gray-700/80 focus:outline-none focus:ring-2 sm:p-2"
            href={`/#${SectionId.About}`}
          >
            <ChevronDownIcon className="h-5 w-5 bg-transparent sm:h-6 sm:w-6" />
          </a>
        </div>
      </div>
    </Section>
  );
});

Hero.displayName = 'Hero';
export default Hero;
