async function getProfile() {
  const profile = await liff.getProfile();
  const yourid = profile.userId;
  const yourpic = profile.pictureUrl;
  getmember(yourid, yourpic);
}

async function getmember(yourid, yourpic) {
 // localStorage.clear();
  showLoading();
  let gas = `https://script.google.com/macros/s/AKfycbyY-5A1mpNjJjD9CjPEX4fSW5N6xB7PoMAODHgjMJuuLARrCjvm5csgFamB8MKbjUB9/exec?id=${yourid}`;
  const records = await fetch(gas);
  const data = await records.json();
  //  console.log(data.user);
  if (data.user === null || data.user === undefined || data.user == 0) {
    Swal.fire({
      confirmButtonColor: "#0ef",
      icon: "error",
      title: "ไม่พบข้อมูลของคุณในระบบ",
      allowOutsideClick: false,
    }).then((result) => {
      // ตรวจสอบว่าผู้ใช้กดปุ่มตกลงหรือไม่
      if (result.isConfirmed) {
        // กระทำที่ต้องการทำหลังจากกดปุ่มตกลง
        console.log("ผิดพลาด");
        window.location.href = "register.html"; // https://liff.line.me/1654797991-nkGwelwo
      }
    });
  } else {
    localStorage.setItem("yourpic", yourpic);
    data.user.forEach(function (user) {
      localStorage.setItem("uuid", user.uuid);
      localStorage.setItem("cidhash", user.cidhash);
      localStorage.setItem("userid", user.userid);
      localStorage.setItem("name", user.name);
      localStorage.setItem("job", user.job);
      localStorage.setItem("mainsub", user.mainsub);
      localStorage.setItem("office", user.office);
      localStorage.setItem("oflat", user.oflat);
      localStorage.setItem("oflong", user.oflong);
      localStorage.setItem("db1", user.db1);
      localStorage.setItem("token", user.token);
      localStorage.setItem("status", user.status);
      localStorage.setItem("role", user.role);
      localStorage.setItem("boss", user.boss);
      localStorage.setItem("ceo", user.ceo);
      localStorage.setItem("docno", user.docno);
      localStorage.setItem("upic", user.upic);
      localStorage.setItem("refid", user.refid);
      localStorage.setItem("rank", user.rank);

      Swal.fire({
        confirmButtonColor: "#0ef",
        icon: "success",
        title: "ลงชื่อเข้าใช้สำเร็จแล้ว",
        allowOutsideClick: false,
      }).then((result) => {
        // ตรวจสอบว่าผู้ใช้กดปุ่มตกลงหรือไม่
        if (result.isConfirmed) {
          // กระทำที่ต้องการทำหลังจากกดปุ่มตกลง
          window.location.href = "index.html";
          console.log("สำเร็จ");
        }
      });
    });
    hideLoading();
  }
}

function clearLocal() {
  // เรียกใช้ localStorage.clear() เพื่อลบข้อมูลทั้งหมดใน Local Storage
  localStorage.clear();

  Swal.fire({
    confirmButtonColor: "#0ef",
    icon: "success",
    title: "Local Storage has been cleared.",
  });
}

function showLoading() {
  var overlay = document.getElementById("loadingOverlay");
  overlay.style.display = "flex";
}

function hideLoading() {
  var overlay = document.getElementById("loadingOverlay");
  overlay.style.display = "none";
}

async function main() {
  hideLoading();
  await liff.init({ liffId: "1654797991-pr0xKPxW" });
  if (liff.isLoggedIn()) {
    getProfile();
  } else {
    liff.login();
  }
}
//main();

// telegram api
function getLatestUpdate() {
  Swal.fire({
          icon: "error",
          title: "Error",
          text: "API not found",
        });
}

function cgetLatestUpdate() {
  const botToken = "7733040493:AAEWH-FUoFbXE3ohDboDxImRI52f39yvtV4";
  const url = `https://api.telegram.org/bot${botToken}/getUpdates`;

  fetch(url)
    .then((response) => {
      if (response.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "API not found (404).",
        });
        throw new Error("API not found (404).");
      }
      return response.json();
    })
    .then((data) => {
      // Check if we have any updates
      if (data.result && data.result.length > 0) {
        // Get the latest update (last message)
        const latestUpdate = data.result[data.result.length - 1];

        // Extract the message and chat ID from the latest update
        const yourid = latestUpdate.message.chat.id;
        localStorage.setItem("chatId", yourid);
        getmember(yourid);
      } else {
        showNoMessageAlert();
      }
    })
    .catch((error) => {
      console.error("Error fetching updates:", error);
      Swal.fire({
        icon: "error",
        title: "Fetch Error",
        text: "Error fetching updates. Please try again.",
      });
    });
}


function showNoMessageAlert() {
  const telegramqr = "https://lh5.googleusercontent.com/d/1aC5SsCMqeGgYIBzwNRdXnrjTZCyANIg-";
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
