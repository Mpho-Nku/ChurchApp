"use client";

import { useState, useEffect } from "react";

export default function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  const [isOn, setIsOn] = useState(checked);

  useEffect(() => setIsOn(checked), [checked]);

  const toggle = () => {
    const newVal = !isOn;
    setIsOn(newVal);
    onChange(newVal);

    // HAPTICS (iOS/Android)
    if (navigator.vibrate) navigator.vibrate(10);
  };

  return (
    <button
      onClick={toggle}
      className={`relative w-12 h-7 rounded-full transition-colors duration-200
        ${isOn ? "bg-blue-600" : "bg-gray-300"}
      `}
    >
      <span
        className={`
          absolute top-1 left-1 h-5 w-5 bg-white rounded-full shadow transition-transform
          ${isOn ? "translate-x-5" : ""}
        `}
      />
    </button>
  );
}
