import { gsap } from 'gsap';

export function createBlob(options: any) {
	const points: any[] = [];
	const path = options.element;
	const slice = (Math.PI * 2) / options.numPoints;
	const startAngle = gsap.utils.random(0, 360);

	const tl = gsap.timeline({
		onUpdate: update,
	});

	for (let i = 0; i < options.numPoints; i++) {
		const angle = startAngle + i * slice;
		const duration = gsap.utils.random(options.minDuration, options.maxDuration);

		const point = {
			x: options.centerX + Math.cos(angle) * options.minRadius,
			y: options.centerY + Math.sin(angle) * options.minRadius,
		};

		const tween = gsap.to(point, {
			duration,
			x: options.centerX + Math.cos(angle) * options.maxRadius,
			y: options.centerY + Math.sin(angle) * options.maxRadius,
			repeat: -1,
			yoyo: true,
			ease: "sine.inOut",
		});

		tl.add(tween, -gsap.utils.random(0, duration));
		points.push(point);
	}

	options.tl = tl;
	options.points = points;

	function update() {
		path.setAttribute("d", cardinal(points, true, 1));
	}

	return options;
}

export function cardinal(data: any[], closed: boolean, tension: number) {
	if (data.length < 1) return "M0 0";
	if (tension == null) tension = 1;

	const size = data.length - (closed ? 0 : 1);
	let path = "M" + data[0].x + " " + data[0].y + " C";

	for (let i = 0; i < size; i++) {
		const p0 = closed ? data[(i - 1 + size) % size] : data[i === 0 ? 0 : i - 1];
		const p1 = data[i];
		const p2 = data[(i + 1) % size];
		const p3 = closed ? data[(i + 2) % size] : data[i === size - 1 ? i : i + 2];

		const x1 = p1.x + ((p2.x - p0.x) / 6) * tension;
		const y1 = p1.y + ((p2.y - p0.y) / 6) * tension;

		const x2 = p2.x - ((p3.x - p1.x) / 6) * tension;
		const y2 = p2.y - ((p3.y - p1.y) / 6) * tension;

		path += ` ${x1} ${y1} ${x2} ${y2} ${p2.x} ${p2.y}`;
	}

	return closed ? path + "z" : path;
}

export function createDots(blobs: any[]) {
	const dots: SVGCircleElement[] = [];
	const points: any[] = [];

	blobs.forEach((blob) => {
		blob.points.forEach((point: any) => {
			const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			dot.setAttribute("r", "4");
			dot.setAttribute("class", "dot");
			dot.setAttribute("fill-opacity", "0");
			document.getElementById("dot-container")?.appendChild(dot);
			dots.push(dot);
			points.push(point);
		});
	});

	const update = () => {
		if (!document.querySelector("#show-points")?.checked) return;

		points.forEach((p, i) => {
			dots[i].setAttribute("transform", `translate(${p.x},${p.y})`);
		});
	};

	gsap.ticker.add(update);
}
