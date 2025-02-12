const env = require('node-env-file')

env(__dirname + '/.env')
const env_var = process.env;
module.exports = {
    port: env_var.PORT,
    secretkey:env_var.secretkey
}