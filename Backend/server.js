const app = require("./app"); // Import app.js
const config = require("./config");

const PORT = config.app.port;


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
