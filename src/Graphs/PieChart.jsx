import React, { Component } from "react"
import styled, { keyframes } from "styled-components"
import PropTypes from "prop-types"
/*
    FILE: PieChart.jsx
    Description: This generates a pie chart for data using CSS. 
*/
class PieChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataValid: true,
      currentLabel: "",
      chartGenerated: false,
    }
    this.GenerateSegment = this.GenerateSegment.bind(this)
    this.drawData = this.drawData.bind(this)
    this.GenerateColor = this.GenerateColor.bind(this)
  }
  componentDidMount() {
    this.drawData()
  }
  drawData() {
    // Data is meant to be handled in elements

    var ourData = this.props.chartData
    var values
    var labels
    if (
      ourData === undefined ||
      ourData.values === undefined ||
      ourData.labels === undefined
    ) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log("Pie Chart Error, No data or invalid received.")
      }
      values = [0]
      labels = [""]
    } else {
      values = ourData.values
      labels = ourData.labels
    }

    values = ourData.values
    labels = ourData.labels
    const arrSum = arr => arr.reduce((a, b) => a + b, 0)
    var ourTotalVal = arrSum(values)
    for (var i = 0; i < values.length - 1; i++) {
      values[i] = (values[i] / ourTotalVal) * 100
      console.log("new val", values[i])
    }
    console.log("Total Val", ourTotalVal)

    if (ourData.labels.length !== ourData.values.length) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(
          "Pie Chart Error, please ensure there are the same amount labels and values"
        )
      }
      this.setState({
        dataValid: false,
      })
    }
    var index = -1
    var totalOffset = 0
    if (this.state.chartGenerated !== true) {
      // we have to generate new pie pieces
      const piePieces = values.map(currentVal => {
        index++
        var lastVal = values[index - 1] ? values[index - 1] : 0
        totalOffset += lastVal
        var partName = labels[index]
        console.log("last val", lastVal)
        return (
          <div key={index}>
            {this.GenerateSegment(
              totalOffset,
              currentVal,
              this.GenerateColor(),
              partName
            )}
          </div>
        )
      })
      this.setState({
        pieSegments: piePieces,
        chartGenerated: true,
      })
    }
  }
  GenerateSegment(offset, percent, color, name) {
    // Only Generate a single segment of the pie chart
    // Get the amount in percent of degrees.
    const percentInDegrees = Math.round((percent / 100) * 360)
    const percentLabel = percent + "%"
    const offsetInDegrees = Math.round((offset / 100) * 360)
    var over50 = 0
    if (percent > 50) {
      // If the percentage is greater than 50 we have to activate the small fix.
      over50 = 1
    }
    return (
      <Wrapper>
        <PieSegment
          onMouseOverCapture={e => {
            e.stopPropagation()

            this.setState(
              {
                labelVisible: true,
                currentLabel: name,
              }
              
            )
          }}
          onMouseOut={e => {
            this.handleHoverLeave(name)
          }}
          degrees={percentInDegrees}
          offset={offsetInDegrees}
          color={color}
          over50={over50}
        >
          {" "}
          <SegmentLabel>{percentLabel}</SegmentLabel>
        </PieSegment>
      </Wrapper>
    )
  }
  GenerateColor() {
    const colors = [
      "#1c63d6",
      "#6404e0",
      "#04d5e0",
      "#e06704",
      "#04e0b8",
      "#f50029",
      "#cf0094",
      "#eb78ff",
    ]
    var maxRGBVal = 255
    var r = this.getRandomInt(maxRGBVal)
    var g = this.getRandomInt(maxRGBVal)
    var b = this.getRandomInt(maxRGBVal)
    var rgbColor = "rgb(" + r + "," + g + "," + b + ")"
    return rgbColor
  }
  getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max))
  }
  handleHover = (e, name) => {
    e.stopPropagation()

    this.setState(
      {
        labelVisible: true,
        currentLabel: name,
      }
      
    )
    console.log("Look!", name)
  }
  handleHoverLeave = name => {
    this.setState(
      {
        labelVisible: false,
      },
      () => {
        this.setState({
          labelVisible: true,
        })
      }
    )
    console.log("Look!", name)
  }

  render() {
    try {
      return this.state.dataValid ? (
        <Container style={this.props.style} size={this.props.size}>
          <Pie>
            {this.state.pieSegments}
            <Middle />
            <Label
              className={
                this.state.labelVisible === true ? "fade-in" : "fade-out"
              }
            >
              {this.state.currentLabel}
            </Label>
          </Pie>
        </Container>
      ) : null
    } catch (e) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(e)
      }
      return null
    }
  }
}
export default PieChart
const Container = styled.div`
  position: relative;
  margin: auto;

  height: ${props => (props.size ? props.size + `px` : `150px`)};
  width: ${props => (props.size ? props.size + `px` : `150px`)};
`
const Pie = styled.div`
  background: #dedede;

  position: relative;
  overflow: hidden;
  border-radius: 100%;
  height: 100%;
  width: 100%;
  filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.4));
`

const Label = styled.span`
  position: absolute;
  z-index: 3;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  font-size: 1em;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  transition-property: all;
  transition-duration: 0.3s;
  &.fade-in {
    opacity: 1;
    transition-property: all;
    transition-duration: 0.3s;
  }
  &.fade-out {
    opacity: 0;
    transition-property: all;
    transition-duration: 0.3s;
  }
`
const Middle = styled.div`
  position: absolute;
  background: #f0f0f0;
  border-radius: 100%;
  width: 100%;
  height: 100%;
  z-index: 3;
  top: 50%;
  right: 50%;
  filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.4));

  transform: translate(50%, -50%) scale(0.6);
`
const Wrapper = styled.div``
const PieSegment = styled.div`
  --offset: ${props => (props.offset ? props.offset : 0)};
  --over50: ${props => (props.over50 ? props.over50 : 0)};
  --a: calc(var(--over50, 0) * -100%);
  --b: calc((1 + var(--over50, 0)) * 100%);
  height: 100%;
  width: 100%;
  position: absolute;
  /* This transform is only for setting the offset */
  transform: translate(0, -50%) rotate(90deg) rotate(calc(var(--offset) * 1deg));
  transform-origin: 50% 100%;

  /* This crazy thing is for handling the overflow when it is over 50% */
  clip-path: polygon(
    var(--a) var(--a),
    var(--b) var(--a),
    var(--b) var(--b),
    var(--a) var(--b)
  );
  z-index: calc(1 + var(--over50));
  &:after,
  &:before {
    background: ${props => (props.color ? props.color : "#3e75cf")};
    content: "";
    height: 100%;
    position: absolute;
    width: 100%;
  }
  &:before {
    --degrees: ${props => (props.degrees ? props.degrees : 0)};
    transform: translate(0, 100%) rotate(calc(var(--degrees) * 1deg));
    transform-origin: 50% 0%;
  }

  &:after {
    --over50: ${props => (props.over50 ? props.over50 : 0)};
    opacity: var(--over50, 0);
  }
`
const SegmentLabel = styled.div`
  bottom: 0;
  left: 3%;

  position: absolute;
  text-align: center;
  font-size: 18px;

  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  width: auto;
  z-index: 2;

  color: white;
`
