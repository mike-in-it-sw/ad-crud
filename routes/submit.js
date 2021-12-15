var express = require('express');
const app = require('../app');
var router = express.Router();
var fs = require('fs');
var moment = require('moment');
const { check, validationResult } = require('express-validator')

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.redirect('users');
});

/* POST method handling (form submission data) */
router.post('/', [
    /* Simple validations on the form data using express-validator */
    check('firstname').isString().trim().escape(),
    check('department').isString().trim().escape(),
    check('lastname').isString().trim().escape(),
    check('startdate').isDate().escape()
], function (req, res, next) {
    /* If errors are returned on the validation... */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    /* log to console our post body from the form submission */
    console.log('post body:' + JSON.stringify(req.body))

    /* set some variables to define our output file based on a timestamp */
    var dateStamp = moment().format('YYYY-MM-DD-HH-MM-SS');
    var jsonOutFile = "/temp/node_output_" + dateStamp + ".json"
    console.log('output file: ' + jsonOutFile);

    /* attempt to write JSON formatted post body to our output file */
    fs.writeFile(jsonOutFile, JSON.stringify(req.body), function (err) {
        if (err) {
            // any errors in writing to the file system will need show in the console window and will render the 'submit-error' view
            console.error(err);
            res.render('submit-error');
        } else {
            // No errors, show console log with that info and then render the 'submit' view to the client (browser) 
            console.log("JSON output data has been saved with the user data to: " + jsonOutFile);
            res.render('submit');
        }
    });
});

module.exports = router;