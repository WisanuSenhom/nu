// ฟังก์ชันสำหรับสร้างรหัส Secure โดยใช้ HMAC-SHA-256
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

// ฟังก์ชันที่ใช้ในการแสดงและซ่อน Loading Modal
function showLoading() {
  var overlay = document.getElementById("loadingOverlay");
  overlay.style.display = "flex"; // แสดง loading overlay
}

function hideLoading() {
  var overlay = document.getElementById("loadingOverlay");
  overlay.style.display = "none"; // ซ่อน loading overlay
}

// ฟังก์ชันที่ใช้ในการดึงตำแหน่งจาก Geolocation API
function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords), // ส่งตำแหน่งจาก Geolocation
        (error) => showError(error) // เรียกฟังก์ชัน showError เมื่อเกิดข้อผิดพลาด
      );
    } else {
      reject("เบราว์เซอร์ไม่รองรับ Geolocation");
    }
  });
}

// ฟังก์ชันแสดงข้อผิดพลาด
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      Swal.fire({
        icon: "error",
        title: "การขออนุญาตถูกปฏิเสธ",
        text: "ดูเหมือนว่าคุณปฏิเสธการให้สิทธิ์ในการเข้าถึงตำแหน่งของคุณ กรุณาเปิดการอนุญาตเพื่อให้สามารถใช้งานฟังก์ชันนี้ได้",
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload(); // Refresh the page if the user clicks OK
        }
      });
      break;
    case error.POSITION_UNAVAILABLE:
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถเข้าถึงข้อมูลตำแหน่งได้",
        text: "ขออภัย, ข้อมูลตำแหน่งไม่พร้อมใช้งานในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลัง",
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload(); // Refresh the page if the user clicks OK
        }
      });
      break;
    case error.TIMEOUT:
      Swal.fire({
        icon: "error",
        title: "หมดเวลาในการขอข้อมูล",
        text: "การร้องขอค่าพิกัดใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง",
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload(); // Refresh the page if the user clicks OK
        }
      });
      break;
    case error.UNKNOWN_ERROR:
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดที่ไม่คาดคิด",
        text: "เกิดข้อผิดพลาดบางอย่างที่เราไม่สามารถระบุได้ ขอโทษในความไม่สะดวก กรุณาลองใหม่อีกครั้ง",
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload(); // Refresh the page if the user clicks OK
        }
      });
      break;
  }
}

