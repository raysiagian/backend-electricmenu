import multer from "multer";

// simpan di memory (biar bisa kamu proses manual pakai fs)
const storage = multer.memoryStorage();

// validasi file
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only PNG, JPG, JPEG allowed"), false);
    }
};

// batas ukuran file
const limits = {
    fileSize: 2 * 1024 * 1024 // 2MB
};

export const upload = multer({
    storage,
    fileFilter,
    limits
});