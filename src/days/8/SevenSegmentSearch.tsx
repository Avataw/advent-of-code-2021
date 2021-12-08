import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

/*
0 = a,b,c,e,f,g     -> = 6
1 = c,f             -> = 2 *
2 = a,c,d,e,g       -> = 5
3 = a,c,d,f,g       -> = 5
4 = b,c,d,f         -> = 4 *
5 = a,b,d,f,g       -> = 5
6 = a,b,d,e,f,g     -> = 6
7 = a,c,f           -> = 3 *
8 = a,b,c,d,e,f,g   -> = 7 *
9 = a,b,c,d,f,g     -> = 6

*/

interface Signal {
    signalPatterns: string[];
    digitOutput: string[];
}

class SignalEntry implements Signal {
    signalPatterns: string[];
    digitOutput: string[];
    private randomizedSignalMapping: Map<number, string> = new Map();
    private letterMappings: Map<string, string> = new Map();

    constructor(signalPatterns: string[], digitOutput: string[]) {
        this.signalPatterns = signalPatterns;
        this.digitOutput = digitOutput;

        this.signalPatterns.forEach(s => {
            if (s.length === 2) this.randomizedSignalMapping.set(1, s);
            if (s.length === 3) this.randomizedSignalMapping.set(7, s);
            if (s.length === 4) this.randomizedSignalMapping.set(4, s);
            if (s.length === 7) this.randomizedSignalMapping.set(8, s);
        });


        const sevenAsString = this.randomizedSignalMapping.get(7);
        this.signalPatterns.forEach(s => {
            if (s.length === 5) {
                if (this.findDifferences(sevenAsString, s).length === 2) {
                    this.randomizedSignalMapping.set(3, s);
                }
            }
        });
    }

    findDifferences(smaller: string | undefined, larger: string | undefined) {
        if (smaller == null || larger == null) return [];

        const filterString = smaller.split("");
        return larger.split("").filter(s => !filterString.includes(s));
    }

    findOverlap(smaller: string | undefined, larger: string | undefined) {
        if (smaller == null || larger == null) return [];

        const filterString = smaller.split("");
        return larger.split("").filter(s => filterString.includes(s));
    }

    calculateDigitMapping() {

        const a = this.findDifferences(
            this.randomizedSignalMapping.get(1),
            this.randomizedSignalMapping.get(7)
        )[0]

        this.letterMappings.set(a, "a");


        const d = this.findDifferences(
            this.randomizedSignalMapping.get(1),
            this.findOverlap(
                this.randomizedSignalMapping.get(4),
                this.randomizedSignalMapping.get(3)
            ).join("")
        )[0];

        this.letterMappings.set(d, "d");


        const b = this.findDifferences(
            this.randomizedSignalMapping.get(1),
            this.randomizedSignalMapping.get(4)
        ).filter(letter => letter !== d)[0];

        this.letterMappings.set(b, "b");


        const g = this.findDifferences(
            this.randomizedSignalMapping.get(4),
            this.randomizedSignalMapping.get(3)
        ).filter(letter => letter !== a)[0];

        this.letterMappings.set(g, "g");

        this.signalPatterns.forEach(s => {
            if (s.length === 5) {
                if (s !== this.randomizedSignalMapping.get(3) && !s.includes(b)) {
                    this.randomizedSignalMapping.set(2, s);
                }
            }
        });

        const e = this.findDifferences(
            this.randomizedSignalMapping.get(3),
            this.randomizedSignalMapping.get(2)
        )[0];

        this.letterMappings.set(e, "e");


        const f = this.findDifferences(
            this.randomizedSignalMapping.get(2),
            this.randomizedSignalMapping.get(3)
        )[0];

        this.letterMappings.set(f, "f");


        const c = this.randomizedSignalMapping.get(1)!!
            .split("")
            .filter(letter => letter !== f)[0];

        this.letterMappings.set(c, "c");

        return parseInt(
            this.digitOutput
                .map(digit => this.mapRandomizedDigitToActualDigit(digit))
                .join("")
        );
    }

    mapRandomizedDigitToActualDigit(randomizedDigit: string): number {

        const digits = randomizedDigit
            .split("")
            .map(letter => this.letterMappings.get(letter))
            .sort()
            .join("")!!;


        switch (digits) {
            case "abcefg": return 0;
            case "cf": return 1;
            case "acdeg": return 2;
            case "acdfg": return 3;
            case "bcdf": return 4;
            case "abdfg": return 5;
            case "abdefg": return 6;
            case "acf": return 7;
            case "abcdefg": return 8;
            case "abcdfg": return 9;
            default: return -1;
        }
    }
}

export default function SevenSegmentSearch() {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [solution, setSolution] = useState(0);

    let importText = "";

    const handleImportForOne = () => {
        const input = importText.split(/\r?\n/).flatMap(line => line.split(" | ")).map(line => line.split(" "));
        let entries: Signal[] = [];

        for (let i = 0; i < input.length - 1; i += 2) {
            entries.push({
                signalPatterns: input[i],
                digitOutput: input[i + 1]
            })
        }

        const oneFourSevenAndEightCount = entries.reduce((sum, current) => {
            return sum + current.digitOutput.filter(digit => digit.length === 2 || digit.length === 4 || digit.length === 3 || digit.length === 7).length
        }, 0);

        console.log(oneFourSevenAndEightCount);

        setDialogOpen(false);
    }

    const handleImport = () => {
        const input = importText.split(/\r?\n/).flatMap(line => line.split(" | ")).map(line => line.split(" "));
        let entries: SignalEntry[] = [];

        for (let i = 0; i < input.length - 1; i += 2) {
            entries.push(new SignalEntry(input[i], input[i + 1]));
        }

        console.time("test");
        const result = entries
            .map(entry => entry.calculateDigitMapping())
            .reduce((sum, current) => sum + current, 0);

        console.timeEnd("test")
        console.log(result);

        setDialogOpen(false);
    }

    return (
        <>
            <Typography align="center" variant="h1" component="div" gutterBottom>
                Seven Segment Search
            </Typography>

            <Typography align="center" variant="h2" component="div" gutterBottom>
                Digit Solver
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


