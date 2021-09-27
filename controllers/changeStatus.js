const Admin = require('../models/Admin');
const SuperAdmin = require('../models/SuperAdmin');
const User = require('../models/User');
exports.changeStatus = async (req, res, next) => {
  const resc = await Admin.findById(req.params.id);
  {
    resc.active === true ? (resc.active = false) : (resc.active = true);
  }
  console.log(resc);
  await Admin.findOneAndUpdate({ _id: req.params.id }, resc);
  res.status(200).json({
    success: true,
  });
};
