import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stage, Layer, Shape } from 'react-konva'; // Import react-konva components
import './MainPage.css'; // Import your CSS file

const MainPage = () => {
  const navigate = useNavigate();

  const handleButtonClick_search = () => {
    navigate('/search'); // Navigate to the search page
  };

  const handleButtonClick_recite = () => {
    navigate('/recite'); // Navigate to the recite page
  };

  return (
    <div className="background">
      <div className="main-content">

        <div className="artistic-word">
          <div className="scattered-letters">
            <span>V</span>
            <span>o</span>
            <span>c</span>
            <span>a</span>
            <span>b</span>
          </div>
          <span className="slightly-unaligned" id="letter-p">P</span>
          <span className="slightly-unaligned" id="letter-i">i</span>
          <span className="slightly-unaligned" id="letter-e">e</span>
        </div>


        <div className="intro">

          <div className="part1">
            <span className="triangleicon">
              △
            </span>

            <span className="description">
              A Chrome extension that allows you to effortlessly mark and collect unknown words while browsing the web, targeting to support global languages.
            </span>
          </div>


          <div className="part2">
            <span className="description">All your selected / searched words are saved for easy access, review, recitation, and management, helping you master new vocabulary efficiently.</span>


            <div className="mud-button-section">
              <div className="button-group">
                <button onClick={handleButtonClick_search}>Search</button>
                <button onClick={handleButtonClick_recite}>Recite</button>
                <button onClick={handleButtonClick_search}>Statistics</button>
              </div >
              <div className="button-group" id="square">
                <button onClick={handleButtonClick_search}>Download Customised Dictionary</button>
              </div >
            </div>
          </div>
        </div>

        {/* Canvas for triangle drawing */}
        <Stage width={window.innerWidth} height={window.innerHeight} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
          <Layer>
            {/* Left Triangle Shape */}
            <Shape
              sceneFunc={(context, shape) => {
                context.beginPath();
                context.moveTo(-100, 100); // Start at the top
                context.lineTo(100000, 200); // Draw line to the bottom left
                context.lineTo(0, 300); // Draw line to the bottom right
                context.closePath(); // Close the path to create a triangle
                context.fillStrokeShape(shape); // Fills and strokes the shape
              }}
              fill="transparent" // Transparent inner area
              stroke="black" // Outline color of the triangle
              strokeWidth={3} // Bold stroke width
              x={0} // Position at the left side of the window
              y={0} // Position at the top
              rotation={-30} // Rotate the triangle by -30 degrees
            />

            {/* Right Triangle Shape */}
            <Shape
              sceneFunc={(context, shape) => {
                context.beginPath();
                context.moveTo(100, 0); // Start at the top
                context.lineTo(200, 300); // Draw line to the bottom left
                context.lineTo(700, 300); // Draw line to the bottom right
                context.closePath(); // Close the path to create a triangle
                context.fillStrokeShape(shape); // Fills and strokes the shape
              }}
              fill="transparent" // Transparent inner area
              stroke="black" // Outline color of the triangle
              strokeWidth={3} // Bold stroke width
              x={window.innerWidth - 300} // Adjust x to position the triangle in the top right corner
              y={0} // Position at the top
              rotation={30} // Rotate the triangle by 30 degrees
            />
          </Layer>
        </Stage>

      </div >
    </div>
  );
};

export default MainPage;
