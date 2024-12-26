"use client";
import { useState } from "react";

export default function Analysis() {
  const [groups, setGroups] = useState<string>(""); // Ввод данных групп
  const [result, setResult] = useState<null | {
    fStatistic: number;
    pValue: string;
  }>(null); // Результаты анализа

  const calculateAnova = () => {
    try {
      const groupData = groups
        .split("\n")
        .map((line) => line.split(",").map((v) => parseFloat(v.trim())));

      const means = groupData.map(
        (group) => group.reduce((sum, val) => sum + val, 0) / group.length
      );
      const overallMean =
        groupData.flat().reduce((sum, val) => sum + val, 0) /
        groupData.flat().length;

      // Межгрупповая сумма квадратов (SSB)
      const ssb = groupData.reduce(
        (sum, group, i) =>
          sum + group.length * Math.pow(means[i] - overallMean, 2),
        0
      );
      console.log("ssb: ", ssb);
      console.log("means: ", means);
      console.log("groupData: ", groupData);

      // Внутригрупповая сумма квадратов (SSW)
      const ssw = groupData.reduce(
        (sum, group, i) =>
          sum +
          group.reduce((acc, val) => acc + Math.pow(val - means[i], 2), 0),
        0
      );
      console.log("ssw: ", ssw);

      const dfBetween = groupData.length - 1; // Степени свободы для межгрупповой вариации
      const dfWithin = groupData.flat().length - groupData.length; // Степени свободы для внутригрупповой вариации

      const msb = ssb / dfBetween; // Межгрупповая среднеквадратичная
      const msw = ssw / dfWithin; // Внутригрупповая среднеквадратичная

      const fStatistic = msb / msw; // F-статистика

      // Простая оценка p-значения (для реального анализа используйте scipy или статистический пакет)
      const pValue =
        fStatistic > 1.0
          ? "< 0.05 (возможное различие)"
          : "≥ 0.05 (различий нет)";

      setResult({ fStatistic, pValue });
    } catch {
      alert("Ошибка: проверьте формат данных");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Однофакторный дисперсионный анализ (ANOVA)
        </h1>
        <textarea
          value={groups}
          onChange={(e) => setGroups(e.target.value)}
          className="w-full h-32 p-2 border border-gray-300 rounded-md"
          placeholder="Введите группы данных через запятую. Каждая группа с новой строки.\nПример:\n1, 2, 3\n4, 5, 6\n7, 8, 9"
        />
        <button
          onClick={calculateAnova}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Рассчитать ANOVA
        </button>
        {result && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-300 rounded-md">
            <p className="text-lg">
              <strong>F-статистика:</strong> {result.fStatistic.toFixed(2)}
            </p>
            <p className="text-lg">
              <strong>P-значение:</strong> {result.pValue}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
