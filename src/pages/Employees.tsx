
import { useState } from "react";
import EmployeeList from "@/components/employees/EmployeeList";


const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background:
          "linear-gradient(151.95deg, rgba(76, 220, 156, 0.81) 17.38%, rgba(255, 255, 255, 0.81) 107.36%)",
      }}
    >
      <div className="px-3 md:px-6 py-6 max-w-[1200px] mx-auto">
        {/* Filters and heading are rendered above the table within EmployeeList's card */}
        <EmployeeList searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default Employees;