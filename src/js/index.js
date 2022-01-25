import { $ } from "./utils/dom.js";
import MenuApi from "./api/index.js";
// JS파일 불러왓을때 처음 실행되는 함수
function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = "espresso";

  this.init = async () => {
    render();
    initEventListener();
  };

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    const template = this.menu[this.currentCategory]
      .map((item) => {
        return `<li data-menu-id=${item.id} class="${
          item.isSoldOut ? "sold-out" : ""
        } menu-list-item d-flex items-center py-2">
            <span class="w-100 pl-2 menu-name">${item.name}</span>
            <button
              type="button"
              class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
            >
              품절
            </button>
            <button
              type="button"
              class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
            >
              수정
            </button>
            <button
              type="button"
              class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
            >
              삭제
            </button>
          </li>`;
      })
      .join("");

    $("#menu-list").innerHTML = template;

    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addMenuName = async () => {
    const menuName = $("#menu-name").value;
    if (menuName.trim().length === 0) {
      alert("값을 입력해주세요");
      $("#menu-name").focus();
      return;
    }

    if (
      this.menu[this.currentCategory].find((item) => item.name === menuName)
    ) {
      alert("이미 등록된 메뉴입니다");
      $("#menu-name").value = "";
      return;
    }

    await MenuApi.createMenu(this.currentCategory, menuName);
    render();
    $("#menu-name").value = "";
  };

  const removeMenuName = async (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      render();
    }
  };

  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuname = e.target.closest("li").querySelector(".menu-name");
    const editedMenuName = prompt("메뉴명을 수정하세요", $menuname.innerText);
    if (editedMenuName === null || editedMenuName.trim().length === 0) {
      return;
    }
    await MenuApi.updateMenu(this.currentCategory, editedMenuName, menuId);
    render();
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    render();
  };

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  };

  const initEventListener = () => {
    // 이벤트 버블링을 활용한 위임
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    $("#menu-form").addEventListener("submit", (e) => e.preventDefault());

    $("#menu-submit-button").addEventListener("click", addMenuName);

    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    });

    $("nav").addEventListener("click", changeCategory);
  };
}

const app = new App();
// console.log(app);
app.init();
