import { useRef, useEffect, useState } from "react";
import { Paper } from "@mui/material";
import { useWindowSize } from "@react-hook/window-size";

const ROW_HEIGHT = 2;
const GAP = 2 * 8;

export default function GridItem({ children, columnSpan = 1 }) {
  const ref = useRef(null);
  const [span, setSpan] = useState(1);
  const [width, height] = useWindowSize();

  useEffect(() => {
    const resize = () => {
      const height = ref.current.getBoundingClientRect().height;
      setSpan(Math.ceil((height + GAP) / (ROW_HEIGHT + GAP)));
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <Paper
      sx={{
        gridRowEnd: `span ${span}`,
        gridColumn: `span ${columnSpan}`,
        outline: 'none',
        border: 'none',
        boxShadow: 'none',
        alignSelf: 'start',
        
      }}
    >
      <div ref={ref}>
        {children}
      </div>
    </Paper>
  );
}