import { Ot, Rectify } from "ot-builder";

function roundTo(x, precision) {
	return Math.round(x * precision) / precision;
}

function rewriteAxisNoto(font) {
	font.stat = null;
	font.fvar.instances = [];
	const dimWght = font.fvar.axes[0].dim;
	dimWght.min = 200;  // match SHS
	font.avar.segmentMaps.set(dimWght, [
		[-1, -1],
		[-0.5, -0.625],
		[0, 0],
		[1, 1],
	]);

	const dimWdth = font.fvar.axes[1].dim;
	dimWdth.min = 75;  // Nowar Sans’s min width
	font.avar.segmentMaps.set(dimWdth, [
		[-1, -1],
		[0, 0],
		[1, 1],
	]);

	// min reset, rectify all data
	const instanceNewWghtNeg = new Map([[dimWght, -0.8], [dimWdth, 0]]);
	const instanceNewWghtPos = new Map([[dimWght, 1], [dimWdth, 0]]);
	const instanceNewWdthNeg = new Map([[dimWght, 0], [dimWdth, -0.7]]);
	const instanceNewWgthNegWdthNeg = new Map([[dimWght, -0.8], [dimWdth, -0.7]]);
	const instanceNewWgthPosWdthNeg = new Map([[dimWght, 1], [dimWdth, -0.7]]);

	const masterSet = new Ot.Var.MasterSet();
	const masterWghtNeg = new Ot.Var.Master([
		{ dim: dimWght, min: -1, peak: -1, max: 0, },
		{ dim: dimWdth, min: -1, peak: 0, max: 0, },
	]);
	masterSet.getOrPush(masterWghtNeg);
	const masterWghtPos = new Ot.Var.Master([
		{ dim: dimWght, min: 0, peak: 1, max: 1, },
		{ dim: dimWdth, min: -1, peak: 0, max: 0, },
	]);
	masterSet.getOrPush(masterWghtPos);
	const masterWdthNeg = new Ot.Var.Master([
		{ dim: dimWdth, min: -1, peak: -1, max: 0, },
	]);
	masterSet.getOrPush(masterWdthNeg);
	const masterWghtNegWdthNeg = new Ot.Var.Master([
		{ dim: dimWght, min: -1, peak: -1, max: 0, },
		{ dim: dimWdth, min: -1, peak: -1, max: 0, },
	]);
	masterSet.getOrPush(masterWghtNegWdthNeg);
	const masterWghtPosWdthNeg = new Ot.Var.Master([
		{ dim: dimWght, min: 0, peak: 1, max: 1, },
		{ dim: dimWdth, min: -1, peak: -1, max: 0, },
	]);
	masterSet.getOrPush(masterWghtPosWdthNeg);
	const valueFactory = new Ot.Var.ValueFactory(masterSet);

	const recCoord = {
		coord: function (x) {
			const newOrigin = roundTo(Ot.Var.Ops.originOf(x), 1);
			const newWghtNeg = roundTo(Ot.Var.Ops.evaluate(x, instanceNewWghtNeg), 1);
			const newWghtPos = roundTo(Ot.Var.Ops.evaluate(x, instanceNewWghtPos), 1);
			const newWdthNeg = roundTo(Ot.Var.Ops.evaluate(x, instanceNewWdthNeg), 1);
			const newWgthNegWdthNeg = roundTo(Ot.Var.Ops.evaluate(x, instanceNewWgthNegWdthNeg), 1);
			const newWgthPosWdthNeg = roundTo(Ot.Var.Ops.evaluate(x, instanceNewWgthPosWdthNeg), 1);
			return valueFactory.create(newOrigin, [
				[masterWghtNeg, newWghtNeg - newOrigin],
				[masterWghtPos, newWghtPos - newOrigin],
				[masterWdthNeg, newWdthNeg - newOrigin],
				[masterWghtNegWdthNeg, newWgthNegWdthNeg - newWghtNeg - newWdthNeg + newOrigin],
				[masterWghtPosWdthNeg, newWgthPosWdthNeg - newWghtPos - newWdthNeg + newOrigin],
			]);
		},
		cv: x => x,
	};

	Rectify.inPlaceRectifyFontCoords(recCoord, Rectify.IdPointAttachmentRectifier, font);
}

export { rewriteAxisNoto };
