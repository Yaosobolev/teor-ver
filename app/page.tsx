"use client";

import { useState } from "react";
export default function Home() {
  const [nominalRate, setNominalRate] = useState<number | "">(0);
  const [inflationRate, setInflationRate] = useState<number | "">(0);
  const [realRate, setRealRate] = useState<number | null>(null);

  const calculateRealRate = () => {
    if (nominalRate !== "" && inflationRate !== "") {
      const r = (1 + nominalRate / 100) / (1 + inflationRate / 100) - 1;
      setRealRate(Number((r * 100).toFixed(2)));
    } else {
      setRealRate(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Уравнение Фишера
        </h1>
        <div className="mb-4">
          <label
            htmlFor="nominalRate"
            className="block text-sm font-medium text-gray-700"
          >
            Номинальная процентная ставка (%)
          </label>
          <input
            type="number"
            id="nominalRate"
            value={nominalRate}
            onChange={(e) => setNominalRate(Number(e.target.value))}
            className="mt-1 block w-full py-1 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Введите значение"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="inflationRate"
            className="block text-sm font-medium text-gray-700"
          >
            Уровень инфляции (%)
          </label>
          <input
            type="number"
            id="inflationRate"
            value={inflationRate}
            onChange={(e) => setInflationRate(Number(e.target.value))}
            className="mt-1 block w-full py-1 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Введите значение"
          />
        </div>
        <button
          onClick={calculateRealRate}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Рассчитать реальную ставку
        </button>
        {realRate !== null && (
          <div className="mt-4 text-center">
            <p className="text-lg">
              Реальная процентная ставка: <strong>{realRate}%</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
