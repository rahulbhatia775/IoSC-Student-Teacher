module.exports = { 
  security: {
    jwtSecret: process.env.JWT_SECRET,
    jetExpire: process.env.JWT_EXPIRE 
  },
  
  apiKeys: {
    email: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};