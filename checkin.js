let map;
let watchId = null;

async function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          stopLocationTracking(); // หยุดเมื่อได้พิกัด

          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          Swal.fire({
            icon: "success",
            title: "พร้อม...",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              title: "text-success"}
          });
          
          alertUpdate();
        },
        (error) => {
          stopLocationTracking();
          reject(error);
          alertUpdate();
          showError(error);
        }
      );
    } else {
      stopLocationTracking();
      Swal.fire({
        icon: "error",
        title: "ไม่รองรับ Geolocation",
        text: "เบราว์เซอร์ของคุณไม่รองรับการใช้งาน Geolocation กรุณาอัปเดตเบราว์เซอร์หรือใช้อุปกรณ์อื่น",
        footer:
          '<a href="https://www.google.com/chrome/" target="_blank">คลิกที่นี่เพื่อดาวน์โหลด Chrome</a>',
      });

      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

// ฟังก์ชันหยุดการรับค่าพิกัด
function stopLocationTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}



function showError(error) {
  let title = "เกิดข้อผิดพลาด";
  let text = "ขออภัยในความไม่สะดวก กรุณาลองใหม่อีกครั้ง";
  let footer = "";

  switch (error.code) {
    case error.PERMISSION_DENIED:
      title = "การขออนุญาตถูกปฏิเสธ";
      text =
        "ดูเหมือนว่าคุณปฏิเสธการให้สิทธิ์ในการเข้าถึงตำแหน่งของคุณ กรุณาเปิดการอนุญาตเพื่อให้สามารถใช้งานฟังก์ชันนี้ได้ หากรับค่าพิกัดไม่ได้ท่านสามารถแสกน QR-code จากหัวหน้าของคุณได้";
      // footer =
      //   '<a href="chrome://settings/content/location" target="_blank">คลิกที่นี่เพื่อเปิดการตั้งค่า</a>';
      break;
    case error.POSITION_UNAVAILABLE:
      title = "ไม่สามารถเข้าถึงข้อมูลตำแหน่ง";
      text = "ข้อมูลตำแหน่งไม่พร้อมใช้งานในขณะนี้ กรุณาลองใหม่อีกครั้ง หากรับค่าพิกัดไม่ได้ท่านสามารถแสกน QR-code จากหัวหน้าของคุณได้";
      break;
    case error.TIMEOUT:
      title = "หมดเวลาในการขอข้อมูล";
      text = "การร้องขอใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง หากรับค่าพิกัดไม่ได้ท่านสามารถแสกน QR-code จากหัวหน้าของคุณได้";
      break;
    case error.UNKNOWN_ERROR:
      title = "เกิดข้อผิดพลาดที่ไม่คาดคิด";
      text =
        "ไม่สามารถระบุข้อผิดพลาดได้ ขออภัยในความไม่สะดวก กรุณาลองใหม่อีกครั้ง หากรับค่าพิกัดไม่ได้ท่านสามารถแสกน QR-code จากหัวหน้าของคุณได้";
      break;
  }

  Swal.fire({
    icon: "error",
    title,
    text,
    footer,
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) location.reload();
  });
}

