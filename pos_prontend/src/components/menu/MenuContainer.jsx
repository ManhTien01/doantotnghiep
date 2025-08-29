import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";
import { setCurrentTurn, setIsOrderSaved } from "../../redux/slices/orderSlice";
import api from "../../https";

const MenuContainer = ({ currentTurn, menuType }) => {
  const [menus, setMenus] = useState([]);
  const [selected, setSelected] = useState(null);
  const [itemCounts, setItemCounts] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMenusWithDishes = async () => {
      try {
        // Lấy tất cả category loại "menu"
        const res = await api.getCategories({ type: "menu" });
        let categories = res.categories || [];

        // Lọc theo menuType nếu có
        if (menuType) {
          categories = categories.filter(cat => cat.menuType === menuType);
        }

        const allDishIds = categories.flatMap((cat) =>
          (cat.dishes || []).map((d) => (typeof d === "string" ? d : d._id))
        );

        const dishRes = await api.getDishesByIds(allDishIds);
        const dishes = dishRes || [];

        const dishMap = {};
        dishes.forEach((dish) => {
          dishMap[dish._id] = dish;
        });

        const categoriesWithDishes = categories
          .map((cat) => {
            const items = (cat.dishes || [])
              .map((d) => {
                const id = typeof d === "string" ? d : d._id;
                return dishMap[id];
              })
              .filter(Boolean);

            return { ...cat, items };
          })


        setMenus(categoriesWithDishes);
        setSelected(categoriesWithDishes[0]);
      } catch (err) {
        console.error("Lỗi khi load menu:", err);
      }
    };

    fetchMenusWithDishes();
  }, [menuType]);


  const increment = (id) => {
    setItemCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const decrement = (id) => {
    setItemCounts((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const handleQuantityChange = (id, value) => {
    const number = parseInt(value);
    if (!isNaN(number) && number >= 0) {
      setItemCounts((prev) => ({
        ...prev,
        [id]: number,
      }));
    }
  };

  const handleAddToCart = (item) => {
    const count = itemCounts[item._id] ?? 0;
    if (count <= 0) return;

    const newItem = {
      dish: item,
      quantity: count,
      status: "Đang chế biến",
      notes: "",
    };

    const payload = {
      turn: currentTurn + 1,
      time: new Date().toISOString(),
      items: [newItem],
    };

    dispatch(addItems(payload));
    dispatch(setCurrentTurn(currentTurn + 1));
    dispatch(setIsOrderSaved(false))
    setItemCounts((prev) => ({
      ...prev,
      [item._id]: 0,
    }));
  };

  return (
    <div className="w-full px-3 py-4 space-y-4 h-full flex flex-col">
      {/* Menu Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 h-28 sm:h-32">
        {menus.map((menu) => (
          <div
            key={menu._id}
            className={`flex flex-col justify-center items-center p-3 rounded-xl cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg ${selected?._id === menu._id ? "bg-yellow-500" : "bg-zinc-800"
              }`}
            onClick={() => setSelected(menu)}
          >
            <h1 className="text-white text-xs sm:text-sm font-semibold text-center line-clamp-2">
              {menu.name}
            </h1>
          </div>
        ))}
      </div>

      <hr className="border-gray-600" />

      {/* Items Grid */}
      <div className="overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-2 sm:px-4 py-4 w-full">
          {selected?.items
            ?.filter(item => item.isAvailable)
            .map((item) => (
              <div
                key={item._id}
                className="bg-[#1f1f1f] rounded-2xl shadow-md hover:shadow-lg hover:bg-[#2a2a2a] transition duration-300 p-4 flex flex-col"
              >
                <img
                  src={item.image || "/images/default-dish.png"}
                  alt={item.name}
                  className="w-full h-32 sm:h-36 object-cover rounded-xl mb-3 sm:mb-4"
                />
                <h2 className="text-white text-base sm:text-lg font-semibold mb-1 truncate">
                  {item.name}
                </h2>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-yellow-500 font-bold text-lg sm:text-xl whitespace-nowrap">
                    {item.price.toLocaleString()}đ
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-[#02942a] transition"
                    aria-label={`Thêm ${item.name} vào giỏ hàng`}
                  >
                    <FaShoppingCart size={18} />
                  </button>
                </div>

                {/* Ô nhập số lượng */}
                <div className="flex items-center justify-between bg-[#333] px-3 py-2 rounded-lg">
                  <button
                    onClick={() => decrement(item._id)}
                    className="text-yellow-500 text-2xl select-none"
                    aria-label={`Giảm số lượng ${item.name}`}
                  >
                    &minus;
                  </button>

                  <input
                    type="number"
                    min="0"
                    className="w-16 sm:w-20 text-center text-white bg-transparent outline-none"
                    value={itemCounts[item._id] || 0}
                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                    aria-label={`Số lượng ${item.name}`}
                  />

                  <button
                    onClick={() => increment(item._id)}
                    className="text-yellow-500 text-2xl select-none"
                    aria-label={`Tăng số lượng ${item.name}`}
                  >
                    &#43;
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default MenuContainer;
