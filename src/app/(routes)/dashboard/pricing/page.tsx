import { PricingTable } from "@clerk/nextjs";
import React from "react";

function Billing() {
  return (
    <div className="container mx-auto max-w-4xl p-4 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Pricing Plans</h1>
      <PricingTable />
    </div>
  );
}

export default Billing;
