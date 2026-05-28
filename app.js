const ADMIN_KEY = "uusi&jasdja1213@qq_142";
const STORAGE_KEY = "sniper-rental-accounts-v1";
const GITHUB_CONFIG_KEY = "sniper-rental-github-config-v1";
const DATA_FILE = "./data.json";

const seedAccounts = [
  {
    id: crypto.randomUUID(),
    title: "星光终焉15传说 满配神器 神途终章 v10 永久臻藏武器库",
    description: "高配主号，武器库完整，适合排位、娱乐和体验稀有皮肤。下单前请确认区服。",
    vip: 10,
    server: "生死狙击 / 双线 / 联通四区",
    prices: { hour: 2.4, night: 14.9, day: 29.9 },
    gift: { rent: 3, free: 1 },
    tags: ["免押金", "超13X", "高信誉"],
    image: "",
  },
  {
    id: crypto.randomUUID(),
    title: "断罪套装 速影幻羽 枪王同款 2888万战 满级账号",
    description: "热门套装齐全，号内资源多，稳定可租。请勿改密、绑定或进行违规操作。",
    vip: 12,
    server: "生死狙击 / 电信 / 双线三区",
    prices: { hour: 2.9, night: 16.9, day: 32.9 },
    gift: { rent: 2, free: 1 },
    tags: ["免押金", "租4送1", "满级"],
    image: "",
  },
  {
    id: crypto.randomUUID(),
    title: "满配冒险主号 王者武器多 竞技娱乐通用",
    description: "冒险、竞技都能玩，角色和武器搭配完整，适合长租体验。",
    vip: 8,
    server: "生死狙击 / 双线 / 华东一区",
    prices: { hour: 1.8, night: 10.8, day: 22.8 },
    gift: { rent: 4, free: 1 },
    tags: ["性价比", "冒险强", "可包天"],
    image: "",
  },
];

const state = {
  accounts: loadAccounts(),
  query: "",
  sort: "default",
  editingTags: [],
  currentImages: [],
  github: loadGithubConfig(),
};

const els = {
  searchInput: document.querySelector("#searchInput"),
  searchButton: document.querySelector("#searchButton"),
  sortSelect: document.querySelector("#sortSelect"),
  productGrid: document.querySelector("#productGrid"),
  resultCount: document.querySelector("#resultCount"),
  emptyState: document.querySelector("#emptyState"),
  adminEntry: document.querySelector("#adminEntry"),
  keyDialog: document.querySelector("#keyDialog"),
  keyForm: document.querySelector("#keyForm"),
  keyInput: document.querySelector("#keyInput"),
  cancelKey: document.querySelector("#cancelKey"),
  keyError: document.querySelector("#keyError"),
  adminBackdrop: document.querySelector("#adminBackdrop"),
  adminPanel: document.querySelector("#adminPanel"),
  closeAdmin: document.querySelector("#closeAdmin"),
  accountForm: document.querySelector("#accountForm"),
  editingId: document.querySelector("#editingId"),
  titleInput: document.querySelector("#titleInput"),
  descriptionInput: document.querySelector("#descriptionInput"),
  vipInput: document.querySelector("#vipInput"),
  serverInput: document.querySelector("#serverInput"),
  hourPriceInput: document.querySelector("#hourPriceInput"),
  nightPriceInput: document.querySelector("#nightPriceInput"),
  dayPriceInput: document.querySelector("#dayPriceInput"),
  rentHoursInput: document.querySelector("#rentHoursInput"),
  giftHoursInput: document.querySelector("#giftHoursInput"),
  imageInput: document.querySelector("#imageInput"),
  imagePreview: document.querySelector("#imagePreview"),
  tagInput: document.querySelector("#tagInput"),
  addTagButton: document.querySelector("#addTagButton"),
  tagList: document.querySelector("#tagList"),
  resetFormButton: document.querySelector("#resetFormButton"),
  adminListHint: document.querySelector("#adminListHint"),
  adminItems: document.querySelector("#adminItems"),
  githubOwnerInput: document.querySelector("#githubOwnerInput"),
  githubRepoInput: document.querySelector("#githubRepoInput"),
  githubBranchInput: document.querySelector("#githubBranchInput"),
  githubPathInput: document.querySelector("#githubPathInput"),
  githubTokenInput: document.querySelector("#githubTokenInput"),
  githubLoadButton: document.querySelector("#githubLoadButton"),
  githubPublishButton: document.querySelector("#githubPublishButton"),
  githubStatus: document.querySelector("#githubStatus"),
  detailDialog: document.querySelector("#detailDialog"),
  closeDetail: document.querySelector("#closeDetail"),
  detailContent: document.querySelector("#detailContent"),
};

