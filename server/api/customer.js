const express = require('express');
const router = express.Router();
// utils
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
const JwtUtil = require('../utils/JwtUtil');
// daos
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require('../models/OrderDAO');
// category
router.get('/categories', async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});
// product
router.get('/products/new', async function (req, res) {
  const products = await ProductDAO.selectTopNew(3);
  res.json(products);
});
router.get('/products/hot', async function (req, res) {
  const products = await ProductDAO.selectTopHot(3);
  res.json(products);
});
router.get('/products/category/:cid', async function (req, res) {
  const _cid = req.params.cid;
  const products = await ProductDAO.selectByCatID(_cid);
  res.json(products);
});
router.get('/products/search/:keyword', async function (req, res) {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});
router.get('/products/:id', async function (req, res) {
  const _id = req.params.id;
  const product = await ProductDAO.selectByID(_id);
  res.json(product);
});
// customer
router.post('/signup', async function (req, res) {
  const { username, password, name, phone, email } = req.body;

  // Kiểm tra nếu thiếu thông tin
  if (!username || !password || !name || !phone || !email) {
    return res.json({ success: false, message: 'Please provide all required fields' });
  }

  try {
    // Kiểm tra xem username đã tồn tại chưa
    const existingUser = await CustomerDAO.selectByUsername(username);
    if (existingUser) {
      return res.json({ success: false, message: 'Username already exists' });
    }

    // Thêm user vào database, mặc định status là 'Active'
    const newUser = await CustomerDAO.insert({
      username,
      password,
      name,
      phone,
      email,
      active: 'Active',  // Thêm trường status mặc định là 'Active'
    });

    if (newUser) {
      const token = JwtUtil.genToken(username, password);
      res.json({ success: true, message: 'Registration successful', token });
    } else {
      res.json({ success: false, message: 'Failed to register user' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    try {
      // Kiểm tra tài khoản
      const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);
      if (customer) {
        // Kiểm tra trạng thái tài khoản là 'Active'
        if (customer.active === 'Active') {
          const token = JwtUtil.genToken(customer.username, customer.password); // Sử dụng thông tin customer để tạo token
          res.json({ success: true, message: 'Authentication successful', token: token, customer: customer });
        } else {
          res.json({ success: false, message: 'Account is deactivated' });
        }
      } else {
        res.json({ success: false, message: 'Incorrect username or password' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  } else {
    res.json({ success: false, message: 'Please input username and password' });
  }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token: token });
});
// myprofile
router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const customer = { _id: _id, username: username, password: password, name: name, phone: phone, email: email };
  const result = await CustomerDAO.update(customer);
  res.json(result);
});
// mycart
router.post('/checkout', JwtUtil.checkToken, async function (req, res) {
  const now = new Date().getTime(); // milliseconds
  const total = req.body.total;
  const items = req.body.items;
  const customer = req.body.customer;
  const order = { cdate: now, total: total, status: 'PENDING', customer: customer, items: items };
  const result = await OrderDAO.insert(order);
  res.json(result);
});
// myorders
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});
module.exports = router;