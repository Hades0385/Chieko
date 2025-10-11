function getGreeting() {
  const currentTime = new Date();
  const hours = currentTime.getHours();
  let greeting = "";

  if (hours < 12) {
    greeting = "早安";
  } else if (hours < 18) {
    greeting = "午安";
  } else {
    greeting = "晚安";
  }

  return greeting;
}

function updateTime() {
  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}`;

  document.getElementById("greeting").textContent = getGreeting();
  document.getElementById("current-time").textContent = `${timeString}`;
}

setInterval(updateTime, 5000); // 每秒更新一次時間
updateTime(); // 頁面加載時先更新一次時間

//-------------------------timeEnd-------------------------
//-------------------------weatherStart-------------------------

// 範例資料（未來可改由 GAS/Your API 填入）
// const WEATHER_DATA = {
//   location: "嘉義市 東區",
//   temp: 31,
//   min: 26,
//   max: 34,
//   desc: "雷雨",
//   humidity: 67,
//   wind: "5.2 m/s",
//   aqi: 17,
//   aqiText: "良好",
//   uvi: 9,
//   uviText: "高量級"
// };

// 更新時間顯示（時:分）
// function updateClock(){
//   const el = document.getElementById('clock');
//   const now = new Date();
//   const h = now.getHours().toString().padStart(2,'0');
//   const m = now.getMinutes().toString().padStart(2,'0');
//   el.textContent = `${h}:${m}`;
// }
// updateClock();
// setInterval(updateClock, 1000*30); // 每30秒更新一次時間顯示

// 更新天氣 UI（可在取得 API 後呼叫）
function updateWeather(data){
  document.getElementById('location').textContent = data.location || '';
  document.getElementById('temp').textContent = (data.temp ?? '') + '°';
  document.getElementById('range').textContent = `${data.min}° / ${data.max}°`;
  document.getElementById('weatherDesc').textContent = data.desc || '';
  document.getElementById('humidity').textContent = (data.humidity ?? '') + '%';
  document.getElementById('wind').textContent = data.wind ?? '';
  document.getElementById('aqiValue').textContent = data.aqi ?? '';
  document.getElementById('aqiLevel').textContent = data.aqiText ?? '';
  document.getElementById('uviLevel').textContent = data.uviText ?? '';
  document.querySelector('.aqi + .uvi')?.setAttribute('aria-hidden', 'false');
  document.getElementById('uviValue').textContent = data.uvi ?? '';
  // 你可以依 data 變更 icon（此範例使用固定雨雲）
}

// 初始化（載入範例資料）

// 範例：若想從 GAS 抓資料，請用 fetch 並呼叫 updateWeather(json)
/*
fetch(`${GAS_URL}?type=weather&loc=...`).then(r=>r.json()).then(updateWeather).catch(e=>console.error(e));
*/

// 你的 GAS Web App URL
const GAS_PROXY_URL = 'https://script.google.com/macros/s/AKfycbwBLt1bDvDZauTzb1rLeJ9nNPd0C_f_Bxx66o-VR6H51jEk7lCLXPDP30vGl5ajdyqCvg/exec';

async function fetchViaGAS(targetUrl) {
  try {
    const response = await fetch(`${GAS_PROXY_URL}?url=${encodeURIComponent(targetUrl)}`);
    const data = await response.json(); // 假設目標 API 回傳 JSON
    return data;
  } catch (error) {
    console.error('代理請求發生錯誤：', error);
  }
}

function uvilevel(uvi) {
  if (uvi<=2) {
    let level = "低量級";
    return level
  }else if (uvi<=5){
    let level = "中量級";
    return level
  }else if (uvi<=7){
    let level = "高量級";
    return level
  }else if (uvi<=10){
    let level = "過量級";
    return level
  }else{
    let level = "危險級";
    return level
  }
}

function aqilevel(aqi) {
  if (aqi<=50) {
    let level = "良好";
    return level
  }else if (aqi<=100){
    let level = "普通";
    return level
  }else if (aqi<=150){
    let level = "對敏感族群不良";
    return level
  }else if (aqi<=200){
    let level = "對所有族群不良";
    return level
  }else if (aqi<=300){
    let level = "非常不良";
    return level
  }else{
    let level = "危害";
    return level
  }
}

function setWeatherImage(type) {
  const img = document.getElementById('weatherImg');
  if (!img) return;

  // 定義各種天氣對應的圖片路徑
  const iconMap = {
  "多雲": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/67aaf9dbe30989c25cbde6c6ec099213.png",
  "晴時多雲": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/67aaf9dbe30989c25cbde6c6ec099213.png",
  "晴": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/575900edccbc7def167f7874c02aeb0b.png",
  "陰": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/66117fab0f288a2867b340fa2fcde31b.png",
  "陰有雨": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/a55fef55bbeb0762a8dd329b4b8ad342.png",
  "陣雨": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/4417bf88c7bbcd8e24fb78ee6479b362.png",
  "陰有雷雨": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/efffb1e26f6de5bf5c8adbd872a2933a.png",
  "陰有雷": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/efffb1e26f6de5bf5c8adbd872a2933a.png",
  "小雪": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/00171e3b54b97dee8c1a2f6a62272640.png",
  "陣雪": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/e95fb90fc5a4aac111be78770921beb1.png",
  "雷陣雪": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/efffb1e26f6de5bf5c8adbd872a2933a.png",
  "濃霧": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/d35bb25d12281cd9ee5ce78a98cd2aa7.png",
  "大雷雨": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/efffb1e26f6de5bf5c8adbd872a2933a.png",
  "大雨": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/451d37e6cea3af4a568110863a1adcf7.png",
  "豪雨": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/451d37e6cea3af4a568110863a1adcf7.png",
  "暴風雨": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/451d37e6cea3af4a568110863a1adcf7.png",
  "風雪": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/e95fb90fc5a4aac111be78770921beb1.png",
  "冰雹": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/9189cb49e806d1ebfeed24f33367143c.png",
  "多雲有霾": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/73ae8300a30e895e3739cd50ade0dfe1.png",
  "有靄": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/73ae8300a30e895e3739cd50ade0dfe1.png",
  "沙塵暴": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/ad9e41c68b6a2671d2bcd843be1baa86.png",
  "乾燥": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/ad9e41c68b6a2671d2bcd843be1baa86.png"
  };

  // 根據 type 切換圖片
  img.src = iconMap[type] || 'https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/ad9e41c68b6a2671d2bcd843be1baa86.png';
  img.alt = `404 圖示`;
}

async function loadWeatherData() {
  try {
    const weatherData = await fetchViaGAS('https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=rdec-key-123-45678-011121314&limit=1&StationName=嘉義');
    const aqiData = await fetchViaGAS('https://data.moenv.gov.tw/api/v2/aqx_p_432?language=zh&offset=40&api_key=4c89a32a-a214-461b-bf29-30ff32a61a8a');

    let apiData = weatherData.records.Station[0].WeatherElement;
    let apiInfo = weatherData.records.Station[0];
    let currentTemp = apiData.AirTemperature;
    let wind = apiData.WindSpeed;
    let cloudness = apiData.Weather;
    let country = apiInfo.StationName;
    let rh = apiData.RelativeHumidity;
    let uv = apiData.UVIndex;
    let tempH = apiData.DailyExtreme.DailyHigh.TemperatureInfo.AirTemperature;
    let tempL = apiData.DailyExtreme.DailyLow.TemperatureInfo.AirTemperature;
    let aqi = aqiData.records[0].aqi;

    const WEATHER_DATA = {
      location: "嘉義市",
      temp: currentTemp,
      min: tempL,
      max: tempH,
      desc: cloudness,
      humidity: rh,
      wind: `${wind} m/s`,
      aqi: aqi,
      aqiText: aqilevel(aqi),
      uvi: uv,
      uviText: uvilevel(uv)
    };

    updateWeather(WEATHER_DATA);
    setWeatherImage(cloudness);

  } catch (error) {
    console.log(error);
  }
}

loadWeatherData(); 

/* ====== PWA 安裝提示 ====== */
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  els.btnInstall.hidden = false;
});
els.btnInstall.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  els.btnInstall.hidden = true;
});