function loadAccounts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return seedAccounts.map(normalizeAccount);
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeAccount) : seedAccounts.map(normalizeAccount);
  } catch {
    return seedAccounts.map(normalizeAccount);
  }
}

function normalizeAccount(account) {
  const images = Array.isArray(account.images) ? account.images : account.image ? [account.image] : [];
  return {
    ...account,
    images,
    image: images[0] || account.image || "",
  };
}

function saveAccounts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.accounts));
}

function loadGithubConfig() {
  try {
    return {
      owner: "",
      repo: "",
      branch: "main",
      path: "data.json",
      ...JSON.parse(localStorage.getItem(GITHUB_CONFIG_KEY) || "{}"),
    };
  } catch {
    return { owner: "", repo: "", branch: "main", path: "data.json" };
  }
}

function saveGithubConfig() {
  state.github = {
    owner: els.githubOwnerInput.value.trim(),
    repo: els.githubRepoInput.value.trim(),
    branch: els.githubBranchInput.value.trim() || "main",
    path: els.githubPathInput.value.trim() || "data.json",
  };
  localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(state.github));
}

function fillGithubConfig() {
  els.githubOwnerInput.value = state.github.owner || "";
  els.githubRepoInput.value = state.github.repo || "";
  els.githubBranchInput.value = state.github.branch || "main";
  els.githubPathInput.value = state.github.path || "data.json";
}

function setGithubStatus(message, type = "") {
  els.githubStatus.textContent = message;
  els.githubStatus.dataset.type = type;
}

