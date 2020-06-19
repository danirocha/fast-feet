module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'root',
  database: 'fastfeet',
  // timezone: 'America/Sao_Paulo',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
