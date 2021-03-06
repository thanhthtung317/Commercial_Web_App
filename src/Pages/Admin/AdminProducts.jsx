import React, { useEffect, useState } from "react";
import { FaMoneyBill } from "react-icons/fa";
import ProductRequest from "../../Request/ProductRequest";

import AdminButton from "./AdminButton";
import AdminProductEditModal from "./AdminProductEditModal";
import AdminCreateModal from "./AdminProductCreateModal";

const AdminProductItem = ({ product, ...children }) => {
  // console.log(product);
  return (
    <div className=" w-full  lg:w-1/3 mb-5 cursor-pointer px-3" {...children}>
      <img
        className="m-0 max-h-[200px] mx-auto"
        src={product.img}
        alt={product.name}
      />
      <div className="p-2 mx-3">
        <p className=" text-md font-bold">{product && product.title}</p>
        <div className="text-sm text-gray-400 inline-block">
          <span className="mr-3">
            <FaMoneyBill className="inline-block" />
          </span>
          <span>{product.price}</span>
        </div>
      </div>
    </div>
  );
};

function AdminProducts() {
  const [loading, setLoading] = useState(true);
  const [listProducts, setListProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentSelectedProduct, setCurrentSelectedProduct] = useState(null);
  const [createModelVisible, setCreateModelVisible] = useState(false);

  const [filter, setFilter] = useState({
    sortBy: "date_new",
    search: "",
    limit: 10,
    startPosition: 0,
    currentPosition: 0,
  });

  /**
   * Fetching all products function
   */
  useEffect(() => {
    setLoading(true);
    // Awaiting for fetch all products
    ProductRequest.getAllProducts()
      .then((response) => {
        // console.log(response.data);
        setListProducts(response);
      })
      .catch((err) => {
        alert(`Error: ${err}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /**
   * Filter products function
   */
  useEffect(() => {
    if (!listProducts) {
      return;
    }
    if (filter.sortBy === "date_new") {
      setFilteredProducts(
        listProducts.sort((a, b) => {
          return b.createdAt - a.createdAt;
        })
      );
    }
    if (filter.sortBy === "date") {
      // console.log(listProducts);

      setFilteredProducts(
        listProducts.sort((a, b) => {
          return b._id - a._id;
        })
      );
    }
    if (filter.sortBy === "name_a") {
      setFilteredProducts(
        listProducts.sort((a, b) => {
          if (a.title < b.title) {
            return -1;
          }
          if (a.title > b.title) {
            return 1;
          }
          return 0;
        })
      );
    }
    if (filter.sortBy === "name_d") {
      setFilteredProducts(
        listProducts.sort((a, b) => {
          if (a.title > b.title) {
            return -1;
          }
          if (a.title < b.title) {
            return 1;
          }
          return 0;
        })
      );
    }
    if (filter.search !== "") {
      setFilteredProducts(
        listProducts.filter((product) => {
          return product.title
            .toLowerCase()
            .includes(filter.search.toLowerCase());
        })
      );
    }
    // Size limit
    // setCurrentDisplaySize(filter.limit);
  }, [filter, listProducts]);

  return loading ? (
    <div className="text-center text-3xl font-bold my-16">
      Retrieving data...
    </div>
  ) : (
    <div>
      <div className="flex flex-row">
        <div className="font-bold text-2xl mx-3 mb-3 w-5/6">Products</div>
        <div className="">
          <AdminButton
            text="Create"
            level="primary"
            onClick={() => setCreateModelVisible(true)}
          />
        </div>
      </div>
      <div className="m-3 ">
        <div className="flex flex-col md:flex-row flex-wrap gap-3">
          <div className="w-2/5">
            <input
              className="py-1 border border-gray-200 px-4 w-full rounded-3xl"
              placeholder="Search for"
              onChange={(e) => {
                setFilter({ ...filter, search: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-row gap-4 flex-1">
            <span className="text-gray-500">Filter</span>
            <select
              className="py-1 border border-gray-200 px-2 w-full rounded-3xl"
              defaultValue={filter.sortBy}
              onChange={(v) => {
                setFilter({ ...filter, sortBy: v.target.value });
              }}
            >
              <option value="date_new">Newest</option>
              <option value={`date`}>Date (oldest)</option>
              <option value={`name_a`}>Name A-Z</option>
              <option value={`name_d`}>Name Z-A</option>
              <option>Cost [A-Z]</option>
            </select>
            <span className="text-gray-500">Display</span>
            <select
              className="py-1 border border-gray-200 px-2 w-full rounded-3xl"
              onChange={(e) => {
                const v = Number.parseInt(e.target.value);
                setFilter({ ...filter, limit: v });
              }}
            >
              <option>10</option>
              <option>20</option>
              <option>30</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>
      </div>
      {/* Product container wrapper */}
      <div className="flex flex-row flex-wrap">
        {filteredProducts &&
          filteredProducts
            .slice(filter.startPosition, filter.currentPosition + filter.limit)
            .map((product, index) => {
              return (
                <AdminProductItem
                  product={product}
                  key={product._id}
                  onClick={() => {
                    setCurrentSelectedProduct(product);
                    setModalVisible(true);
                  }}
                />
              );
            })}
      </div>

      {/* Footer */}

      <div className="text-center underline text-blue-500">
        {filter.currentPosition + filter.limit > filteredProducts.length ? (
          <></>
        ) : (
          <>
            <div
              className="p-2 cursor-pointer"
              onClick={() => {
                setFilter({
                  ...filter,
                  currentPosition: filter.currentPosition + filter.limit,
                });
              }}
            ></div>
          </>
        )}
      </div>

      <AdminProductEditModal
        visible={isModalVisible}
        product={currentSelectedProduct}
        onClose={() => {
          setModalVisible(false);
        }}
        onUpdateView={(updateItem) => {
          setListProducts(
            listProducts.map((item) => {
              if (item._id === updateItem._id) {
                return updateItem;
              }
              return item;
            })
          );
        }}
      />
      <AdminCreateModal
        visible={createModelVisible}
        onClose={() => setCreateModelVisible(false)}
      />
    </div>
  );
}

export default AdminProducts;
