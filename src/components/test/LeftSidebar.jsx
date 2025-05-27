import React from "react";
import { FaRegClock } from "react-icons/fa6";
import { getIcon } from "../../utils/iconMapping";

export default function LeftSidebar({ test, otherTests, onSelectTest }) {
  const TestIcon = getIcon(test.icon);

  return (
    <div className="bg-white p-6 rounded-lg h-140 shadow-md">
      <div className="flex items-center mb-4">
        <div className={`text-6xl mr-4 ${test.color}`}>
          <TestIcon />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{test.title}</h2>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center mt-4">
          <FaRegClock className="mr-2" size={18} />
          <span className="font-semibold mr-2"> Час:</span>
          <span className=" text-gray-600">{test.duration} хвилин</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2">Кількість питань:</span>
          <span className=" text-gray-600">{test.questions}</span>
        </div>
      </div>

      <div className="pt-4 mt-4">
        <h3 className="text-xl font-bold mb-2">Інші тести</h3>
        <div className="space-y-2">
          {otherTests.slice(0, 5).map((otherTest) => {
            const OtherTestIcon = getIcon(otherTest.icon);

            return (
              <div
                key={otherTest.id}
                className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => onSelectTest(otherTest)}
              >
                <div className={`mr-2 ${otherTest.color}`}>
                  <OtherTestIcon size={36} />
                </div>
                <span className=" text-lg">{otherTest.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
