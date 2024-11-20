import React, { useEffect, useState } from "react";

interface IntroContentProps {
  lessonTitle: string;
}

export default function IntroContent({ lessonTitle }: IntroContentProps) {
  const [description, setDescription] = useState<string>("loading...");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/description");
      const data = await response.json();
      setDescription(data.description);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="py-56 pl-36 pr-96">
        <h1 className="text-3xl font-medium">{lessonTitle}</h1>
        {description}
      </div>
    </>
  );
}
