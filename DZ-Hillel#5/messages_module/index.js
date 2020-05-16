const express = require("express");
const router = express.Router();
const controller = require("./controller");
const validation = require("./validation");

router.get('/', controller.get_main_page);
router.get('/image/:file', controller.get_file);
router.get('/messages/', controller.get_messages);
router.get('/messages/:id', controller.get_message_by_id);
router.get('/messages/:sort/:sortValue/:limit/:skip', controller.get_messages_by_sort);
router.post('/messages', validation.check_body ,controller.add_message)
router.delete('/messages', controller.delete_all_messages)
router.delete('/messages/:id', validation.check_number, controller.delete_message_by_id)
router.put('/messages/:id', controller.update_message_by_id)
module.exports = router;
