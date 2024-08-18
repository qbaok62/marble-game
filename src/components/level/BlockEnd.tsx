import { boxGeometry, floor1Material } from "@/constants";
import { Text, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";

interface Props {
  position?: Vector3;
}

export const BlockEnd = ({ position = new Vector3(0, 0, 0) }: Props) => {
  const hamburger = useGLTF("./hamburger.glb");

  hamburger.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });

  return (
    <group position={position}>
      <Text
        // font="./bebas-neue-v9-latin-regular.woff"
        scale={0.5}
        position={[0, 2.25, 2]}
      >
        FINISH
        <meshBasicMaterial toneMapped={false} />
      </Text>
      <RigidBody type="fixed" restitution={0.2} friction={1}>
        <mesh
          geometry={boxGeometry}
          material={floor1Material}
          position={[0, 0, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
        <RigidBody
          type="fixed"
          colliders="hull"
          restitution={0.2}
          friction={0}
          position={[0, 0.75, 0]}
        >
          <primitive object={hamburger.scene} scale={0.2} />
        </RigidBody>
      </RigidBody>
    </group>
  );
};
