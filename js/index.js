let productListData;
let cartData;
let apiURL = "https://livejs-api.hexschool.io/api/livejs/v1/customer";
let apiPath = "roan";

// 宣告函式，定義所有功能
//// API 功能：GET 取得產品列表
function renderProductsList(value) {
  let str = "";

  productListData.forEach(item => {
    if (item.category === value || value === "全部") {
      str += `<li class="productCard">
          <h4 class="productType">新品</h4>
          <img
            src=${item.images}
            alt="" />
          <a
            href="#"
            class="addCardBtn"
productID=${item.id}
            >加入購物車</a
          >
          <h3>${item.title}</h3>
          <del class="originPrice">NT$${new Intl.NumberFormat().format(
            item.origin_price
          )}</del>
          <p class="nowPrice">NT$${new Intl.NumberFormat().format(
            item.price
          )}</p>
        </li>`;
    }
  });
  const productWrap = document.querySelector(".productWrap");
  productWrap.innerHTML = str;
  // console.log("str", str);
}

//// API 功能：GET 取得購物車列表
function renderCartsList() {
  let str = "";
  console.log("新 cartData=", cartData);
  cartData.forEach(item => {
    str += `<tr>
            <td>
              <div class="cardItem-title">
                <img
                  src=${item.product.images}
                  alt="" />
                <p>${item.product.title}</p>
              </div>
            </td>
            <td>NT$${new Intl.NumberFormat().format(item.product.price)}</td>
            <td>${new Intl.NumberFormat().format(item.quantity)}</td>
            <td>NT$${new Intl.NumberFormat().format(
              item.product.price * item.quantity
            )}</td>
            <td class="discardBtn">
              <a
                href="#"
                class="material-icons">
                clear
              </a>
            </td>
          </tr> `;
  });

  let cartTotalAmount = 0;
  cartData.forEach(item => {
    cartTotalAmount += item.quantity * item.product.price;
  });

  const shoppingCartTable = document.querySelector(".shoppingCart-table");

  let cartList = "";
  if (cartData.length >= 1) {
    cartList = ` <tr>
            <th width="40%">品項</th>
            <th width="15%">單價</th>
            <th width="15%">數量</th>
            <th width="15%">金額</th>
            <th width="15%"></th>
          </tr>
          ${str}
            
 <tr>
            <td>
              <a
                href="#"
                class="discardAllBtn"
                >刪除所有品項</a
              >
            </td>
            <td></td>
            <td></td>
            <td>
              <p>總金額</p>
            </td>
            <td>NT$${new Intl.NumberFormat().format(cartTotalAmount)}</td>
          </tr>
        `;
  }

  shoppingCartTable.innerHTML = cartList;
}

//// API 功能：POST 新增購物車品項，並再次初始化購物車列表
function postAddCart(value) {
  let numCheck = 1;
  cartData.forEach(function (item) {
    if (item.product.id === value) {
      numCheck = item.quantity += 1;
      console.log("numCheck=", numCheck);
    }
  });

  axios
    .post(`${apiURL}/${apiPath}/carts`, {
      "data": {
        "productId": value,
        "quantity": numCheck
      }
    })
    .then(response => {
      cartData = response.data.carts;
      console.log("加入後", response.data);
      console.log("CartData=", cartData);
      renderCartsList();
    })
    .catch(error => console.error("API POST 失敗", error));
}

//// API 功能：Delete 清除購物車內全部產品
function deleteAllCartList() {
  axios
    .delete(`${apiURL}/${apiPath}/carts`)
    .then(response => {
      cartData = response.data.carts;
      console.log("已刪除", response.data);
      renderCartsList();
    })
    .catch(error => console.error(error));
}

//axios 功能
////取得產品列表
axios
  .get(`${apiURL}/${apiPath}/products`)
  .then(response => {
    productListData = response.data.products;
    renderProductsList("全部");
  })
  .catch(error => console.error("API GET 失敗", error));

//// 取得購物車清單
axios
  .get(`${apiURL}/${apiPath}/carts`)
  .then(response => {
    cartData = response.data.carts;

    console.log("cartData=", cartData);
    renderCartsList();
  })
  .catch(error => console.error("API GET 失敗", error));

//事件監聽器
////事件監聽器：篩選產品列表
document.querySelector(".productSelect").addEventListener("change", event => {
  renderProductsList(event.target.value);
});

////事件監聽器：加入購物車
document.querySelector(".productWrap").addEventListener("click", event => {
  if (event.target.getAttribute("class") === "addCardBtn") {
    postAddCart(event.target.getAttribute("productid"));
  }
});

////事件監聽器：清除購物車內全部產品
document
  .querySelector(".shoppingCart-table")
  .addEventListener("click", event => {
    if (event.target.classList.contains("discardAllBtn")) {
      deleteAllCartList();
    }
  });
