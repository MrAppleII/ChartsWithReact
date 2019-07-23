import React, { Component } from "react"
import styled, { keyframes } from "styled-components"
import PropTypes from "prop-types"
/*
    FILE: PieChart.jsx
    Description: This generates a bar chart for data using CSS. It does not do much for checking the 
    data. The Main Graph Gen Component should do that 
*/
class BarChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
     
      currentLabel: "",
      barSegments: null,
      AmountOfBars: 0,
      chartGenerated: false,
      xAxisTitle: ``,
      yAxisTitle: ``,
    }
    this.chartEl = React.createRef()
    this.yAxisEl = React.createRef()
    this.yAxisContEl = React.createRef()
    this.drawData = this.drawData.bind(this)
  }
  componentDidMount() {
   
    this.drawData()
  }
  


  drawData() {
    // Data is meant to be handled in elements
    var ourData = this.props.chartData
    var values;
    var labels;
    if(ourData===undefined || ourData.values===undefined || ourData.labels===undefined){
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(
          "Bar Chart Error, No data received."
        )
      }
      values = [0]
      labels = [""]
     
    }else{
      values = ourData.values
      labels = ourData.labels
    }
   
    if ( labels.length !==  values.length) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(
          "Bar Chart Error, please ensure there are the same amount labels and values"
        )
      }
      this.setState({
        dataValid: false,
      })
    }
    var index = -1

    if (this.state.chartGenerated !== true) {
      // we have to generate new pie pieces
      const barPieces = values.map(currentVal => {
        index++
        var MaxV = 101

        var animationLength = 0

        var percentage = Math.floor(
          (currentVal / this.props.maxScaleValue) * 100
        )
       // console.log("Min Scale Val", this.props.minScaleValue)

        var BarSize = Math.round(
          ((currentVal - this.props.minScaleValue) /
            (this.props.maxScaleValue - this.props.minScaleValue)) *
            100
        )
        if (currentVal >= this.props.maxScaleValue) {
          BarSize = 100
        }

        var startValue = MaxV - BarSize
        var BarClassName = ""
        if (BarSize < 0) {
          // well lets just hide this bar then.

          startValue = MaxV - 1
          BarClassName = "hidden"
        } else if (BarSize === 0) {
          startValue = MaxV - 1
          BarClassName = "minSize"
        }
        var Label = percentage + "%"
        if (percentage <= 0) {
          Label = ""
        }
        //console.log("StartVa", startValue)
        if (this.props.animated === true) {
          animationLength = index * 0.14
        }

        return (
          <Bar
            barColor={this.props.barColor}
            alternateColor={this.props.alternateBarColor}
            className={BarClassName}
            delay={animationLength}
            key={index}
            start={startValue}
          >
            <div>
              <BarTextContainer>
                <TopLabel>{currentVal}</TopLabel>
                {BarClassName !== "minSize" ? (
                  <BarLabel>{Label}</BarLabel>
                ) : null}
              </BarTextContainer>
            </div>
          </Bar>
        )
      })
      const Labels = labels.map((name, index) => {
        //console.log("index", index)
        var animationLength = 1.2
        return (
          <Label delay={animationLength} key={this.getRandomInt(200)}>
            {name}
          </Label>
        )
      })
      this.setState({
        barSegments: barPieces,
        chartGenerated: true,
        LabelDivs: Labels,
        AmountOfBars: values.length,
      })
    }
  }
  getChartHeight = () => {
    if (this.chartEl.current) {
      return this.chartEl.current.getBoundingClientRect().height
    } else {
      return 0
    }
  }
  getChartWidth = () => {
    if (this.chartEl.current) {
      //console.log("width", this.chartEl.current.getBoundingClientRect())
      return this.chartEl.current.getBoundingClientRect().width
    } else {
      return 0
    }
  }
  getYLabelWidth = () => {
    if (this.yAxisEl.current) {
     // console.log("width", this.yAxisEl.current.getBoundingClientRect())
      return this.yAxisEl.current.getBoundingClientRect().width
    } else {
      return 0
    }
  }
  getYContainerWidth = () => {
    if (this.yAxisContEl.current) {
    //  console.log("width", this.yAxisContEl.current.getBoundingClientRect())
      return this.yAxisContEl.current.getBoundingClientRect().width
    } else {
      return 0
    }
  }

  getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max))
  }

  render() {
    
    try {
      
      return (
        <Container
          style={this.props.style}
          width={this.props.width}
          height={this.props.height}
        >
          <BarContainer>
            <InnerContainer>
              <YTitleContainer
                left={
                  -this.getYLabelWidth() - this.getYContainerWidth() / 2 - 15
                }
                ref={this.yAxisEl}
                height={this.getChartHeight()}
              >
                <YTitleLabel>{this.props.yAxisTitle}</YTitleLabel>
              </YTitleContainer>
              <Scale
                ref={this.yAxisContEl}
                left={-this.getYContainerWidth() / 2 - 10}
                height={this.getChartHeight()}
              >
                <ScaleItem>{this.props.maxScaleValue}</ScaleItem>
                <ScaleItem>
                  {(this.props.maxScaleValue + this.props.minScaleValue) / 2}
                </ScaleItem>
                <ScaleItem>{this.props.minScaleValue}</ScaleItem>
              </Scale>
            </InnerContainer>
            <InnerContainer>
              {
                // Inner container is a column flex with center justify content
              }
              <BackgroundChart AmountOfBars={this.state.AmountOfBars}>
                <BackgroundLine />
                <BackgroundLine />
                <BackgroundLine />
                <BackgroundLine />
                <BackgroundLine />
              </BackgroundChart>
              <Chart ref={this.chartEl} AmountOfBars={this.state.AmountOfBars}>
                {this.state.barSegments}
              </Chart>

              <LabelContainer AmountOfBars={this.state.AmountOfBars}>
                {this.state.LabelDivs}
              </LabelContainer>
              <XTitleContainer top={this.getChartHeight()+32}>
                <XTitle>{this.props.xAxisTitle}</XTitle>
              </XTitleContainer>
            </InnerContainer>
          </BarContainer>
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

BarChart.propTypes = {
  maxScaleValue: PropTypes.number,
  minScaleValue: PropTypes.number,
  xAxisTitle: PropTypes.string,
  yAxisTitle: PropTypes.string,
  barColor: PropTypes.string,
  alternateBarColor: PropTypes.string,
}
BarChart.defaultProps = {
  maxScaleValue: 100,
  minScaleValue: 0,
  barColor: "#4c7ecf",
  alternateBarColor: undefined,
}

const Container = styled.div`
  width: ${props => (props.width ? props.width + "px" : "100%")};
  height: ${props => (props.height ? props.height + "px" : "100px")};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  position: relative;
  box-sizing: border-box;
`
const Chart = styled.div`
  display: grid;
  --columns: ${props => (props.AmountOfBars ? props.AmountOfBars : 12)};
  grid-template-columns: repeat(var(--columns, 12), 1fr);
  grid-template-rows: repeat(100, 1fr);
  grid-column-gap: 5px;
  height: 90%;
  width: 100%;
  z-index: 2;

  padding: 5px 10px;
`
const XTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  
  top: ${props => (props.top ? props.top + "px" : "0")};
  justify-content: center;
  align-content: center;
  width: ${props => (props.width ? props.width + "px" : "100%")};
  height: ${props => (props.height ? props.height + "px" : "auto")};
`
const XTitle = styled.span`
  text-anchor: middle;
  font-weight: 500;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
`

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  height: 100%;
`

const LabelContainer = styled.div`
  display: grid;
  position: relative;
  --columns: ${props => (props.AmountOfBars ? props.AmountOfBars : 12)};
  grid-template-columns: repeat(var(--columns, 12), 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 5px;
  width: 100%;
  height: 10%;
  padding: 5px 10px;
`
const GrowIn = keyframes`
from{
transform-origin:100% 100%;
transform:scale(1,0.0);
}
to{
  transform-origin:0 100%;

  transform:scaleY(1,1);
}
`
const FadeIn = keyframes`
from{
  opacity:0;
}
to{
  opacity:1;
}

`
const Scale = styled.div`
  position: absolute;
  height: ${props => (props.height ? props.height + "px" : "100%")};
  top: 0;
  width: auto;
  left: ${props => (props.left ? props.left + "px" : "0")};

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`
const ScaleItem = styled.span`
  position: relative;
  padding: 0;
  color: #949494;
  line-height: 1em;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
`
const YTitleContainer = styled.div`
  position: absolute;
  top: 0;
  left: ${props => (props.left ? props.left + "px" : "0")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  vertical-align: center;

  height: ${props => (props.height ? props.height + "px" : "auto")};
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
`
const YTitleLabel = styled.span`
  font-weight: 500;
  text-anchor: middle;
`
const BarTextContainer = styled.div`
  top: 0;
  left: 0;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  vertical-align: baseline;
  align-items: center;
  height: 100%;
  width: 100%;
  align-content: center;
`
const BarLabel = styled.span`
  position: relative;
  align-self: stretch;
  text-align: center;

  bottom: 0.5em;
  line-height: 1em;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
`
const TopLabel = styled.span`
  position: relative;
  top: -1em;
  line-height: 1em;
  margin: 0 auto;
  color: black;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
`

const Bar = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  vertical-align: baseline;
  align-items: center;
  align-content: center;
  height: 100%;

  /* border-radius: 2px 2px 0px 0px; */
  border-radius: 2px;
  transition: all 0.6s ease;
  background-color: ${props => (props.barColor ? props.barColor : "")};

  grid-row-end: 101;
  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
  &.minSize {
  }
  color: transparent;
  animation: ${GrowIn};
  animation-timing-function: ease-out;
  animation-duration: ${props => (props.delay ? props.delay + "s" : 0)};
  grid-row-start: ${props => (props.start ? props.start : 100)};
  :nth-child(odd) {
    background-color: ${props => (props.barColor ? props.barColor : "")};
  }
  :hover {
    color: #fff;
  }

  :nth-child(even) {
    background-color: ${props =>
      props.alternateColor ? props.alternateColor : ""};
  }
`
const BarContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 100%;
  width: 100%;
`
const Label = styled.span`
  position: relative;
  margin: auto;
  font-weight: 400;
  color: #4d4d4d;
  animation: ${FadeIn};
  animation-timing-function: ease-out;
  animation-duration: ${props => (props.delay ? props.delay + "s" : "0s")};
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
`
const BackgroundChart = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;

  top: 0;
  padding: 5px 10px;
  height: 90%;
  width: 100%;

  z-index: 2;
`
const BackgroundLine = styled.div`
  width: 100%;

  border-radius: 8px;
  opacity: 0.4;
  height: 2px;
  background: grey;
`
export default BarChart