// ฟังก์ชันที่ใช้สำหรับการลงเวลา
async function processCheckinOrCheckout(ctype,latitude,longitude) {
  const loadingModal = document.getElementById("loadingModal");
  loadingModal.style.display = "block"; // แสดง modal ตอนกำลังทำงาน

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

    if (!refid || !cidhash || !userid || !name ) {
      throw new Error("ไม่พบข้อมูลที่จำเป็นในการลงเวลา กรุณาลองใหม่หรือลงชื่อออกแล้วเข้าสู่ระบบใหม่");
    }

    const secureCode = await generateSecureCode(); 
    let typea = document.querySelector("#typea").value;
    let nte = document.querySelector("#nte").value;
    let todays = new Date();
    todays.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
    let todayx = todays.toLocaleTimeString("th-TH");

    // เลือก id "latlong"
    var latlongElement = document.getElementById("latlong");

    // แสดงค่าใน element
    latlongElement.innerHTML =
      "ละติจูด: " +
      latitude +
      "<br>ลองจิจูด: " +
      longitude +
      "<br><br>กรุณารอสักครู่...<br>ระบบกำลังรับส่งข้อมูลเพื่อประมวลผล";

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
      let iconx = datas.icon;
      let header = datas.header;
      let text = datas.text;

      Swal.fire({
        confirmButtonColor: "#1e90ff",
        icon: iconx || "success", // ใช้ icon ที่ได้รับจาก API ถ้ามี หรือใช้ "success" เป็นค่าเริ่มต้น
        title: header,
        text: data.message || text, // ข้อความที่ได้รับจาก API หรือจากแต่ละ entry
        confirmButtonText: "ตกลง",
        allowOutsideClick: false,
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
            liff.closeWindow();
            window.close();
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
    // ซ่อน loading modal เมื่อเสร็จสิ้น
    loadingModal.style.display = "none";
  }
}

// ฟังก์ชันสำหรับการลงเวลาเข้า-ออก

async function checkin() {
  Swal.fire({
    title: "คุณต้องการลงเวลาปฏิบัติงานหรือไม่?",
    html: '<div id="map"></div>',
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    allowOutsideClick: false,
    confirmButtonColor: "#008000",
    cancelButtonColor: "#6F7378",
    customClass: {
      title: "text-success",
      content: "text-muted",
    },
    didOpen: async () => {
      // Show progress bar during loading
      Swal.showLoading();
      
      // Get user location
      const location = await getLocation();
      const lat = location.latitude;
      const lon = location.longitude;

      // Create map in Swal
      let map = L.map("map").setView([lat, lon], 13);

      // Add base map (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "",
      }).addTo(map);

      // Destination location
      const destinationLat = parseFloat(localStorage.getItem("oflat"));
      const destinationLon = parseFloat(localStorage.getItem("oflong"));
      const officer = localStorage.getItem("office");

      const userLatLng = L.latLng(lat, lon);
      const destinationLatLng = L.latLng(destinationLat, destinationLon);

      // Calculate distance
      const distanceInMeters = userLatLng.distanceTo(destinationLatLng);
      const distanceInKilometers = (distanceInMeters / 1000).toFixed(2);

      // Add circle at destination location
      L.circle([destinationLat, destinationLon], {
        color: "green",
        fillColor: "#0f0",
        fillOpacity: 0.2,
        radius: 10000,
      })
        .addTo(map)
        .bindPopup("รัศมี 10 กิโลเมตร จากหน่วยงานของคุณ");

      // Add marker at destination location
      L.marker([destinationLat, destinationLon])
        .addTo(map)
        .bindPopup(`${officer}`)
        .openPopup();

      // Add marker at user location with distance info
      L.marker([lat, lon])
        .addTo(map)
        .bindPopup(
          `
          <b>ตำแหน่งของคุณ</b><br>
          ระยะห่างจากปลายทาง: ${distanceInKilometers} กิโลเมตร
        `
        )
        .openPopup();

     // Function to calculate AQI from PM2.5
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
        } else {
          return {
            aqi: Math.round(((500 - 201) / (pm25 - 91)) * (pm25 - 91) + 201),
            level: "อันตราย",
            color: "#FF0000",
          }; // แดง
        }
      }

      try {
        // Define API Keys and URLs
        const apiKey = "639b4c8c49d8ae3d835971a444856be5";
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=th`;
        const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        // Fetch weather data
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // Fetch air quality data
        const airQualityResponse = await fetch(airQualityUrl);
        const airQualityData = await airQualityResponse.json();
   
        // Extract weather data
        const weatherDescription = weatherData.weather[0].description;
        const weatherIcon = weatherData.weather[0].icon;
        const weatherTemp = weatherData.main.temp;
        const weatherName = weatherData.name;
        const weatherImageUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

        // Extract PM2.5 data and calculate AQI
        const pm25 = airQualityData.list[0].components.pm2_5;
        const { aqi, level: aqiLevel, color: aqiColor } = calculateAQI(pm25);

        // Define Google Maps URL
        const googleMapUrl = `https://www.google.co.th/maps/dir/${destinationLat},${destinationLon}/${lat},${lon}`;

        // Add weather, AQI, and PM2.5 information in user location popup
        L.marker([lat, lon])
          .addTo(map)
          .bindPopup(
            ` 
    <div style="background-color: lightblue; color: black; padding: 10px; border-radius: 8px; text-align: center;">
      <b>ตำแหน่งของคุณ</b><br>
      <a href="${googleMapUrl}" target="_blank">${lat},${lon}</a><br>
      ระยะห่างจาก ${officer}: ${distanceInKilometers} กิโลเมตร <br>
      <img src="${weatherImageUrl}" alt="Weather Icon" style="width: 50px; height: 50px;"><br>
      ${weatherName} อุณหภูมิ: ${weatherTemp}°C <br>
      สภาพอากาศ: ${weatherDescription}<br>
      PM2.5: ${pm25} µg/m³ <br>
      AQI: <span style="color: ${aqiColor};"><b>${aqi} (${aqiLevel}) </b></span> <br>
    </div>
  `
          )
          .openPopup();
      } catch (error) {
        console.error("Error fetching weather or air quality data: ", error);
      }

      // Add polyline from user to destination
      let latlngs = [
        [lat, lon],
        [destinationLat, destinationLon],
      ];
      L.polyline(latlngs, { color: "blue" }).addTo(map);

      // Handle confirmation click to process checkout
      Swal.getConfirmButton().addEventListener("click", () => {
         processCheckinOrCheckout("In", lat, lon);
      });

      // Hide progress bar when loading is complete
      Swal.hideLoading();
    },
  });
}

