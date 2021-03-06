// initial state
// shape: [{ id, quantity }]
const state = {
  items: []
};

// getters
const getters = {
  // 获取所有购物车中的商品详情
  cartProducts: (state, getters, rootState) => {
    // 用id查product表 返回详情及购物车中的数量
    return state.items.map(({ id, quantity }) => {
      const product = rootState.products.productList.find(
        product => product.id === id
      );
      return {
        title: product.title,
        totalPrice: product.price * quantity,
        quantity,
        id
      };
    });
  },
  // 计算总价
  cartTotalPrice: (state, getter) =>
    getter.cartProducts.reduce((total, item) => total + item.totalPrice, 0),
  // 通过id获取商品数
  getQuantityById: state => id => {
    const item = state.items.find(product => product.id === id);
    return item ? item.quantity : 0;
  },
  // 获取购物车全部商品数
  getTotalQuantity: state =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  // 通过id获取单位总价
  getTotalPriceById: state => id => {
    const item = state.items.find(product => product.id === id);
    return item ? item.totalPrice : 0;
  }
};

// actions
const actions = {
  // 结算 现在用不到
  checkout({ commit, state }, products) {
    const savedCartItems = [...state.items];
    // empty cart
    commit("clearnCart");
  },

  changeQuantityById({ state, commit }, { id, quantity }) {
    const cartItem = state.items.find(item => item.id === id);
    // 购物车不存在商品 并且新增数量为正, 则调用添加商品到购物车mutations
    if (!cartItem && quantity > 0) {
      commit("pushProductToCart", { id, quantity });
    } else if (cartItem.quantity + quantity <= 0) {
      // 商品数量与输入数量之和小于0, 则从购物车中删除该项
      commit("popProductToCart", id);
    } else {
      commit("changeItemQuantity", { id, quantity });
    }
  }
};

// mutations
const mutations = {
  // 从购物车列表中删除
  popProductToCart(state, id) {
    state.items = state.items.filter(item => item.id !== id);
  },

  // 添加ID和数量到购物车列表
  pushProductToCart(state, { id, quantity = 1 }) {
    state.items.push({
      id,
      quantity
    });
  },

  // 库存操作
  changeItemQuantity(state, { id, quantity = 1 }) {
    const cartItem = state.items.find(item => item.id === id);
    cartItem.quantity += quantity;
  },

  clearnCart(state) {
    state.items = [];
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
