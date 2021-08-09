import fs from 'fs';
import { FontIo, Ot } from "ot-builder";

function readOtf(filename) {
	const otfBuf = fs.readFileSync(filename);
	const sfnt = FontIo.readSfntOtf(otfBuf);
	const font = FontIo.readFont(sfnt, Ot.ListGlyphStoreFactory);
	return font;
}

function writeOtf(font, filename) {
	const sfnt = FontIo.writeFont(font);
	const otfBuf = FontIo.writeSfntOtf(sfnt);
	fs.writeFileSync(filename, otfBuf);
}

export {
	readOtf,
	writeOtf,
};
