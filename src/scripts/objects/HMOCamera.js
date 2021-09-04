
/* created by @sanyabeast 8/14/2021 1:31:45 AM
 *
 *
*/


import * as THREE from 'three/build/three.module';

class HMOCamera extends THREE.OrthographicCamera {
    width_ortho = 1
    height_ortho = 1
    prev_width = -1
    prev_height = -1
    prev_position_z =-99999999999
    constructor(params) {
        params = {
            ...params
        }
        super(params)
        
        this.fov = params.fov ?? 90
        this.update_camera()
    }
    on_tick(time_stats) {
        let width = this.globals.uniforms.resolution.value.x
        let height = this.globals.uniforms.resolution.value.y
        let position_z = this.position.z
        if (width != this.prev_width || height !== this.prev_height || position_z !== this.prev_position_z){
            this.prev_width = width
            this.prev_height = height
            this.prev_position_z = position_z
            this.update_camera()
            this.globals.need_render = true
        }
        
    }

    get_viewport_size() {
        return [
            this.width_ortho,
            this.height_ortho
        ]
    }
    update_camera(){
        let width = this.globals.uniforms.resolution.value.x
        let height = this.globals.uniforms.resolution.value.y
        let aspect = width / height;

        let height_ortho = this.position.z * 2 * Math.atan( (this.fov * 2)*(Math.PI/180) / 2 )
        let width_ortho  = height_ortho * aspect;
        this.left = -width_ortho/2
        this.right = width_ortho/2
        this.top = height_ortho/2
        this.bottom = -height_ortho/2
        this.width_ortho = width_ortho
        this.height_ortho = height_ortho
        this.updateProjectionMatrix()
    }
    screen_to_world(input) {
        let v3 = new THREE.Vector3(input[0], input[1], 0).unproject(this);
        return [v3.x, v3.y, 0]
    }
}

export default HMOCamera