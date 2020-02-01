const router = require('express').Router();
const Product = require('../models/productModel');

//const aws = require('aws-sdk');
const multer = require('multer');
//const multerS3 = require('multer-s3');
//const s3 = new aws.S3({ accessKeyId: "AKIAIBR5G5OP47EVSYJA", secretAccessKey: "mXU0TGX4NV0QXUsD2J8iwtJi9sSQmHSeEU9j2bqe" });

const faker = require('faker');
const checkJWT = require('../middlewares/check-jwt');



const PATH = './public/uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATH);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});


const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
        }
    }
});


// var upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'amazonowebapplication',
//     metadata: function (req, file, cb) {
//       cb(null, {fieldName: file.fieldname});
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString())
//     }
//   })
// });


router.route('/products')
  .get(checkJWT, (req, res, next) => {
    Product.find({ owner: req.decode.user._id })
      .populate('owner')
      .populate('category')
      .exec((err, products) => {
        if (products) {
          res.json({
            success: true,
            message: "Products",
            products: products
          });
        }
      });
  })
  .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
    console.log(upload);
    console.log(req.file);
    let product = new Product();
    product.owner = req.decode.user._id;
    product.category = req.body.categoryId;
    product.title = req.body.title;
    product.price = req.body.price;
    product.description = req.body.description;
    product.image = req.file.originalname;
    product.save();
    res.json({
      success: true,
      message: 'Successfully Added the product'
    });
  });

/* Just for testing */
router.get('/faker/test',(req, res, next) => {
  for (i = 0; i < 20; i++) {
    let product = new Product();
    product.category = "5e35c9b44dffb33e7c4e69c6";
    product.owner = "5e358df8fa8cb93eecd24d02";
    product.image = faker.image.cats();
    product.title = faker.commerce.productName();
    product.description = faker.lorem.words();
    product.price = faker.commerce.price();
    product.save();
  }

  res.json({
    message: "Successfully added 20 pictures"
  });

});



module.exports = router;
