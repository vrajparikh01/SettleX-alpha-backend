const express = require('express');
const validate = require('../../../middlewares/validate');
const {activityValidation} = require('../../../validations');
const {activityController} = require('../../../controllers');

const router = express.Router();


router.post('/', validate(activityValidation.addActivity), activityController.addActivity);
router.get('/activity-for-token/:token_id', activityController.getActivitiesForToken);
router.get('/activity-for-user/:wallet_address', activityController.getUsersActivities);

module.exports = router;
