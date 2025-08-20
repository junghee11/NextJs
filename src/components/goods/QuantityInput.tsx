'use client';

import { useState } from 'react';
import styles from '../../styles/goods/QuantityInput.module.css';

interface QuantityInputProps {
  initialValue?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}

export default function QuantityInput({ 
  initialValue = 1, 
  min = 1, 
  max = 10, 
  onChange 
}: QuantityInputProps) {
  const [quantity, setQuantity] = useState(initialValue);

  const handleIncrease = () => {
    if (quantity < max) {
      const newValue = quantity + 1;
      setQuantity(newValue);
      onChange?.(newValue);
    }
  };

  const handleDecrease = () => {
    if (quantity > min) {
      const newValue = quantity - 1;
      setQuantity(newValue);
      onChange?.(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= min && value <= max) {
      setQuantity(value);
      onChange?.(value);
    }
  };

  return (
    <div className={styles.quantityContainer}>
      <button 
        type="button"
        className={styles.quantityButton}
        onClick={handleDecrease}
        disabled={quantity <= min}
      >
        -
      </button>
      <input
        type="number"
        className={styles.quantityInput}
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
      />
      <button 
        type="button"
        className={styles.quantityButton}
        onClick={handleIncrease}
        disabled={quantity >= max}
      >
        +
      </button>
    </div>
  );
}