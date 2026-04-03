const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const categoryFilter = req.query.category
      ? { category: req.query.category }
      : {};

    const products = await Product.find({ ...keyword, ...categoryFilter }).populate('category', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    let imageUrls = [];
    if (req.file) {
      imageUrls.push(req.file.path);
    } else if (req.body.images) {
      if (typeof req.body.images === 'string') {
        try {
          const parsed = JSON.parse(req.body.images);
          imageUrls = Array.isArray(parsed) ? parsed : [req.body.images];
        } catch(e) {
          imageUrls = [req.body.images];
        }
      } else {
        imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
      }
    } else {
      imageUrls.push('/images/sample.jpg');
    }

    const product = new Product({
      name: req.body.name || 'Sample name',
      description: req.body.description || 'Sample description',
      category: req.body.category,
      images: imageUrls,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, description, category } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      let imageUrls = product.images;
      if (req.file) {
        imageUrls = [req.file.path];
      } else if (req.body.images) {
        if (typeof req.body.images === 'string') {
          try {
             const parsed = JSON.parse(req.body.images);
             imageUrls = Array.isArray(parsed) ? parsed : [req.body.images];
          } catch(e) {
             imageUrls = [req.body.images];
          }
        } else {
          imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        }
      }

      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.images = imageUrls;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