async function initializeMap(
  lat,
  lon,
  destinationLat,
  destinationLon,
  officer
) {
  // สร้างแผนที่ใหม่
  map = L.map("map").setView([lat, lon], 12);

  // เพิ่มแผนที่พื้นฐาน (OpenStreetMap)
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "",
  }).addTo(map);

  const userLatLng = L.latLng(lat, lon);
  const destinationLatLng = L.latLng(destinationLat, destinationLon);

  // คำนวณระยะทาง
  const distanceInMeters = userLatLng.distanceTo(destinationLatLng);
  const distanceInKilometers = (distanceInMeters / 1000).toFixed(2);

  // เพิ่มวงกลมแสดงรัศมี
  L.circle([destinationLat, destinationLon], {
    color: "green",
    fillColor: "#0f0",
    fillOpacity: 0.2,
    radius: 10000,
  })
    .addTo(map)
    .bindPopup("รัศมี 10 กิโลเมตร จากหน่วยงานของคุณ");

  // เพิ่ม Marker แสดงตำแหน่งปลายทาง
  L.marker([destinationLat, destinationLon])
    .addTo(map)
    .bindPopup(`${officer}`)
    .openPopup();

  // เพิ่ม Marker แสดงตำแหน่งผู้ใช้
  L.marker([lat, lon])
    .addTo(map)
    .bindPopup(
      `<b>ตำแหน่งของคุณ</b><br>ระยะห่างจากปลายทาง: ${distanceInKilometers} กิโลเมตร`
    )
    .openPopup();

  // เพิ่มเส้นเชื่อมระหว่างตำแหน่งผู้ใช้และปลายทาง
  const latlngs = [
    [lat, lon],
    [destinationLat, destinationLon],
  ];
  L.polyline(latlngs, { color: "blue" })
    .addTo(map)
    .bindPopup(
      `
    <b>ตำแหน่งของคุณ</b><br>
    ระยะห่างจาก ${officer} : ${distanceInKilometers} กิโลเมตร
  `
    )
    .openPopup();

    function calculateAQI(pm25) {
      if (pm25 <= 25) {
        return {
          aqi: Math.round((25 / 25) * pm25),
          level: "ดีมาก",
          color: "#007FFE",
        }; // ฟ้า
      } else if (pm25 <= 37) {
        return {
          aqi: Math.round(((50 - 26) / (37 - 26)) * (pm25 - 26) + 26),
          level: "ดี",
          color: "#008000",
        }; // เขียว
      } else if (pm25 <= 50) {
        return {
          aqi: Math.round(((100 - 51) / (50 - 38)) * (pm25 - 38) + 51),
          level: "ปานกลาง",
          color: "#C09200",
        }; // เหลือง
      } else if (pm25 <= 90) {
        return {
          aqi: Math.round(((200 - 101) / (90 - 51)) * (pm25 - 51) + 101),
          level: "มีผลกระทบต่อสุขภาพ",
          color: "#E2543C",
        }; // ส้ม
      } else if (pm25 <= 150) {
        return {
          aqi: Math.round(((300 - 201) / (150 - 91)) * (pm25 - 91) + 201),
          level: "อันตราย",
          color: "#FF0000",
        }; // แดง
      } else if (pm25 <= 250) {
        return {
          aqi: Math.round(((400 - 301) / (250 - 151)) * (pm25 - 151) + 301),
          level: "อันตรายมาก",
          color: "#800000",
        }; // น้ำตาล
      } else {
        return {
          aqi: Math.round(((500 - 401) / (pm25 - 251)) * (pm25 - 251) + 401),
          level: "อันตรายถึงชีวิต",
          color: "#660000",
        }; // ม่วงเข้ม
      }
    }
    

  function getTemperatureLevel(temp) {
    if (temp >= 45) {
      return { level: "ร้อนจัดมาก", color: "#8B0000" }; // Very Extremely Hot (แดงเข้มมาก)
    } else if (temp >= 40) {
      return { level: "ร้อนจัด", color: "#B22222" }; // Very Hot (แดงเข้ม)
    } else if (temp >= 37) {
      return { level: "ร้อนมาก", color: "#FF4500" }; // Extremely Hot (แดงส้มเข้ม)
    } else if (temp >= 35) {
      return { level: "ร้อน", color: "#FF8C00" }; // Hot (ส้มเข้ม)
    } else if (temp >= 30) {
      return { level: "ค่อนข้างร้อน", color: "#FFA500" }; // Warm (ส้ม)
    } else if (temp >= 23) {
      return { level: "ปกติ", color: "#228B22" }; // Normal (เขียวเข้ม)
    } else if (temp >= 20) {
      return { level: "เย็นสบาย", color: "#32CD32" }; // Pleasantly Cool (เขียวสด)
    } else if (temp >= 18) {
      return { level: "เย็น", color: "#1E90FF" }; // Cool (ฟ้าเข้ม)
    } else if (temp >= 16) {
      return { level: "ค่อนข้างหนาว", color: "#4682B4" }; // Moderately Cold (ฟ้าเข้มขึ้น)
    } else if (temp >= 8) {
      return { level: "หนาว", color: "#00008B" }; // Cold (น้ำเงินเข้ม)
    } else if (temp >= 5) {
      return { level: "หนาวจัด", color: "#800080" }; // Very Cold (ม่วงเข้ม)
    } else {
      return { level: "หนาวจัดมาก", color: "#4B0082" }; // Extremely Cold (ม่วงน้ำเงินเข้มมาก)
    }
  }

  try {
    const apiKey = "639b4c8c49d8ae3d835971a444856be5";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=th`;
    const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // Fetch weather data
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    // Fetch air quality data
    const airQualityResponse = await fetch(airQualityUrl);
    const airQualityData = await airQualityResponse.json();

    const weatherDescription = weatherData.weather[0].description;
    const weatherIcon = weatherData.weather[0].icon;
    const weatherTemp = weatherData.main.temp;
    const weatherName = weatherData.name;
    const weatherImageUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

    const pm25 = airQualityData.list[0].components.pm2_5;
    const { aqi, level: aqiLevel, color: aqiColor } = calculateAQI(pm25);
    const { level: tempLevel, color: tempColor } =
      getTemperatureLevel(weatherTemp);

    const googleMapUrl = `https://www.google.co.th/maps/dir/${destinationLat},${destinationLon}/${lat},${lon}`;

    // Add weather, AQI, and PM2.5 information in user location popup
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup(
        `
      <div class="popup-content">
        <b>ตำแหน่งของคุณ</b><br>
        <a href="${googleMapUrl}" target="_blank">${lat}, ${lon}</a><br>
        <span class="secondary-text">ระยะห่างจาก ${officer}: ${distanceInKilometers} กิโลเมตร</span><br>
        <img src="${weatherImageUrl}" alt="Weather Icon"><br>
        <span class="weather-info">${weatherName}, อุณหภูมิ: ${weatherTemp}°C</span> 
        <span style="color: ${tempColor};"><b>(${tempLevel})</b></span><br>
        <span class="secondary-text">สภาพอากาศ: ${weatherDescription}</span><br>
        <span class="secondary-text">PM2.5: ${pm25} µg/m³</span><br>
        AQI: <span class="aqi" style="color: ${aqiColor};">${aqi} (${aqiLevel})</span>
      </div>
      `
      )
      .openPopup();
  } catch (error) {
    console.error("Error fetching weather or air quality data: ", error);
  }
}

