var express = require("express");
const FlatController = require("../controllers/FlatControllers");

var router = express.Router();

//retrieve flats
router.get("/", FlatController.flatList);
router.get("/:id", FlatController.flatDetail);
router.get("/type", FlatController.flatType);
//router.get("/:loc", FlatController.flatLocation);
//router.get("/location/:loc/type/:type", FlatController.flatLocationAndType);


//create flats
router.post("/store", FlatController.flatStore);

//update flats
router.put("/:id", FlatController.flatUpdate);

//delete flats
router.delete("/:id", FlatController.flatDelete);

module.exports = router;