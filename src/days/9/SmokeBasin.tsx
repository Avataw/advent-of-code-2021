import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

class Point {
    x: number;
    y: number;
    height: number;
    riskLevel: number;
    inBasin: boolean = false;

    constructor(x: number, y: number, height: number, riskLevel: number) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.riskLevel = riskLevel;
    }
}

class LavaMap {
    inputLines: string[];
    points: Point[] = [];
    Basins: number[] = [];

    constructor(lines: string[]) {
        this.inputLines = lines;
        for (let y = 0; y < lines.length; y++) {
            const line = lines[y];
            for (let x = 0; x < line.length; x++) {

                const height = parseInt(line[x]);

                const riskLevel = this.isLowerThanAroundIt(lines[y - 1], lines[y + 1], lines[y][x - 1], lines[y][x + 1], x, height)
                    ? 1 + height
                    : 0

                const point = new Point(x, y, height, riskLevel);
                this.points.push(point);
            }
        }
    }

    findBasins(): number[] {
        return this.points.map(p => this.findBasinSizeForPoint(p)).filter(b => b != 0)
    }

    private findBasinSizeForPoint(point: Point | undefined): number {
        if (point == undefined) return 0;
        if (point.height == 9 || point.inBasin) return 0;

        const pointAbove = this.points.find(p => p.x === point.x && p.y === point.y - 1);
        const pointDown = this.points.find(p => p.x === point.x && p.y === point.y + 1);
        const pointRight = this.points.find(p => p.x === point.x + 1 && p.y === point.y);
        const pointLeft = this.points.find(p => p.x === point.x - 1 && p.y === point.y);

        point.inBasin = true;

        return [pointAbove, pointDown, pointRight, pointLeft].reduce((sum, current) => sum + this.findBasinSizeForPoint(current), 1);
    }

    private isLowerThanAroundIt(upperRow: string, bottomRow: string, left: string, right: string, currentX: number, height: number): boolean {
        const upHeight = upperRow != undefined ? parseInt(upperRow[currentX]) : Number.MAX_SAFE_INTEGER;
        const downHeight = bottomRow != undefined ? parseInt(bottomRow[currentX]) : Number.MAX_SAFE_INTEGER;
        const leftHeight = left != undefined ? parseInt(left) : Number.MAX_SAFE_INTEGER
        const rightHeight = right != undefined ? parseInt(right) : Number.MAX_SAFE_INTEGER

        return height < upHeight && height < downHeight && height < leftHeight && height < rightHeight
    }
}


export default function SmokeBasin() {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [solution, setSolution] = useState(0);

    let importText = "";

    const handleImport = () => {
        const input = importText.split(/\r?\n/);

        const lavaMap = new LavaMap(input);

        const riskSum = lavaMap.points
            .map(point => point.riskLevel)
            .reduce((sum, current) => sum + current, 0);

        console.log("Solution for A: ", riskSum);

        console.time("testB");
        const sortedBasins = lavaMap.findBasins().sort((a, b) => b - a);
        const result = sortedBasins[0] * sortedBasins[1] * sortedBasins[2]
        console.timeEnd("testB");

        console.log(sortedBasins)
        console.log("Solution for B: ", result);

        setDialogOpen(false);
    }

    return (
        <>
            <Typography align="center" variant="h1" component="div" gutterBottom>
                Smoke Basin
            </Typography>

            <Typography align="center" variant="h2" component="div" gutterBottom>
                Lava danger dodger
            </Typography>

            <Typography align="center" variant="h5" component="div">
                The minimum fuel required is : {solution}!
            </Typography>

            <Stack spacing={2} padding={4} alignItems={"center"}>
                <Button variant="contained" size={"large"} onClick={() => setDialogOpen(true)}>
                    Import horizontal crab positions
                </Button>
            </Stack>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Import</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To import horizontal crab positions, please enter a list of entries separated by commas.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        multiline
                        onChange={(e) => importText = e.target.value}
                        id="importCrabPositions"
                        label="Crab positions"
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


