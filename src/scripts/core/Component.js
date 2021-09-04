/* created by @sanyabeast 8/14/2021 1:31:45 AM
 *
 *
 */

import log from "../utils/log";
import EventDispatcher from "./EventDispatcher";

let id = 0

class Component extends EventDispatcher {
    object = null;
    _enabled = true;
    tick_skip = 1;
    tick = 0;
    _params_applied = false;
    globals = undefined
    constructor(params) {
        super(params);
        Component.patch_props(this)
        this.id = id
        id++
        this._params = params;
        if (this.topics){
            this.topics.forEach(event_name=>this.listen(event_name))
        }
        this.tick = Math.floor(Math.random() * this.tick_skip)
        
    }

    apply_params() {
        if (!this._params_applied) {
            this._params_applied = true;
            for (let k in this._params) {
                Object.defineProperty(this, k, {
                    value: this._params[k],
                    configurable: true,
                    enumerable: true,
                    writable: true,
                });
            }
        }
    }

    on_created() { }
    on_destoy() { }
    on_tick(td) { }
    on_enabled() { }
    on_disabled() { }

    get parent() {
        let r = null;
        if (this.object && this.object.parent) {
            r = this.object.parent;
        }
        return r;
    }

    get enabled() {
        return this._enabled;
    }
    set enabled(v) {
        if (v !== this._enabled) {
            if (v) {
                this.on_enabled();
            } else {
                this.on_disabled();
            }

            this._enabled = v;
        }
    }
    get refs() {
        return this.object.refs;
    }
    get camera() {
        return this.globals.camera;
    }
    get scene() {
        return this.globals.scene;
    }
    get children() {
        return this.object.children;
    }
    get components() {
        return this.object.components;
    }
    get states() {
        return this.object.states;
    }
    get tasks() {
        return this.object.tasks;
    }

    get component_name() {
        return this.constructor.component_name;
    }

    listen(event_name) {
        return this.object.listen(event_name);
    }

    broadcast(event_name, payload) {
        return this.object.broadcast(event_name, payload);
    }

    get_component(component_name) {
        return this.object.get_component(component_name);
    }

    find_component_of_type(component_name) {
        return this.object.find_component_of_type(component_name);
    }

    find_components_of_type(component_name) {
        return this.object.find_components_of_type(component_name);
    }

    setup_components(data) {
        if (Array.isArray(data)) {
            this.object.setup_components(data)

        }
    }

    add_component(data) {
        if (typeof data === 'object') {
            this.object.add_component(data)

        }
    }

    get_components(component_name) {
        return this.object.get_components(component_name);
    }

    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }
    log() {
        log(...arguments);
    }
    shuffle_array(arr) {
        return arr.sort(() => (Math.random() > .5) ? 1 : -1);
    }
    static patch_props(){}

}

Component.component_name = "Component";

export default Component;
