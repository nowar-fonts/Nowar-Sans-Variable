import { Ot, Rectify } from "ot-builder";

function roundTo(x, precision) {
	return Math.round(x * precision) / precision;
}

function rewriteAxisShs(font) {
	font.stat = null;
	font.fvar.instances = [];

	// follow Nowar Sans
	const dimWght = font.fvar.axes[0].dim;
	dimWght.min = 200;
	dimWght.default = 200;
	font.avar.segmentMaps.set(dimWght, [
		[-1, -1],
		[0, 0],
		[1/7, 0.15],
		[2/7, 0.4],
		[1, 1],
	]);

	// dummy width to match Noto Sans
	const dimWdth = new Ot.Var.Dim('wdth', 75, 100, 100);
	const axisWdth = new Ot.Fvar.Axis(dimWdth, Ot.Fvar.AxisFlags.Hidden, 257);
	font.fvar.axes.push(axisWdth);
	font.avar.segmentMaps.set(dimWdth, [
		[-1, -1],
		[0, 0],
		[1, 1],
	]);
}

export { rewriteAxisShs };