async function loadPublishedAccounts(showStatus = false) {
  try {
    const response = await fetch(`${DATA_FILE}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`读取失败：${response.status}`);
    const data = await response.json();
    const accounts = Array.isArray(data) ? data : data.accounts;
    if (!Array.isArray(accounts)) throw new Error("data.json 格式不正确");
    state.accounts = accounts.map(normalizeAccount);
    saveAccounts();
    renderProducts();
    renderAdminList();
    if (showStatus) setGithubStatus("已从 data.json 读取最新数据。", "success");
  } catch (error) {
    if (showStatus) setGithubStatus(error.message, "error");
  }
}

function money(value) {
  return Number(value || 0).toFixed(1);
}

function accountsPayload() {
  return {
    accounts: state.accounts.map((account) => ({
      ...normalizeAccount(account),
      image: accountImages(account)[0] || "",
    })),
  };
}

function isDataImage(value) {
  return typeof value === "string" && value.startsWith("data:image/");
}

function isRepoImage(value) {
  return typeof value === "string" && !isDataImage(value) && value.trim() !== "";
}

function dataImageInfo(dataUrl) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) throw new Error("图片格式不正确，请重新上传图片。");
  const mime = match[1].toLowerCase();
  const extensionMap = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return {
    base64: match[2],
    extension: extensionMap[mime] || "jpg",
  };
}

function safePathPart(value) {
  return String(value || crypto.randomUUID())
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function uploadPathFor(account, imageIndex, extension) {
  const accountFolder = safePathPart(account.id);
  const stamp = Date.now().toString(36);
  return `uploads/${accountFolder}/${stamp}-${imageIndex + 1}.${extension}`;
}

function collectRepoImages(accounts) {
  return new Set(
    accounts.flatMap((account) => accountImages(account).filter(isRepoImage)),
  );
}

function encodeBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function contentsUrl(owner, repo, path) {
  const apiPath = encodeURIComponent(path).replaceAll("%2F", "/");
  return `https://api.github.com/repos/${owner}/${repo}/contents/${apiPath}`;
}

async function githubRequest(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(data?.message || `GitHub 请求失败：${response.status}`);
  }
  return data;
}

async function readGithubJsonFile(owner, repo, branch, path, token) {
  const file = await githubRequest(`${contentsUrl(owner, repo, path)}?ref=${encodeURIComponent(branch)}`, token);
  const jsonText = new TextDecoder().decode(
    Uint8Array.from(atob(file.content.replace(/\s/g, "")), (char) => char.charCodeAt(0)),
  );
  const data = JSON.parse(jsonText);
  const accounts = Array.isArray(data) ? data : data.accounts;
  if (!Array.isArray(accounts)) throw new Error("GitHub 上的 data.json 格式不正确。");
  return { sha: file.sha, accounts: accounts.map(normalizeAccount) };
}

async function uploadGithubImage(owner, repo, branch, path, dataUrl, token) {
  const { base64 } = dataImageInfo(dataUrl);
  await githubRequest(contentsUrl(owner, repo, path), token, {
    method: "PUT",
    body: JSON.stringify({
      message: `Upload rental image ${path}`,
      content: base64,
      branch,
    }),
  });
  return path;
}

async function deleteGithubFile(owner, repo, branch, path, token) {
  let file;
  try {
    file = await githubRequest(`${contentsUrl(owner, repo, path)}?ref=${encodeURIComponent(branch)}`, token);
  } catch (error) {
    if (String(error.message).includes("Not Found")) return;
    throw error;
  }

  await githubRequest(contentsUrl(owner, repo, path), token, {
    method: "DELETE",
    body: JSON.stringify({
      message: `Delete unused rental image ${path}`,
      sha: file.sha,
      branch,
    }),
  });
}

async function publishToGithub() {
  saveGithubConfig();
  const token = els.githubTokenInput.value.trim();
  const { owner, repo, branch, path } = state.github;
  if (!owner || !repo || !branch || !path) {
    throw new Error("请先填写 GitHub 用户名、仓库名、分支和数据文件路径。");
  }
  if (!token) {
    throw new Error("请填写 GitHub token。");
  }

  let remoteSha;
  let remoteAccounts = [];
  try {
    const remote = await readGithubJsonFile(owner, repo, branch, path, token);
    remoteSha = remote.sha;
    remoteAccounts = remote.accounts;
  } catch (error) {
    if (!String(error.message).includes("Not Found")) throw error;
  }

  const syncedAccounts = [];
  for (const account of state.accounts.map(normalizeAccount)) {
    const syncedImages = [];
    for (const [imageIndex, image] of accountImages(account).entries()) {
      if (isDataImage(image)) {
        const { extension } = dataImageInfo(image);
        const imagePath = uploadPathFor(account, imageIndex, extension);
        setGithubStatus(`正在上传图片：${imagePath}`);
        syncedImages.push(await uploadGithubImage(owner, repo, branch, imagePath, image, token));
      } else if (isRepoImage(image)) {
        syncedImages.push(image);
      }
    }
    syncedAccounts.push({
      ...account,
      images: syncedImages,
      image: syncedImages[0] || "",
    });
  }

  const remoteImages = collectRepoImages(remoteAccounts);
  const retainedImages = collectRepoImages(syncedAccounts);

  state.accounts = syncedAccounts;
  saveAccounts();
  renderProducts();
  renderAdminList();
  resetForm();

  const content = `${JSON.stringify(accountsPayload(), null, 2)}\n`;
  await githubRequest(contentsUrl(owner, repo, path), token, {
    method: "PUT",
    body: JSON.stringify({
      message: `Update rental account data ${new Date().toISOString()}`,
      content: encodeBase64(content),
      branch,
      ...(remoteSha ? { sha: remoteSha } : {}),
    }),
  });

  for (const imagePath of remoteImages) {
    if (!retainedImages.has(imagePath) && imagePath.startsWith("uploads/")) {
      setGithubStatus(`正在删除未使用图片：${imagePath}`);
      await deleteGithubFile(owner, repo, branch, imagePath, token);
    }
  }
}

async function loadFromGithub() {
  saveGithubConfig();
  const token = els.githubTokenInput.value.trim();
  const { owner, repo, branch, path } = state.github;
  if (!owner || !repo || !branch || !path) {
    throw new Error("请先填写 GitHub 用户名、仓库名、分支和数据文件路径。");
  }
  if (!token) {
    throw new Error("请填写 GitHub token。");
  }

  const remote = await readGithubJsonFile(owner, repo, branch, path, token);
  state.accounts = remote.accounts;
  saveAccounts();
  renderProducts();
  renderAdminList();
  resetForm();
}

function productTitle(account) {
  const vip = Number(account.vip || 0);
  return vip > 0 ? `V${vip}🌟${account.title}` : account.title;
}

function giftText(account) {
  const rent = Number(account.gift?.rent || 0);
  const free = Number(account.gift?.free || 0);
  return rent > 0 && free > 0 ? `租${rent}送${free}` : "暂无赠送";
}

function defaultImageSvg(index) {
  const hue = (index * 47 + 185) % 360;
  const title = encodeURIComponent(`生死狙击 ${String(index).padStart(3, "0")}`);
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='hsl(${hue},75%25,36%25)'/%3E%3Cstop offset='1' stop-color='hsl(${(hue + 70) % 360},85%25,54%25)'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='400' fill='%23121b27'/%3E%3Cg fill='url(%23g)' opacity='.9'%3E%3Crect x='28' y='42' width='344' height='48' rx='10'/%3E%3Crect x='28' y='108' width='150' height='96' rx='10'/%3E%3Crect x='196' y='108' width='176' height='96' rx='10'/%3E%3Crect x='28' y='222' width='344' height='48' rx='10'/%3E%3Crect x='28' y='288' width='344' height='58' rx='10'/%3E%3C/g%3E%3Ctext x='200' y='374' text-anchor='middle' fill='white' font-size='28' font-family='Arial,sans-serif' font-weight='700'%3E${title}%3C/text%3E%3C/svg%3E`;
}

function accountImages(account) {
  return Array.isArray(account.images) && account.images.length > 0
    ? account.images
    : account.image
      ? [account.image]
      : [];
}

function getFilteredAccounts() {
  const query = state.query.trim().toLowerCase();
  let list = state.accounts.map((account, index) => ({ ...account, number: index + 1 }));

  if (query) {
    list = list.filter((account) => {
      const searchable = [
        account.title,
        productTitle(account),
        account.description,
        account.server,
        giftText(account),
        ...(account.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      return searchable.includes(query);
    });
  }

  if (state.sort === "asc") {
    list.sort((a, b) => Number(a.prices.hour) - Number(b.prices.hour));
  }
  if (state.sort === "desc") {
    list.sort((a, b) => Number(b.prices.hour) - Number(a.prices.hour));
  }

  return list;
}

function renderProducts() {
  const accounts = getFilteredAccounts();
  els.productGrid.innerHTML = accounts
    .map((account) => {
      const image = accountImages(account)[0] || defaultImageSvg(account.number);
      const tags = (account.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
      return `
        <article class="product-card" data-detail="${account.id}" tabindex="0" role="button" aria-label="查看 ${escapeHtml(productTitle(account))}">
          <div class="product-image">
            <img src="${image}" alt="${escapeHtml(account.title)}" />
            <span class="product-number">编号 ${String(account.number).padStart(3, "0")}</span>
          </div>
          <div class="product-body">
            <h2 class="product-title">${escapeHtml(productTitle(account))}</h2>
            <div class="server-line">${escapeHtml(account.server || "生死狙击")}</div>
            <div class="tag-row">${tags}</div>
            <div class="gift">${escapeHtml(giftText(account))}</div>
            <div class="price-row">
              <button class="rent-button price-button" data-detail="${account.id}">
                <span>1小时</span>
                <strong>¥${money(account.prices.hour)}</strong>
              </button>
              <button class="rent-button price-button" data-detail="${account.id}">
                <span>包夜</span>
                <strong>¥${money(account.prices.night)}</strong>
              </button>
              <button class="rent-button price-button" data-detail="${account.id}">
                <span>包天</span>
                <strong>¥${money(account.prices.day)}</strong>
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  els.resultCount.textContent = `共 ${accounts.length} 个商品`;
  els.emptyState.hidden = accounts.length > 0;
}

function renderAdminTags() {
  els.tagList.innerHTML = state.editingTags
    .map(
      (tag, index) => `
        <span class="admin-tag">
          ${escapeHtml(tag)}
          <button type="button" data-remove-tag="${index}" aria-label="删除标签">×</button>
        </span>
      `,
    )
    .join("");
}

function renderImagePreview() {
  if (state.currentImages.length > 0) {
    els.imagePreview.innerHTML = state.currentImages
      .map(
        (image, index) => `
          <div class="preview-tile">
            <img src="${image}" alt="商品图片预览 ${index + 1}" />
            <button type="button" data-remove-image="${index}" aria-label="删除图片">×</button>
          </div>
        `,
      )
      .join("");
  } else {
    els.imagePreview.textContent = "未选择图片";
  }
}

function renderAdminList() {
  els.adminListHint.textContent = `${state.accounts.length} 个账号`;
  els.adminItems.className = "admin-items";
  els.adminItems.innerHTML = state.accounts
    .map(
      (account, index) => `
        <div class="admin-item">
          <div>
            <strong>${String(index + 1).padStart(3, "0")} ${escapeHtml(productTitle(account))}</strong>
            <span>1小时 ¥${money(account.prices.hour)} · ${escapeHtml(account.server || "生死狙击")}</span>
          </div>
          <div class="admin-item-actions">
            <button class="small-button" data-edit="${account.id}">编辑</button>
            <button class="small-button danger-button" data-delete="${account.id}">删除</button>
          </div>
        </div>
      `,
    )
    .join("");
}

function resetForm() {
  els.accountForm.reset();
  els.editingId.value = "";
  els.vipInput.value = "0";
  els.rentHoursInput.value = "0";
  els.giftHoursInput.value = "0";
  state.editingTags = [];
  state.currentImages = [];
  renderAdminTags();
  renderImagePreview();
}

function fillForm(account) {
  els.editingId.value = account.id;
  els.titleInput.value = account.title || "";
  els.descriptionInput.value = account.description || "";
  els.vipInput.value = account.vip || 0;
  els.serverInput.value = account.server || "";
  els.hourPriceInput.value = money(account.prices.hour);
  els.nightPriceInput.value = money(account.prices.night);
  els.dayPriceInput.value = money(account.prices.day);
  els.rentHoursInput.value = account.gift?.rent || 0;
  els.giftHoursInput.value = account.gift?.free || 0;
  state.editingTags = [...(account.tags || [])];
  state.currentImages = accountImages(account);
  els.imageInput.value = "";
  renderAdminTags();
  renderImagePreview();
}

function openAdmin() {
  els.adminBackdrop.hidden = false;
  els.adminPanel.classList.add("open");
  els.adminPanel.setAttribute("aria-hidden", "false");
  renderAdminList();
}

function closeAdmin() {
  els.adminPanel.classList.remove("open");
  els.adminPanel.setAttribute("aria-hidden", "true");
  els.adminBackdrop.hidden = true;
}

function showDetail(id, imageIndex = 0) {
  const account = state.accounts.find((item) => item.id === id);
  if (!account) return;
  const number = state.accounts.findIndex((item) => item.id === id) + 1;
  const images = accountImages(account);
  const displayImages = images.length > 0 ? images : [defaultImageSvg(number)];
  const safeIndex = Math.max(0, Math.min(imageIndex, displayImages.length - 1));
  const image = displayImages[safeIndex];
  els.detailContent.className = "detail-content";
  els.detailContent.dataset.detailId = id;
  els.detailContent.dataset.imageIndex = String(safeIndex);
  els.detailContent.innerHTML = `
    <div class="detail-media">
      <div class="detail-hero">
        <img src="${image}" alt="${escapeHtml(account.title)}" />
        ${
          displayImages.length > 1
            ? `
              <button class="gallery-nav gallery-prev" data-gallery-shift="-1" aria-label="上一张">‹</button>
              <button class="gallery-nav gallery-next" data-gallery-shift="1" aria-label="下一张">›</button>
            `
            : ""
        }
      </div>
      ${
        displayImages.length > 1
          ? `<div class="detail-thumbs">${displayImages
              .map(
                (item, index) => `
                  <button class="detail-thumb ${index === safeIndex ? "active" : ""}" data-gallery-index="${index}" aria-label="查看图片 ${index + 1}">
                    <img src="${item}" alt="商品图片 ${index + 1}" />
                  </button>
                `,
              )
              .join("")}</div>`
          : ""
      }
    </div>
    <div class="detail-info">
      <h2 class="detail-title">${escapeHtml(productTitle(account))}</h2>
      <p class="server-line">编号 ${String(number).padStart(3, "0")} · ${escapeHtml(account.server || "生死狙击")}</p>
      <div class="tag-row">${(account.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      <div class="gift">${escapeHtml(giftText(account))}</div>
      <div class="detail-price-row">
        <span>1小时 ¥${money(account.prices.hour)}</span>
        <span>包夜 ¥${money(account.prices.night)}</span>
        <span>包天 ¥${money(account.prices.day)}</span>
      </div>
      <div class="detail-description">${escapeHtml(account.description || "暂无详细描述")}</div>
    </div>
  `;
  if (!els.detailDialog.open) {
    els.detailDialog.showModal();
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

els.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderProducts();
});

els.searchButton.addEventListener("click", () => {
  state.query = els.searchInput.value;
  renderProducts();
});

els.sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

els.productGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".product-card[data-detail]");
  if (card) {
    showDetail(card.dataset.detail);
  }
});

