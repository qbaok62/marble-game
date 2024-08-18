import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Lights } from "./components/lights";
import { Level } from "./components/level";
import { Physics } from "@react-three/rapier";
import { Player } from "./components/plaayer";
import { Interface } from "./components/interface";
import { useGame } from "./stores/useGame";
import { Controls } from "./constants";

function App() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);

  return (
    <KeyboardControls
      map={[
        { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
        { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
        { name: Controls.leftward, keys: ["ArrowLeft", "KeyA"] },
        { name: Controls.rightward, keys: ["ArrowRight", "KeyD"] },
        { name: Controls.jump, keys: ["Space"] },
      ]}
    >
      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [4, 6, 10],
        }}
      >
        <color args={["#bdedfc"]} attach="background" />
        {/* <OrbitControls makeDefault /> */}
        <Physics>
          <Lights />
          <Level count={blocksCount} seed={blocksSeed} />
          <Player />
        </Physics>
      </Canvas>
      <Interface />
    </KeyboardControls>
  );
}

export default App;
