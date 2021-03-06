import React, { useEffect, useState } from "react";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaCheck,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import OrderRequest from "../../Request/OrderRequest";
import AdminButton from "./AdminButton";
import AdminInput from "./AdminInput";

function PageNavigator({ setFilter, filter, totalOrder }) {
  const [maxPage, setMaxPage] = useState(0);

  useEffect(() => {
    setMaxPage(Math.ceil(totalOrder / filter.limit));
  }, [totalOrder, filter]);

  return (
    <div className="flex flex-col justify-between w-full">
      <div className="text-gray-500 flex flex-row gap-4">
        <button
          className={`cursor-pointer ${filter.page === 1 ? "opacity-50" : ""
            } transition-all ease-linear hover:bg-gray-300 p-2 rounded-3xl`}
          onClick={() => {
            if (filter.page > 1) setFilter({ ...filter, page: 1 });
          }}
        >
          <FaAngleDoubleLeft />
        </button>
        <button
          className={`cursor-pointer ${filter.page === 1 ? "opacity-50" : ""
            } transition-all ease-linear hover:bg-gray-300 p-2 rounded-3xl`}
          onClick={() => {
            if (filter.page > 1)
              setFilter({ ...filter, page: filter.page - 1 });
          }}
        >
          <FaAngleLeft />
        </button>
        {/* <span className="font-extrabold cursor-default">{filter.page}</span> */}
        <div className="overflow-x-scroll block whitespace-nowrap">
          {Array(maxPage)
            .fill(0)
            // limit 6 items from - page to page

            // take limit of 6 from current page
            .map((_, index) => {
              if (index < filter.page - 3 || index > filter.page + 3)
                return null;
              return (
                <button
                  key={index}
                  className={`cursor-pointer ${filter.page === index + 1 ? "opacity-50 font-extrabold" : ""
                    } transition-all ease-linear hover:bg-gray-300 rounded-3xl p-2`}
                  onClick={() => {
                    if (filter.page !== index + 1)
                      setFilter({ ...filter, page: index + 1 });
                  }}
                >
                  {index + 1}
                </button>
              );
            })}
        </div>
        <button
          className={`cursor-pointer ${filter.page === maxPage ? "opacity-50" : ""
            } transition-all ease-linear hover:bg-gray-300 p-2 rounded-3xl`}
          onClick={() => {
            if (filter.page < maxPage) {
              setFilter({ ...filter, page: filter.page + 1 });
            }
          }}
        >
          <FaAngleRight />
        </button>
        <button
          className={`cursor-pointer ${filter.page === maxPage ? "opacity-50" : ""
            } transition-all ease-linear hover:bg-gray-300 p-2 rounded-3xl`}
          onClick={() => {
            if (filter.page < maxPage) {
              setFilter({ ...filter, page: maxPage });
            }
          }}
        >
          <FaAngleDoubleRight />
        </button>
      </div>
    </div>
  );
}

function AdminOrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalDeliveredAmount, setTotalDeliveredAmount] = useState(0);
  const [filter, setFilter] = useState({
    limit: 10,
    // offset: 0,
    page: 1,
    // status: "",
    _id: "",
  });

  useEffect(() => {
    setLoading(true);
    OrderRequest.getOrders(
      filter.limit,
      (filter.page - 1) * filter.limit,
      filter._id
    )
      .then((response) => {
        setOrders(response.orders);
        setTotalOrder(response.totalOrder);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filter]);

  useEffect(() => {
    OrderRequest.getIncomeDelivered().then((response) => {
      setTotalDeliveredAmount(response.totalDeliveredIncome);
    });
  }, []);

  const handleConfirm = (id) => {
    // If is pending,
    // then confirm
    // else
    // then delivered

    const order = orders.find((order) => order._id === id);
    setOrderStatus(id, order.status === "pending" ? "confirmed" : "delivered");
    if (order.status !== "delivered") {
      toast.success("Order status updated");
    }
    if (order.status === "confirmed") {
      setTotalDeliveredAmount(
        Number.parseInt(totalDeliveredAmount) + order.amount
      );
    }
  };

  const handleDelete = (id) => {
    OrderRequest.deleteOrder(id)
      .then((response) => {
        toast.success(response);
        // console.log(response.data);
        setOrders(orders.filter((order) => order._id !== id));
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const setOrderStatus = (id, status) => {
    OrderRequest.updateOrder(id, status).then((_response) => {
      // console.log(_response);
      // toast.success("Order status updated");
      setOrders(
        orders.map((order) => {
          if (order._id === id) {
            order.status = status;
          }
          return order;
        })
      );
    });
  };

  return (
    <div>
      {/* Header */}
      <div
        className="ml-3 mt-1 flex flex-col md:flex-row p-3 justify-start 
          md:justify-start md:items-stretch items-start gap-5 md:gap-8"
      >
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <div>
            <AdminInput
              placeholder="Search by order ID"
              onChange={(v) => {
                // console.log(v);
                setFilter({ ...filter, _id: v });
              }}
            />
          </div>
        </div>
        <div className="">
          <div className="text-gray-500 italic">Delivered</div>
          <span className="font-bold text-2xl">$ {totalDeliveredAmount}</span>
        </div>
      </div>

      <PageNavigator
        filter={filter}
        setFilter={setFilter}
        totalOrder={totalOrder}
      />

      {/* Body */}
      <div className="mx-3 my-8">
        {loading ? (
          <div className="text text-3xl text-center font-extrabold text-gray-600">
            <div>Loading...</div>
          </div>
        ) : (
          orders.length > 0 &&
          orders.map((order, index) => {
            return (
              // Wrapper
              <div key={index} className="flex flex-col mb-6">
                {/* Information */}
                <div className="flex flex-col lg:flex-row w-full border p-4 rounded bg-gray-100 content-start justify-start ">
                  {/* General Information */}
                  <div className="w-full lg:w-4/5">
                    <div className="text-zinc-400 font-semibold text-lg mb-3">
                      # {order._id}
                    </div>
                    <div className="text-zinc-900 font-bold text-xl">
                      {order.userId.username}
                    </div>
                    <div>{order.userId.email}</div>
                    <div>{typeof (order.address) === 'string' ? order.address : <>{
                      order.address["Stress address"]
                    }, {order.address["City"]}, {order.address["State"]}</>}</div>
                    <div>{order.phone}</div>
                  </div>
                  {/* Status */}
                  <div className="mt-3 lg:flex lg:flex-col w-full lg:w-2/5 text-left">
                    <div className="text-gray-700 content-start">status</div>
                    <div className="text-zinc-700 font-bold text-xl">
                      {order.status}
                    </div>
                  </div>
                  {/* Amount */}
                  <div className="mt-3 lg:flex lg:flex-col justify-start align-middle text-left w-full lg:w-2/5">
                    <div className="text-gray-700">amount</div>
                    <div className="text-zinc-700 font-bold text-xl">
                      $ {order.amount}
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex flex-row gap-2">
                    <AdminButton
                      text={<FaTrash />}
                      level={"rounded-outline-danger"}
                      alt={`Delete order #${order._id}`}
                      onClick={() => handleDelete(order._id)}
                    />
                    <AdminButton
                      text={<FaCheck />}
                      level={"rounded-outline-success"}
                      alt={"Confirm order"}
                      onClick={() => handleConfirm(order._id)}
                      disabled={order.status === "delivered"}
                    />
                  </div>
                </div>

                {/* Products */}
                <div className="flex flex-col w-full border-t-0 border p-4 rounded hover:bg-gray-100 px-12 lg:px-40 justify-start align-middle">
                  {order.products &&
                    order.products.length > 0 &&
                    order.products.map((product, _index) => {
                      return (
                        <div key={_index} className="mb-2 w-full">
                          <div className="flex flex-row">
                            <span className="text-gray-500">
                              {product.productId && product.productId.title}
                            </span>
                            <span className="font-bold text-zinc-900">
                              x {product.quantity}
                            </span>
                          </div>

                          <div></div>
                          <div>
                            ${" "}
                            {product.productId &&
                              (
                                product.productId.price * product.quantity
                              ).toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <PageNavigator
        filter={filter}
        setFilter={setFilter}
        totalOrder={totalOrder}
      />
    </div>
  );
}

export default AdminOrderManager;
