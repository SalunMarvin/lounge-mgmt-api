const secrets = {
  dbUri: process.env.DB_URI || 'mongodb://loungemgmt:b2a5r67@ds015909.mlab.com:15909/loungemgmt',
};

const getSecret = (key) => secrets[key];

module.exports = { getSecret };
