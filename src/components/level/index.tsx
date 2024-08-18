import { ComponentType, useMemo } from "react";
import { Vector3 } from "three";
import { BlockAxe } from "./BlockAxe";
import { BlockEnd } from "./BlockEnd";
import { BlockLimbo } from "./BlockLimbo";
import { BlockSpinner } from "./BlockSpinner";
import { BlockStart } from "./BlockStart";
import { Bounds } from "./Bounds";

interface Props {
  count?: number;
  seed?: number;
  types?: ComponentType<{ position: Vector3 }>[];
}

export const Level = ({
  count = 5,
  seed = 0,
  types = [BlockSpinner, BlockAxe, BlockLimbo],
}: Props) => {
  const blocks = useMemo(() => {
    const results = [];
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      results.push(type);
    }
    return results;
  }, [count, types, seed]);

  return (
    <>
      <BlockStart position={new Vector3(0, 0, 0)} />
      {blocks.map((Block, idx) => {
        return <Block key={idx} position={new Vector3(0, 0, -(idx + 1) * 4)} />;
      })}
      <BlockEnd position={new Vector3(0, 0, -(count + 1) * 4)} />
      <Bounds length={count + 2} />
    </>
  );
};
