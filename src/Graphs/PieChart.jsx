import React, { Component } from "react"
import styled, {keyframes} from "styled-components"
import PropTypes from "prop-types"
/*
    FILE: PieChart.jsx
    Description: This generates a pie chart for data using CSS. It filters
    out zeroes to hide any ugly pieces. It DOES round the percents to 
    two decimal places. 
    PROPS:
     size: PropTypes.number,  How big to make the Pie. 
     chartData: PropTypes.object, The data to be presented.
     graphColors: PropTypes.array, Which colors to be used 

*/
class PieChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataValid: true,
      currentLabel: "",
      chartGenerated: false,
    }
    this.generateSegment = this.generateSegment.bind(this)
    this.drawData = this.drawData.bind(this)
  }
  componentDidMount() {
    // Begin drawing the data. 
    this.drawData()
  }
  /*
    getValidatedData() 
    parameters: dataToValidate(object)
    This involves a few steps actually. We need to make sure received the correct
    amount of labels and values. We need to also filter out zeroes that 
    might have made it through.  

  */
  getValidatedData = (dataToValidate) =>{
      // Data is meant to be handled in elements

      var ourData = dataToValidate
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
      // Now lets filter out zero values
      var filteredValueArray = []
      var filteredLabelArray = []
     
      for (var i = 0; i < values.length - 1; i++) {
        if (values[i] > 0) {
          filteredValueArray.push(values[i])
          filteredLabelArray.push(labels[i])
        }
      }
      //Now it is filtered.
      // Set the new Values for the filtered arrays
      values = filteredValueArray
      labels = filteredLabelArray
  
      //Create a function that can sum an array for us
      const arrSum = arr => arr.reduce((a, b) => a + b, 0)
      var ourTotalVal = arrSum(values)
      console.log(ourTotalVal)
      console.log("Filtered Array", values)
      var tempValueArray = []
      for (var j = 0; j < values.length ; j++) {
        var calculatedPercent = Math.fround(((values[j] / ourTotalVal) * 100.0))
        
        tempValueArray.push(calculatedPercent)
      }
      values = tempValueArray
      console.log("New Values", values)
      console.log("Summed Percents", arrSum(tempValueArray))
      return ({
        labels:labels,
        values:values,
      })
  

  }
  /*
      drawData()
      parameters:none,
      
      This draws the pie and its labels as well. It does not handle 
      data validation though. That is managed by the other function,
      getValidatedData.
  */
  drawData() {
    var ourData = this.getValidatedData(this.props.chartData)
    var values = ourData.values
    var labels = ourData.labels
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
    /*
      Now lets actually generate pieces for the pie. 
      We have to keep track of the index and the offset used for each piece.
    */
    var index = -1
    var totalOffset = 0
    if (this.state.chartGenerated !== true) {
      // we have to generate new pie pieces
      var colorArray = []
      const piePieces = values.map((currentVal )=> {
        index++
        const newColor = this.generateColor(index)
        // Lets add a new color to the array. 
        colorArray.push(newColor)
        
        var lastVal = values[index - 1] ? values[index - 1] : 0
        if(lastVal!==0){
          totalOffset += lastVal-0.005
        }
        else{
          totalOffset += lastVal
        }
       
        var partName = labels[index]
        console.log("last val", lastVal)
        return (
          <div key={index}>
            {this.generateSegment(totalOffset, currentVal, newColor, partName)}
          </div>
        )
      })
      /*
        Here we are creating the legend along with the percentages.
        They are then stored into a variable that is save as a state. 

      */
      const pieLegends = colorArray.map((currentColor, index) => {
       let percentLabel =(values[index]).toFixed(1)+"%"
       let labelFontSize = Math.ceil(this.props.size*0.1)
       let labelWidth = Math.round(this.props.size*0.03)
        return (
          <LegendItemContainer fontSize={labelFontSize} key={this.getRandomInt(900)}>
            <ColorLabel width={labelWidth} color={currentColor} />
            
            <LegendLabel>{labels[index]}</LegendLabel>
            <PercentLabel>{percentLabel}</PercentLabel>
        
          </LegendItemContainer>
        )
      })
      // Now lets actually save the objects we generated.
      this.setState({
        pieSegments: piePieces,
        chartGenerated: true,
        colorVarArray: colorArray,
        pieLegendPieces: pieLegends,
      })
    }
  }
  /*
    generateSegment()
    parameters: offset(number),percent(number), color(string)

    Here we are actually a segment for the pie chart. We need to know the 
    offset and what size it should be. The color as a valid css color
    needs to be passed in. 
  */
  generateSegment(offset, percent, color) {
    // Only Generate a single segment of the pie chart
    // Get the amount in percent of degrees.
    const percentInDegrees = Math.round((percent / 100) * 360)
   
    const offsetInDegrees = Math.round((offset / 100) * 360)
    var over50 = 0
    if (percent > 50) {
      // If the percentage is greater than 50 we have to activate the small fix.
      over50 = 1
    }
    return (
      <Wrapper>
        <PieSegment
          degrees={percentInDegrees}
          offset={offsetInDegrees}
          color={color}
          over50={over50}
        >
          {" "}
        </PieSegment>
      </Wrapper>
    )
  }
  /*
      generateColor()
      parameters: colorIndex(number)

      Here we pick a color from the color list prop or else
      we randomly generate a random color. These colors are used 
      for the pie pieces and their legend.
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
  // Just returned a value between 0-max
  getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max))
  }
  /*
    We only render the data if it is valid or else we render
    nothing. 
  */
  render() {
    try {
      return this.state.dataValid ? (
        <Container >
          <ShadowWrapper>
          <Pie size={this.props.size}>
            {this.state.pieSegments}
            <Middle />
          </Pie>
          </ShadowWrapper>
          <LabelsContainer
            fontSize={this.props.size * 0.06}
            height={this.props.size * 0.3}
          >
            {this.state.pieLegendPieces}
          </LabelsContainer>
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
PieChart.propTypes = {
  size: PropTypes.number,
  chartData: PropTypes.object,
  graphColors: PropTypes.array,
}
PieChart.defaultProps = {
  size: 200,
  graphColors:undefined,
  chartData: undefined,
}
const FadeInAnimation =keyframes`
from{
  opacity:0;
}
to{
  opacity:1;
}

`
const LabelsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: ${props => (props.fontSize ? props.fontSize + `px` : "")};
  z-index: 5;
  margin-top: 5%;
  max-width: 80%;
  max-height: ${props => (props.height ? props.height + `px` : "100%")};
  justify-content: center;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  align-content: space-evenly;
`
const LegendLabel = styled.span`
  margin: 1% 5px;
  font-weight:500;

`
const PercentLabel = styled.span`
 margin: 1% 0%;
 color:grey;
 font-weight:300;

`
const ShadowWrapper = styled.div`
  filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.0));
`
const ColorLabel = styled.div`
  border-radius: 10%;
  
  height:100%;
  width:${props => (props.width ? props.width+`px` : "10px")};
  padding: 0;
  margin: 0 1% 0px 0px;
  position:relative;
  background: ${props => (props.color ? props.color : "")};
`
const Container = styled.div`
  position: relative;
  margin: auto;
  overflow:visible;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  

  height: ${props => (props.size ? props.size + `px` : "auto")};
  width: ${props => (props.size ? props.size + `px` : "auto")};
`
const Pie = styled.div`
  background: #dedede;

  position: relative;
  overflow: hidden;
  border-radius: 100%;
  height: ${props => (props.size ? props.size + `px` : `150px`)};
  width: ${props => (props.size ? props.size + `px` : `150px`)};
`


const LegendItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  font-size: ${props => (props.fontSize ? props.fontSize + `px` : "")};

  margin: 2% 10px;
`
const Middle = styled.div`
  position: absolute;
  background: #f0f0f0;
  border-radius: 100%;
  width: 100%;
  height: 100%;
  z-index: 0;
  top: 50%;
  right: 50%;

  transform: translate(50%, -50%) scale(0.65);
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
