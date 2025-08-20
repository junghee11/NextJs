'use client';

import { useState } from 'react';
import QuantityInput from './QuantityInput';
import PurchaseButton from './PurchaseButton';
import AddToCartButton from './AddToCartButton';
import WishButton from './WishButton';

interface GoodsActionsProps {
  goodsCode: string;
  goodsName: string;
  price: number;
}

export default function GoodsActions({ goodsCode, goodsName, price }: GoodsActionsProps) {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  return (
    <>
      <div style={{ marginTop: '16px' }}>
        <QuantityInput onChange={handleQuantityChange} />
      </div>
      <div style={{ marginTop: '16px' }}>
        <PurchaseButton 
          goodsCode={goodsCode} 
          goodsName={goodsName}
          price={price}
          count={quantity}
        />
        <AddToCartButton goodsCode={goodsCode} count={quantity} goodsName={goodsName} />
        <WishButton goodsCode={goodsCode} goodsName={goodsName} />
      </div>
    </>
  );
}