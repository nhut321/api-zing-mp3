const multer = require('multer');

// module.exports = multer({
//     storage: multer.diskStorage({}),
//     fileFilter: (req, file, cb) => {
//         if (!file.mimetype.match(/jpe|jpeg|png|mpeg|gif$i/)) {
//             cb(new Error('File is not supported'), false)
//             return
//         }
//         cb(null, true)
//     }
// })

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        console.log('File MIME type:', file.mimetype); // Log MIME type để kiểm tra

        // Danh sách các loại MIME chấp nhận
        const fileTypes = /jpeg|jpg|png|gif|audio\/mpeg/;
        const mimeType = fileTypes.test(file.mimetype);

        if (mimeType) {
            cb(null, true);
        } else {
            cb(new Error('File is not supported'), false);
        }
    },
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});