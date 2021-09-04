
/* created by @sanyabeast 9/4/2021 
 *
 *
 */


import Component from "../core/Component";
import * as THREE from "three/build/three.module";

class ClockComponent extends Component {
    on_created() {
        this.handle_raf = this.handle_raf.bind(this)
        this.loop_id = requestAnimationFrame(this.handle_raf)
        this.raf_cb_id = 0
        this.raf_callbacks = {}
    }
    handle_raf() {
        this.loop_id = requestAnimationFrame(this.handle_raf)
        let scene = this.find_component_of_type("SceneComponent")
        if (scene) {
            setTimeout(()=>{
                scene.tick_scene()
            })
        }
        
        for (let k in this.raf_callbacks) {
            this.raf_callbacks[k]()
        }

        this.globals.tick_skip = this.globals.need_render ? 1 : 1
    }
    on_tick(time_delta) {
        this.globals.uniforms.time.value += 0.01;
    }
    add(cb) {
        this.raf_callbacks[this.raf_cb_id] = cb
        return this.raf_cb_id++
    }
    create(cb) {
        let raf_data = {}
        let loop_func = () => {
            raf_data.id = requestAnimationFrame(loop_func)
            cb()
        }
        raf_data.id = requestAnimationFrame(loop_func)
        raf_data.stop = () => {
            cancelAnimationFrame(raf_data.id)
        }
        return raf_data
    }
    remove(id) {
        delete this.raf_callbacks[id]
    }
}

export default ClockComponent;
