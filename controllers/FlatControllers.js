const Flat = require("../models/FlatModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Book Schema
function FlatData(data) {
	this.id = data._id;
    this.houseNumber = data.address.houseNumber;
    this.streetName = data.address.streetName;
    this.locale = data.address.locale;
    this.lga = data.address.lga;
    this.city = data.address.city;
    this.postCode = data.address.postCode;
    this.flatType = data.flatType;
    this.comment = data.comment;
    this.price = data.price;
    this.agentID = data.agentID;
    this.available = data.available;
    this.pix = data.pix;
}

/**
 * Book List.
 * 
 * @returns {Object}
 */
exports.flatList = [
	auth,
	function (req, res) {
		try {
			Flat.find({},"address comment flatType price agentiD available pix").then((flats)=>{
				if(flats.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", flats);
				}else{
					return apiResponse.notFoundResponse(res, "No flats available", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Book Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.flatDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.ErrorResponse(res, "ID provided is not valid", {});
		}
		try {
			Flat.findOne({_id: req.params.id},"address description price agentiD available pix").then((flat)=>{                
				if(flat !== null){
					// let flatData = new FlatData(flat);
					return apiResponse.successResponseWithData(res, "Flat search success", flat);
				}else{
					return apiResponse.ErrorResponse(res, "No item found", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


/**
 * Flat Type.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.flatType = [
	auth,
	function (req, res) {
		// if(!mongoose.Types.ObjectId.isValid(req.params.id)){
		// 	return apiResponse.ErrorResponse(res, "ID provided is not valid", {});
		// }
		// try {
        //     Flat.aggregate({$match: {'description.flatType': req.params.type}},
        //                 "address description price agentiD available pix")
        //                 .then((flat)=>{                
        //                         if(flat !== null){
        //                             // let flatData = new FlatData(flat);
        //                             return apiResponse.successResponseWithData(res, "Flat search success", flat);
        //                         }else{
        //                             return apiResponse.ErrorResponse(res, "No item found", {});
        //                         }
	    //         		});
		// } catch (err) {
		// 	//throw error in json response with status 500. 
		// 	return apiResponse.ErrorResponse(res, err);
		// }
	}
];

/**
 * Flat store.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      isbn
 * 
 * @returns {Object}
 */

exports.flatStore = [
	auth,
	body("houseNumber", "House Number must not be empty.").isLength({ min: 1 }).trim(),
	body("streetName", "Street Name must not be empty.").isLength({ min: 1 }).trim(),
	body("locale", "Locality must not be empty.").isLength({ min: 1 }).trim(),
	body("lga", "Local Government Area must not be empty.").isLength({ min: 1 }).trim(),
	body("city", "city must not be empty.").isLength({ min: 1 }).trim(),
	body("postCode", "Post Code must not be empty.").isLength({ min: 1 }).trim(),
	body("flatType", "Flat Type must not be empty.").isLength({ min: 1 }).trim(),
	body("comment", "Comment must not be empty.").isLength({ min: 1 }).trim(),
	body("price", "Price must not be empty.").isLength({ min: 1 }).trim(),
    //body("agentID", "Agent ID must not be empty.").isLength({ min: 1 }).trim(),
    //body("available", "Availability must not be empty.").isLength({ min: 1 }).trim(),
    //body("pix").isLength({ min: 1 }).trim(),    
	
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var flat = new Flat(
				{   
                    address:[{
                        houseNumber: req.body.houseNumber,
                        streetName: req.body.streetName,
                        locale: req.body.locale,
                        lga: req.body.lga,
                        city: req.body.city,
                        postCode: req.body.postCode
                    }],
                    flatType: req.body.flatType,
                    comment: req.body.comment,
                    price: req.body.price,
                    agentID: req.user,
                    available: req.body.available,
                    pix: req.body.pix
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save flat.
				flat.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let flatData = new FlatData(flat);
					return apiResponse.successResponseWithData(res,"Flat added Successfully.", flatData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Book update.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      isbn
 * 
 * @returns {Object}
 */
exports.flatUpdate = [
	auth,
	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	body("isbn", "ISBN must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
		return Book.findOne({isbn : value,user: req.user._id, _id: { "$ne": req.params.id }}).then(book => {
			if (book) {
				return Promise.reject("Book already exist with this ISBN no.");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var book = new Book(
				{ title: req.body.title,
					description: req.body.description,
					isbn: req.body.isbn,
					_id:req.params.id
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					Book.findById(req.params.id, function (err, foundBook) {
						if(foundBook === null){
							return apiResponse.notFoundResponse(res,"Book not exists with this id");
						}else{
							//Check authorized user
							if(foundBook.user.toString() !== req.user._id){
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							}else{
								//update book.
								Book.findByIdAndUpdate(req.params.id, book, {},function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										let bookData = new BookData(book);
										return apiResponse.successResponseWithData(res,"Book update Success.", bookData);
									}
								});
							}
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Book Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.flatDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Book.findById(req.params.id, function (err, foundBook) {
				if(foundBook === null){
					return apiResponse.notFoundResponse(res,"Book not exists with this id");
				}else{
					//Check authorized user
					if(foundBook.user.toString() !== req.user._id){
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					}else{
						//delete book.
						Book.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return apiResponse.ErrorResponse(res, err); 
							}else{
								return apiResponse.successResponse(res,"Book delete Success.");
							}
						});
					}
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];