async function checkonmap() {
  const mapContainer = document.getElementById("map");
  mapContainer.innerHTML = ""; // เคลียร์เนื้อหาของ div ก่อนเริ่ม

  // แสดงข้อความโหลด
  const loadingText = document.createElement("p");
  loadingText.textContent = "กำลังโหลดแผนที่...";
  loadingText.style.textAlign = "center";
  loadingText.style.color = "blue"; // Set text color here
  mapContainer.appendChild(loadingText);

  try {
    const location = await getLocation();
    const lat = location.latitude;
    const lon = location.longitude;

    const destinationLat = parseFloat(localStorage.getItem("oflat"));
    const destinationLon = parseFloat(localStorage.getItem("oflong"));
    const officer = localStorage.getItem("office") || "หน่วยงาน";

    // เรียกฟังก์ชัน initializeMap
    displayLatLon(lat, lon);
    initializeMap(lat, lon, destinationLat, destinationLon, officer);
  } catch (error) {
    console.error("Error displaying map: ", error);
    mapContainer.innerHTML = `<p style="text-align: center; color: red;">ไม่สามารถโหลดแผนที่ได้: ${error.message}</p>`;
  }
}

checkonmap();

function refreshMap() {
  const mainContent = document.getElementById("mainContent");
  const showHideButton = document.getElementById("showHide");

  // Check if mainContent is collapsed
  const isCollapsed = mainContent.classList.contains("collapsed");

  if (isCollapsed) {
    // If collapsed, show the content and change button text
    mainContent.classList.remove("collapsed"); // Show the content
    showHideButton.textContent = "ย่อ"; // Change button text to 'Hide'

    // Update localStorage with the new state
    localStorage.setItem("containerCollapsed", "false");

    // Call checkonmap() to reload the map if shown
    if (map) {
      map.remove(); // Properly remove the existing map instance
    }
    checkonmap();
  } else {
    // If not collapsed, refresh the map properly
    if (map) {
      map.remove(); // Remove the old map
    }
    checkonmap(); // Reinitialize the map
  }
}

function displayLatLon(lat, lon) {
  // Set the values to the hidden input fields
  document.getElementById("llat").value = lat;
  document.getElementById("llon").value = lon;
}

// in-out
async function checkin() {
  let latitude = document.querySelector("#llat").value;
  let longitude = document.querySelector("#llon").value;

  if (!latitude || !longitude) {
    Swal.fire({
      icon: "warning",
      title: "ขณะนี้ระบบกำลังรับค่าพิกัดจากอุปกรณ์",
      html: 'กรุณาลองใหม่อีกครั้ง\nหากรับค่าพิกัดไม่ได้ท่านสามารถแสกน QR-code จากหัวหน้าของคุณได้',
      confirmButtonText: "ตกลง",
      allowOutsideClick: false,
      customClass: {
        title: "text-warning",
        content: "text-muted",
        confirmButton: "btn btn-warning",
      },
    });
    return; // Exit the function if required values are missing
  }

  Swal.fire({
    title: "คุณต้องการบันทึกเวลาการปฏิบัติงานหรือไม่?",
    html: "กรุณากดยืนยันเพื่อดำเนินการ",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    allowOutsideClick: false,
    cancelButtonColor: "#6F7378",
    customClass: {
      title: "text-success",
      content: "text-muted",
      confirmButton: "btn btn-success",
    },
    didOpen: async () => {
      Swal.getConfirmButton().addEventListener("click", async () => {
        await processCheckinOrCheckout("In", latitude, longitude);
      });
    },
  });
}

