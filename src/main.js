
import "./index.html";
import WorldMap from "./scripts/HexMap";

document.addEventListener("DOMContentLoaded", async () => {
    let app = new WorldMap({
        rendering_postprocessing: false,
        show_stats: true,
        navigation_bounds: [-200, -200, 400, 400],
        loading_icon_texture: "res/loading.png",
        background_image: "res/bg_b.jpg",
        cell_scale: 0.888,
        border_width: 1,
    });

    document.body.appendChild(app.dom)
});