els.productGrid.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest(".product-card[data-detail]");
  if (!card) return;
  event.preventDefault();
  showDetail(card.dataset.detail);
});

els.adminEntry.addEventListener("click", () => {
  els.keyError.hidden = true;
  els.keyInput.value = "";
  els.keyDialog.showModal();
  els.keyInput.focus();
});

els.keyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (els.keyInput.value === ADMIN_KEY) {
    els.keyDialog.close();
    openAdmin();
  } else {
    els.keyError.hidden = false;
  }
});

els.cancelKey.addEventListener("click", () => {
  els.keyError.hidden = true;
  els.keyDialog.close();
});

els.closeAdmin.addEventListener("click", closeAdmin);
els.adminBackdrop.addEventListener("click", closeAdmin);
els.closeDetail.addEventListener("click", () => els.detailDialog.close());

els.detailContent.addEventListener("click", (event) => {
  const id = els.detailContent.dataset.detailId;
  if (!id) return;

  const thumb = event.target.closest("[data-gallery-index]");
  if (thumb) {
    showDetail(id, Number(thumb.dataset.galleryIndex));
    return;
  }

  const nav = event.target.closest("[data-gallery-shift]");
  if (nav) {
    const account = state.accounts.find((item) => item.id === id);
    const count = Math.max(accountImages(account || {}).length, 1);
    const current = Number(els.detailContent.dataset.imageIndex || 0);
    const next = (current + Number(nav.dataset.galleryShift) + count) % count;
    showDetail(id, next);
  }
});