async function checkout() {
  let latitude = document.querySelector("#llat").value;
  let longitude = document.querySelector("#llon").value;

  if (!latitude || !longitude) {
    Swal.fire({
      icon: "warning",
      title: "ขณะนี้ระบบกำลังรับค่าพิกัดจากอุปกรณ์",
      html: 'กรุณาลองใหม่อีกครั้ง\nหากรับค่าพิกัดไม่ได้ท่านสามารถแสกน QR-code จากหัวหน้าของคุณได้',
      confirmButtonText: "ตกลง",
      allowOutsideClick: false,
      customClass: {
        title: "text-warning",
        content: "text-muted",
        confirmButton: "btn btn-warning",
      },
    });
    return;
  }

  Swal.fire({
    title: "คุณต้องการบันทึกเวลาการกลับหรือไม่?",
    html: "กรุณากดยืนยันเพื่อดำเนินการ",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    allowOutsideClick: false,
    cancelButtonColor: "#6F7378",
    customClass: {
      title: "text-danger",
      content: "text-muted",
      confirmButton: "btn btn-danger",
    },
    didOpen: async () => {
      Swal.getConfirmButton().addEventListener("click", async () => {
        await processCheckinOrCheckout("Out", latitude, longitude);
      });
    },
  });
}

async function generateSecureCode() {
  const date = new Date();
  const data = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
  const secretKey = "Impermanent_Suffering_Egolessness";

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const code = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return code;
}

