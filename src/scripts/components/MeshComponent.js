/* created by @sanyabeast 8/14/2021 1:31:45 AM
 *
 *
 */

import * as THREE from "three/build/three.module";
import AssetManager from "../utils/AssetManager";
import Component from "../core/Component";
import {set, get} from "lodash-es"

class MeshComponent extends Component {
    mesh = null;
    enabled = true;
    on_created() {
        let geometry = this.geometry
            ? this.create_geometry(this.geometry, this.geometry_id)
            : undefined;
        let material = this.material
            ? this.create_material(this.material, this.material_id)
            : undefined;
        let mesh = new THREE.Mesh({
            geometry: geometry,
            material: material,
        });

        if (this.geometry_translate){
            geometry.translate(...this.geometry_translate)
        }

        if (this.position !== undefined) {
            mesh.position.set(...this.position);
        }
        if (this.scale !== undefined) {
            mesh.scale.set(...this.scale);
        }
        if (this.rotation !== undefined) {
            mesh.rotation.set(...this.rotation);
        }

        if (this.frustum_culled !== undefined){
            mesh.frustumCulled = this.frustum_culled
        }

        mesh.renderOrder = this.render_order || 0

        this.mesh = mesh;
    }

    on_enabled() {
        this.object.add(this.mesh);
    }

    on_disabled() {
        console.log(`disabled`);
        this.object.remove(this.mesh);
    }

    create_geometry(params, id) {
        return AssetManager.create_geometry(params[0], params[1], id);
    }

    create_material(params, id) {
        return AssetManager.create_material(params[0], params[1], id);
    }

    get visible () {
        return this.mesh.visible
    }

    set visible(v){
        this.mesh.visible = v
    }

    uniform(name){
        return this.mesh.material.uniforms[name]
    }
    get uniforms(){
        return this.mesh.material.uniforms
    }
}

export default MeshComponent;
