import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';
import { chartColors } from './ChartjsConfig';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

function BarChart03({ data, width, height }) {
  const [chart, setChart] = useState(null)
  const canvas = useRef(null);
  const legend = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === 'dark';
  const { textColor, gridColor, tooltipBodyColor, tooltipBgColor, tooltipBorderColor } = chartColors; 

  useEffect(() => {
    const ctx = canvas.current;
    if (!ctx) return;
    if (chart) chart.destroy();

    const newChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        indexAxis: 'y', // Horizontal stacked bar
        layout: {
          padding: { top: 12, bottom: 16, left: 20, right: 20 },
        },
        scales: {
          y: {
            stacked: true,
            display: false,
          },
          x: {
            stacked: true,
            display: false,
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: () => false,
              label: (context) => context.parsed.x, // Value is on X axis because it's horizontal
            },
            bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
            backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
            borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
          },
        },
        interaction: { intersect: false, mode: 'nearest' },
        animation: { duration: 500 },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
      plugins: [{
        id: 'htmlLegend',
        afterUpdate(c) {
          const ul = legend.current;
          if (!ul) return;
          while (ul.firstChild) { ul.firstChild.remove(); }
          const items = c.options.plugins.legend.labels.generateLabels(c);
          items.forEach((item) => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.style.display = 'inline-flex';
            button.style.alignItems = 'center';
            button.style.opacity = item.hidden ? '.3' : '';
            button.onclick = () => {
              c.setDatasetVisibility(item.datasetIndex, !c.isDatasetVisible(item.datasetIndex));
              c.update();
            };
            const box = document.createElement('span');
            box.style.display = 'block';
            box.style.width = '12px';
            box.style.height = '12px';
            box.style.borderRadius = 'calc(infinity * 1px)';
            box.style.marginRight = '8px';
            box.style.borderWidth = '3px';
            box.style.borderColor = item.fillStyle;
            box.style.pointerEvents = 'none';
            const label = document.createElement('span');
            label.classList.add('text-gray-500', 'dark:text-gray-400');
            label.style.fontSize = '14px';
            const labelText = document.createTextNode(item.text);
            label.appendChild(labelText);
            li.appendChild(button);
            button.appendChild(box);
            button.appendChild(label);
            ul.appendChild(li);
          });
        },
      }],
    });
    setChart(newChart);
    return () => newChart.destroy();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (!chart) return;
    if (darkMode) {
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    }
    chart.update('none');
  }, [currentTheme]);

  return (
    <React.Fragment>
      <div className="grow">
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>      
      <div className="px-5 py-4">
        <div className="grow mb-1">
          <ul ref={legend} className="flex flex-wrap gap-x-4"></ul>
        </div>
      </div>
    </React.Fragment>
  );
}

export default BarChart03;



