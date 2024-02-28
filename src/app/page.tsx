"use client"
import { MouseEvent, useEffect, useRef, useState } from 'react'
import styles from './page.module.css'
import { FaEraser, FaPencilAlt } from 'react-icons/fa';

export default function Home() {

  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const [mouseDown, setMouseDown] = useState<Boolean>(false); // false - mouseup, true - mousedown 
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  // const [lineWidth, setLineWidth] = useState<number>(10);



  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    setMouseDown(true);
    canvasContext?.beginPath();
    let coordinates = { x: e.pageX, y: e.pageY };
    setStartPoint(coordinates);
  }

  // convert coordinates 
  const convertCoordinates = (x: number, y: number): { x: number, y: number } => {
    const rect = canvasRef.current?.getBoundingClientRect()!;
    const scaleX = (canvasRef.current?.width || 0) / rect?.width;
    const scaleY = (canvasRef.current?.height || 0) / rect.height;

    return {
      x: (x - rect.left) * scaleX,
      y: (y - rect.top) * scaleY
    };
  }

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (mouseDown) {
      let coordinates = { x: e.pageX, y: e.pageY };
      let prevCoordinates: { x: number, y: number } = convertCoordinates(startPoint.x, startPoint.y);
      let currentCoordinates: { x: number, y: number } = convertCoordinates(e.pageX, e.pageY);
      canvasContext?.moveTo(prevCoordinates.x, prevCoordinates.y);
      canvasContext?.lineTo(currentCoordinates.x, currentCoordinates.y);
      canvasContext?.closePath();
      canvasContext?.stroke();
      setStartPoint(coordinates);
    }
  }

  const handleMouseUp = () => {
    setMouseDown(false);
    canvasContext?.closePath();
    canvasContext?.stroke();
  }

  // handle stroke color 
  const handleStrokeColor = (color: string) => {
    if (canvasContext) {
      canvasContext.strokeStyle = color
    }
  }

  // handle tool change
  const handleToolChange = (tool: string) => {
    if(canvasContext){
      if(tool === "eraser"){
        canvasContext.globalCompositeOperation = 'destination-out'
      }else if(tool === "pencil"){
        canvasContext.globalCompositeOperation = 'source-over'
      }
    }
  }

  // // handle line width
  // const handleLineWidth = (width: number) => {
  //   if(canvasContext){
  //     setLineWidth(() => {
  //       canvasContext.lineWidth = width;
  //       return width
  //     })
  //   }
  // }

  const resetCanvas = () => {
    canvasContext?.reset();
  }

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')!;
    setCanvasContext(ctx);
  }, [])

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        <div className={styles.canvasWrapper}>
          <div className={styles.canvasTools}>
            <div className={styles.canvasTool} title='Pencil' onClick={() => handleToolChange('pencil')}>
              <FaPencilAlt className={styles.canvasToolIcon} color='#fff'/>
            </div>
            <div className={styles.canvasTool} title='Eraser' onClick={() => handleToolChange('eraser')}>
              <FaEraser className={styles.canvasToolIcon} color='#fff'/>
            </div>
          </div>
          <canvas
            className={styles.canvas}
            width={1100}
            height={450}
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
          </canvas>
        </div>
        <div className={styles.toolsContainer}>
          <div className={styles.colorSet}>
            <div className={`${styles.color} ${styles.red}`} onClick={() => handleStrokeColor('red')}></div>
            <div className={`${styles.color} ${styles.black}`} onClick={() => handleStrokeColor('black')}></div>
            <div className={`${styles.color} ${styles.blue}`} onClick={() => handleStrokeColor('blue')}></div>
          </div>
          <div className={styles.btns}>
            {/* <input type="range" value={lineWidth} min={10} max={50} onChange={(e) => handleLineWidth(Number(e.target.value))}/> */}
            <button className={styles.reset} onClick={resetCanvas}>Reset</button>
          </div>
        </div>
      </div>

    </main>
  )
}
