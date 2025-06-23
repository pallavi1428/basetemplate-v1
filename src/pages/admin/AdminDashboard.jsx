import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useContext } from 'react';
import myContext from '../../context/myContext';
import ProductDetail from '../../components/admin/ProductDetail';
import OrderDetail from '../../components/admin/OrderDetail';
import UserDetail from '../../components/admin/UserDetail';

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem('users')) || {};
    const { getAllProduct = [], getAllOrder = [], getAllUser = [] } = useContext(myContext);

    const stats = [
        {
            title: "Total Products",
            count: getAllProduct.length,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={50} height={50} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 11 4-7" /><path d="m19 11-4-7" /><path d="M2 11h20" />
                    <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8c.9 0 1.8-.7 2-1.6l1.7-7.4" />
                    <path d="m9 11 1 9" /><path d="M4.5 15.5h15" /><path d="m15 11-1 9" />
                </svg>
            )
        },
        {
            title: "Total Order",
            count: getAllOrder.length,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={50} height={50} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <line x1={10} x2={21} y1={6} y2={6} /><line x1={10} x2={21} y1={12} y2={12} /><line x1={10} x2={21} y1={18} y2={18} />
                    <path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                </svg>
            )
        },
        {
            title: "Total User",
            count: getAllUser.length,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={50} height={50} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx={9} cy={7} r={4} />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            )
        }
    ];

    return (
        <div className="px-5 mt-5 space-y-5 min-h-screen">
            {/* Admin Header */}
            <div className="bg-pink-50 py-5 border border-pink-100 rounded-lg">
                <h1 className="text-center text-2xl font-bold text-pink-500">Admin Dashboard</h1>
            </div>

            {/* Admin Profile */}
            <div className="bg-pink-50 py-5 rounded-xl border border-pink-100">
                <div className="flex justify-center">
                    <img
                        src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png"
                        alt="Admin avatar"
                        className="h-20 w-20 rounded-full border border-gray-200 object-cover"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                    />
                </div>
                <div className="space-y-2 mt-4 text-center">
                    <h1 className="text-lg"><span className="font-bold">Name: </span>{user.name || "N/A"}</h1>
                    <h1 className="text-lg"><span className="font-bold">Email: </span>{user.email || "N/A"}</h1>
                    <h1 className="text-lg"><span className="font-bold">Date: </span>{user.date || "N/A"}</h1>
                    <h1 className="text-lg"><span className="font-bold">Role: </span>{user.role || "N/A"}</h1>
                </div>
            </div>

            {/* Stats Tabs */}
            <Tabs selectedTabClassName="ring-2 ring-pink-300 rounded-xl">
                <TabList className="flex flex-wrap justify-center gap-4">
                    {stats.map((stat, index) => (
                        <Tab
                            key={index}
                            className="cursor-pointer w-full sm:w-1/2 md:w-1/3 lg:w-1/4 focus:outline-none"
                        >
                            <div className="border bg-pink-50 hover:bg-pink-100 border-pink-100 p-4 rounded-xl transition-colors">
                                <div className="text-pink-500 w-12 h-12 mb-3 mx-auto">
                                    {stat.icon}
                                </div>
                                <h2 className="text-3xl font-medium text-pink-400 text-center">
                                    {stat.count}
                                </h2>
                                <p className="text-pink-500 font-bold text-center">
                                    {stat.title}
                                </p>
                            </div>
                        </Tab>
                    ))}
                </TabList>

                <TabPanel>
                    <ProductDetail />
                </TabPanel>
                <TabPanel>
                    <OrderDetail />
                </TabPanel>
                <TabPanel>
                    <UserDetail />
                </TabPanel>
            </Tabs>
        </div>
    );
};

export default AdminDashboard;