els.addTagButton.addEventListener("click", () => {
  const tag = els.tagInput.value.trim();
  if (!tag) return;
  state.editingTags.push(tag.slice(0, 6));
  els.tagInput.value = "";
  renderAdminTags();
});

els.tagInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    els.addTagButton.click();
  }
});

els.tagList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-tag]");
  if (!button) return;
  state.editingTags.splice(Number(button.dataset.removeTag), 1);
  renderAdminTags();
});

els.imageInput.addEventListener("change", () => {
  const files = [...(els.imageInput.files || [])];
  if (files.length === 0) return;
  let loaded = 0;
  files.forEach((file) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      state.currentImages.push(String(reader.result || ""));
      loaded += 1;
      if (loaded === files.length) {
        els.imageInput.value = "";
        renderImagePreview();
      }
    });
    reader.readAsDataURL(file);
  });
});

els.imagePreview.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-image]");
  if (!button) return;
  state.currentImages.splice(Number(button.dataset.removeImage), 1);
  renderImagePreview();
});

els.accountForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = els.editingId.value || crypto.randomUUID();
  const account = {
    id,
    title: els.titleInput.value.trim(),
    description: els.descriptionInput.value.trim(),
    vip: Number.parseInt(els.vipInput.value || "0", 10),
    server: els.serverInput.value.trim(),
    prices: {
      hour: Number(els.hourPriceInput.value || 0),
      night: Number(els.nightPriceInput.value || 0),
      day: Number(els.dayPriceInput.value || 0),
    },
    gift: {
      rent: Number.parseInt(els.rentHoursInput.value || "0", 10),
      free: Number.parseInt(els.giftHoursInput.value || "0", 10),
    },
    tags: [...state.editingTags],
    images: [...state.currentImages],
    image: state.currentImages[0] || "",
  };

  const index = state.accounts.findIndex((item) => item.id === id);
  if (index >= 0) {
    state.accounts[index] = account;
  } else {
    state.accounts.unshift(account);
  }

  saveAccounts();
  renderProducts();
  renderAdminList();
  resetForm();
});

