
/* created by @sanyabeast 9/4/2021 
 *
 *
 */


import Component from "../core/Component";
import * as THREE from "three/build/three.module";
import HMPCamera from "../objects/HMPCamera";
import HMOCamera from "../objects/HMOCamera";

import {
    BloomEffect,
    EffectComposer,
    EffectPass,
    RenderPass,
} from "postprocessing";

class RendererComponent extends Component {
    canvas = null
    on_created() {
        let scene = this.find_component_of_type("SceneComponent").$scene

        let renderer = this.renderer = this.globals.renderer = new THREE.WebGL1Renderer({
            antialias: this.globals.rendering_antialias,
            alpha: true
        });
        renderer.setSize(1000, 1000);
        renderer.setPixelRatio(this.globals.uniforms.pixel_ratio.value);
        renderer.setPixelRatio(1);
        this.canvas = this.globals.canvas = this.renderer.domElement
        this.handle_mousemove = this.handle_mousemove.bind(this);
        this.renderer.domElement.addEventListener("mousemove", this.handle_mousemove);
    }
    handle_mousemove(evt) {
        let x = evt.clientX / this.canvas.width;
        let y = evt.clientY / this.canvas.height;
        this.globals.uniforms.mouse.value.x = x;
        this.globals.uniforms.mouse.value.y = y;
    }
    on_tick(time_delta) {

    }
    on_enabled() {
        this.globals.dom.appendChild(this.renderer.domElement)
        let clock = this.find_component_of_type("ClockComponent")
        this.raf_loop = clock.create(this.render.bind(this))
        // this.raf_cb_id = clock.add(this.render.bind(this))
    }
    render() {
        let scene = this.find_component_of_type("SceneComponent")
        let camera = this.find_component_of_type("CameraComponent")
        if (scene && camera) {
            this.check_size()
            this.renderer.need_render = this.globals.need_render;
            this.renderer.need_render = true;
            this.globals.stats.update('rendering', this.globals.need_render)
            this.globals.need_render = false;
            this.renderer.render(scene.$scene, camera.$camera);
        }
    }
    check_size() {
        let camera = this.find_component_of_type("CameraComponent")
        let new_rect = this.globals.dom.getBoundingClientRect();
        if (
            new_rect.width !== this.globals.dom_bounding_rect.width ||
            new_rect.height !== this.globals.dom_bounding_rect.height
        ) {
            this.renderer.setPixelRatio(
                this.globals.uniforms.pixel_ratio.value
            );
            this.renderer.setSize(new_rect.width, new_rect.height);
            this.renderer.getSize(this.globals.uniforms.resolution.value);
            this.globals.need_render = true
            camera.set_aspect(this.globals.uniforms.resolution.value.x / this.globals.uniforms.resolution.value.y)

        }

        this.globals.dom_bounding_rect = new_rect;
    }
}

export default RendererComponent;
