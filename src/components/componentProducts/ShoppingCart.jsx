import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCart } from '../../redux/actions';
import * as Scroll from 'react-scroll'
const { Element } = Scroll;
import '../styles/Product.css';

export function ShoppingCart() {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://api.escuelajs.co/api/v1/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos de la API");
        }   
        return response.json();
      })
      .then((result) => setData(result))
      .catch((err) => setError(err.message));
  }, []);

  const handleIncrement = (productId) => {
    setQuantity((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const handleDecrement = (productId) => {
    setQuantity((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }));
  };

  const handleAddCart = (product) => {
    const qty = quantity[product.id] || 1;
    dispatch(addCart({ productId: product.id, name: product.title, price: product.price, quantity: qty }));
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Element name="productos">
        <h1 className='prdt'>PRODUCTOS</h1>
        <div className="product-list">
          {data.slice(0, 12).map((product) => (
            <div
              key={product.id}
              className="product-card"
              style={{ backgroundImage: `url(${product.images[0]})` }}
            >
              <div className="product-info">
                <h3>{product.title}</h3>
                <p>Precio: ${product.price}</p>
                <div className="quantity-controls">
                  <button onClick={() => handleDecrement(product.id)}>-</button>
                  <span>{quantity[product.id] || 1}</span>
                  <button onClick={() => handleIncrement(product.id)}>+</button>
                </div>
                <button onClick={() => handleAddCart(product)}>Añadir al carrito</button>
              </div>
            </div>
          ))}
        </div>
      </Element >
    </>
  );
}
