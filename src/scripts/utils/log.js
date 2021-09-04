export default function log(tag, ...data) {
    console.log(`%c[${tag}]`, "color: magenta", ...data);
}
