import { useContext, useEffect } from "react";
import myContext from "../../context/myContext";

const OrderDetail = () => {
    const context = useContext(myContext);
    const { orderList, getAllOrders } = context;

    useEffect(() => {
        getAllOrders();
    }, []);

    return (
        <div>
            <div className="py-5">
                <h1 className="text-xl text-pink-300 font-bold">All Orders</h1>
            </div>

            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border border-collapse sm:border-separate border-pink-100 text-pink-400">
                    <thead>
                        <tr>
                            {["S.No.", "Order ID", "User Email", "Items", "Total Amount", "Date"].map((header, idx) => (
                                <th key={idx} className="h-12 px-6 text-md border-pink-100 text-slate-700 bg-slate-100 font-bold">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {orderList.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            orderList.map((order, index) => (
                                <tr key={order.id} className="text-pink-300">
                                    <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500">
                                        {index + 1}
                                    </td>
                                    <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500">
                                        {order.id}
                                    </td>
                                    <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500">
                                        {order.email}
                                    </td>
                                    <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500">
                                        {order.items?.map(item => item.name).join(", ")}
                                    </td>
                                    <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500">
                                        ₹{order.total}
                                    </td>
                                    <td className="h-12 px-6 text-md border-t border-pink-100 text-slate-500">
                                        {new Date(order.date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderDetail;
