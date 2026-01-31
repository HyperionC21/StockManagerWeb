import React, { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";

function getRandomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function Legend({ data }) {
  return (
    <div className="pie-legend">
      {data.map((entry, index) => (
        <div key={index} className="pie-legend__item">
          <span
            className="pie-legend__swatch"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.title}</span>
        </div>
      ))}
    </div>
  );
}

export default function MyPieChart({ data, height, cb, maxPercentage = 2 }) {
  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  const threshold = (maxPercentage / 100) * total;
  let otherValue = 0;
  const pieData = data
    .map((entry) => ({
      title: entry.name,
      value: entry.value,
      color: getRandomColor(),
      total,
    }))
    .sort((a, b) => b.value - a.value)
    .filter((entry) => {
      if (entry.value < threshold) {
        otherValue += entry.value;
        return false;
      }
      return true;
    });
  if (otherValue > 0) {
    pieData.push({
      title: "other",
      value: otherValue,
      color: getRandomColor(),
      total,
    });
  }

  const [colors, setColors] = useState([]);

  useEffect(() => {
    const newColors = [];
    for (let i = 0; i < pieData.length; i++) {
      newColors.push(getRandomColor());
    }
    setColors(newColors);
  }, [pieData.length]);


  const [selected, setSelected] = useState(null);

  const handleClick = (event, dataIndex) => {
    if (dataIndex === selected) {
      setSelected(-1);
      cb('ALL');
    } else {
      setSelected(dataIndex);
      cb(pieData[dataIndex].title);
    }
    
  };

  return (
    <div className="pie-card">
      <div className="pie-card__chart">
        <PieChart
          className="pie-chart"
          data={pieData.map((entry, index) => ({
            ...entry,
            color: colors[index],
          }))}
          label={({ dataEntry }) => (dataEntry.value * 100 / total).toFixed(2)}
          labelStyle={{
            fontSize: "6px",
            fontFamily: "sans-serif",
            fill: "#111827",
          }}
          labelPosition={120}
          radius={36}
          viewBoxSize={[120, 120]}
          center={[60, 60]}
          startAngle={-90}
          onClick={handleClick}
          segmentsShift={(index) => (index === selected ? 6 : 0)}
        />
      </div>
      <div className="pie-card__legend">
        <Legend
          data={pieData.map((entry, index) => ({
            ...entry,
            color: colors[index],
          }))}
        />
      </div>
    </div>
  );
}
