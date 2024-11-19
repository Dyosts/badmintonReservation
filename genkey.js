const crypto = require("crypto");
const fs = require("fs");

const SECRET = crypto.randomBytes(32).toString("hex");
fs.writeFileSync("private.key", SECRET);