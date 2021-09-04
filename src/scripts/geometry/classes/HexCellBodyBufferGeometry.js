import * as THREE from "three/build/three.module";
import { forEach } from "lodash-es";

class HexCellBodyBufferGeometry extends THREE.CircleBufferGeometry {
    constructor() {
        console.log(arguments);
        super(...arguments);
    }
}

export default HexCellBodyBufferGeometry;
