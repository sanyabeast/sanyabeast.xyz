
/* created by @sanyabeast 9/4/2021 
 *
 *
 */

import Component from "../core/Component";
import * as THREE from "three/build/three.module";

class SceneComponent extends Component {
    on_created() {
        let scene = this.$scene = new THREE.Scene();
        this.globals.scene = scene
    }
    on_tick(time_delta) {
        
    }
    tick_scene(){
        this.$scene.tick()
    }
    add(){this.$scene.add(...arguments)}
}

export default SceneComponent;
