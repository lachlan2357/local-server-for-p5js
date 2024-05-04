const old_setup = window.setup;

let cWidth;
let cHeight;

window.setup = () => {
	old_setup();
	
	cWidth = width;
	cHeight = height;

	scale_canvas();
}

function scale_canvas() {
	const elements = document.getElementsByTagName("canvas");
	const canvas = elements[0];
	if (!canvas) return console.log("No canvas found");

	const width_scale = window.innerWidth / cWidth;
	const height_scale = window.innerHeight / cHeight;
	const scale = Math.min(width_scale, height_scale);
	console.log(scale);

	canvas.style.width = `${cWidth * scale}px`;
	canvas.style.height = `${cHeight * scale}px`;
}

window.addEventListener("resize", () => scale_canvas());