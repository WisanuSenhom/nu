// telegram api

function getchatID() {
  const chatId = localStorage.getItem("chatId");
  if (chatId) {
    Swal.fire({
      icon: "info",
      title: "พบการเชื่อมต่อ Telegram แล้ว",
      allowOutsideClick: false,
      confirmButtonText: "เชื่อมต่อใหม่",
      cancelButtonText: "ยกเลิก",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: "#24A1DE",
      customClass: {
        title: "text-info",
        content: "text-muted",
      },
      html: `<i class="fa-brands fa-telegram"></i> Chat.ID:<strong> ${chatId} </strong>`,
      footer: `<a href="https://t.me/setlanguage/thaith" target="_blank">
            <i class="fa-solid fa-language"></i> กำหนดภาษาไทยสำหรับ Telegram
          </a>`,
    }).then((result) => {
      if (result.isConfirmed) {
        getLatestUpdate();
      }
    });
  } else {
    getLatestUpdate();
  }
}

// function getLatestUpdate() {
//   const botToken = "7733040493:AAEWH-FUoFbXE3ohDboDxImRI52f39yvtV4";
//   const url = `https://api.telegram.org/bot${botToken}/getUpdates`;

//   fetch(url)
//     .then((response) => {
//       if (response.status === 404) {
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "API not found (404).",
//         });
//         throw new Error("API not found (404).");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       // Check if we have any updates
//       if (data.result && data.result.length > 0) {
//         // Get the latest update (last message)
//         const latestUpdate = data.result[data.result.length - 1];

//         // Extract the message and chat ID from the latest update
//         const chatId = latestUpdate.message.chat.id;
//         const usName = latestUpdate.message.chat.username;
//         const fname = latestUpdate.message.chat.first_name;
//         const lname = latestUpdate.message.chat.last_name;

//         Swal.fire({
//           icon: "info",
//           title: "ข้อมูลของคุณใน Telegram",
//           allowOutsideClick: false,
//           confirmButtonText: "ดำเนินการต่อ",
//           showCloseButton: true,
//           confirmButtonColor: "#24A1DE",
//           customClass: {
//             title: "text-info",
//             content: "text-muted",
//           },
//           html: `Name:<strong> ${fname} ${lname}</strong><br>
//             Username:<strong> ${usName}</strong>`,
//           footer: `<a href="https://t.me/setlanguage/thaith" target="_blank">
//             <i class="fa-solid fa-language"></i> กำหนดภาษาไทยสำหรับ Telegram
//           </a>`,
//         }).then((result) => {
//           if (result.isConfirmed) {
//             // ส่งข้อมูล API

//             updateChatId(chatId, usName);
//           }
//         });
//       } else {
//         showNoMessageAlert();
//       }
//     })
//     .catch((error) => {
//       // console.error("Error fetching updates:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Fetch Error",
//         text: "Error fetching updates. Please try again.",
//       });
//     });
// }

function sendMessageToTelegram(chatId) {
  const message = "การเชื่อมต่อสำเร็จแล้ว";
  const botToken = "7733040493:AAEWH-FUoFbXE3ohDboDxImRI52f39yvtV4";
  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      //  // console.log(data);
    })
    .catch((error) => {
      // console.error("Error sending message:", error);
      alert("Error sending message. Please try again.");
    });
}

// อัพเดพข้อมูลลง sheet
function updateChatId(chatId, usName) {
  if (!chatId) {
    showNoMessageAlert();
    return; // Exit the function to prevent further execution
  }
  Swal.fire({
    title: "เชื่อมต่อกับ Telegram",
    html: "กรุณากด <strong>ตกลง</strong> ",
    showCancelButton: true,
    allowOutsideClick: false,
    confirmButtonColor: "#008000",
    cancelButtonColor: "#6F7378",
    confirmButtonText: "ตกลง",
    cancelButtonText: "ยกเลิก",
  }).then((result) => {
    if (result.isConfirmed) {
      // Show loading status
      Swal.fire({
        title: "กำลังเชื่อมต่อกับ Telegram...",
        text: "โปรดรอสักครู่",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false, // Hide confirm button
        didOpen: () => {
          Swal.showLoading(); // Show loading spinner
        },
      });

      var urlperson = `https://script.google.com/macros/s/AKfycbwQHbXJ4KxeyS_ZWEPTHRxnVsBisgHCI5C6uE_SMS_NbIoAq42L6cyCWrJh_855_huE/exec`;
      var dataperson = `?id=${localStorage.getItem(
        "uuid"
      )}&chatId=${chatId}&usName=${usName}`;
      fetch(urlperson + dataperson)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Show a success message using SweetAlert
          Swal.fire({
            title: "การเชื่อมต่อสำเร็จ!",
            text: "การเชื่อมต่อกับ Telegram สำเร็จ",
            icon: "success",
            confirmButtonColor: "#008000",
            allowOutsideClick: false,
          }).then(() => {
            localStorage.setItem("chatId ", chatId);
            sendMessageToTelegram(chatId);
          });
        })
        .catch((error) => {
          // Handle any errors that occurred during the fetch
          // console.error("Fetch error:", error);

          // Show an error message using SweetAlert
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถแก้ไขข้อมูลได้",
            icon: "error",
            confirmButtonColor: "#bb2124",
          });
        });
    }
  });
}

