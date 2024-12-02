document.addEventListener("DOMContentLoaded", function () { 
const uuid = localStorage.getItem("uuid");
  if (!uuid) {
      console.log("User is not logged in. Redirecting to login page.");
      window.location.href = "login.html";
      return;
  }
});

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
      html: `<i class="fa-brands fa-telegram"></i> Telegram_ID : <strong> ${chatId} </strong>`,
      footer: `<a href="https://t.me/setlanguage/thaith" target="_blank">
            <i class="fa-solid fa-language"></i> กำหนดภาษาไทยสำหรับ Telegram
          </a>`,
    }).then((result) => {
      if (result.isConfirmed) {
        getLatestUpdate();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // เมื่อกดปุ่มยกเลิก ให้เปลี่ยนหน้าไปยัง index.html
        window.location.href = "index.html";
      }
    });
  } else {
    getLatestUpdate();
  }
}

function sendMessageToTelegram(chatId) {
  const message = "การเชื่อมต่อสำเร็จแล้ว";
  const botToken = "7733040493:AAEWH-FUoFbXE3ohDboDxImRI52f39yvtV4";
  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const status = data.ok ? 'สำเร็จ' : 'ข้อผิดพลาด';
      const text = data.ok ? 'ส่งข้อความสำเร็จ!' : `เกิดข้อผิดพลาด: ${data.description}`;
      Swal.fire({ icon: data.ok ? 'success' : 'error', title: status, text }).then(() => window.location.href = "index.html");
    })
    .catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'ข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง'
      }).then(() => window.location.href = "index.html");
    });
}



// อัพเดพข้อมูลลง sheet
function updateChatId(chatId, usName) {
  if (!chatId) {
    showNoMessageAlert();
    return; // Exit the function to prevent further execution
  }
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
            window.location.href = "index.html";
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

// telegram login

const botUsername = "TimestampNotifybot"; // Bot username
const botId = "7733040493"; // Bot ID from @BotFather

function getLatestUpdate() {
  Swal.fire({
    title: "กำลังเข้าสู่ระบบเทเลแกรม...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
  // const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${window.location.origin}&embed=1`;
  const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=https://wisanusenhom.github.io/nu/authen.html&embed=1`;
  window.open(authUrl, "_self"); // Open Telegram login page

}

window.addEventListener("load", handleTelegramCallback);
 
async function handleTelegramCallback(){
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
        title: `ยินดีต้อนรับ \n ${first_name} ${last_name}`,
        text: `คุณต้องการดำเนินการต่อด้วยบัญชี ${username} หรือไม่?`,
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
        }).then(() => {
          window.location.href = "index.html";
        });
      }
      window.location.hash = '';
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการประมวลผลข้อมูลจาก Telegram กรุณาลองใหม่อีกครั้ง",
        text: error.message,
        confirmButtonColor: "#0ef",
    });
    }
  } else {
    Swal.fire({
        icon: "info",
        title: "กรุณาเข้าสู่ระบบด้วย Telegram",
        confirmButtonColor: "#0ef",
    });
  }
}

function coseWindow() {
  // Redirect to index.html
  window.location.href = 'index.html';
}
