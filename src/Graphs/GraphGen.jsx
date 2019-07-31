import React, { Component } from "react"
import styled, {keyframes} from "styled-components"
import PropTypes from "prop-types"
import PieChart from "./PieChart"
import BarChart from "./BarChart"
import LineGraph from "./LineGraph"
/*
    File: GraphGen.jsx
    Description: Created a line, bar, or pie chart from data that been passed in. Objects 
    must be in the format: 
    {
      labels:[],
      values:[],
    }
    For line graphs, multiple arrays can be displayed. If it is another chart type, 
    the extra arrays are filtered and ignored. 

    Props:
    maxYScale: PropTypes.number, 
    minYScale: PropTypes.number,
    chartData: PropTypes.object, This is the actual data meant to be displayed
    height: PropTypes.number,
    width:PropTypes.number,
    fadeIn: PropTypes.bool,
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
  analyzeData = ChartData => {
    var PassedInData = ChartData
    var PassedInLabels;
    var PassedInValues;
    
    if (this.props.chartData !== undefined) {
      // That means there is actual data passed in.

      PassedInLabels = PassedInData.labels
      PassedInValues = PassedInData.values
      var amountOfValueArrays = PassedInData.values.length
      //Lets us figure out how many arrays were passed in. 
   
      
        var i
        var j
        /*
          Here we padding the values array with a 0 if it 
          is found to be empty or null for any index of the string we 
          are checking. 
        */
        for(i=0;i<PassedInValues.length;i++){
          if (PassedInLabels.length > PassedInValues[i].length) {
            // We are gonna have to pad that value
            for (
              j = PassedInValues[i].length - 1;
              j < PassedInLabels.length - 1;
              j++
            ) {
              /*
                Set Start to last element in Passed in labels. Push some empty Text.
            */
              PassedInValues[i].push(0)
            }
          }
        }
        /*
            Now lets pad the labels in order incase there is a 
            mismatch there.
        */
        for(i=0;i<PassedInValues.length-1;i++){
          if (PassedInValues[i].length > PassedInLabels.length) {
            for (
              j = PassedInLabels.length - 1;
              j < PassedInValues[i].length - 1;
              j++
            ) {
              /*
                Set Start to last element in Passed in labels. Push some empty Text.
            */
              PassedInLabels.push("")
            }
          }
          
        }
          /*
          Here we padding the values array with a 0 if it 
          is found to be empty or null for any index of the string we 
          are checking. 
        */
       for(i=0;i<PassedInValues.length;i++){
        if (PassedInLabels.length > PassedInValues[i].length) {
          // We are gonna have to pad that value
          for (
            j = PassedInValues[i].length - 1;
            j < PassedInLabels.length - 1;
            j++
          ) {
            /*
              Set Start to last element in Passed in labels. Push some empty Text.
          */
            PassedInValues[i].push(0)
          }
        }
      }

        // We are done checking for mismatches

       /*
          Here we are going though the array to make sure 
          they are all actually numbers. If they are not we set the value
          to 0. We will also let the programmer know that there was an error in the data.
       */
        for(j=0;j<amountOfValueArrays-1;j++){
          //go through every array
          for (i=0; i < PassedInValues[j].length; i++) {
            if (!(typeof PassedInValues[j][i] === "number")) {
              // We have a type mismatch
              PassedInValues[j][i] = 0
             
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
        // We are done adjust our passed in values so lets return them.
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
    var minOfData = 0
    var maxOfData = 0 // Here is the max of the values for the array
    for(var i=0;i<arrayOfValues.length;i++){
     
        
        if(minOfData>(Math.min(...arrayOfValues[i]))){
          minOfData=Math.min(...arrayOfValues[i])
        }
        if(maxOfData<(Math.max(...arrayOfValues[i]))){
          maxOfData=Math.max(...arrayOfValues[i])
        }
    }
   minOfData = Math.floor(minOfData)
   maxOfData = Math.ceil(maxOfData)

    var avgOfData = (minOfData + maxOfData) / 2
    var finalMaxY = 0
    var finalMinY = 0
    if (
      this.props.maxYScale === undefined ||
      !(typeof this.props.maxYScale === "number")
    ) {
      // no scale was set on Max Y scale.
      finalMaxY = Math.fround(maxOfData + avgOfData / 4)
    } else {
      finalMaxY = this.props.maxYScale
    }
    if (
      this.props.minYScale === undefined ||
      !(typeof this.props.minYScale === "number")
    ) {
      // Min was not set
      finalMinY = Math.fround(minOfData - avgOfData / 4)
    } else {
     
      finalMinY = this.props.minYScale
     
    }
    //console.log("Corrected Data", FinalizedData)

    var yTitle = ""
    var xTitle = ""
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

    var yTitle = this.state.yAxisTitle
    var xTitle = this.state.xAxisTitle
    var labelsToDisplay = this.state.CorrectedChartData.labels
    var firstValueArray = this.state.CorrectedChartData.values[0]
    var singleArrayData = {
      labels:labelsToDisplay,
      values:firstValueArray,
    }
    if(this.props.chartType==="line" || this.props.chartType==="Line"){
      return (
        <>
          <LineGraph
            LineColor={this.props.chartColor}
            maxYScaleValue={maxVal}
            graphColors={this.props.graphColors}
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
            maxScaleValue={maxVal}
            minScaleValue={minVal}
            height={this.props.height}
            width={this.props.width}
                        graphColors={this.props.graphColors}

            yAxisTitle={yTitle}
            xAxisTitle={xTitle}
            chartData={singleArrayData}
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
            graphColors={this.props.graphColors}
            xAxisTitle={xTitle}
            chartData={singleArrayData}
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
        <Container className={this.props.fadeIn===true ? "fadeIn" : ""} style={this.props.style}>{this.generateGraph()}</Container>
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
  lineColors: PropTypes.array,
  height: PropTypes.number,
  width:PropTypes.number,
  fadeIn:PropTypes.bool,
  size: PropTypes.number,
  chartData: PropTypes.object,
  xAxisTitle: PropTypes.string,
  yAxisTitle: PropTypes.string,
  chartColor: PropTypes.string,
  alternateBarColor: PropTypes.string,
}
GraphGen.defaultProps = {
  maxYScale: undefined,
  fadeIn: false,
  minYScale: undefined,
  chartColor: "#4c7ecf",
  alternateBarColor: undefined,
}
const FadeIn = keyframes`
from{
  
    opacity:0;
}
to{

  opacity:1;
}
`
const Container = styled.div`
  position: relative;
  &.fadeIn{
    animation: ${FadeIn} 0.4s ease-out 0s;

  }
`
