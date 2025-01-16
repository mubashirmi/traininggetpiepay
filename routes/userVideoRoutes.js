const { completeVideo } = require("../controllers/updateVideoStatusController");
const express = require('express');
const router = express.Router();

router.post("/completeVideo/:videoId/:userId" , completeVideo );


module.exports = router;
