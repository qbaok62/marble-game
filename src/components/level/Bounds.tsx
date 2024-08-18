import { boxGeometry, wallMaterial } from "@/constants";
import { RigidBody } from "@react-three/rapier";

interface Props {
  length?: number;
}

export const Bounds = ({ length = 1 }: Props) => {
  return (
    <RigidBody type="fixed" restitution={0.2} friction={0}>
      <mesh
        geometry={boxGeometry}
        material={wallMaterial}
        position={[2.15, 0.75, -(length * 2) + 2]}
        scale={[0.3, 1.5, 4 * length]}
        castShadow
      />
      <mesh
        geometry={boxGeometry}
        material={wallMaterial}
        position={[-2.15, 0.75, -(length * 2) + 2]}
        scale={[0.3, 1.5, 4 * length]}
      />
      <mesh
        geometry={boxGeometry}
        material={wallMaterial}
        position={[0, 0.75, -(length * 4) + 2]}
        scale={[4, 1.5, 0.3]}
      />
      {/* <CuboidCollider
        args={[2, 0.1, 2 * length]}
        position={[0, -0.1, -(length * 2) + 2]}
        restitution={0.2}
        friction={1}
      /> */}
    </RigidBody>
  );
};
