import React, { useState } from "react";
import Item1 from "../../assets/images/menu/menu-item-1.png";
import Item2 from "../../assets/images/menu/menu-item-2.png";
import Item3 from "../../assets/images/menu/menu-item-3.png";
import Item4 from "../../assets/images/menu/menu-item-4.png";
import Item5 from "../../assets/images/menu/menu-item-5.png";
import Item6 from "../../assets/images/menu/menu-item-6.png";

const menuData = {
  starters: [
    {
      img: Item1,
      title: "Magnam Tiste",
      ingredients: "Lorem, deren, trataro, filede, nerada",
      price: "$5.95",
    },
    {
      img: Item2,
      title: "Aut Luia",
      ingredients: "Lorem, deren, trataro, filede, nerada",
      price: "$14.95",
    },
    {
      img: Item3,
      title: "Est Eligendi",
      ingredients: "Lorem, deren, trataro, filede, nerada",
      price: "$8.95",
    },
    {
      img: Item4,
      title: "Eos Luibusdam",
      ingredients: "Lorem, deren, trataro, filede, nerada",
      price: "$12.95",
    },
    {
      img: Item5,
      title: "Eos Luibusdam",
      ingredients: "Lorem, deren, trataro, filede, nerada",
      price: "$12.95",
    },
    {
      img: Item6,
      title: "Laboriosam Direva",
      ingredients: "Lorem, deren, trataro, filede, nerada",
      price: "$9.95",
    },
  ],
  breakfast: [
    {
      img: Item2,
      title: "Morning Delight",
      ingredients: "Eggs, Toast, Coffee",
      price: "$7.95",
    },
    {
      img: Item5,
      title: "Pancake Set",
      ingredients: "Pancakes, Maple Syrup, Fruit",
      price: "$9.95",
    },
  ],
  lunch: [
    {
      img: Item3,
      title: "Grilled Chicken",
      ingredients: "Chicken, Rice, Vegetables",
      price: "$11.95",
    },
    {
      img: Item4,
      title: "Pasta Primavera",
      ingredients: "Pasta, Fresh Veggies",
      price: "$10.50",
    },
  ],
  dinner: [
    {
      img: Item6,
      title: "Steak Dinner",
      ingredients: "Steak, Mashed Potatoes, Greens",
      price: "$15.95",
    },
    {
      img: Item1,
      title: "Seafood Combo",
      ingredients: "Shrimp, Fish, Calamari",
      price: "$17.95",
    },
  ],
};

const MenuSection = () => {
  const [activeTab, setActiveTab] = useState("starters");
  const getMenuItems = (key) => menuData[key]?.length ? menuData[key] : [];

  return (
    <section id="menu" className="menu section py-16 bg-white">
      <div className="container mx-auto text-center mb-12" data-aos="fade-up">
        <h2 className="text-3xl font-semibold mb-2">Menu</h2>
        <p className="text-lg">
          
          <span className="text-gray-700"><span className="font-semibold text-yellow-500">Yummy</span> có gì? </span>
        </p>
      </div>

      <div className="container mx-auto">
        <ul
          className="flex justify-center space-x-8 mb-10 border-b border-gray-300"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {["starters", "breakfast", "lunch", "dinner"].map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-lg font-medium ${
                  activeTab === tab
                    ? "border-b-4 border-yellow-400 text-yellow-500"
                    : "text-gray-600 hover:text-yellow-500"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>

        <div data-aos="fade-up" data-aos-delay="200">
          <div className="text-center mb-12">
            <p className="text-yellow-500 uppercase tracking-widest">Menu</p>
            <h3 className="text-2xl font-semibold capitalize">{activeTab}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {getMenuItems(activeTab).length === 0 ? (
              <p className="text-gray-500 text-center col-span-3">
                No items available for this category.
              </p>
            ) : (
              getMenuItems(activeTab).map(({ img, title, ingredients, price }, i) => (
                <div key={i} className="menu-item text-center">
                  <a href={img} className="block mb-4" target="_blank" rel="noreferrer">
                    <img
                      src={img}
                      alt={title}
                      className="w-full h-auto p-12 object-cover rounded-lg"
                    />
                  </a>
                  <h4 className="text-xl font-semibold mb-1">{title}</h4>
                  <p className="text-gray-600 mb-2">{ingredients}</p>
                  <p className="text-yellow-500 font-bold text-2xl">{price}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { MenuSection };
