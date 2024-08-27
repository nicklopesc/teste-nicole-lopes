import ReactECharts from "echarts-for-react";

interface ProductivityChartProps {
  productivity: number;
}

export default function ProductivityChart({
  productivity,
}: ProductivityChartProps) {
  const getOption = () => ({
    title: {
      text: `Produtividade: ${productivity.toFixed(2)}%`,
      subtext: "Total de Horas Operacionais",
      left: "center",
      top: "center",
      textStyle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
      },
      subtextStyle: {
        fontSize: 14,
        color: "#000",
      },
    },
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "Produtividade",
        type: "pie",
        radius: "70%",
        center: ["50%", "50%"],
        data: [
          { value: productivity, name: "Produtivo" },
          { value: 100 - productivity, name: "Não Produtivo" },
        ],
        itemStyle: {
          color: (params: any) => {
            if (params.name === "Produtivo") {
              return "#00796b";
            } else {
              return "#A6A6A6";
            }
          },
        },
        emphasis: {
          itemStyle: {
            borderColor: "rgba(0, 0, 0, 0.5)",
            borderWidth: 2,
          },
        },
      },
    ],
  });

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <ReactECharts
        option={getOption()}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
