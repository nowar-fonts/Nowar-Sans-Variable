import { CliProc, Ot } from 'ot-builder';

import { readOtf, writeOtf } from './script/font-io.mjs';
import { rewriteAxisNoto } from './script/rewrite-axis/noto.mjs';
import { rewriteAxisShs } from './script/rewrite-axis/shs.mjs';

const latin = readOtf('source/noto/NotoSans-VF.ttf');
rewriteAxisNoto(latin);

const cjk = readOtf('source/shs/SourceHanSansCN-VF.ttf');
rewriteAxisShs(cjk);

CliProc.mergeFonts(latin, cjk, Ot.ListGlyphStoreFactory, { preferOverride: false });
CliProc.gcFont(latin, Ot.ListGlyphStoreFactory);

writeOtf(latin, 'out.ttf')
