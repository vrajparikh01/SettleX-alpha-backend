const express = require('express');
const {onlyadmin} = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.put('/update', validate(userValidation.updateUser), userController.updateUser);
router.delete('/:userId', validate(userValidation.deleteUser), userController.deleteUser);
router.get('/quick-update/:wallet_address', userController.getQuickUpdateData);
router.post('/whitelist-wallet-for-premarket/',onlyadmin, userController.WhiteListWalletForPreMarket);

module.exports = router;
