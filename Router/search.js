const express = require("express");
const router = express.Router();
const slugify = require("slugify");

const mongooseMusic = require("../Model/music");

class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    sorting() {
        this.query = this.query.sort("-createAt");
        return this;
    }
}
router.get("/", async (req, res) => {
    try {
        const query = handleSlug(req.query.query) || "";
        const _page = req.query._page * 1 || 1;
        const _limit = req.query._limit * 1 || 20;
        const start = (_page - 1) * _limit;
        const end = start + _limit;
        const queryString = {
            $or: [
                { slug_name_music: { $regex: query, $options: "i" } },
                { slug_name_singer: { $regex: query, $options: "i" } },
                { slug_category: { $regex: query, $options: "i" } },
                { slug_subscribe: { $regex: query, $options: "i" } },
            ],
        };

        const features = new ApiFeatures(
            mongooseMusic.find(queryString),
            req.query
        ).sorting();
        const result = await features.query;

        res.json({
            pagination: {
                _limit: _limit,
                _page: _page,
                _total: result.length,
            },
            data: result.slice(start, end),
        });
    } catch (error) {
        console.error('Error:', error); // In thông báo lỗi ra console để dễ theo dõi
        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
});
module.exports = router;
const handleSlug = (name) => slugify(name || "", {
    replacement: "-",
    remove: /[*-+~,.()'"!:@]/g,
    lower: true,
    strip: true,
    locale: "vi",
    trim: true,
});