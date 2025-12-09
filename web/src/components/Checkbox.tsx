import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import "./Checkbox.scss";
import type { CheckboxProps } from '../interface/Hud';

const Checkbox: FC<CheckboxProps> = ({ checked, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <label className="checkbox-container">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
      <span className="checkmark">
        <FontAwesomeIcon icon={faCheck} className="fa-check" />
      </span>
    </label>
  );
};

export default Checkbox;
