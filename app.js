<!DOCTYPE html>
<html lang="en">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="description" content="ระบบลงเวลาปฏิบัติงาน สำหรับการลงเวลา การตรวจสอบการลงเวลา และการจัดการข้อมูล" />
  <!-- <link rel="manifest" href="mainfest.json" /> -->
  <link rel="apple-touch-icon" sizes="180x180"
    href="https://lh5.googleusercontent.com/d/15oBJkXkg-WVElsZb6a-BlRx8CyPP0_Q5" />
  <link rel="shortcut icon" href="https://lh5.googleusercontent.com/d/15oBJkXkg-WVElsZb6a-BlRx8CyPP0_Q5" />
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
  <!-- CSS ของ Leaflet -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
  crossorigin=""/>
  <!-- JS ของ Leaflet -->
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
  integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
  crossorigin=""></script>
  <!-- QR-CODE -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
  <!-- css -->
  <link rel="stylesheet" href="style.css" />
  <!-- DataTable CSS -->
  <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css">
  <link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.4.2/css/buttons.dataTables.min.css">
  <link rel="stylesheet" href="https://cdn.datatables.net/colreorder/1.7.0/css/colReorder.dataTables.min.css">
  <link rel="stylesheet" href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.dataTables.min.css">
  <link rel="stylesheet" href="https://cdn.datatables.net/fixedheader/3.4.0/css/fixedHeader.dataTables.min.css">
  <link rel="stylesheet" href="https://cdn.datatables.net/select/1.7.0/css/select.dataTables.min.css">


  <title>ระบบลงเวลาปฏิบัติงาน | SK_BK_Time</title>
</head>

