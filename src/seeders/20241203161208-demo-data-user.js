'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash password untuk admin user
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Masukkan data admin ke tabel Users
    await queryInterface.bulkInsert(
      'Users', // Nama tabel harus sesuai dengan tabel di database Anda
      [
        {
          name: 'Admin',
          username: 'admin',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Hapus data admin berdasarkan username
    await queryInterface.bulkDelete(
      'Users',
      { username: 'admin' },
      {}
    );
  },
};
