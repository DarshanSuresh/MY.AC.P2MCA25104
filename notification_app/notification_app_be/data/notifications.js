const notifications = [
  {
    id: 1,
    studentId: 101,
    type: "Placement",
    message: "Google placement drive tomorrow",
    isRead: false,
    createdAt: new Date()
  },
  {
    id: 2,
    studentId: 102,
    type: "Event",
    message: "Hackathon starts at 10 AM",
    isRead: false,
    createdAt: new Date()
  },
  {
    id: 3,
    studentId: 101,
    type: "Result",
    message: "Semester results published",
    isRead: true,
    createdAt: new Date()
  }
];

module.exports = notifications;