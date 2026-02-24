import { useEffect, useState } from "react";

function useDebugTools(): { borders: boolean; setBorders: React.Dispatch<React.SetStateAction<boolean>> } {
  const [borders, setBorders] = useState(false);

  useEffect(() => {
    if (borders) {
      document.body.classList.add("**:border", "**:border-red-500/15");
    } else {
      document.body.classList.remove("**:border", "**:border-red-500/15");
    }
  }, [borders]);

  return { borders, setBorders };
}

export default useDebugTools