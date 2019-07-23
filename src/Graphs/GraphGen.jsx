import React, { Component } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import PieChart from "./PieChart"
import BarChart from "./BarChart"
import LineGraph from "./LineGraph"
/*
    File: GraphGen.jsx
    Description: Created a line, bar, or pie chart from data that been passed in.

    Props:
    maxYScale: PropTypes.number, 
    minYScale: PropTypes.number,
    chartData: PropTypes.object, This is the actual data meant to be displayed
    height: PropTypes.number,
    width:PropTypes.number,
    size: PropTypes.number, Used ONLY for Pie Charts
    xAxisTitle: PropTypes.string,
    yAxisTitle: PropTypes.string,
    chartColor: PropTypes.string,
    alternateBarColor: PropTypes.string, Used for Bar Charts only

*/
class GraphGen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      CorrectedChartData: undefined,
      dataIsLoaded: false,
      scaleYMin: undefined,
      scaleYMax: undefined,
      yAxisTitle: ``,
      xAxisTitle: ``,
    }
  }
  componentDidMount() {
    this.setChartData()
  }
  componentWillUnmount() {}
  analyzeData = ChartData => {
    var PassedInData = ChartData
    var PassedInLabels = PassedInData.labels
    var PassedInValues = PassedInData.values
    if (this.props.chartData !== undefined) {
      // That means there is actual data passed in.

      PassedInLabels = PassedInData.labels
      PassedInValues = PassedInData.values

      if (PassedInLabels.length !== PassedInValues) {
        // There is a mismatch
        var i
        if (PassedInLabels.length > PassedInValues.length) {
          // We are gonna have to pad that value
          for (
            i = PassedInValues.length - 1;
            i < PassedInLabels.length - 1;
            i++
          ) {
            /*
              Set Start to last element in Passed in labels. Push some empty Text.
          */
            PassedInValues.push(0)
          }
        }
        if (PassedInValues.length > PassedInLabels.length) {
          for (
            i = PassedInLabels.length - 1;
            i < PassedInValues.length - 1;
            i++
          ) {
            /*
              Set Start to last element in Passed in labels. Push some empty Text.
          */
            PassedInLabels.push("")
          }
        }

        // We are done checking for mismatches

        // Now we need to check the number array
        for (i; i < PassedInValues.length - 1; i++) {
          if (!(typeof PassedInValues[i] === "number")) {
            // We have a type mismatch
            PassedInValues[i] = 0
            // replace it with a 0
            if (
              !process.env.NODE_ENV ||
              process.env.NODE_ENV === "development"
            ) {
              console.log(
                "Chart Gen Error: There was a data mismatch. Element was replaced with 0"
              )
            }
          }
        }
        return {
          labels: PassedInLabels,
          values: PassedInValues,
        }
      }
    } else {
      // No data was passed in.
      return {
        labels: [""],
        values: [0],
      }
    }
  }
  setChartData = () => {
    if(this.props.chartData===undefined ||  this.props.chartData.labels===undefined || this.props.chartData.values === undefined){
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log("Error in Graph Gen: Data is undefined or invalid")
      }
      return
    }
    var FinalizedData = this.analyzeData(this.props.chartData)
    var arrayOfValues = FinalizedData.values
    var minOfData = Math.min(...arrayOfValues)
    var maxOfData = Math.max(...arrayOfValues)
    var avgOfData = (minOfData + maxOfData) / 2
    var finalMaxY = 0
    var finalMinY = 0
    if (
      this.props.maxYScale === undefined ||
      !(typeof this.props.maxYScale === "number")
    ) {
      // no scale was set on Max Y scale.
      finalMaxY = maxOfData + avgOfData / 4
    } else {
      finalMaxY = this.props.maxYScale
    }
    if (
      this.props.minYScale === undefined ||
      !(typeof this.props.minYScale === "number")
    ) {
      // Min was not set
      finalMinY = minOfData - avgOfData / 4
    } else {
      finalMinY = maxOfData
    }
    //console.log("Corrected Data", FinalizedData)

    var yTitle = ``
    var xTitle = ``
    if (
      typeof this.props.yAxisTitle !== "undefined" &&
      typeof this.props.yAxisTitle === "string"
    ) {
      // We have a valid title
      yTitle = this.props.yAxisTitle
    }
    if (
      typeof this.props.xAxisTitle !== "undefined" &&
      typeof this.props.xAxisTitle === "string"
    ) {
      xTitle = this.props.xAxisTitle
    }

    this.setState(
      {
        CorrectedChartData: FinalizedData,
        yAxisTitle: yTitle,
        xAxisTitle: xTitle,
        scaleYMax: finalMaxY,
        scaleYMin: finalMinY,
      },
      () => {
        this.setState({
          dataIsLoaded: true,
        })
      }
    )
  }
  generateGraph = () => {
    var minVal = this.state.scaleYMin
    var maxVal = this.state.scaleYMax
    var yTitle = this.state.yTitle
    var xTitle = this.state.xTitle
    if(this.props.chartType==="line" || this.props.chartType==="Line"){
      return (
        <>
          <LineGraph
            LineColor={this.props.chartColor}
            maxYScaleValue={maxVal}
            minYScaleValue={minVal}
            height={this.props.height}
            width={this.props.width}
            yAxisTitle={yTitle}
            xAxisTitle={xTitle}
            chartData={this.state.CorrectedChartData}
          />
        </>
      )
    }else if (this.props.chartType==="bar" || this.props.chartType==="Bar"){
      return (
        <>
          <BarChart
            LineColor={this.props.chartColor}
            alternateBarColor={this.props.alternateBarColor}
            maxYScaleValue={maxVal}
            minYScaleValue={minVal}
            height={this.props.height}
            width={this.props.width}
            yAxisTitle={yTitle}
            xAxisTitle={xTitle}
            chartData={this.state.CorrectedChartData}
          />
        </>
      )
    }else if(this.props.chartType==="pie" || this.props.chartType==="Pie"){

      return (
        <>
          <PieChart
            size = {this.props.size}
            maxYScaleValue={maxVal}
            minYScaleValue={minVal}
            yAxisTitle={yTitle}
            xAxisTitle={xTitle}
            chartData={this.state.CorrectedChartData}
          />
        </>
      )

    }else{
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log("Error, no chart selected")
      }
      return (
        null
        )
    }
    
  }

  render() {
    try {
      return this.state.dataIsLoaded === true ? (
        <Container style={this.props.style}>{this.generateGraph()}</Container>
      ) : null
    } catch (e) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
      }
      return null
    }
  }
}
export default GraphGen
GraphGen.propTypes = {
  maxYScale: PropTypes.number,
  minYScale: PropTypes.number,
  LineColor: PropTypes.string,
  height: PropTypes.number,
  width:PropTypes.number,
  size: PropTypes.number,
  chartData: PropTypes.object,
  xAxisTitle: PropTypes.string,
  yAxisTitle: PropTypes.string,
  chartColor: PropTypes.string,
  alternateBarColor: PropTypes.string,
}
GraphGen.defaultProps = {
  maxYScale: undefined,
  minYScale: undefined,
  chartColor: "#4c7ecf",
  alternateBarColor: undefined,
}
const Container = styled.div`
  position: relative;
`
