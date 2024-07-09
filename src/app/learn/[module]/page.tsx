import React from "react";

interface PageProps {
  params: {
    module: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ModulePage({ params, searchParams }: PageProps) {
  console.log("Params:", params);
  console.log("SearchParams:", searchParams);
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Module Page</h1>
      <p>You are viewing the module: {params.module}</p>
    </>
  );
}

export async function generateStaticParams() {
  return [
    { slug: "budgeting-strategies" },
    { slug: "managing-debt" },
    { slug: "long-term-budgeting" },
    { slug: "basics-to-budgeting" },
    { slug: "creating-a-budget" },
  ];
}
