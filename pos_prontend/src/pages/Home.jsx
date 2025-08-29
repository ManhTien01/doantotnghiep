import React, { useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/home/Greetings";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import MiniCard from "../components/home/MiniCard";
import RecentOrders from "../components/home/RecentOrders";
import PopularDishes from "../components/home/PopularDishes";
import { useDashboardStats } from "../hooks/useDashboardStats";

const Home = () => {
  const { data, isLoading } = useDashboardStats();

  // Gọi useEffect luôn ở đầu component, không nằm trong điều kiện nào
  useEffect(() => {
    document.title = "POS | Home";
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <section className="bg-[#1f1f1f] min-h-[calc(100vh-5rem)] overflow-hidden flex flex-col md:flex-row gap-4 md:gap-3 px-4 md:px-6 pb-20">
      {/* Left Div */}
      <div className="flex-[3] flex flex-col">
        <Greetings />

        <div className="flex flex-col-2 sm:flex-row items-start sm:items-center gap-3 w-full mt-4">
          <MiniCard title="Doanh thu" icon={<BsCashCoin />} number={data?.todayRevenue} footerNum={data?.footnum?.revenue} />
          <MiniCard title="Số hoá đơn" icon={<GrInProgress />} number={data?.todayCount} footerNum={data?.footnum?.orderCount} />
        </div>

        <RecentOrders />
      </div>

      {/* Right Div */}
      <div className="flex-[2] flex flex-col mt-6 md:mt-0">
        <PopularDishes />
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </section>
  );
};

export default Home;
