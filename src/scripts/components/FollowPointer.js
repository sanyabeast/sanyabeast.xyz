/* created by @sanyabeast 8/20/2021 08:11:31 AM
 *
 *
 */

import Component from "../core/Component";
import * as THREE from "three/build/three.module";

class FollowPointer extends Component {
    offset = [0, 0, 0];
    on_created() {
        console.log(`follow pointer created`);
    }
    handle_pointermove(evt) {
        let global_pos = this.globals.camera.screen_to_world(evt.pointer_a);
        this.object.position.set(
            global_pos[0] + this.offset[0],
            global_pos[1] + this.offset[1],
            global_pos[2] + this.offset[2]
        );
        // console.log(this.offset, this)
    }
}

export default FollowPointer;
