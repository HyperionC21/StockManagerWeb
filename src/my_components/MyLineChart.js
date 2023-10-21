import React from 'react';
import Chart from 'react-apexcharts';
import { xaxis } from 'apexcharts';

function MyLineChart (props) {

    const options = {
      chart: {
        id: 'basic-line'
      },
      title: {
        text: props.option,
        align: "center",
        style: {
          fontSize: "16px",
          fontWeight: "bold",
          color: "#263238",
        },
      },
      xaxis: {
        categories: props.date
      },
      stroke: {
        curve: 'smooth'
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value.toFixed(2);
          },
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#00FF00', '#FF0000'],
    }

    const series = [
        {
          name: "Profit",
          data: props.profit,
          type: "line",
          fill: {
            type: 'gardient',
            colors: function ({ value }) {
              if (value > 0) {
                return '#008FFB';
              } else if (value < 0) {
                return '#FF4560';
              } else {
                return '#000000';
              }
            }
          }
        }
    ];

    return (
      <div>
        <Chart options={options} series={series} type="line" height={350} width={800}/>
      </div>
    );
}

export default MyLineChart;
