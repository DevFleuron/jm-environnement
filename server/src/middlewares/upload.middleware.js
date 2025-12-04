import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import "dotenv/config";

const uploadDir = process.env.UPLOAD_DIR || "uploads/pdfs";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const safeName = baseName.replace(/\s+/g, "-").toLowerCase();
    cb(null, `${timestamp}-${safeName}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Le fichier doit être un PDF"), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

// 5) Middleware prêt à l’emploi pour un seul PDF
export const uploadSinglePdf = upload.single("file");
