let productListData;
let cartData;
let apiURL = "https://livejs-api.hexschool.io/api/livejs/v1/customer";
let apiPath = "roan";
//const token = "86LLXALC2NNdzMW2jZZG8Xol6382"; //事實上 token 必須放在後端，例如環境變數。由於 token 的位置非本作業的重點，故先放前端

// 宣告函式，定義所有功能
//// API 功能：GET 取得產品列表
function renderProductsList(value) {
  axios
    .get(`${apiURL}/${apiPath}/products`)
    .then(response => {
      productListData = response.data.products;

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
    })
    .catch(error => console.error("API GET 失敗", error));
}

//// API 功能：GET 取得購物車列表
function renderCartsList() {
  axios
    .get(`${apiURL}/${apiPath}/carts`)
    .then(response => {
      cartData = response.data.carts;

      let str = "";
      // console.log("新 ", cartData);
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
              <a class="material-icons" data-id=${item.id}>
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
    })
    .catch(error => console.error("API GET 失敗", error));
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
      // console.log("加入後", response.data);
      // console.log("cartData after postAddCart=", cartData);
      renderCartsList();
    })
    .catch(error => console.error("API POST 失敗", error));
}

//// API 功能：Delete 刪除購物車內全部產品
function deleteAllCartList() {
  axios
    .delete(`${apiURL}/${apiPath}/carts`)
    .then(response => {
      cartData = response.data.carts;

      renderCartsList();
    })
    .catch(error => console.error(error));
}

////API 功能：刪除購物車特定訂單
function deleteCartItem(cartID) {
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts/${cartID}`
    )
    .then(function (response) {
      cartData = response.data.carts;
      renderCartsList();
    })
    .catch(error => console.error(error));
}

//axios 功能
////取得產品列表
// axios
//   .get(`${apiURL}/${apiPath}/products`)
//   .then(response => {
//     productListData = response.data.products;
//     renderProductsList("全部");
//   })
//   .catch(error => console.error("API GET 失敗", error));

//// 取得購物車清單
// axios
//   .get(`${apiURL}/${apiPath}/carts`)
//   .then(response => {
//     cartData = response.data.carts;

//     renderCartsList();
//   })
//   .catch(error => console.error("API GET 失敗", error));

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

////事件監聽器：刪除購物車內全部產品
document
  .querySelector(".shoppingCart-table")
  .addEventListener("click", event => {
    if (event.target.classList.contains("discardAllBtn")) {
      deleteAllCartList();
    }
  });

////事件監聽器：刪除購物車特定訂單
document
  .querySelector(".shoppingCart-table")
  .addEventListener("click", event => {
    const cartID = event.target.getAttribute("data-id");
    if (event.target.classList.contains("material-icons")) {
      deleteCartItem(cartID);
    }
  });

////事件監聽器：送出訂單
const orderInfoBtn = document.querySelector(".orderInfo-btn");
orderInfoBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (cartData.length == 0) {
    alert("請加入購物車");
    return;
  }
  const customerName = document.querySelector("#customerName").value;
  const customerPhone = document.querySelector("#customerPhone").value;
  const customerEmail = document.querySelector("#customerEmail").value;
  const customerAddress = document.querySelector("#customerAddress").value;
  const customerTradeWay = document.querySelector("#tradeWay").value;

  if (
    customerName == "" ||
    customerPhone == "" ||
    customerEmail == "" ||
    customerAddress == "" ||
    customerTradeWay == ""
  ) {
    alert("請輸入訂單資訊");
    return;
  }

  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/orders`,
      {
        "data": {
          "user": {
            "name": customerName,
            "tel": customerPhone,
            "email": customerEmail,
            "address": customerAddress,
            "payment": customerTradeWay
          }
        }
      }
    )
    .then(function (response) {
      alert("訂單建立成功");
      document.querySelector("#customerName").value = "";
      document.querySelector("#customerPhone").value = "";
      document.querySelector("#customerEmail").value = "";
      document.querySelector("#customerAddress").value = "";
      document.querySelector("#tradeWay").value = "ATM";
      renderCartsList();
    });
});

function init() {
  renderProductsList("全部");
  renderCartsList();
}
init();
