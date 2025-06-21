import React from 'react';
import { useCart } from './CartContext';

interface AddToCartButtonProps {
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
    type: 'book' | 'audiobook' | 'music';
  };
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, className = '' }) => {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        type: product.type
      }
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${className}`}
    >
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"></path>
      </svg>
      Add to Cart
    </button>
  );
};

export default AddToCartButton;

