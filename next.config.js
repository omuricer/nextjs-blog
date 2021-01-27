const path = require("path");
module.exports = (phase, { defaultConfig }) => {
  return {
    webpack(config, options) {
      config.resolve.alias["@"] = path.join(__dirname, "src");
      return config;
    },
  };
};
