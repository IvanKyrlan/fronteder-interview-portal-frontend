import React from "react";

export default function InfoContent({ test, onStartTest }) {
  return (
    <div className="">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Опис тесту</h3>
        <p className="text-gray-600 text-md text-justify">
          Тут ви можете пройти тест для підготовки та перевірки своїх знань по{" "}
          <span className="font-semibold">{test.title}</span>. На тест
          виділяється фіксований проміжок часу, а також після закінчення тесту
          ви зможете переглянути результати та ознайомитися з вірними та
          невірними відповідями.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">
          Основні теми які розглядаються в тесті
        </h3>
        <p className="text-gray-600 text-md">{test.description}</p>
      </div>

      <div className="flex justify-left">
        <button
          onClick={onStartTest}
          className="px-10 py-3 rounded-md text-white bg-amber-600 hover:bg-amber-700 text-lg "
        >
          Почати тест
        </button>
      </div>
    </div>
  );
}
