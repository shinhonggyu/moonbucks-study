const BASE_URL = "http://localhost:3000/api";

const HTTP_METHOD = {
  POST(data) {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: data }),
    };
  },
  PUT(data) {
    return {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify({ name: data }) : null,
    };
  },
  DELETE() {
    return {
      method: "DELETE",
    };
  },
};

const request = async (url, option) => {
  const res = await fetch(url, option);
  if (!res.ok) {
    alert("에러가 발생했습니다.");
    return;
  }
  return res.json();
};

const requestWithoutJson = async (url, option) => {
  const res = await fetch(url, option);
  if (!res.ok) {
    alert("에러가 발생했습니다.");
    return;
  }
  return res;
};

const MenuApi = {
  getAllMenuByCategory(category) {
    return request(`${BASE_URL}/category/${category}/menu`);
  },

  createMenu(category, name) {
    return request(
      `${BASE_URL}/category/${category}/menu`,
      HTTP_METHOD.POST(name)
    );
  },

  updateMenu(category, name, menuId) {
    return request(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      HTTP_METHOD.PUT(name)
    );
  },

  toggleSoldOutMenu(category, menuId) {
    return request(
      `${BASE_URL}/category/${category}/menu/${menuId}/soldout`,
      HTTP_METHOD.PUT()
    );
  },

  deleteMenu(category, menuId) {
    return requestWithoutJson(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      HTTP_METHOD.DELETE()
    );
  },
};

export default MenuApi;
