// ====== 路線資料 ======
const routes = [
  { id: "r1", name: "綠線", route: "大富路 -> 嘉義大學" },
  { id: "r2", name: "綠線", route: "嘉義大學 -> 大富路" },
  { id: "r3", name: "綠A線", route: "二二八公園 -> 嘉義大學" },
  { id: "r4", name: "綠A線", route: "嘉義大學 -> 二二八公園" },
];

// ====== 生成路線清單 ======
const routeList = document.getElementById("routeList");
const searchInput = document.getElementById("searchRoute");

// 專責渲染函式
function renderRoutes(list) {
  routeList.innerHTML = ""; // 先清空
  if (list.length === 0) {
    routeList.innerHTML = `<li><div class="p-3">查無符合路線</div></li>`;
    return;
  }

  list.forEach((route) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `timeline.html?id=${route.id}`; // 根據 id 動態生成 URL
    a.innerHTML = `
        <div class="max">
          <h6 class="small">${route.name}</h6>
          <div>${route.route}</div>
        </div>
      `;
    li.appendChild(a);
    routeList.appendChild(li);
  });
}

// 初次載入
renderRoutes(routes);

// ====== 搜尋功能 ======
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim().toLowerCase();
    const filtered = routes.filter(
      (r) =>
        r.name.toLowerCase().includes(keyword) ||
        r.route.toLowerCase().includes(keyword)
    );
    renderRoutes(filtered);
  });
}
