const fs = require('fs');
function getJpegSize(filePath) {
    const buf = fs.readFileSync(filePath);
    let i = 4;
    while (i < buf.length) {
        const marker = buf.readUInt16BE(i);
        const len = buf.readUInt16BE(i + 2);
        if (marker >= 0xFFC0 && marker <= 0xFFC3) {
            console.log('Height:', buf.readUInt16BE(i + 5), 'Width:', buf.readUInt16BE(i + 7));
            return;
        }
        i += len + 2;
    }
}
getJpegSize('login.jpeg');
