require('../utils/MongooseUtil');
const Models = require('./Models');

const CustomerDAO = {
  async selectAll() {
    const query = {};
    const customers = await Models.Customer.find(query).exec();
    return customers;
  },
  
  async selectByID(_id) {
    const customer = await Models.Customer.findById(_id).exec();
    return customer;
  },


  async selectByUsername(username) {
    try {
      return await Models.Customer.findOne({ username });
    } catch (error) {
      console.error("Lỗi tìm khách hàng theo username:", error);
      throw error;
    }
  },
  async selectByUsernameOrEmail(username, email) {
    const query = { $or: [{ username: username }, { email: email }] };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },
  async insert(userData) {
    try {
      const newUser = new Models.Customer(userData);
      return await newUser.save();
    } catch (error) {
      console.error("Lỗi thêm khách hàng:", error);
      throw error;
    }
  },

  async selectByUsernameAndPassword(username, password) {
    try {
      return await Models.Customer.findOne({ username, password });
    } catch (error) {
      console.error("Lỗi xác thực khách hàng:", error);
      throw error;
    }
  },

  async update(customer) {
    const newvalues = { username: customer.username, password: customer.password, name: customer.name, phone: customer.phone, email: customer.email };
    const result = await Models.Customer.findByIdAndUpdate(customer._id, newvalues, { new: true });
    return result;
  },
};
module.exports = CustomerDAO;