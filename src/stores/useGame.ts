import { Phases } from "@/constants";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface GameState {
  blocksCount: number;
  blocksSeed: number;
  startTime: number;
  endTime: number;
  phase: Phases;
  start: () => void;
  restart: () => void;
  end: () => void;
}

export const useGame = create<GameState>()(
  subscribeWithSelector((set) => ({
    blocksCount: 10,
    blocksSeed: 0,

    /**
     * Time
     */
    startTime: 0,
    endTime: 0,

    /**
     * Phases
     */
    phase: Phases.ready,

    start: () =>
      set((state) => {
        if (state.phase === Phases.ready) {
          return {
            startTime: Date.now(),
            phase: Phases.playing,
          };
        }
        return {};
      }),
    restart: () =>
      set((state) => {
        if ([Phases.playing, Phases.ended].includes(state.phase)) {
          return {
            blocksSeed: Math.random(),
            phase: Phases.ready,
          };
        }
        return {};
      }),
    end: () =>
      set((state) => {
        if (state.phase === Phases.playing) {
          return {
            phase: Phases.ended,
            endTime: Date.now(),
          };
        }
        return {};
      }),
  }))
);
