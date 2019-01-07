const express = require('express');
const router = express.Router();

// @route /api/profile/test
// @desc testing
// @access public

router.get('/test', (req,res) => res.json({
    msg: "Users works"
}));

module.exports = router;

