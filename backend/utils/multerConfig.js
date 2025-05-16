const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../Uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

const archiveFileFilter = (req, file, cb) => {
  const allowedTypes = /zip|rar/;
  const mimetype = allowedTypes.test(file.mimetype.toLowerCase());
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only zip and rar files are allowed'), false);
  }
};


const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

const uploadArchive = multer({
  storage,
  fileFilter: archiveFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image') {
      imageFileFilter(req, file, cb);
    } else if (file.fieldname === 'file') {
      archiveFileFilter(req, file, cb);
    } else {
      cb(new Error('Unexpected field'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, 
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 },
]);

module.exports = { uploadImage, uploadArchive, upload };