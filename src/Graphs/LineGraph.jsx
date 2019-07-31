import React, { Component } from "react"
import styled from "styled-components"
import PropTypes from "prop-types"

class LineGraph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      svgPTS: "",
      xCoor: null,
      DataLabels: [],
      DataValues: [],
      YLabelWidth: 20,
      chartWidth: 0,
      chartHeight: 0,
    }
    this.drawData = this.drawData.bind(this)
    this.chartEl = React.createRef()
    this.yAxisEl = React.createRef()
  }
  componentDidMount() {
    try {
      this.setInitialValues()
    } catch (e) {
      // Width or height are not actual numbers we can use.
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log("Line Chart Error:", e)
      }
    }
  }

  /*
      setInitialValue()
      Parameters: none.
      This generates the scale to be used. If we are not given, 
      nothing is done about it and an error will occur. It handles the case that the 
      scales are reserved or one is missing in a crude manner. It also typechecks and 
      set the labels. 

  */
  setInitialValues = () => {
    // First lets sets our X axis
    if (
      typeof this.props.minYScaleValue !== "number" ||
      typeof this.props.maxYScaleValue !== "number"
    ) {
      // Width or height are not actual numbers we can use.
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log("Line Chart Error: Scale prop is not a number.", this.props)
      }
    }
    var FinalXMax = 0
    var FinalXMin = 0
    if (this.props.minYScaleValue === this.props.maxYScaleValue) {
      //this means the scale was set improperly.

      FinalXMin = this.props.MinScaleValue
      FinalXMax = this.props.MinScaleValue + 100
    } else if (this.props.minYScaleValue > this.props.maxYScaleValue) {
      //this means the they probably were switched.

      FinalXMin = this.props.MaxScaleValue
      FinalXMax = this.props.MinScaleValue
    } else {
      // Data is probably fine.
      FinalXMin = this.props.minYScaleValue
      FinalXMax = this.props.maxYScaleValue
    }
    // Now lets move on to the title for the chart
    var yTitle = ""
    var xTitle = ""
    if (
      typeof this.props.yAxisTitle === "string"
    ) {
      // We have a valid title

      yTitle = this.props.yAxisTitle
    }
    if (
     
      typeof this.props.xAxisTitle === "string"
    ) {
      xTitle = this.props.xAxisTitle
    }
    this.setState(
      {
        yAxisTitle: yTitle,
        xAxisTitle: xTitle,
        minXScale: FinalXMin,
        maxXScale: FinalXMax,
      },
      () => {
        this.drawData(this.props.chartData)
      }
    )
  }
  /*
    generateColor()
    Parameter: colorIndex(number)

    Returns a number from a list. If we run out of colors to pick,
    we will automatically generate one. If the list given is invalid 
    in a detectable manner, we will also randomly generate one. 

  */
  generateColor = (colorIndex) => {
    var maxRGBVal = 255
    var r = this.getRandomInt(maxRGBVal)
    var g = this.getRandomInt(maxRGBVal)
    var b = this.getRandomInt(maxRGBVal)
    var rgbColor = "rgb(" + r + "," + g + "," + b + ")"
    try{
    if( Array.isArray(this.props.graphColors) !== true){
      // were given a proper array.
      return rgbColor 
    }else{
      // here is the usual case actually 
      if(this.props.graphColors.length-1<colorIndex)
      {
        //We are out of colors, so generate a random one 
        return rgbColor
      }
      else{
        return this.props.graphColors[colorIndex]
      }
      
    }
    }catch(e){
      return rgbColor
    }
  }
  getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max))
  }
  /*
    drawData()
    Parameter:chartData(Object)
    This function generates the points to be displayed,
    calls another function to generate the background gridlines,
    calls another function to generate the labels and scale. 
  */
  drawData(chartData) {
   

    var labels = chartData.labels
    var ChartWidth = this.chartEl.current.getBoundingClientRect().width
    var ChartHeight = this.chartEl.current.getBoundingClientRect().height
    const sPts = chartData.values.map((dataSet,index)=>{
        return (
          <polyline
          key={this.getRandomInt(400)}
          fill="none"
          stroke={this.generateColor(index)}
          strokeWidth="3"
          points={this.generatePoints(
            ChartWidth,
            ChartHeight,
            dataSet,
            this.state.maxXScale,
            this.state.minXScale
          )}
        />
        )

    })
   
    var backG = this.generateGridLines(ChartWidth, ChartHeight)

    this.setState(
      {
        chartWidth: ChartWidth,
        chartHeight: ChartHeight,
        svgPTS: sPts,
        BackGrid: backG,
      },
      () => {
        // So here we are just generating labels.
        this.generateXLabels(labels, this.state.xCoor, 20)
        this.generateYLabels(
          this.state.minXScale,
          this.state.maxXScale,
          ChartHeight
        )
      }
    )
  }
  /*
      generateXLabels()
      Parameters: labels(array of strings),xCoor(array of numbers),height(number)
      Creates a set of objects to be displayed on the X axis and sets them to state. This is usually 
      the name of the data points. I could have put in the render function but this causes
      a lot of extra rerenders. 
  */
  generateXLabels = (labels, xCoor, height) => {
    const XLabels = labels.map((name, index) => {
      if(name!==""){
        return (
          <>
            <XLabel
              key={this.getRandomInt(400)}
              x={xCoor[index]}
              y={height}
            >
              {name}
            </XLabel>
          </>
        )
      }else return(
        <>
        </>
      )
      
    })

    this.setState({
      XLabels: XLabels,
    })
  }
  /*
    generateYLabels()
    parameters: min(number), max(number), height(number)


  */
  generateYLabels = (min, max, height) => {
    var midpoint = (min + max) / 2
    var LabelNames = [max, midpoint, min]
    let xHeight = [0, height / 2, height]
    let yTitleWidth = this.yAxisEl.current.getBoundingClientRect().width
    const LabelNamesTexts = LabelNames.map((name, index) => {
      return (
        <>
          <YLabel
            key={Math.floor(Math.random() * 999)}
            x={this.state.YLabelWidth / 2}
            y={xHeight[index]}
          >
            {name}
          </YLabel>
        </>
      )
    })

    this.setState({
      yAxisTitleWidth: yTitleWidth,
      YLabels: LabelNamesTexts,
    })
  }
  generateGridLines = (Width, Height) => {
    var MidPoint = Height / 2
    var TopLine = "00," + 1 + " " + Width + ",1 "
    var MiddleLine = "00," + MidPoint + " " + Width + ", " + MidPoint + ""
    var BottomLine = "00," + (Height - 1) + " ," + Width + ", " + (Height - 1)
    var BackGrid = (
      <>
        <BackgroundChart width={Width} height={Height}>
          <BackgroundLine fill="none" points={MiddleLine} />
        </BackgroundChart>
        <BackgroundChart width={Width} height={Height}>
          <BackgroundLine fill="none" points={TopLine} />
        </BackgroundChart>
        <BackgroundChart width={Width} height={Height}>
          <BackgroundLine fill="none" points={BottomLine} />
        </BackgroundChart>
      </>
    )
    return BackGrid
  }
  generatePoints = (Width, Height, dataSet, MaxValue, MinValue) => {
    var ourData = dataSet
    var svgPTS = ""
    try {
      if (MinValue > MaxValue) {
        // In this case, the scale has been set improperly
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
          console.log("Line Chart Error: min value is greater than max value")
        }
        return ""
      }
      if (!(typeof Width === "number") || !(typeof Height === "number")) {
        // Width or height are not actual numbers we can use.
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
          console.log("Line Chart Error: Width or Height is not a number.")
        }
        return ""
      }
      // For SVG Pts, the lowest pt is Height. The farthest pts is the width
    } catch (e) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
      }
    }
    var Xcordinates = []
    var AmtOfXSteps = Width / (ourData.length - 1)
    //console.log("data", ourData)
    ourData.map((dataVal, index) => {
      //Get the Y size. This is how much of the Y scale used.
      var ySize = Math.fround((dataVal - MinValue) / (MaxValue - MinValue))

      var yPt = Math.round(Height - ySize * Height) // Ex: 0.23 * 400 = 92. But need to take that from H
     

      // Generate X Pts
      var xPt = index * AmtOfXSteps
      xPt = Math.round(xPt)
      Xcordinates.push(xPt)
     
      var newCoor = xPt + "," + yPt + " "
      svgPTS += newCoor
      return newCoor
    })
    this.setState({
      xCoor: Xcordinates,
    })
    return svgPTS
  }

  render() {
    try {
      return (
        <Container
          style={this.props.style}
          width={this.props.width}
          height={this.props.height}
        >
          <RowContainer>
            <svg
              width={this.state.YLabelWidth}
              style={{ left: -20, overflow: "visible",position:"absolute" }}
              height={this.state.chartHeight}
            >
              <g>
                {this.state.YLabels}
                <YTitle
                  ref={this.yAxisEl}
                  x={
                   ( -this.state.yAxisTitleWidth / 2) -
                    (this.state.YLabelWidth / 2) -
                    15
                  }
                  y={this.state.chartHeight / 2}
                >
                  {this.state.yAxisTitle}
                </YTitle>
              </g>
            </svg>

            {this.state.BackGrid}

            <Chart style={{ overflow: "visible" }} ref={this.chartEl}>
              <g>{this.state.svgPTS}</g>
            </Chart>
          </RowContainer>
          <svg
            width={this.state.chartWidth}
            height="23px"
            style={{ right: 0, overflow: "visible" }}
          >
            <g>{this.state.XLabels} </g>
            <g />
            <XTitle x={this.state.chartWidth / 2} y={44}>
              {this.state.xAxisTitle}
            </XTitle>
          </svg>
        </Container>
      )
    } catch (e) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
      }
      return null
    }
  }
}
export default LineGraph
LineGraph.propTypes = {
  maxYScaleValue: PropTypes.number,
  minYScaleValue: PropTypes.number,
  yAxisTitle: PropTypes.string,
  xAxisTitle: PropTypes.string,
  LineColor: PropTypes.string,
  chartData: PropTypes.object,
}
LineGraph.defaultProps = {
  LineColor: "#4c7ecf",
}
const Container = styled.div`
  width: ${props => (props.width ? props.width + "px" : "100%")};
  height: ${props => (props.height ? props.height + "px" : "auto")};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  margin: auto;
  position: relative;
  box-sizing: border-box;
`
const Chart = styled.svg`
  background: transparent;
  width: 100%;
  bottom: 0;
  height: 100%;
  z-index: 2;
  position: relative;
`
const BackgroundChart = styled(Chart)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  width: ${props => (props.width ? props.width + "px" : "")};
  height: ${props => (props.height ? props.height + "px" : "")};
`
const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
`

const XLabel = styled.text`
  text-anchor: middle;

  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
`

const XTitle = styled.text`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
  text-anchor: middle;
  white-space: pre-line;

  fill: black;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
`
const YTitle = styled.text`
  font-weight: bold;

  text-transform: uppercase;
  font-size: 14px;
  overflow: visible;
  white-space: pre;

  text-anchor: middle;
  fill: black;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
`
const YLabel = styled.text`
  line-height: 1em;
  text-anchor: end;
  fill: black;
  font-size: 1em;

  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
`
const BackgroundLine = styled.polyline`
  stroke: #000;
  opacity: 0.2;
  stroke-width: 2;
`
