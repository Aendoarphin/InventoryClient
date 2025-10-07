import useMetrics from "@/hooks/useMetrics";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const warning = "#F2C03F";
const good = "#31B531";

function NeedsAttention() {
  const metrics: Record<string, any> = useMetrics();
  console.log(metrics[0])
  console.log(metrics[1])
  const [labels] = useState<string[]>(['Complete', 'Needs Attention'])
  return (
    <div className="col-span-2 p-4 border border-muted shadow-md">
      {/* <Doughnut data={null}></Doughnut> */}
    </div>
  );
}

export default NeedsAttention;
