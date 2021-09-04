/* created by @sanyabeast 8/20/2021 08:11:31 AM
 *
 *
 */


/* created by @sanyabeast 9/4/2021 
 *
 *
 */

import Component from "../core/Component";
import * as THREE from "three/build/three.module";
import HMPCamera from "../objects/HMPCamera";
import HMOCamera from "../objects/HMOCamera";

class CameraComponent extends Component {
    offset = [0, 0, 0];
    on_created() {
        let scene = this.find_component_of_type("SceneComponent")
        let o_camera = this.o_camera = new HMOCamera({
            fov: 90,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.01,
            far: 1000,
            parent: scene.$scene,
            position: new THREE.Vector3(0, 0, 20),
        });

        let p_camera = this.p_camera = new HMPCamera({
            fov: 90,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.01,
            far: 1000,
            parent: scene.$scene,
            position: new THREE.Vector3(0, 0, 20),
        });

        this.set_camera_type(0)
    }

    set_camera_type(t) {
        switch (t) {
            case 0: {
                this.$camera = this.o_camera
                this.globals.camera = this.$camera
                break
            }
            case 1: {
                this.$camera = this.p_camera
                this.globals.camera = this.$camera
                break
            }
        }
    }

    on_tick() {
        this.globals.uniforms.camera_pos.value.set(
            this.$camera.position.x,
            this.$camera.position.y,
            this.$camera.position.z
        );
    }

    set_aspect(v) {
        this.$camera.aspect = v
        this.$camera.updateProjectionMatrix();
    }
}

export default CameraComponent;
