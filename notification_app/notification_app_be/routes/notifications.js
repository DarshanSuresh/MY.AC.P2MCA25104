const express = require("express");

const router = express.Router();

const notifications = require("../data/notifications");


// GET all notifications
router.get("/", (req, res) => {
  res.json(notifications);
});


// GET unread notifications
router.get("/unread/:studentId", (req, res) => {

  const studentId = Number(req.params.studentId);

  const unreadNotifications = notifications.filter(
    n => n.studentId === studentId && !n.isRead
  );

  res.json(unreadNotifications);
});


// CREATE notification
router.post("/", (req, res) => {

  const newNotification = {
    id: notifications.length + 1,
    ...req.body,
    createdAt: new Date()
  };

  notifications.push(newNotification);

  res.status(201).json({
    message: "Notification added",
    data: newNotification
  });
});


// MARK AS READ
router.put("/:id/read", (req, res) => {

  const id = Number(req.params.id);

  const notification = notifications.find(
    n => n.id === id
  );

  if (!notification) {
    return res.status(404).json({
      message: "Notification not found"
    });
  }

  notification.isRead = true;

  res.json({
    message: "Notification marked as read",
    data: notification
  });
});


// DELETE notification
router.delete("/:id", (req, res) => {

  const id = Number(req.params.id);

  const index = notifications.findIndex(
    n => n.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Notification not found"
    });
  }

  notifications.splice(index, 1);

  res.json({
    message: "Notification deleted"
  });
});


module.exports = router;