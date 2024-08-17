import CargoClientForm from "@/components/new-cargo-form.client";
import React from "react";

const NewCargoPage = () => {
  return (
    <div className=" flex place-content-center ">
      <div className="max-w-7xl w-full ">
        <CargoClientForm />
      </div>
    </div>
  );
};

export default NewCargoPage;
