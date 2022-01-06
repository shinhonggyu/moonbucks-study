/*
🎯 step1 요구사항 - 돔 조작과 이벤트 핸들링으로 메뉴 관리하기
[ ] 에스프레소 메뉴에 새로운 메뉴를 확인 버튼 또는 엔터키 입력으로 추가한다.
추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
[ ] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
[ ] 사용자 입력값이 빈 값이라면 추가되지 않는다.
[ ] 메뉴의 수정 버튼을 눌러 메뉴 이름 수정할 수 있다.
[ ] 메뉴 수정시 브라우저에서 제공하는 prompt 인터페이스를 활용한다.
[ ] 메뉴 삭제 버튼을 이용하여 메뉴 삭제할 수 있다.
[ ] 메뉴 삭제시 브라우저에서 제공하는 confirm 인터페이스를 활용한다.
[ ] 총 메뉴 갯수를 count하여 상단에 보여준다.
*/

const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return localStorage.getItem("menu");
  },
};

const renderMenuName = () => {
  const template = app.menu
    .map((item) => {
      return `<li class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name">${item.name}</span>
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

  $("#espresso-menu-list").innerHTML = template;
};

// JS파일 불러왓을때 처음 실행되는 함수
function App() {
  this.menu = JSON.parse(store.getLocalStorage()) || [];
  console.log(this.menu);

  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    const espressoMenuName = $("#espresso-menu-name").value;
    if (espressoMenuName.trim().length === 0) {
      alert("값을 입력해주세요");
      $("#espresso-menu-name").focus();
      return;
    }
    this.menu.push({ name: espressoMenuName });
    console.log(this.menu);
    store.setLocalStorage(this.menu);
    const template = this.menu
      .map((item) => {
        return `<li class="menu-list-item d-flex items-center py-2">
            <span class="w-100 pl-2 menu-name">${item.name}</span>
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

    $("#espresso-menu-list").innerHTML = template;

    updateMenuCount();
    $("#espresso-menu-name").value = "";
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const deleteMenuName = e.target
        .closest("li")
        .querySelector(".menu-name").innerText;

      const newArray = this.menu.filter((item) => item.name !== deleteMenuName);
      this.menu = newArray;
      console.log(this.menu);
      store.setLocalStorage(this.menu);
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  const updateMenuName = (e) => {
    const $menuname = e.target.closest("li").querySelector(".menu-name");
    const editedMenuName = prompt("메뉴명을 수정하세요", $menuname.innerText);
    if (editedMenuName === null || editedMenuName.trim().length === 0) {
      return;
    }
    const updatedMenu = this.menu.map((item) => {
      if (item.name === $menuname.innerText) {
        return {
          name: editedMenuName,
        };
      }
      return item;
    });
    this.menu = updatedMenu;
    console.log(this.menu);
    store.setLocalStorage(this.menu);
    $menuname.innerText = editedMenuName;
  };

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }

    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  $("#espresso-menu-form").addEventListener("submit", (e) =>
    e.preventDefault()
  );

  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenuName();
  });
}

const app = new App();
console.log(app.menu);
renderMenuName();
