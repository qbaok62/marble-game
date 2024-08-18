import { Controls, Phases } from "@/constants";
import { useGame } from "@/stores/useGame";
import { useKeyboardControls } from "@react-three/drei";
import { addEffect } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export const Interface = () => {
  const forward = useKeyboardControls<Controls>((state) => state.forward);
  const backward = useKeyboardControls<Controls>((state) => state.backward);
  const leftward = useKeyboardControls<Controls>((state) => state.leftward);
  const rightward = useKeyboardControls<Controls>((state) => state.rightward);
  const jump = useKeyboardControls<Controls>((state) => state.jump);

  const phase = useGame((state) => state.phase);
  const restart = useGame((state) => state.restart);

  const timeRef = useRef<HTMLDivElement>(null);

  const handleRestart = () => {
    restart();
  };

  useEffect(() => {
    const unsubcribeEffect = addEffect(() => {
      const state = useGame.getState();
      let elapsedTime = 0;
      if (state.phase === Phases.playing) {
        elapsedTime = Date.now() - state.startTime;
      } else if (state.phase === Phases.ended) {
        elapsedTime = state.endTime - state.startTime;
      }

      elapsedTime /= 1000;

      if (timeRef.current) {
        timeRef.current.textContent = elapsedTime.toFixed(2);
      }
    });

    return () => {
      unsubcribeEffect();
    };
  }, []);

  return (
    <div className="interface">
      {/* Time */}
      <div ref={timeRef} className="time">
        0.00
      </div>

      {/* Restart */}
      {phase === Phases.ended && (
        <div className="restart" onClick={handleRestart}>
          Restart
        </div>
      )}

      {/* Controls */}
      <div className="controls">
        <div className="raw">
          <div className={`key ${forward ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key ${leftward ? "active" : ""}`}></div>
          <div className={`key ${backward ? "active" : ""}`}></div>
          <div className={`key ${rightward ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key large ${jump ? "active" : ""}`}></div>
        </div>
      </div>
    </div>
  );
};
