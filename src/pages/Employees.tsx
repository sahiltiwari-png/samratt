
import { useState } from "react";
import EmployeeList from "@/components/employees/EmployeeList";


const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
  <div className="p-6 overflow-x-hidden">
      {/* Only the EmployeeList table will be scrollable, not the page */}
      <EmployeeList searchTerm={searchTerm} />
    </div>
  );
};

export default Employees;