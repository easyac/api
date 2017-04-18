module.exports = {
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'n5T28qbpq`h{/5b:H9.v}`99~H?4=VA&#uZZ_ku',
  },
  database: {
    url: process.env.MONGO_URL,
  },
  redis: {
    HOST: process.env.REDIS_HOST,
    PORT: process.env.REDIS_PORT,
  },
};
