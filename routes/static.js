import express from "express";
const __dirname = import.meta.dirname;
const router = express.Router();

router.use(express.static("public"));
router.use("/css", express.static(__dirname + "public/css"));
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));

export default router;
