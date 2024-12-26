"use client";
import { useState } from "react";

const TwoWayAnova = () => {
  const [data, setData] = useState<string>(""); // Ввод данных пользователем
  const [result, setResult] = useState<null | {
    factorA: number;
    factorB: number;
    interaction: number;
    conclusion: string;
  }>(null);

  const calculateTwoWayAnova = () => {
    try {
      // Парсинг данных
      const rows = data
        .trim()
        .split("\n")
        .map((row) =>
          row
            .trim()
            .split(",")
            .map((v) => parseFloat(v.trim()))
        );

      // Проверка структуры данных
      if (rows.length !== 6 || rows.some((row) => row.length !== 3)) {
        throw new Error("Неверный формат данных");
      }

      // Группировка данных по факторам
      const groups = {
        A1B1: rows[0],
        A2B1: rows[1],
        A3B1: rows[2],
        A1B2: rows[3],
        A2B2: rows[4],
        A3B2: rows[5],
      };

      // Все данные в одном массиве
      const allData = Object.values(groups).flat();

      // Общая средняя
      const grandMean =
        allData.reduce((sum, value) => sum + value, 0) / allData.length;

      // Средние по уровням факторов
      const meanA = [
        [...groups.A1B1, ...groups.A1B2].reduce(
          (sum, value) => sum + value,
          0
        ) /
          (groups.A1B1.length + groups.A1B2.length),
        [...groups.A2B1, ...groups.A2B2].reduce(
          (sum, value) => sum + value,
          0
        ) /
          (groups.A2B1.length + groups.A2B2.length),
        [...groups.A3B1, ...groups.A3B2].reduce(
          (sum, value) => sum + value,
          0
        ) /
          (groups.A3B1.length + groups.A3B2.length),
      ];
      const meanB = [
        [...groups.A1B1, ...groups.A2B1, ...groups.A3B1].reduce(
          (sum, value) => sum + value,
          0
        ) /
          (groups.A1B1.length + groups.A2B1.length + groups.A3B1.length),
        [...groups.A1B2, ...groups.A2B2, ...groups.A3B2].reduce(
          (sum, value) => sum + value,
          0
        ) /
          (groups.A1B2.length + groups.A2B2.length + groups.A3B2.length),
      ];

      // Межгрупповая сумма квадратов для факторов A и B
      const ssA =
        groups.A1B1.length *
        meanA.reduce((sum, mean) => sum + Math.pow(mean - grandMean, 2), 0);
      const ssB =
        groups.A1B1.length *
        meanB.reduce((sum, mean) => sum + Math.pow(mean - grandMean, 2), 0);

      // Сумма квадратов взаимодействия
      const ssInteraction = Object.values(groups).reduce(
        (sum, group, index) => {
          const meanAB = group.reduce((s, v) => s + v, 0) / group.length;
          return (
            sum +
            group.length *
              Math.pow(
                meanAB -
                  (meanA[Math.floor(index / 2)] + meanB[index % 2] - grandMean),
                2
              )
          );
        },
        0
      );

      // Остаточная сумма квадратов
      const ssTotal = allData.reduce(
        (sum, value) => sum + Math.pow(value - grandMean, 2),
        0
      );
      const ssError = ssTotal - ssA - ssB - ssInteraction;

      // Степени свободы
      const dfA = 2;
      const dfB = 1;
      const dfInteraction = 2;
      const dfError = allData.length - 6;

      // F-статистики
      const fA = ssA / dfA / (ssError / dfError);
      const fB = ssB / dfB / (ssError / dfError);
      const fInteraction = ssInteraction / dfInteraction / (ssError / dfError);

      // Вывод результатов
      setResult({
        factorA: fA,
        factorB: fB,
        interaction: fInteraction,
        conclusion: "Интерпретация требует таблицы F-критических значений.",
      });
    } catch {
      alert("Ошибка: проверьте формат данных.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Двухфакторный дисперсионный анализ (Two-Way ANOVA)
        </h1>
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full h-48 p-2 border border-gray-300 rounded-md"
          placeholder="Введите данные в формате: каждая группа с новой строки, значения через запятую.\nПример:\n530,540,550\n490,510,520\n430,420,450\n600,620,580\n550,540,560\n470,460,430"
        />
        <button
          onClick={calculateTwoWayAnova}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Рассчитать ANOVA
        </button>
        {result && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-300 rounded-md">
            <p className="text-lg">
              <strong>F-фактор A:</strong> {result.factorA.toFixed(2)}
            </p>
            <p className="text-lg">
              <strong>F-фактор B:</strong> {result.factorB.toFixed(2)}
            </p>
            <p className="text-lg">
              <strong>F-взаимодействие:</strong> {result.interaction.toFixed(2)}
            </p>
            <p className="text-lg">
              <strong>Заключение:</strong> {result.conclusion}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoWayAnova;
