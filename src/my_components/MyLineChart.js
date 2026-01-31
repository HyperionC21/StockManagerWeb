import React from 'react';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import Chart from 'react-apexcharts';

function MyLineChart(props) {

  const series = [
    {
      name: "Profit",
      data: props.profit,
      type: "line",
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100]
        }
      },
      stroke: {
        curve: 'smooth',
        colors: props.profit.map(value => value > 0 ? '#00FF00' : '#FF0000'), // Dynamically set colors based on the values
        width: 2,
        dashArray: 0,
      },
      background: {
        enabled: true,
        opacity: 0.1,
        color: function ({ value }) {
          if (value > 0) {
            return '#00FF00'; // Green for positive values
          } else if (value < 0) {
            return '#FF0000'; // Red for negative values
          } else {
            return '#000000';
          }
        }
      },
    }
  ];

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
      categories: props.date,
      tickAmount: 10,
      labels: {
        rotate: -45,
        trim: true
      }
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
    fill: {
      type: "solid" },
    dataLabels: {
      enabled: false
    },
  };

  return (
    <Box className="performance-chart" position="relative">
      <Chart options={options} series={series} type="line" height={350} width="100%" />
      {props.loading && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          gridGap={10}
          bgcolor="rgba(255, 255, 255, 0.7)"
          borderRadius={12}
        >
          <CircularProgress size={20} thickness={5} />
          <Typography variant="body2" color="textSecondary">Updating chart...</Typography>
        </Box>
      )}
    </Box>
  );
}

export default MyLineChart;
