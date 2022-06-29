const express = require('express');
const fs = require('fs');
const path = require('path')
const app = express();
const PORT = 3000;
const OUTPUT_DIR = "/../output"
const PUBLIC_DIR = "./../public"


if (!fs.existsSync(path.join(__dirname, OUTPUT_DIR))) {
    throw new Error("build module before running test server")
}

for (const dirent of fs.readdirSync(path.join(__dirname, OUTPUT_DIR) ))
    fs.copyFileSync(
        path.join(__dirname, OUTPUT_DIR) + "/" + dirent,
        path.join(__dirname, PUBLIC_DIR) + "/" + dirent
    )

app.use(express.static('public'));

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
