import { axiosWrapper } from "./axiosWrapper";

const api = {
  login: async (data) => {
    try {
      const res = await axiosWrapper.post("/api/user/login", data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  register: async (data) => {
    try {
      const res = await axiosWrapper.post("/api/user/register", data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getUserData: async () => {
    try {
      const res = await axiosWrapper.get("/api/user/me");
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: async () => {
    try {
      const res = await axiosWrapper.post("/api/user/logout");
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUsers: async ({ search = "", page = 1, limit = 10 }) => {
    try {
      const res = await axiosWrapper.get(`/api/user/?search=${search}&page=${page}&limit=${limit}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateUser: async (id, data) => {
    try {
      const res = await axiosWrapper.put(`/api/user/${id}`, data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteUser: async (id) => {
    try {
      const res = await axiosWrapper.delete(`/api/user/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addArea: async (data) => {
    try {
      const res = await axiosWrapper.post("/api/area/", data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAreas: async () => {
    try {
      const res = await axiosWrapper.get("/api/area");
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addTable: async (data) => {
    try {
      const res = await axiosWrapper.post("/api/table/", data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getTablesByStatus: async (status) => {
    try {
      const res = await axiosWrapper.get(`/api/table/status/${status}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getTables: async () => {
    try {
      const res = await axiosWrapper.get("/api/table");
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getTableById: async (id) => {
    try {
      const res = await axiosWrapper.get(`/api/table/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  updateTable: async ({ id, ...updateFields }) => {
    try {
      if (!id || typeof id !== "string") {
        throw new Error("ID không hợp lệ hoặc bị thiếu");
      }
      const res = await axiosWrapper.put(`/api/table/${id}`, updateFields);
      return res.data;
    } catch (error) {
      console.error("Error in updateTable:", error);
      throw error.response?.data || error;
    }
  },

  deleteTable: async (id) => {
    try {
      const res = await axiosWrapper.delete(`/api/table/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  switchTable: async (fromTableId, toTableId) => {
    try {
      const res = await axiosWrapper.post("/api/table/switch", { fromTableId, toTableId });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  mergeTables: async (tableIds, targetTableId) => {
    try {
      const res = await axiosWrapper.post("/api/table/merge", { tableIds, targetTableId });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createOrderRazorpay: async (data) => {
    try {
      const res = await axiosWrapper.post("/api/payment/create-order", data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  verifyPaymentRazorpay: async (data) => {
    try {
      const res = await axiosWrapper.post("/api/payment/verify-payment", data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addOrder: async (data) => {
    try {
      const res = await axiosWrapper.post("/api/order/", data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getOrders: async () => {
    try {
      const res = await axiosWrapper.get("/api/order");
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },


  getOrderById: async (orderId) => {
    try {
      const res = await axiosWrapper.get(`/api/order/${orderId}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getOrderByTableId: async (tableId) => {
    try {
      const res = await axiosWrapper.get(`/api/order/by-table/${tableId}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  updateOrder: async ({ updateOrderId, orderPayload }) => {
    try {
      const res = await axiosWrapper.put(`/api/order/${updateOrderId}`, orderPayload);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateDishStatus: async ({orderId, turn, dishId, status}) => {
    try {
      const res = await axiosWrapper.put(`/api/order/${orderId}/turns/${turn}/items/${dishId}`, { status })
      return res.data;

    } catch (error) {
      throw error.response?.data || error;

    }
  },


  getReservations: async ({ search = "", page = 1, limit = 10, date = "" }) => {
    try {
      const res = await axiosWrapper.get(`/api/reservations?search=${search}&page=${page}&limit=${limit}&date=${date}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createReservation: async (reservationData) => {
    try {
      const response = await axiosWrapper.post("/api/reservations", reservationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  updateReservation: async (id, data) => {
    try {
      const res = await axiosWrapper.put(`/api/reservations/${id}`, data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  deleteReservation: async (id) => {
    try {
      const res = await axiosWrapper.delete(`/api/reservations/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Category APIs
  addCategory: async (data) => {
    try {
      const res = await axiosWrapper.post("/api/category", data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getCategories: async ({ page = 1, limit = 10, search = "", type = "", menuType = "" } = {}) => {
    try {
      const res = await axiosWrapper.get("/api/category", {
        params: {
          page,
          limit,
          search,
          type,      // "menu" hoặc "ingredient"
          menuType,  // "buffet", "combo", "alacart" nếu cần lọc sâu hơn
        },
      });
      return res.data; // { categories: [...], totalPages, totalItems }
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  

  updateCategory: async (id, data) => {
    try {
      const res = await axiosWrapper.put(`/api/category/${id}`, data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const res = await axiosWrapper.delete(`/api/category/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Upload ảnh món ăn (image) riêng biệt
  uploadDishImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await axiosWrapper.post("/api/upload/", formData);

      return res.data; // Thường server trả về đường dẫn ảnh đã upload
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Dish APIs
  addDish: async (data) => {
    try {
      const res = await axiosWrapper.post("/api/dishes", data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getDishes: async ({ search = "", page = 1, limit = 10, category = "" } = {}) => {
    try {
      const res = await axiosWrapper.get("/api/dishes", {
        params: { search, page, limit, category },
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getDishById: async (id) => {
    try {
      const res = await axiosWrapper.get(`/api/dishes/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getDishesByIds: async (ids) => {
    try {
      const res = await axiosWrapper.post("/api/dishes/by-ids", { ids });
      return res.data.dishes;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateDish: async (id, data) => {
    try {
      const res = await axiosWrapper.put(`/api/dishes/${id}`, data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteDish: async (id) => {
    try {
      const res = await axiosWrapper.delete(`/api/dishes/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // ===== Ingredient APIs =====
  createIngredient: async (data) => {
    try {
      const res = await axiosWrapper.post("/api/ingredients", data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getIngredients: async (params) => {
    try {
      const res = await axiosWrapper.get("/api/ingredients", { params });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getIngredientById: async (id) => {
    try {
      const res = await axiosWrapper.get(`/api/ingredients/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateIngredient: async (id, data) => {
    try {
      const res = await axiosWrapper.put(`/api/ingredients/${id}`, data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteIngredient: async (id) => {
    try {
      const res = await axiosWrapper.delete(`/api/ingredients/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getMetricsByMonth: async (params) => {
    try {
      const res = await axiosWrapper.get("/api/metrics", { params });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  decreaseStock: async (items) => {
    try {
      const res = await axiosWrapper.post("/api/ingredients/decrease-stock", {
        items, 
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
};

export default api;
