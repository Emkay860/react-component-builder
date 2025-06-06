// src/pages/GeneratedTestPage.tsx
import React from "react";
import GeneratedComponent from "../components/GeneratedComponent";
import type { DroppedItem } from "../types";

interface GeneratedTestPageProps {
  items: DroppedItem[];
}

const GeneratedTestPage: React.FC<GeneratedTestPageProps> = ({ items }) => {
  return (
    <div className="min-h-screen w-[99vw] flex flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-black">
        Test Generated Component
      </h1>
      <div className="w-[99vw]">
        <GeneratedComponent items={items} />
      </div>
    </div>
  );
};

export default GeneratedTestPage;








// const GeneratedTestPage: React.FC<GeneratedTestPageProps> = ({ items }) => {
//   return (
//     <div className="min-h-screen w-[99vw] flex flex-col items-center justify-center p-8 bg-gray-50">
//       <h1 className="text-2xl font-bold mb-6 text-black">
//         Test Generated Component
//       </h1>
//       <div className="w-full">
//         <GeneratedComponent items={items} />
//       </div>
//     </div>
//   );
// };