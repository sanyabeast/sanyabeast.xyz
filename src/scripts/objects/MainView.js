/* created by @sanyabeast 8/14/2021 1:31:45 AM
 *
 *
 */

import * as THREE from "three/build/three.module";

let material_names = [
    "sb_bg_a",
    "sb_bg_b",
    "sb_bg_c",
    "sb_bg_d"
]

class MainView extends THREE.Group {
    constructor(params) {
        super(params)
        let bg_mat_id = `@${material_names[Math.floor(Math.random() * material_names.length)]}`
        console.log(bg_mat_id)
        // bg_mat_id = "@sb_bg_d"
        this.setup_components([
            {
                name: "SceneComponent",
                enabled: true
            },
            {
                name: "CameraComponent",
                enabled: true
            },
            {
                name: "ClockComponent",
                enabled: true
            },

            {
                name: "RendererComponent",
                enabled: true
            },
            {
                name: "MeshComponent",
                ref: "background",
                params: {
                    render_order: 4,
                    geometry: [
                        "PlaneBufferGeometry",
                        [1, 1, 1],
                    ],
                    material_id: "background/body",
                    material: [bg_mat_id, {
                        uniforms: {
                        }
                    }],
                    position: [0, 0, 0.001],
                    frustum_culled: false
                },
            },
            {
                name: "UserPointer",
                params: {
                    events: ["move", "over", "out", "down", "up", "scroll"],
                    raycasting: true,
                },
            },
            {
                enabled: true,
                name: "Animator"
            },
        ])
        this.globals.uniforms.bc.value.x = -1
        this.refs.Animator.animate("loading", {
            duration: 5,
            ease: "ease_in_cubic",
            values: {
                "globals.uniforms.bc.value.x": 0,
            },
        });

        this.refs.background.mesh.material.uniforms.map.value = AssetManager.load_texture(this.globals.background_image)
        this.refs.background.mesh.material.uniforms.map.needsUpdate = true

        this.refs.SceneComponent.add(this)
    }
}

export default MainView;
