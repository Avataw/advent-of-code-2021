import { CollectionsBookmarkOutlined } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";


class BingoBoard {
    rows: number[][];
    columns: number[][] = [[], [], [], [], []];
    finished: boolean = false;

    constructor(rows: number[][]) {
        this.rows = rows;

        this.rows.forEach(r => {
            r.forEach((n, index) => {
                this.columns[index].push(n);
            });
        })
    }

    markNumber(number: number) {
        if (this.finished) return;

        this.rows = this.rows.map(r => r.filter(n => n !== number));
        this.columns = this.columns.map(c => c.filter(n => n !== number));

        if (this.rows.some(r => r.length === 0) || this.columns.some(c => c.length === 0)) {
            const rowSum = this.rows.map(r => r.reduce((sum, current) => sum + current, 0)).reduce((sum, current) => sum + current, 0);

            console.log("BINGO!" + rowSum * number, this);
            this.finished = true;
            return rowSum * number;
        }
    }



}



export default function GiantSquid() {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [solution, setSolution] = useState(0);

    let importText = "";

    const handleImport = () => {

        const splittedImportText = importText.split(/\r?\n/);

        const bingoInput = splittedImportText[0];
        const bingoBoards: BingoBoard[] = [];

        let rows: number[][] = [];

        for (let i = 2; i < splittedImportText.length; i++) {

            if (splittedImportText[i] !== "") {
                const row = splittedImportText[i]
                    .split(" ")
                    .map(c => parseInt(c))
                    .filter(n => isNaN(n) === false);

                rows.push(row)
            } else {
                const newBingoBoard = new BingoBoard(rows);
                bingoBoards.push(newBingoBoard);
                rows = [];
            }
        }

        const bingoInputNumbers = bingoInput.split(",");

        for (let bingoInputNumber of bingoInputNumbers) {
            for (let bingoBoard of bingoBoards) {
                const result = bingoBoard.markNumber(parseInt(bingoInputNumber));
                if (result != null) {
                    setSolution(result);
                }
            }
        }

        setDialogOpen(false);

    }

    return (
        <>
            <Typography align="center" variant="h1" component="div" gutterBottom>
                GiantSquid
            </Typography>

            <Typography align="center" variant="h2" component="div" gutterBottom>
                Bingo Game Calculator
            </Typography>

            <Typography align="center" variant="h5" component="div">
                First board wins with : {solution}
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
