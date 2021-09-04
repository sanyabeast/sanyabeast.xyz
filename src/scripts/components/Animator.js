/* created by @sanyabeast 8/14/2021 2:53:12 AM
 *
 *
 */

import Component from "../core/Component";
import { set, get, has } from "lodash-es";
import { call } from "file-loader";

const easing_functions = {
    linear: function (t) {
        return t;
    },
    ease_in_quad: function (t) {
        return t * t;
    },
    ease_out_quad: function (t) {
        return t * (2 - t);
    },
    ease_in_out_quad: function (t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    ease_in_cubic: function (t) {
        return t * t * t;
    },
    ease_out_cubic: function (t) {
        return --t * t * t + 1;
    },
    ease_in_out_cubic: function (t) {
        return t < 0.5
            ? 4 * t * t * t
            : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    ease_in_quard: function (t) {
        return t * t * t * t;
    },
    ease_out_quart: function (t) {
        return 1 - --t * t * t * t;
    },
    ease_in_out_quart: function (t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    ease_in_quint: function (t) {
        return t * t * t * t * t;
    },
    ease_out_quint: function (t) {
        return 1 + --t * t * t * t * t;
    },
    ease_in_out_quint: function (t) {
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    },
    ease_in_back: function (t) {
        return t * t * ((2.5 + 1) * t - 2.5);
    },
    ease_out_back: function (t) {
        return --t * t * ((2.5 + 1) * t + 2.5) + 1;
    },
    ease_in_out_back: function (t) {
        return (
            ((t *= 2) < 1
                ? t * t * ((2.5 + 1) * t - 2.5)
                : (t -= 2) * t * ((2.5 + 1) * t + 2.5) + 2) / 2
        );
    },
};

class Animator extends Component {
    static easing_functions = easing_functions
    tick_skip = 2;
    active_animations = {};
    animations = {}
    on_created() {}
    on_enabled() {
        for (let k in this.animations) {
            if (this.animations[k].autoplay) {
                this.animate(k, 1);
            }
        }
    }

    animate(animation_name, duration_scale, callbacks) {
        return new Promise((resolve)=>{
            
            if (typeof duration_scale === "object") {
                let anim_params = duration_scale;
                this.animations[animation_name] = anim_params;
                duration_scale = 1;
            }
    
            if (this.animations[animation_name] === undefined) {
                console.log(`Animator: no such animation: ${animation_name}`);
            }
            duration_scale =
                typeof duration_scale === "number" ? duration_scale : 1;
            // console.log(`Animator: playing ${animation_name}`)
            let start_values = {};
            for (let k in this.animations[animation_name].values) {
                if (
                    this.animations[animation_name].from_values &&
                    this.animations[animation_name].from_values[k] !== undefined
                ) {
                    start_values[k] =
                        this.animations[animation_name].from_values[k];
                } else {
                    start_values[k] = get(this.object, k) || 0;
                }
            }
            this.active_animations[animation_name] = {
                name: animation_name,
                start: +new Date(),
                end:
                    +new Date() +
                    this.animations[animation_name].duration *
                        duration_scale *
                        1000,
                progress: 0,
                started: false,
                stopped: false,
                on_complete: callbacks ? callbacks.on_complete : undefined,
                on_start: callbacks ? callbacks.on_start : undefined,
                on_update: callbacks ? callbacks.on_update : undefined,
                start_values: start_values,
                _resolve: resolve
            };
        })
    }

    on_tick(time_delta) {
        let now = +new Date();
        let new_values = {};
        for (let k in this.active_animations) {
            let a = this.active_animations[k];
            let ease = a.ease || "linear";
            let progress = easing_functions[ease](
                (now - a.start) / (a.end - a.start)
            );

            if (progress > 1) {
                if (this.animations[a.name].repeat) {
                    progress = progress % 1;
                } else {
                    progress = 1;
                }
            }

            if (a.stopped) {
                delete this.active_animations[k];
            }

            if (!a.started) {
                a.started = true;
                if (a.on_start) {
                    a.on_start();
                }
            }

            let target_values = this.animations[a.name].values;
            for (let k in target_values) {
                let cv = this.lerp(
                    a.start_values[k],
                    target_values[k],
                    progress
                );
                
                if (this.animations[a.name].object){
                    if (has(this.animations[a.name].object, k)){
                        set(this.animations[a.name].object, k, cv);
                    }
                } else {
                    new_values[k] = cv;
                }
            }

            if (progress >= 1) {
                if (a.on_complete) {
                    a.on_complete();
                }

                a._resolve()
                delete this.active_animations[k];
            }

            this.globals.need_render = true
        }

        for (let k in new_values) {
            if (has(this.object, k)){
                set(this.object, k, new_values[k]);
            }
        }
    }
}

export default Animator;
