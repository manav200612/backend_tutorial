import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'C:/Users/2858m/Downloads/webdev/chai-aur-react-main/backend/backend_tutorial-1/public/temp')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + ".png")
    }
  })
  
  export const upload = multer({ storage: storage })