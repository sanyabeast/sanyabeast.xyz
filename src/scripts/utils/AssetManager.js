/* created by @sanyabeast 8/14/2021 1:57:45 AM
 *
 *
 */

import * as THREE from "three/build/three.module";
import log from "../utils/log";
import { isObject, merge, forEach, template } from "lodash-es";

// const obj_loader = new OBJLoader();

let components = require.context("../components/", true, /\.js$/);
components.keys().forEach((p) => {
    let component = components(p).default;
    THREE.Object3D.register_component(component);
});

const material_templates = {};
let materials = require.context("../materials/", true, /\.yaml$/);
materials.keys().forEach((p) => {
    let name = p.replace("./", "").replace(".yaml", "");
    material_templates[name] = materials(p);
    console.log(material_templates[name])
});

const geometry_templates = {};
let geometries = require.context("../geometry/", true, /\.yaml$/);
geometries.keys().forEach((p) => {
    let name = p.replace("./", "").replace(".yaml", "");
    geometry_templates[name] = geometries(p);
});

/**textures */
const textures_lib = {};
let textures = require.context("../textures/", true, /\.yaml$/);
textures.keys().forEach((p) => {
    let name = p.replace("./", "").replace(".yaml", "");
    let data = textures(p)
    textures_lib[name] = data
});


let g_classes = require.context("../geometry/classes", true, /\.js$/);
g_classes.keys().forEach((p) => {
    let name = p.replace("./", "").replace(".js", "");
    THREE[name] = g_classes(p).default
});

let m_classes = require.context("../materials/classes", true, /\.js$/);
m_classes.keys().forEach((p) => {
    let name = p.replace("./", "").replace(".js", "");
    THREE[name] = m_classes(p).default
});

class AssetManager {
    static textures_cache = {};
    static cached_geometries = {};
    static cached_materials = {};

    static create_material_with_template(template_name, params, id) {
        template_name = template_name.replace("@", "");
        let template_data = material_templates[template_name];
        let template_data_params = Object.assign({}, template_data.params);
        let merged_params = merge({ ...template_data_params }, { ...params });

        if (false && template_name === `body`) {
            console.log(merged_params);
            // console.log(`creating material with template: ${template_name}, id: ${id}; merged params: ${JSON.stringify(merged_params, null, '\t')}`)
        }

        let mat = new THREE[template_data.type](merged_params);
        return mat.clone();
    }
    static slick_merge(a, b) {
        AssetManager.for_each(b, (v, k) => (a[k] = v));
        return a;
    }
    static create_material(type, params, id) {
        // console.log(`creating material: ${type}, ${id}`, JSON.stringify(params))
        let mat = AssetManager.cached_materials[id];
        if (mat === undefined || id === undefined) {
            if (type.indexOf("@") === 0)
                return this.create_material_with_template(type, params, id);
            mat = new THREE[type](params);
            if (id !== undefined) {
                AssetManager.cached_materials[id] = mat;
            }
        }
        return mat;
    }
    static load_obj_geometry(src) {
        // load a resource
        obj_loader.load(
            // resource URL
            "res/hex_cyl.obj",
            // called when resource is loaded
            function (object) {
                console.log(object);
            },
            // called when loading is in progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            // called when loading has errors
            function (error) {
                console.log("An error happened");
            }
        );
    }
    static create_geometry_with_template(type, params, id) {
        let template_name = type.replace("@", "");
        let template_data = geometry_templates[template_name];
        let args = template_data?.params?.args ?? [];
        let scale = template_data?.params.scale ?? [1, 1, 1]


        params?.forEach((v, i) => {
            args[i] = v;
        });
        let geometry = AssetManager.create_geometry(template_data.type, args, id);
        geometry.scale(scale[0], scale[1], scale[2])
        return geometry;
    }
    static create_obj_geometry(type, params, id) {
        let src = type.replace("url:", "");
        let geometry = this.load_obj_geometry(src);
        console.log(geometry);
    }
    static create_geometry(type, params, id) {
        let g = AssetManager.cached_geometries[id];
        if (g === undefined || id === undefined) {
            if (type.indexOf("@") === 0)
                return this.create_geometry_with_template(type, params, id);
            if (type.indexOf("url:") === 0)
                return this.create_obj_geometry(type, params, id);
            g = new THREE[type](...params);
            if (id !== undefined) {
                AssetManager.cached_geometries[id] = g;
            }
        }
        return g;
    }
    static load_from_texture_lib(src, params) {
        let name = src.replace("@", "")
        let image = new Image();
        let texture = new THREE.Texture();
        image.src = textures_lib[name].base64
        texture.image = image;
        image.onload = function () {
            for (let k in params) {
                texture[k] = params[k];
            }
            texture.needsUpdate = true;
        };

        return texture
    }
    static load_texture(src, params) {

        let texture = AssetManager.textures_cache[src];
        if (!texture) {
            // console.log(`[AssetManager]: loading texture ${src}`)
            if (src.indexOf("@") === 0) {
                texture = AssetManager.textures_cache[src] = AssetManager.load_from_texture_lib(src, params)
                for (let k in params) {
                    texture[k] = params[k];
                }
            } else {
                texture = AssetManager.textures_cache[src] =
                    new THREE.TextureLoader().load(src);
            }

        }

        texture.needsUpdate = true;

        return texture;
    }

    static images_cache = {}
    static load_image(src) {
        return new Promise((resolve) => {
            let image = AssetManager.images_cache[src]
            if (image !== undefined) {
                resolve(image)
            } else {
                image = new Image()
                image.src = src
                image.onload = () => {
                    AssetManager.images_cache[src] = image
                    resolve(image)
                }
            }

        })
    }
}

log("AssetManaget", "initialized");
window.AssetManager = AssetManager;

export default AssetManager;
