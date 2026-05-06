async function loadNotifications() {

  try {

    const response = await fetch(
      "http://localhost:3000/notifications",
      {
        headers: {
          Authorization: "Bearer mytoken"
        }
      }
    );

    const data = await response.json();

    const container =
      document.getElementById("notifications");

    container.innerHTML = "";

    data.forEach(notification => {

      container.innerHTML += `
        <div class="notification">

          <h3>${notification.type}</h3>

          <p>${notification.message}</p>

          <p>
            Student ID:
            ${notification.studentId}
          </p>

          <p>
            Read:
            ${notification.isRead}
          </p>

        </div>
      `;
    });

  } catch (error) {

    console.log(error);

  }
}