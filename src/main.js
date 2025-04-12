const express = require("express");
const jsonner = require("jsonner");
const path = require("path");

const app = express();
const config = jsonner.read("src/config.json");

const types = config.types;
const categories = config.categories;
const folders = config.folders;
const link = `${config.host}:${config.port}`;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const getRandomIndex = (mn, mx) => {
    return Math.floor(Math.random() * (mx - mn + 1) + mn);
};

app.get("/api/:type/:category", (req, res) => {
    const type = req.params.type;
    const category = req.params.category;

    const rand_category = categories[getRandomIndex(0, categories.length - 1)];

    if (categories.includes(category)) {
        if (category === "random") {
            res.json({
                response: `${link}/${type}/${rand_category}/${rand_category}${getRandomIndex(
                    1,
                    10
                )}.gif`,
            });
        } else
            res.json({
                response: `${link}/${type}/${category}/${category}${getRandomIndex(
                    1,
                    10
                )}.gif`,
            });
    } else res.json({ response: "this folder not found" });
});

app.get("/:type/:category/:filename", (req, res) => {
    const type = req.params.type;
    const category = req.params.category;
    const filename = req.params.filename;

    const folder = folders[type];

    const filePath = path.join(__dirname, folder, category, filename);
    if (folders[type]) {
        if (categories.includes(category)) {
            res.sendFile(filePath);
        }
    } else res.json({ response: "this folder not found" });
});

app.listen(config.port, config.host, () => {
    console.log(`Server is running on port ${config.host}:${config.port}`);
});
