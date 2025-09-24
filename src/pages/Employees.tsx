
import { useState } from "react";
import { EmployeeList } from "@/components/employees/EmployeeList";


const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="p-6">
      <EmployeeList searchTerm={searchTerm} />
    </div>
  );
};

export default Employees;