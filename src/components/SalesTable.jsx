import "bootstrap/dist/css/bootstrap.min.css";
import React, { Fragment, useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
const aSales = require("../data/sales.json").rows;

const SalesTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [allocInput, setAllocInput] = useState([]);
  console.log(allocInput, salesData);

  useEffect(() => {
    if (aSales) {
      const sales = [];
      aSales.forEach((e, i) => {
        const { id, label, value } = e;
        sales.push({
          id,
          label,
          value,
          cat: "parent",
          variance: 0,
        });
        if (e.children.length) {
          e.children.forEach((child) => {
            const { id, label, value } = child;
            sales.push({
              id,
              label,
              value,
              cat: "child",
              variance: 0,
              parent: e.id,
            });
          });
        }
      });
      setSalesData(sales);
      setAllocInput(Array.from({ length: sales.length }, (e) => ""));
    }
  }, [aSales]);

  return (
    <Fragment>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation (%)</th>
            <th>Allocation (Val)</th>
            <th>Variance (%)</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((element, index) => (
            <tr key={element.id}>
              <td>
                {element.cat === "parent"
                  ? element.label
                  : `-- ${element.label}`}
              </td>
              <td>{element.value}</td>
              <td>
                <input
                  value={allocInput?.[index]}
                  onChange={(e) => {
                    const { value } = e.target;
                    const tempInput = JSON.parse(JSON.stringify(allocInput));
                    tempInput[index] = parseInt(value);
                    setAllocInput(tempInput);
                  }}
                  onKeyDown={(e) => {
                    if (e.which < 48 || e.which > 57) {
                      e.preventDefault();
                    }
                  }}
                />
              </td>
              <td>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (element?.parent) {
                      const percentage = allocInput[index];
                      const tempSales = JSON.parse(JSON.stringify(salesData));
                      tempSales[index].value =
                        (percentage / 100) * tempSales[index].value +
                        tempSales[index].value;
                      tempSales[index].variance = percentage;

                      let val = 0;
                      tempSales.forEach((e) => {
                        if (e.parent === element.parent) {
                          val += e.value;
                        }
                      });

                      let match = tempSales.find(
                        (e) => e.id === element.parent
                      );
                      const parentVariance = match.value;
                      match.value = val;
                      match.variance = parseFloat(
                        ((match.value - parentVariance) / parentVariance) * 100
                      ).toFixed(2);
                      setSalesData(tempSales);
                    } else {
                      const percentage = allocInput[index];
                      const tempSales = JSON.parse(JSON.stringify(salesData));
                      tempSales[index].value =
                        (percentage / 100) * tempSales[index].value +
                        tempSales[index].value;
                      tempSales[index].variance = percentage;

                      tempSales.forEach((e) => {
                        if (e.parent === element.id) {
                          e.value = e.value + (percentage * e.value) / 100;
                          e.variance = percentage;
                        }
                      });

                      setSalesData(tempSales);
                    }
                    const tempInput = JSON.parse(JSON.stringify(allocInput));
                    tempInput[index] = "";
                    setAllocInput(tempInput);
                  }}
                >
                  Allocation (%)
                </Button>
              </td>
              <td>
                <Button
                  variant="info"
                  onClick={() => {
                    if (element?.parent) {
                      const tempValue = allocInput[index];
                      const tempSales = JSON.parse(JSON.stringify(salesData));
                      tempSales[index].variance = parseFloat(
                        ((tempValue - tempSales[index].value) /
                          tempSales[index].value) *
                          100
                      ).toFixed(2);
                      tempSales[index].value = tempValue;
                      let val = 0;
                      tempSales.forEach((e) => {
                        if (e.parent === element.parent) {
                          val += e.value;
                        }
                      });

                      let match = tempSales.find(
                        (e) => e.id === element.parent
                      );
                      const parentVariance = match.value;
                      match.value = val;
                      match.variance = parseFloat(
                        ((match.value - parentVariance) / parentVariance) * 100
                      ).toFixed(2);

                      setSalesData(tempSales);
                    } else {
                      const tempValue = allocInput[index];
                      const tempSales = JSON.parse(JSON.stringify(salesData));
                      tempSales[index].variance = parseFloat(
                        ((tempValue - tempSales[index].value) /
                          tempSales[index].value) *
                          100
                      ).toFixed(2);
                      tempSales[index].value = tempValue;

                      tempSales.forEach((e) => {
                        if (e.parent === element.id) {
                          const oldValue = e.value;
                          const oldPercentage =
                            (e.value / ((tempValue * 50) / 100)) * 100;
                          e.value = parseInt((oldPercentage * tempValue) / 100);
                          e.variance = parseFloat(
                            ((e.value - oldValue) / oldValue) * 100
                          );
                        }
                      });

                      setSalesData(tempSales);
                    }
                    const tempInput = JSON.parse(JSON.stringify(allocInput));
                    tempInput[index] = "";
                    setAllocInput(tempInput);
                  }}
                >
                  Allocate (val)
                </Button>
              </td>
              <td>{element.variance} %</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  );
};

export default SalesTable;