async function checkout() {
  Swal.fire({
    title: "คุณต้องการลงเวลากลับหรือไม่?",
    html: '<div id="map"></div>',
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    denyButtonText: "ตำแหน่งปัจจุบัน", // Add the deny button text
    allowOutsideClick: false,
    confirmButtonColor: "#b0120a",
    cancelButtonColor: "#6F7378",
    customClass: {
      title: "text-danger",
      content: "text-muted",
    },
    didOpen: async () => {
      // Show progress bar during loading
      Swal.showLoading();
      
      // Get user location
      const location = await getLocation();
      const lat = location.latitude;
      const lon = location.longitude;

      // Create map in Swal
      let map = L.map("map").setView([lat, lon], 13);

      // Add base map (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "",
      }).addTo(map);

      // Destination location
      const destinationLat = parseFloat(localStorage.getItem("oflat"));
      const destinationLon = parseFloat(localStorage.getItem("oflong"));
      const officer = localStorage.getItem("office");

      const userLatLng = L.latLng(lat, lon);
      const destinationLatLng = L.latLng(destinationLat, destinationLon);

      // Calculate distance
      const distanceInMeters = userLatLng.distanceTo(destinationLatLng);
      const distanceInKilometers = (distanceInMeters / 1000).toFixed(2);

      // Add circle at destination location
      L.circle([destinationLat, destinationLon], {
        color: "green",
        fillColor: "#0f0",
        fillOpacity: 0.2,
        radius: 10000,
      })
        .addTo(map)
        .bindPopup("รัศมี 10 กิโลเมตร จากหน่วยงานของคุณ");

      // Add marker at destination location
      L.marker([destinationLat, destinationLon])
        .addTo(map)
        .bindPopup(`${officer}`)
        .openPopup();

      // Add marker at user location with distance info
      L.marker([lat, lon])
        .addTo(map)
        .bindPopup(
          `
          <b>ตำแหน่งของคุณ</b><br>
          ระยะห่างจากปลายทาง: ${distanceInKilometers} กิโลเมตร
        `
        )
        .openPopup();

      // Function to calculate AQI from PM2.5
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
        } else {
          return {
            aqi: Math.round(((500 - 201) / (pm25 - 91)) * (pm25 - 91) + 201),
            level: "อันตราย",
            color: "#FF0000",
          }; // แดง
        }
      }

      try {
        // Define API Keys and URLs
        const apiKey = "639b4c8c49d8ae3d835971a444856be5";
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=th`;
        const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        // Fetch weather data
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // Fetch air quality data
        const airQualityResponse = await fetch(airQualityUrl);
        const airQualityData = await airQualityResponse.json();
   
        // Extract weather data
        const weatherDescription = weatherData.weather[0].description;
        const weatherIcon = weatherData.weather[0].icon;
        const weatherTemp = weatherData.main.temp;
        const weatherName = weatherData.name;
        const weatherImageUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

        // Extract PM2.5 data and calculate AQI
        const pm25 = airQualityData.list[0].components.pm2_5;
        const { aqi, level: aqiLevel, color: aqiColor } = calculateAQI(pm25);

        // Define Google Maps URL
        const googleMapUrl = `https://www.google.co.th/maps/dir/${destinationLat},${destinationLon}/${lat},${lon}`;

        // Add weather, AQI, and PM2.5 information in user location popup
        L.marker([lat, lon])
          .addTo(map)
          .bindPopup(
            ` 
    <div style="background-color: lightblue; color: black; padding: 10px; border-radius: 8px; text-align: center;">
      <b>ตำแหน่งของคุณ</b><br>
      <a href="${googleMapUrl}" target="_blank">${lat},${lon}</a><br>
      ระยะห่างจาก ${officer}: ${distanceInKilometers} กิโลเมตร <br>
      <img src="${weatherImageUrl}" alt="Weather Icon" style="width: 50px; height: 50px;"><br>
      ${weatherName} อุณหภูมิ: ${weatherTemp}°C <br>
      สภาพอากาศ: ${weatherDescription}<br>
      PM2.5: ${pm25} µg/m³ <br>
      AQI: <span style="color: ${aqiColor};"><b>${aqi} (${aqiLevel}) </b></span> <br>
    </div>
  `
          )
          .openPopup();
      } catch (error) {
        console.error("Error fetching weather or air quality data: ", error);
      }

      // Add polyline from user to destination
      let latlngs = [
        [lat, lon],
        [destinationLat, destinationLon],
      ];
      L.polyline(latlngs, { color: "blue" }).addTo(map);

      // Handle confirmation click to process checkout
      Swal.getConfirmButton().addEventListener("click", () => {
         processCheckinOrCheckout("Out", lat, lon);
      });

      // Hide progress bar when loading is complete
      Swal.hideLoading();
    },
  });
}
