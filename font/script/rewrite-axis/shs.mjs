import { Ot, Rectify } from "ot-builder";

function roundTo(x, precision) {
	return Math.round(x * precision) / precision;
}

function rewriteAxisShs(font) {
	font.stat = null;
	font.fvar.instances = [];

	// match Noto Sans
	const dimWght = font.fvar.axes[0].dim;
	dimWght.min = 200;
	dimWght.default = 400;
	dimWght.max = 900;
	font.avar.segmentMaps.set(dimWght, [
		[-1, -1],
		[-0.5, -0.625],
		[0, 0],
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

	// origin reset, rectify all data
	const instanceNewOrigin = new Map([[dimWght, 0.4]]);  // follow Nowar Sans
	const instanceNewPositive = new Map([[dimWght, 1]]);

	const masterSet = new Ot.Var.MasterSet();
	const masterNegative = new Ot.Var.Master([{
		dim: dimWght,
		min: -1,
		peak: -1,
		max: 0,
	}]);
	masterSet.getOrPush(masterNegative);
	const masterPositive = new Ot.Var.Master([{
		dim: dimWght,
		min: 0,
		peak: 1,
		max: 1,
	}]);
	masterSet.getOrPush(masterPositive);
	const valueFactory = new Ot.Var.ValueFactory(masterSet);

	const recCoord = {
		coord: function (x) {
			const newNegative = roundTo(Ot.Var.Ops.originOf(x), 1);
			const newOrigin = roundTo(Ot.Var.Ops.evaluate(x, instanceNewOrigin), 1);
			const newPositive = roundTo(Ot.Var.Ops.evaluate(x, instanceNewPositive), 1);
			return valueFactory.create(newOrigin, [
				[masterNegative, newNegative - newOrigin],
				[masterPositive, newPositive - newOrigin],
			]);
		},
		cv: x => x,
	};

	Rectify.inPlaceRectifyFontCoords(recCoord, Rectify.IdPointAttachmentRectifier, font);
}

export { rewriteAxisShs };
