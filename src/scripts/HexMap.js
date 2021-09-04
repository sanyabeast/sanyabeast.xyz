/* created by @sanyabeast 8/14/2021 1:31:45 AM
 *
 *
 */

import * as THREE from "three/build/three.module";
import MainView from "./objects/MainView";
import AssetManager from "./utils/AssetManager";
import Stats from "./utils/Stats";
import DataComputed from "./utils/DataComputed";
import EventDispatcher from "./core/EventDispatcher";
import Component from "./core/Component";

class HexMap extends EventDispatcher {
    dom = null;
    globals = {
        rendering_mode: 0,
        cell_scale: 0.75,
        tick_skip: 1,
        _need_render: true,
        focused_cells_group: 0,
        get need_render() { return this._need_render },
        set need_render(v) {
            this._need_render = v
        },
        rendering_postprocessing: true,
        rendering_antialias: true,
        dom_bounding_rect: { left: 0, top: 0, width: 1, height: 1 },
        show_stats: false,
        navigation_bounds: [-100, -100, 200, 200],
        initial_position: [0, 0],
        zoom_range: [1.5, 12],
        loading_icon_texture: "res/loading.png",
        uniforms: {
            bc: { value: new THREE.Vector2(0, 1), type: "v2" },
            time: { value: 0, type: "f" },
            iTime: { value: 0, type: "f" },
            resolution: { value: new THREE.Vector2(1, 1), type: "v2" },
            iResolution: { value: new THREE.Vector2(1, 1), type: "v2" },
            pixel_ratio: { value: window.devicePixelRatio, type: "f" },
            mouse: { value: new THREE.Vector2(0, 0), type: "v2" },
            iMouse: { value: new THREE.Vector2(0, 0), type: "v2" },
            camera_pos: { value: new THREE.Vector3(), type: "v3" },
        },
        cells_update_chunks_size: 30,
        callbacks: {
            get_cells_data() {
                HexMap.log(
                    'callbacks "get_cells_data" needs to be passed with params object'
                );
            },
        },
        raycaster: new THREE.Raycaster(),
        dom: null,
        get resolution() {
            return this.uniforms.resolution.value;
        },
        get pixel_ratio() {
            return this.uniforms.pixel_ratio.value;
        },
        get mouse() {
            return this.uniforms.mouse.value;
        },
        mouse: null,
        log: this.log,
        cell_caption_bg_image: "res/caption_bg.png"
    };
    stats = new Stats();
    constructor(params) {
        super();
        params = {
            outline: true,
            callbacks: {},
            ...params,
        };

        for (let param_k in params) {
            this.globals[param_k] = params[param_k];
        }

        this.stats.set_enabled(false);

        this.dom = this.globals.dom = document.createElement("div");
        this.dom.style.width = "100%";
        this.dom.style.height = "100%";
        this.dom.style.position = "absolute";
        this.dom.classList.add("app")

        this.globals.uniforms.iResolution.value = this.globals.uniforms.resolution.value
        this.globals.uniforms.iTime.value = this.globals.uniforms.time.value
        this.globals.uniforms.iMouse.value = this.globals.uniforms.mouse.value

        this.globals.app = this;
        this.globals.wait = this.wait;
        this.globals.stats = this.stats;

        THREE.Object3D.global_tick_skip = new DataComputed(() => {
            return this.globals.tick_skip
        })
        THREE.Object3D.patch_props = (o) => {
            o.app = this;
            o.globals = this.globals;
        };
        Component.patch_props = (o) => {
            o.app = this;
            o.globals = this.globals;
        }
        THREE.Material.patch_uniforms = (uniforms, object) => {
            for (let k in this.globals.uniforms) {
                uniforms[k] = {
                    type: this.globals.uniforms[k].type,
                    value: new DataComputed(() => {
                        return this.globals.uniforms[k].value;
                    }, 4),
                };
            }

            uniforms.object_position = {
                type: "v3",
                value: new DataComputed(() => {
                    return object.position;
                }),
            };
        };

        this.init();
    }
    async init() {
        this.main_view = new MainView();
        this.globals.main_view = this.main_view
        this.log(`HexMap`, "initialized");
    }
    wait(d) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, d);
        });
    }
    /**api */
    set_param(key, value) {
        this.globals[key] = value;
    }
    set_zoom(scale = 0.5) {
        this.main_view.refs.tile_map.set_relative_zoom(scale);
    }
    animate_zoom(scale = 0.5, duration = 1) {
        this.main_view.refs.tile_map.animate_relative_zoom(scale, duration);
    }
    set_position(x = 0, y = 0) {
        let grid_pos = this.main_view.grid_to_world(x, y)
        this.main_view.refs.tile_map.set_position(grid_pos[0], grid_pos[1]);
    }
    animate_position(x = 0, y = 0, duration = 1) {
        let grid_pos = this.main_view.grid_to_world(x, y)
        this.main_view.refs.tile_map.animate_position(grid_pos[0], grid_pos[1], duration);
    }
    set_mode(mode_name = "default") {
        this.main_view.set_mode(mode_name)
    }
    update() {
        this.main_view.update()
    }
    set_focused_cells_group(group_id = 0) {
        this.globals.focused_cells_group = group_id
    }

    focus_cell(x, y) {
        this.main_view.focus_cell(x, y)
    }

    zoom_in(anim_duration = 0) { this.main_view.zoom_in(anim_duration) }
    zoom_out(anim_duration = 0) { this.main_view.zoom_out(anim_duration) }
}

export default HexMap;
