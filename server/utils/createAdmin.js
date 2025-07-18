const User = require('../models/User');

const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = new User({
      collegeId: process.env.ADMIN_COLLEGE_ID || 'ADMIN',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      phone: '9999999999' // Default admin phone
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log(`📧 Admin College ID: ${adminUser.collegeId}`);
    console.log(`🔑 Admin Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

module.exports = { createAdminUser };