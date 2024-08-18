import { Phases } from "@/constants";
import { useGame } from "@/stores/useGame";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const Player = () => {
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const body = useRef<RapierRigidBody>(null);
  const { rapier, world } = useRapier();

  const [smoothedCameraPostion] = useState(() => new THREE.Vector3(10, 10, 10));
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  const blocksCount = useGame((state) => state.blocksCount);
  const start = useGame((state) => state.start);
  const restart = useGame((state) => state.restart);
  const end = useGame((state) => state.end);
  const phase = useGame((state) => state.phase);

  console.log(phase);

  const jump = () => {
    const origin = body.current?.translation();
    if (origin) {
      origin.y -= 0.31;
      const direction = { x: 0, y: -1, z: 0 };
      const ray = new rapier.Ray(origin, direction);
      const hit = world.castRay(ray, 10, true);

      if (hit?.timeOfImpact !== undefined && hit.timeOfImpact < 0.15) {
        body.current?.applyImpulse({ x: 0, y: 0.5, z: 0 }, true);
      }
    }
  };

  useFrame((state, delta) => {
    /** Control */
    const { forward, backward, leftward, rightward } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };
    const impluseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impluseStrength;
      torque.x -= torqueStrength;
    }
    if (backward) {
      impulse.z += impluseStrength;
      torque.x += torqueStrength;
    }
    if (rightward) {
      impulse.x += impluseStrength;
      torque.z -= torqueStrength;
    }
    if (leftward) {
      impulse.x -= impluseStrength;
      torque.z += torqueStrength;
    }

    body.current?.applyImpulse(impulse, true);
    body.current?.applyTorqueImpulse(torque, true);

    /** Camera */
    const bodyPosition = body.current?.translation();
    if (!bodyPosition) {
      return;
    }
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    smoothedCameraPostion.lerp(cameraPosition, 5 * delta);
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothedCameraPostion);
    state.camera.lookAt(smoothedCameraTarget);

    /** Phases */
    if (bodyPosition.z < -(blocksCount * 4 + 2)) {
      end();
    }
    if (bodyPosition.y < -4) {
      restart();
    }
  });

  const reset = () => {
    if (!body.current) {
      return;
    }
    body.current.setTranslation({ x: 0, y: 1, z: 0 }, true);
    body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
  };

  useEffect(() => {
    const unsubcribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) => {
        if (value === Phases.ready) {
          reset();
        }
      }
    );

    const unsubcribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) {
          jump();
        }
      }
    );

    const unsubcribeAny = subscribeKeys(() => {
      start();
    });

    return () => {
      unsubcribeJump();
      unsubcribeAny();
      unsubcribeReset();
    };
  }, []);

  return (
    <RigidBody
      ref={body}
      position={[0, 1, 0]}
      colliders={"ball"}
      restitution={0.2}
      friction={1}
      canSleep={false}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color={"mediumpurple"} flatShading />
      </mesh>
    </RigidBody>
  );
};
