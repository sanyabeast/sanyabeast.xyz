/* created by @sanyabeast 8/20/2021 08:11:31 AM
 *
 *
 */

import Component from "../core/Component";
import CanvasText from "../objects/CanvasText";
import * as THREE from "three/build/three.module";

class CanvasTextComponent extends Component {
    offset = [0, 0, 0];
    inited = true
    on_created() {
        this.canvas_text = new CanvasText({
            text: this.text,
            fill_style: this.fill_style,
            gradient: this.gradient,
            background_image: this.background_image,
            fixed_width: this.fixed_width,
            fixed_height: this.fixed_height,
            shrink: this.shrink,
            font_family: this.font_family,
            font_weight: this.font_weight,
            font_size: this.font_size,
            offset_x: this.offset_x,
            offset_y: this.offset_y,
        })

        if (this.position !== undefined) {
            this.canvas_text.position.set(...this.position);
        }
        if (this.scale !== undefined) {
            this.canvas_text.scale.set(...this.scale);
        }
        if (this.rotation !== undefined) {
            this.canvas_text.rotation.set(...this.rotation);
        }

        if (this.frustum_culled !== undefined) {
            this.canvas_text.frustumCulled = this.frustum_culled
        }

        this.canvas_text.renderOrder = this.render_order || 0
    }
    on_enabled() {
        if (this.inited) {
            this.canvas_text.init()
            this.inited = true
        }
        this.object.add(this.canvas_text)
    }
    on_disabled() {
        this.object.remove(this.canvas_text)
    }
    set_text(t) {
        this.canvas_text.set_text(t)
    }
}

export default CanvasTextComponent;
