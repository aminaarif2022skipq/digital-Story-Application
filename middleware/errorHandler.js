const errorHandler = (err, req, res, next) => {
  console.log('errorHanlder');
  console.error(err.stack);
  return res.status(500).json({ message: err.message });
};

module.exports = errorHandler;
