import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

interface Point {
  x: number,
  y: number
}

interface Line {
  start: Point,
  end: Point
}


export default function GiantSquid() {

  const [dialogOpen, setDialogOpen] = useState(false);
  const [solution, setSolution] = useState(0);

  let importText = "";

  const handleImport = () => {

    const overlaps: Map<string, number> = new Map();

    const splittedImportText = importText.split(/\r?\n/);

    const ventCoordinates: Line[] = splittedImportText
      .map(t => {
        const line = t.split(" -> ").map(xy => {
          const point = xy.split(",")
          return ({ x: parseInt(point[0]), y: parseInt(point[1]) }) as Point
        });
        return ({ start: line[0], end: line[1] }) as Line
      })
      .filter(l => l.start.x === l.end.x || l.start.y === l.end.y || isDiagonal(l));

    ventCoordinates.forEach(l => {
      if (l.start.x === l.end.x) {
        const start = l.start.y < l.end.y ? l.start.y : l.end.y;
        const end = l.end.y > l.start.y ? l.end.y : l.start.y;

        for (let i = start; i <= end; i++) {
          const point = { x: l.start.x, y: i };
          overlaps.has(point.x + "," + point.y)
            ? overlaps.set(point.x + "," + point.y, overlaps.get(point.x + "," + point.y) + 1)
            : overlaps.set(point.x + "," + point.y, 0);
        }
      }
      if (l.start.y === l.end.y) {
        const start = l.start.x < l.end.x ? l.start.x : l.end.x;
        const end = l.end.x > l.start.x ? l.end.x : l.start.x;

        for (let i = start; i <= end; i++) {
          const point = { x: i, y: l.start.y };
          overlaps.has(point.x + "," + point.y)
            ? overlaps.set(point.x + "," + point.y, overlaps.get(point.x + "," + point.y) + 1)
            : overlaps.set(point.x + "," + point.y, 0);
        }
      } else {
        if (l.start.x < l.end.x && l.start.y < l.end.y) {
          for (let i = 0; i <= l.end.x - l.start.x; i++) {
            const point = { x: l.start.x + i, y: l.start.y + i };
            overlaps.has(point.x + "," + point.y)
              ? overlaps.set(point.x + "," + point.y, overlaps.get(point.x + "," + point.y) + 1)
              : overlaps.set(point.x + "," + point.y, 0);
          }
        }
        if (l.start.x > l.end.x && l.start.y > l.end.y) {
          for (let i = 0; i >= l.end.x - l.start.x; i--) {
            const point = { x: l.start.x + i, y: l.start.y + i };
            overlaps.has(point.x + "," + point.y)
              ? overlaps.set(point.x + "," + point.y, overlaps.get(point.x + "," + point.y) + 1)
              : overlaps.set(point.x + "," + point.y, 0);
          }
        }
        if (l.start.x > l.end.x && l.start.y < l.end.y) {
          for (let i = 0; i <= l.start.x - l.end.x; i++) {
            const point = { x: l.start.x - i, y: l.start.y + i };
            overlaps.has(point.x + "," + point.y)
              ? overlaps.set(point.x + "," + point.y, overlaps.get(point.x + "," + point.y) + 1)
              : overlaps.set(point.x + "," + point.y, 0);
          }
        }
        if (l.start.x < l.end.x && l.start.y > l.end.y) {
          for (let i = 0; i <= l.start.y - l.end.y; i++) {
            const point = { x: l.start.x + i, y: l.start.y - i };
            overlaps.has(point.x + "," + point.y)
              ? overlaps.set(point.x + "," + point.y, overlaps.get(point.x + "," + point.y) + 1)
              : overlaps.set(point.x + "," + point.y, 0);
          }
        }



      }
    });

    const result = Array.from(overlaps.entries()).filter(overlap => overlap[1] > 0);
    console.log("all points " + Array.from(overlaps.entries()).length + " and actual overlaps: " + result.length, result);

    setDialogOpen(false);

  }

  const isDiagonal = (line: Line) => {
    const start = line.start;
    const end = line.end;

    return Math.abs(start.x - end.x) === Math.abs(start.y - end.y)
      ? true
      : false
  }

  return (
    <>
      <Typography align="center" variant="h1" component="div" gutterBottom>
        Hyrdothermal Venture
      </Typography>

      <Typography align="center" variant="h2" component="div" gutterBottom>
        Vent overlap calculator
      </Typography>

      <Typography align="center" variant="h5" component="div">
        Points with overlap : {solution}
      </Typography>

      <Stack spacing={2} padding={4} alignItems={"center"}>
        <Button variant="contained" size={"large"} onClick={() => setDialogOpen(true)}>Import Diagnostic Report</Button>
      </Stack>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Import</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To import a diagnostic report, please enter a list of entries separated by newlines.
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            onChange={(e) => importText = e.target.value}
            id="importDiagnosticReport"
            label="Report entries"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleImport}>Confirm import</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