els.resetFormButton.addEventListener("click", resetForm);

els.githubLoadButton.addEventListener("click", async () => {
  setGithubStatus("正在读取 GitHub 数据...");
  els.githubLoadButton.disabled = true;
  try {
    await loadFromGithub();
    setGithubStatus("已读取 GitHub 上的 data.json。", "success");
  } catch (error) {
    setGithubStatus(error.message, "error");
  } finally {
    els.githubLoadButton.disabled = false;
  }
});

els.githubPublishButton.addEventListener("click", async () => {
  setGithubStatus("正在发布到 GitHub...");
  els.githubPublishButton.disabled = true;
  try {
    await publishToGithub();
    setGithubStatus("发布成功。GitHub Pages 通常几十秒后刷新。", "success");
  } catch (error) {
    setGithubStatus(error.message, "error");
  } finally {
    els.githubPublishButton.disabled = false;
  }
});

els.adminItems.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");

  if (editButton) {
    const account = state.accounts.find((item) => item.id === editButton.dataset.edit);
    if (account) fillForm(account);
  }

  if (deleteButton) {
    const account = state.accounts.find((item) => item.id === deleteButton.dataset.delete);
    if (account && confirm(`确定删除「${productTitle(account)}」吗？`)) {
      state.accounts = state.accounts.filter((item) => item.id !== deleteButton.dataset.delete);
      saveAccounts();
      renderProducts();
      renderAdminList();
      resetForm();
    }
  }
});

renderProducts();
renderAdminTags();
renderImagePreview();
renderAdminList();
fillGithubConfig();
loadPublishedAccounts();