function showNoMessageAlert() {
  const telegramqr =
    "https://lh5.googleusercontent.com/d/1aC5SsCMqeGgYIBzwNRdXnrjTZCyANIg-";
  Swal.fire({
    title: "ไม่พบ message.chat.id",
    html: `
        <p>กรุณาตรวจสอบว่าคุณได้เพิ่มเพื่อน "<strong>ลงเวลา</strong>" แล้วหรือยัง</p>
        <p>หากยังไม่ได้เพิ่มเพื่อน กรุณาเพิ่มเพื่อนก่อนโดยคลิกที่ปุ่มด้านล่าง:</p>
      `,
    imageUrl: telegramqr,
    imageWidth: 200,
    imageHeight: 240,
    imageAlt: "QR Code",
    icon: "error",
    confirmButtonText: "เพิ่มเพื่อน",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#24A1DE",
    cancelButtonColor: "#6F7378",
    showCancelButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      window.open("https://t.me/TimestampNotifyBot", "_blank");
    }
  });
}

const botUsername = "TimestampNotifybot"; // Bot username
const botId = "7733040493"; // Bot ID from @BotFather

function getLatestUpdate() {
  // const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${window.location.origin}&embed=1`;
  const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=https://1a50-1-10-130-239.ngrok-free.app/index.html&embed=1`;
  window.open(authUrl, "_self"); // Open Telegram login page
}

window.addEventListener("load", handleTelegramCallback);

async function handleTelegramCallback() {
  const urlHash = window.location.hash; // ดึงข้อมูลจาก fragment (หลัง #)
  // console.log("URL Hash:", urlHash); // พิมพ์ข้อมูลที่ดึงจาก fragment

  const telegramDataBase64 = urlHash.replace("#tgAuthResult=", ""); // ลบ '#tgAuthResult=' ออก
  // console.log("Telegram Data (Base64):", telegramDataBase64); // ตรวจสอบข้อมูลที่ได้เป็น Base64

  if (telegramDataBase64) {
    try {
      // ถอดรหัส Base64
      const telegramData = atob(telegramDataBase64);
      // console.log("Decoded Telegram Data:", telegramData); // ตรวจสอบข้อมูลที่ถอดรหัส

      // แปลงข้อมูลเป็น JSON
      const user = JSON.parse(telegramData);
      const { id, first_name, last_name, photo_url,username } = user;

      // console.log("Telegram User Data:", user);

      const result = await Swal.fire({
        title: `ยินดีต้อนรับ, ${first_name} ${last_name}`,
        text: `คุณต้องการดำเนินการต่อด้วยบัญชีนี้หรือไม่?`,
        imageUrl: photo_url,
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: "User Photo",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#24A1DE",
        cancelButtonColor: "#d33",
        allowOutsideClick: false,
      });

      if (result.isConfirmed) {
        // หากผู้ใช้กดยืนยัน ให้ดำเนินการกับข้อมูล user
        localStorage.setItem("chatId", id);
        updateChatId(id, username);
      } else {
        Swal.fire({
          icon: "info",
          title: "การดำเนินการถูกยกเลิก",
          confirmButtonColor: "#0ef",
        });
      }
      window.location.hash = '';
    } catch (error) {
    //  showNoMessageAlert();
      Swal.fire({
        icon: "error",
        title: "Error parsing Telegram data.",
        text: error.message,
        confirmButtonColor: "#0ef",
      });
    }
  } else {
    // Swal.fire({
    //     icon: "error",
    //     title: "Failed to log in via Telegram.",
    //     confirmButtonColor: "#0ef",
    // });
  }
}