<body>
  <nav>

    <div class="logo" onclick="window.location.href='#';">
      <i class="fa-regular fa-clock"></i> ลงเวลา
    </div>

    <div>
      <img src="https://lh5.googleusercontent.com/d/15oBJkXkg-WVElsZb6a-BlRx8CyPP0_Q5" alt="Avatar" class="avatar"
        id="avatar" onclick="editpic()">
      <span class="theme-toggle" id="theme-toggle"><i class="fa-solid fa-moon"></i></span>
      <span class="menu-toggle" id="menu-toggle"><i class="fa-solid fa-bars"></i></span>
    </div>
    <div class="menu" id="menu">
      <a href="request.html"><i class="fas fa-paper-plane"></i> ส่งคำขอ</a>
      <a href="javascript:void(0);" onclick="checktoday()"><i class="fas fa-clock"></i> ตรวจสอบ</a>
      <a href="javascript:void(0);" onclick="canceltoday()"><i class="fas fa-xmark"></i> ยกเลิก</a>
      <!-- <a href="#">พิกัด</a> -->
      <a href="javascript:void(0);" onclick="openWebAdmin()"><i class="fas fa-chart-bar"></i> รายงาน</a>
      <a href="javascript:void(0);" onclick="openWeb5s()"><i class="fas fa-folder"></i> 5ส.</a>
      <a href="authen.html"><i class="fab fa-telegram"></i> เชื่อมต่อ</a>
      <a href="javascript:void(0);" onclick="uploadImage()"><i class="fa-solid fa-gear"></i> ตั้งค่าภาพพื้นหลัง</a>
      <a href="javascript:void(0);" onclick="aboutme()"><i class="fas fa-user"></i> ฉัน</a>
      <a href="javascript:void(0);" onclick="editpic()"><i class="fas fa-image"></i> รูปโปรไฟล์</a>
      <a href="javascript:void(0);" onclick="requestReceive()"><i class="fa-regular fa-file-lines"></i> คำขอกู้คืน</a>
      <a href="javascript:void(0);" onclick="logupdate()"><i class="fas fa-history"></i> บันทึก</a>
      <a href="javascript:void(0);" onclick="clearLocal()"><i class="fas fa-sync-alt"></i> ออก</a>
    </div>
  </nav>

  <div id="mainContent" class="container">
    <button id="showHide">แสดง/ซ่อน</button>

    <!-- tap -->
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button"
          role="tab" aria-controls="home" aria-selected="true"><i class="fa-solid fa-location-dot"></i>
          Location</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="srqrcode-tab" data-bs-toggle="tab" data-bs-target="#srqrcode" type="button"
          role="tab" aria-controls="srqrcode" aria-selected="false"><i class="fa-solid fa-qrcode"></i> QR-code</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="report-tab" data-bs-toggle="tab" data-bs-target="#report" type="button" role="tab"
          aria-controls="report" aria-selected="false"><i class="fa-solid fa-table"></i> Report</button>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
        <!-- <h1>Welcome to Work Tracker</h1> -->


        <iframe title="datetime"
          src="https://free.timeanddate.com/clock/i9pxn797/n3376/tlth39/fs18/fc2196f3/tct/pct/ftb/tt0/td1/th1/tb4"
          frameborder="0" width="276" height="46" allowtransparency="true" style="pointer-events: none;"></iframe>

        <div id="log">
          <label for="typea">การปฏิบัติงาน:</label>
          <select id="typea" name="CheckIn" required onchange="handleOtherOption()">
            <option value="ปกติ">ตามปกติ</option>
            <option value="นอกสถานที่">นอกสถานที่</option>
            <option value="วันหยุด">ในวันหยุดเสาร์ อาทิตย์ และวันหยุดราชการ</option>
            <option value="ไปราชการ">ไปราชการ (ประชุม อบรมฯ)</option>
            <option value="อื่นๆ">อื่นๆ โปรดระบุเพิ่มเติม</option>
          </select>
          <div id="otherInput">
            <label for="otherDetails">โปรดระบุ:</label>
            <input type="text" id="otherDetails" name="OtherDetails" placeholder="ระบุเพิ่มเติม" />
            <!-- <label for="llat" >lat:</label> -->
            <input type="text" id="llat" name="llat" placeholder="ละติจูด" hidden />
            <!-- <label for="llon" >lat:</label> -->
            <input type="text" id="llon" name="llon" placeholder="ลองติจูด" hidden />
          </div>
        </div>
        <div id="map"></div>
      </div>

      <div class="tab-pane fade" id="srqrcode" role="tabpanel" aria-labelledby="srqrcode-tab">

        <div class="content-wrapper">
          <div id="reader"></div>
          <button id="button-qr" onclick="toggleQRCode()" class="btn btn-primary">แสดง QR Code</button>
          <div id="qrcode"></div>
          <P></P>
          <P>วิธีใช้ : แสกน QR-code จากหัวหน้าของคุณ</P>
          <P>หมายเหตุ : สำหรับลงเวลาการปฏิบัติงานตามปกติเท่านั้น</P>
        </div>

      </div>

      <div class="tab-pane fade" id="report" role="tabpanel" aria-labelledby="report-tab">

        <div id="loadingSpinner" class="spinner-border text-primary" role="status" style="display: none;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <P>เดือนนี้</P>
        <table id="dreportdata" class="table-striped table-bordered table-hover display nowrap">

          <thead>
            <tr>
              <th>วัน</th>
              <th>วันที่</th>
              <th>เวลามา</th>
              <th>ชื่อ</th>
              <th>กลุ่มงาน/หน่วยงาน</th>
              <th>การปฏิบัติงาน</th>

              <th>ระยะ</th>
              <th>เวลากลับ</th>
              <th>ระยะ</th>
              <th>บันทึก</th>

              <th>สถานะคำขอ</th>
              <th>วันที่คำขอ</th>
              <th>เวลาคำขอ</th>

              <th>วันที่อนุญาต</th>
              <th>เวลาอนุญาต</th>
              <th>ผู้อนุญาต</th>
              <th>ตำแหน่งผู้อนุญาต</th>

              <th>การตรวจสอบ</th>
              <th>ผู้ตรวจสอบ</th>
              <th>ตำแหน่งผู้ตรวจสอบ</th>
              <th>วันที่ตรวจสอบ</th>
              <th>เวลาตรวจสอบ</th>
              <th>อ้างอิง</th>
            </tr>
          </thead>
          <tbody id="reportdata"></tbody>
          <tfoot>
            <tr>
              <th>วัน</th>
              <th>วันที่</th>
              <th>เวลามา</th>
              <th>ชื่อ</th>
              <th>กลุ่มงาน/หน่วยงาน</th>
              <th>การปฏิบัติงาน</th>

              <th>ระยะ</th>
              <th>เวลากลับ</th>
              <th>ระยะ</th>
              <th>บันทึก</th>

              <th>สถานะคำขอ</th>
              <th>วันที่คำขอ</th>
              <th>เวลาคำขอ</th>

              <th>วันที่อนุญาต</th>
              <th>เวลาอนุญาต</th>
              <th>ผู้อนุญาต</th>
              <th>ตำแหน่งผู้อนุญาต</th>

              <th>การตรวจสอบ</th>
              <th>ผู้ตรวจสอบ</th>
              <th>ตำแหน่งผู้ตรวจสอบ</th>
              <th>วันที่ตรวจสอบ</th>
              <th>เวลาตรวจสอบ</th>
              <th>อ้างอิง</th>
            </tr>
          </tfoot>
        </table>


      </div>

    </div>
    <!-- tap end -->




  </div>

  <div id="trackerContent" class="tracker-bar">
    <button id="startBtn" onclick="checkin()"><i class="fas fa-sign-in-alt"></i> มา</button>
    <button id="statusBtn" onclick="checkinfo()"><i class="fas fa-check-circle"></i> สถานะ</button>
    <button id="endBtn" onclick="checkout()"><i class="fas fa-sign-out-alt"></i> กลับ</button>
    <button id="imapBtn" onclick="refreshMap()"><i class="fa-solid fa-location-dot"></i> แผนที่</button>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

  <script>
    // Handle "Other" option in select dropdown
    function handleOtherOption() {
      const select = document.getElementById("typea");
      const otherInput = document.getElementById("otherInput");
      otherInput.style.display = select.value !== "ปกติ" ? "block" : "none";
    }

    // Time-based button visibility
    function toggleButtonsByTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      const startBtn = document.getElementById("startBtn");
      const statusBtn = document.getElementById("statusBtn");
      const endBtn = document.getElementById("endBtn");

      if ((hours === 0 && minutes >= 0) || hours < 8 || (hours === 8 && minutes <= 30)) {
        // Show "Start" button, hide others
        startBtn.style.display = "inline-block";
        statusBtn.style.display = "none";
        endBtn.style.display = "none";
        let formattedToday = now.toLocaleDateString("th-TH");
        if (formattedToday === localStorage.getItem("datecheck")) {
          // Show "Status" button, hide others
          startBtn.style.display = "none";
          statusBtn.style.display = "inline-block";
          endBtn.style.display = "none";
        }
      } else if ((hours >= 8 && hours < 16) || (hours === 16 && minutes < 30)) {
        // Show "Status" button, hide others
        startBtn.style.display = "none";
        statusBtn.style.display = "inline-block";
        endBtn.style.display = "none";
        // redirect ไปยัง 'request.html'
        let formattedToday = now.toLocaleDateString("th-TH");
        if (formattedToday !== localStorage.getItem("datecheck")) {
          window.location.href = "request.html";
        }
      } else {
        // Show "End" button, hide others
        startBtn.style.display = "none";
        statusBtn.style.display = "none";
        endBtn.style.display = "inline-block";

        let formattedToday = now.toLocaleDateString("th-TH");
        if (formattedToday === localStorage.getItem("datecheckout")) {
          // Show "Status" button, hide others
          startBtn.style.display = "none";
          statusBtn.style.display = "inline-block";
          endBtn.style.display = "none";
        }
      }
      // เช็คว่าวันนี้เป็นวันหยุดสุดสัปดาห์หรือไม่ (วันเสาร์หรือวันอาทิตย์)
      const typeaElement = document.getElementById("typea");
      let day = now.getDay();
      if (day === 0 || day === 6) {
        typeaElement.value = "วันหยุด"; // ตั้งค่าเป็นวันหยุด
      }
    }

    // Initialize time-based buttons
    toggleButtonsByTime();
    setInterval(toggleButtonsByTime, 60000); // Check every minute



    // ดึงข้อมูลรูปภาพจาก localStorage
    const avatarSrc = localStorage.getItem("upic");
    const avatarSrcx = localStorage.getItem("yourpic");

    // ตรวจสอบว่ามีข้อมูลรูปภาพใน localStorage หรือไม่
    if (avatarSrc) {
      // ตั้งค่าให้รูปภาพ avatar
      document.getElementById("avatar").src = avatarSrc;
    } else {
      // กรณีที่ไม่มีรูปภาพใน localStorage
      document.getElementById("avatar").src = avatarSrcx; // ใส่รูปภาพที่เป็นค่าเริ่มต้น
    }

    // แท็ป และ ย่อลง
    document.addEventListener("DOMContentLoaded", function () {
      const trackerBar = document.querySelector(".tracker-bar");
      const tabs = document.querySelectorAll(".nav-link");

      tabs.forEach(tab => {
        tab.addEventListener("click", function () {
          const target = this.getAttribute("data-bs-target");

          if (target !== "#home") {
            stopLocationTracking();
            trackerBar.style.display = "none";
          } else {
            trackerBar.style.display = "flex"; // รีเซ็ตค่าให้ถูกต้อง
          }

          // ตรวจสอบว่าเป็นแท็บ #srqrcode หรือไม่
          if (target === "#srqrcode") {
            startScan();
          } else {
            stopScanner(); // หยุดการสแกนเมื่อเปลี่ยนแท็บ
          }
          if (target === "#report") {
            reportdata();
          } else {
            // clearTableData();
          }
        });
      });
    });

    // Check localStorage for the saved state and apply it
    document.addEventListener("DOMContentLoaded", function () {
      const mainContent = document.getElementById("mainContent");
      const showHideButton = document.getElementById("showHide");

      // Retrieve the stored state from localStorage
      const isCollapsed = localStorage.getItem("containerCollapsed") === "true";

      // Apply the collapsed state to the container
      if (isCollapsed) {
        mainContent.classList.add("collapsed");
        showHideButton.textContent = "แสดง"; // Change button text to 'Show'

        // Automatically select the home tab when collapsed
        const homeTab = document.querySelector('.nav-link[data-bs-target="#home"]');
        if (homeTab) {
          homeTab.click();
        }
      } else {
        showHideButton.textContent = "ย่อ"; // Change button text to 'Hide'
      }

      // Add event listener for button click
      showHideButton.addEventListener("click", function () {
        // Toggle the collapsed state
        mainContent.classList.toggle("collapsed");

        // Update localStorage with the new state
        const isCollapsed = mainContent.classList.contains("collapsed");
        localStorage.setItem("containerCollapsed", isCollapsed);

        // Change the button text based on the new state
        showHideButton.textContent = isCollapsed ? "แสดง" : "ย่อ";

        // Automatically select the home tab when collapsed
        if (isCollapsed) {
          const homeTab = document.querySelector('.nav-link[data-bs-target="#home"]');
          if (homeTab) {
            homeTab.click();
          }
        }
      });
    });



  </script>

<!-- Bootstrap 5 JS (with Popper) -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
    crossorigin="anonymous"></script>

  <script src="checkin.js"></script>
  <script src="app.js"></script>

  <!-- DataTable JS -->
<script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/2.4.2/js/dataTables.buttons.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.dataTables.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.colVis.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.print.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/2.4.2/js/buttons.html5.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/colreorder/1.7.0/js/dataTables.colReorder.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/responsive/2.5.0/js/dataTables.responsive.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/fixedheader/3.4.0/js/dataTables.fixedHeader.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/select/1.7.0/js/dataTables.select.min.js"></script> 

</body>

</html>
