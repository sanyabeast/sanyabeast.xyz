
/* created by @sanyabeast 8/14/2021 1:31:45 AM
 *
 *
*/


import * as THREE from 'three/build/three.module';

class HMPCamera extends THREE.PerspectiveCamera {
    constructor(params) {
        super(params)
    }
    on_tick(time_stats) { }

    get_viewport_size() {
        var vFOV = THREE.MathUtils.degToRad(this.fov / 2); // convert vertical fov to radians
        var height = 2 * Math.tan(vFOV) * this.position.z; // visible height
        var width = height * this.aspect;
        return [width, height]
    }
    screen_to_world(input) {
        let v3 = new THREE.Vector3(input[0], input[1], 0).unproject(this);
        return [v3.x, v3.y, 0]
    }
    update_camera(){
        
    }
}

export default HMPCamera