// ฟังก์ชันที่ใช้สำหรับการลงเวลา
async function processCheckinOrCheckout(ctype, latitude, longitude,staff) {
  try {
    // ตรวจสอบว่า localStorage มีข้อมูลครบถ้วนหรือไม่
    const uuid = localStorage.getItem("uuid");
    const cidhash = localStorage.getItem("cidhash");
    const userid = localStorage.getItem("userid");
    const name = localStorage.getItem("name");
    const mainsub = localStorage.getItem("mainsub");
    const office = localStorage.getItem("office");
    const latx = localStorage.getItem("oflat");
    const longx = localStorage.getItem("oflong");
    const db1 = localStorage.getItem("db1");
    const token = localStorage.getItem("token");
    const docno = localStorage.getItem("docno");
    const job = localStorage.getItem("job");
    const boss = localStorage.getItem("boss");
    const ceo = localStorage.getItem("ceo");
    const refid = localStorage.getItem("refid");
    const chatId = localStorage.getItem("chatId");

    if (!refid || !cidhash || !userid || !name) {
      throw new Error(
        "ไม่พบข้อมูลที่จำเป็นในการลงเวลา กรุณาลองใหม่หรือลงชื่อออกแล้วเข้าสู่ระบบใหม่"
      );
    }

    const secureCode = await generateSecureCode();
    let typea = document.querySelector("#typea").value || 'ปกติ';
    let nte = document.querySelector("#otherDetails").value || (typeof staff !== 'undefined' ? staff : '');

    if (typea === "อื่นๆ" && !nte) {
      throw new Error("อื่นๆ โปรดระบุ");
    }

    let todays = new Date();
    todays.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
    let todayx = todays.toLocaleTimeString("th-TH");

    Swal.fire({
      title: "กรุณารอสักครู่...<br>ระบบกำลังรับส่งข้อมูลเพื่อประมวลผล",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbzqlvr7DeGl7rOB5hGVSMnUKdTAo3ddudvxzv4xNWgSq-rrnvgP-3EodZQ1iIUdXsfz/exec?ctype=${ctype}&uuid=${uuid}&cidhash=${cidhash}&userid=${userid}&name=${name}&mainsub=${mainsub}&office=${office}&latx=${latx}&longx=${longx}&db1=${db1}&boss=${boss}&ceo=${ceo}&lat=${latitude}&long=${longitude}&typea=${typea}&nte=${nte}&stampx=${todayx}&refid=${refid}&token=${token}&job=${job}&docno=${docno}&secureCode=${secureCode}&chatId=${chatId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to process: ${response.statusText}`);
    }

    // แปลงข้อมูลที่ได้รับจาก API
    const data = await response.json();

    // ตรวจสอบข้อมูลใน data.res และแสดง Swal
    data.res.forEach((datas) => {
      // ปิดการแสดงสถานะการโหลด
      Swal.close();

      let iconx = datas.icon;
      let header = datas.header;
      let text = datas.text;

      Swal.fire({
        icon: iconx || "success", // ใช้ icon ที่ได้รับจาก API ถ้ามี หรือใช้ "success" เป็นค่าเริ่มต้น
        title: header,
        text: data.message || text, // ข้อความที่ได้รับจาก API หรือจากแต่ละ entry
        confirmButtonText: "ตกลง",
        allowOutsideClick: false,
        customClass: {
          title:
            iconx === "success"
              ? "text-success"
              : iconx === "error"
              ? "text-danger"
              : iconx === "warning"
              ? "text-warning"
              : "text-info", // Default to "text-info" for other cases
          content: "text-muted",
          confirmButton:
            iconx === "success"
              ? "btn btn-success"
              : iconx === "error"
              ? "btn btn-danger"
              : iconx === "warning"
              ? "btn btn-warning"
              : "btn btn-info", // Default to "btn btn-info" for other cases
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const cktoday = new Date();
          const ckfd = cktoday.toLocaleDateString("th-TH"); // รูปแบบวันที่แบบไทย
          const hours = cktoday.getHours().toString().padStart(2, "0");
          const minutes = cktoday.getMinutes().toString().padStart(2, "0");
          const seconds = cktoday.getSeconds().toString().padStart(2, "0");
          const ckfdtime = `${hours}:${minutes}:${seconds}`;

          if (iconx === "success" && ctype === "In") {
            localStorage.setItem("datecheck", ckfd);
            localStorage.setItem("datetimecheck", ckfdtime);
          } else if (
            (iconx === "info" && ctype === "Out") ||
            (iconx === "success" && ctype === "Out") ||
            (iconx === "warning" && ctype === "Out")
          ) {
            localStorage.setItem("datecheck", ckfd);
            localStorage.setItem("datecheckout", ckfd);
            localStorage.setItem("datetimecheckout", ckfdtime);
          }

          try {
            window.close();
            liff.closeWindow();
          } catch (error) {
            console.error("Failed to close window, refreshing...");
            window.location.reload(); // รีเฟรชหน้าแทน
          }
          // ใช้ timeout เพื่อรีเฟรชหน้า
          setTimeout(() => {
            location.reload(); // Refresh if liff.closeWindow() does not work
          }, 500); // ปรับเวลา (500ms)
        }
      });
    });
  } catch (error) {
    // หากเกิดข้อผิดพลาด
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: error.message || error, // ข้อความผิดพลาด
      confirmButtonText: "ตกลง",
    });
  } finally {
    // ดำเนินการเมื่อเสร็จสิ้น
  }
}

function checkinfo() {
  let today = new Date();
  let formattedToday = today.toLocaleDateString("th-TH");

  let dateCheck = localStorage.getItem("datecheck");
  let timeCheck = localStorage.getItem("datetimecheck");
  let dateCheckout = localStorage.getItem("datecheckout");
  let timeCheckout = localStorage.getItem("datetimecheckout");

  if (
    (formattedToday === dateCheck && !dateCheckout) ||
    (formattedToday === dateCheck && formattedToday !== dateCheckout)
  ) {
    // Case: User has checked in but not yet checked out
    Swal.fire({
      title: "การลงเวลามาปฏิบัติงาน",
      html:
        "ท่านได้ลงเวลาปฏิบัติงานในวันที่ <strong>" +
        dateCheck +
        "</strong> เวลา <strong>" +
        timeCheck +
        " น.</strong> เรียบร้อยแล้ว",
      icon: "info",
      confirmButtonText: "ตกลง",
      showCloseButton: true,
      customClass: {
        title: "text-primary",
        content: "text-muted",
        confirmButton: "btn btn-primary",
      },
    });
  } else if (formattedToday === dateCheck && formattedToday === dateCheckout) {
    // Case: User has checked in and out
    Swal.fire({
      title: "การลงเวลาปฏิบัติงาน",
      html:
        "ท่านได้ลงเวลาปฏิบัติงานในวันที่ <strong>" +
        dateCheck +
        "</strong> เวลา <strong>" +
        timeCheck +
        " น.</strong> และได้ลงเวลาสิ้นสุดการปฏิบัติงานในเวลา <strong>" +
        timeCheckout +
        " น.</strong> เรียบร้อยแล้ว",
      icon: "success",
      confirmButtonText: "ตกลง",
      showCloseButton: true,
      customClass: {
        title: "text-success",
        content: "text-muted",
        confirmButton: "btn btn-success",
      },
    });
  } else if (
    (formattedToday != dateCheck && formattedToday === dateCheckout) ||
    (!dateCheck && formattedToday === dateCheckout)
  ) {
    // Case: User has checked in and out
    Swal.fire({
      title: "การลงเวลาปฏิบัติงาน",
      html:
        "ท่านไม่ได้ลงบันทึกเวลาเข้ามาทำงานในวันที่ <strong>" +
        dateCheckout +
        "</strong> ระบบได้ส่งคำขอการบันทึกเวลาเข้ามาทำงานให้ท่านแล้ว โดยท่านได้ลงบันทึกเวลาเลิกงานเรียบร้อยแล้วในเวลา <strong>" +
        timeCheckout +
        " น.</strong>",
      icon: "warning",
      confirmButtonText: "ตกลง",
      showCloseButton: true,
      customClass: {
        title: "text-warning",
        content: "text-muted",
        confirmButton: "btn btn-warning",
      },
    });
  } else {
    Swal.fire({
      title: "ไม่พบการลงเวลาปฏิบัติงาน",
      html: "ไม่พบข้อมูลการลงเวลาในระบบหน้าบ้าน<br>กรุณาตรวจสอบในระบบหลังบ้าน",
      icon: "error",
      confirmButtonText: "ตกลง",
      showCloseButton: true,
      customClass: {
        title: "text-danger",
        content: "text-muted",
        confirmButton: "btn btn-danger",
      },
    }).then(() => {
      checktoday();
    });
  }
}



function alertUpdate() {
  // ตรวจสอบค่าใน local storage
  const logUpdate = localStorage.getItem("logUpdate");
  console.log("logUpdate from localStorage:", logUpdate); // ตรวจสอบค่าใน console

  // หากค่า logUpdate ไม่เท่ากับ 1 หรือไม่มี logUpdate
  if (logUpdate !== "1" || !logUpdate) {
    console.log("ข้อมูลยังไม่ได้รับการอัปเดต"); // ตรวจสอบว่าผ่านเงื่อนไขนี้หรือไม่

    // แสดง Swal.fire
    Swal.fire({
      title: "แจ้งเตือนการปรับปรุง",
      html: `<div style="text-align: left;">
      <ol style="padding-left: 20px; line-height: 1.8;">
        <li>สามารถเปลี่ยนสีธีมได้ โดยกดปุ่ม <i class="fa-solid fa-sun"></i> ข้างปุ่ม <i class="fa-solid fa-bars"></i></li>
        <li>กำหนดภาพพื้นหลังได้ โดยกดปุ่ม <i class="fa-solid fa-bars"></i> เลือกเมนู <i class="fa-solid fa-gear"></i> ตั้งค่าภาพพื้นหลัง</li>
        <li>สามารถย่อหรือแสดงส่วนแสดงแผนที่ได้</li>
      </ol>
    </div>
    
    `,
      input: "checkbox", // ตัวเลือกแสดง checkbox
      inputPlaceholder: "ไม่ต้องแสดงอีก", // ข้อความใน input
      confirmButtonText: "รับทราบ",
    }).then((result) => {
      if (result.isConfirmed) {
        // เมื่อผู้ใช้กดรับทราบ ให้บันทึกค่า logUpdate = 1
        if (result.value) {
          // ถ้าเลือกไม่ให้แสดงอีก
          localStorage.setItem("logUpdate", "1");
          console.log("logUpdate set to 1"); // ตรวจสอบว่าได้ตั้งค่าแล้ว
        }
      }
    });
  }
}

// สร้าง QR-code
// ฟังก์ชันสร้าง QR Code
let qrVisible = false;
let qrCode = null;
let html5QrCode = new Html5Qrcode("reader");

function toggleQRCode() {
  const refid = localStorage.getItem("refid");
  const role = localStorage.getItem("role");
  if (role !== "ceo" && role !== "boss" && role !== "assure") {
    Swal.fire("ท่านไม่สามารถสร้าง QR-code ได้!", "สำหรับหัวหน้า ผู้อำนวยการ ผู้ช่วย ผู้บริหาร เท่านั้น!", "error");
    return;
  }
  let qrname = "";

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ckDate = now.toLocaleDateString("th-TH");

  if ((hours === 0 && minutes >= 0) || hours < 8 || (hours === 8 && minutes <= 30)) {
    qrname = "In|" + refid + "|" + ckDate;
  } else if ((hours >= 8 && hours < 16) || (hours === 16 && minutes < 30)) {
    Swal.fire("นอกช่วงเวลา !", "ท่านไม่สามารถสร้าง QR-code ได้ ในช่วงเวลา 8.31 - 16.29 น. !", "error");
    return;
  } else {
    qrname = "Out|" + refid + "|" + ckDate;
  }

  let encodedQR = btoa(qrname);
  let qrDiv = document.getElementById("qrcode");
  let readerDiv = document.getElementById("reader");
  let button = document.getElementById("button-qr");

  if (!qrVisible) {
    qrDiv.style.display = "block";
    readerDiv.style.display = "none";
    stopScanner();

    if (!qrCode) {
      qrCode = new QRCode(qrDiv, {
        text: encodedQR,
        width: 200,
        height: 200,
      });
    }
    button.textContent = "ซ่อน QR Code";
  } else {
    qrDiv.style.display = "none";
    readerDiv.style.display = "block";
    button.textContent = "แสดง QR Code";
    startScan();
  }
  qrVisible = !qrVisible;
}

// ฟังก์ชันอ่าน QR Code
function startScan() {
  let readerDiv = document.getElementById("reader");
  readerDiv.style.display = "block";

  html5QrCode
    .start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 200, height: 200 } },
      onScanSuccess,
      onScanFailure
    )
    .catch(() => {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถเปิดกล้องได้",
        text: "โปรดตรวจสอบสิทธิ์การเข้าถึงกล้อง",
      });
    });
}

function stopScanner() {
  if (html5QrCode.isScanning) {
    html5QrCode.stop().then(() => {
      console.log("ปิดกล้องเรียบร้อย");
    }).catch(() => {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถปิดกล้องได้ โปรดลองใหม่",
      });
    });
  }
}

function isBase64(str) {
  try {
    return btoa(atob(str)) === str; // ตรวจสอบว่าเข้ารหัสแล้วกลับมาเหมือนเดิมไหม
  } catch (err) {
    return false; // ถ้าเกิด error แสดงว่าไม่ใช่ Base64
  }
}

function onScanSuccess(decodedText) {
  stopScanner();

  if (!isBase64(decodedText)) {
    Swal.fire({
      icon: "error",
      title: "ผิดพลาด!",
      html: 'QR Code ไม่ได้เข้ารหัส Base64',
      showDenyButton: true,
      confirmButtonText: "ปิด",
      denyButtonText: "สแกนใหม่",
      customClass: {
        title: "text-danger",
        content: "text-muted",
        confirmButton: "btn btn-danger",
        denyButton: "btn btn-primary",
      },
      footer: `ผลลัพธ์ : <a href="#">${decodedText}</a>`
    }).then((result) => {
      if (result.isDenied) {
        startScan();
      }
    });
    return;
  }

  try {
    const decodedBase64 = atob(decodedText);
    const splitStr = decodedBase64.split("|");

    if (splitStr.length < 3) {
      throw new Error("ข้อมูลไม่ครบถ้วน");
    }

    let part1 = splitStr[0];
    let part2 = splitStr[1];
    let part3 = splitStr[2];

    if (part1 !== 'In' && part1 !== 'Out') {
      Swal.fire({
        icon: "error",
        title: "ผิดพลาด!",
        html: 'รูปแบบไม่ถูกต้อง\n' + decodedBase64,
        showDenyButton: true,
        confirmButtonText: "ปิด",
        denyButtonText: "สแกนใหม่",
        customClass: {
          title: "text-danger",
          content: "text-muted",
          confirmButton: "btn btn-danger",
          denyButton: "btn btn-primary",
        },
      }).then((result) => {
        if (result.isDenied) {
          startScan();
        }
      });
      return;
    }
  
    const boss = localStorage.getItem("boss");
    const ceo = localStorage.getItem("ceo");
   
    if (boss !== part2 && ceo !== part2) {

      Swal.fire({
        icon: "error",
        title: "รหัสหัวหน้าไม่ถูกต้อง!",
        html: "โปรดตรวจสอบหรือปรับปรุงข้อมูลการกำหนดหัวหน้า",
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonText: "ปิด",
        denyButtonText: "สแกนใหม่",
        customClass: {
          title: "text-danger",
          content: "text-muted",
          confirmButton: "btn btn-danger",
          denyButton: "btn btn-primary",
        },
        footer: '<a href="https://wisanusenhom.github.io/sekatime/user.html">กำหนด หัวหน้า/ผู้อำนวยการ</a>'
      }).then((result) => {
        if (result.isConfirmed) {
         //
        } else if (result.isDenied) {
          startScan();
        }
      });

      return;
    }
  
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let formattedToday = now.toLocaleDateString("th-TH");
  
    if (formattedToday !== part3) {
      Swal.fire({
        icon: "error",
        title: "ไม่ใช่วันที่ปัจจุบัน!",
        html: part3,
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonText: "ปิด",
        denyButtonText: "สแกนใหม่",
        customClass: {
          title: "text-danger",
          content: "text-muted",
          confirmButton: "btn btn-danger",
          denyButton: "btn btn-primary",
        },
      }).then((result) => {
        if (result.isConfirmed) {
         //
        } else if (result.isDenied) {
          startScan();
        }
      });
      return;
    }
  
    const latitude = localStorage.getItem("oflat");
    const longitude = localStorage.getItem("oflong");
    const ctype = part1;
    const staff = part2;
  
    if (part3 === localStorage.getItem("datecheck") || part3 === localStorage.getItem("datecheckout")) {
      checkinfo();  
    } else {
      if (((hours === 0 && minutes >= 0) || hours < 8 || (hours === 8 && minutes <= 30)) && part1 === 'In') {
        // มา
        Swal.fire({
          title: "คุณต้องการบันทึกเวลาการปฏิบัติงานหรือไม่?",
          html: "กรุณากดยืนยันเพื่อดำเนินการ",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "ลงเวลามา",
          denyButtonText: "สแกนใหม่",
          customClass: {
            title: "text-success",
            content: "text-muted",
            confirmButton: "btn btn-success",
            denyButton: "btn btn-primary",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            processCheckinOrCheckout(ctype, latitude, longitude,staff);
          } else if (result.isDenied) {
            startScan();
          }
        });
  
      } else if ((hours >= 8 && hours < 16) || (hours === 16 && minutes < 30)) {
          Swal.fire({
          icon: "warning",
          title: "โปรดยื่นคำขอลงเวลา",
          html: "อยู่ในช่วงเวลา 08:31 - 16:29 ไม่สามารถดำเนินการได้",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "ยื่นคำขอ",
          denyButtonText: "สแกนใหม่",
          customClass: {
            title: "text-success",
            content: "text-muted",
            confirmButton: "btn btn-danger",
            denyButton: "btn btn-primary",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "request.html";
          } else if (result.isDenied) {
            startScan();
          }
        });
      } else if (part1 === 'Out') {
        // กลับ
        Swal.fire({
          title: "คุณต้องการบันทึกเวลาการกลับหรือไม่?",
          html: "กรุณากดยืนยันเพื่อดำเนินการ",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "ลงเวลามา",
          denyButtonText: "สแกนใหม่",
          customClass: {
            title: "text-danger",
            content: "text-muted",
            confirmButton: "btn btn-danger",
            denyButton: "btn btn-primary",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            processCheckinOrCheckout(ctype, latitude, longitude,staff);
          } else if (result.isDenied) {
            startScan();
          }
        });
      }else{
        Swal.fire({
          icon: "error",
          title: "ผิดพลาด!",
          html: 'ไม่สามารถดำเนินการได้',
          showDenyButton: true,
          // showCancelButton: true,
          confirmButtonText: "ปิด",
          denyButtonText: "สแกนใหม่",
          customClass: {
            title: "text-danger",
            content: "text-muted",
            confirmButton: "btn btn-danger",
            denyButton: "btn btn-primary",
          },
        }).then((result) => {
          if (result.isConfirmed) {
           //
          } else if (result.isDenied) {
            startScan();
          }
        });
      return;
      }    
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ผิดพลาด!",
      html: 'QR Code ไม่ถูกต้องหรือข้อมูลไม่ครบถ้วน',
      showDenyButton: true,
      confirmButtonText: "ปิด",
      denyButtonText: "สแกนใหม่",
      customClass: {
        title: "text-danger",
        content: "text-muted",
        confirmButton: "btn btn-danger",
        denyButton: "btn btn-primary",
      },
    }).then((result) => {
      if (result.isDenied) {
        startScan();
      }
    });
  }
}

function onScanFailure() {
  // Swal.fire({
  //   icon: "warning",
  //   title: "เกิดข้อผิดพลาด",
  //   text: "ไม่สามารถสแกน QR Code ได้ โปรดลองอีกครั้ง",
  //   timer: 2000,
  //   showConfirmButton: false,
  // });
}
