import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function TreacherousWhale() {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [solution, setSolution] = useState(0);

    let importText = "";

    const handleImport = () => {

        const crabPositions = importText
            .split(",").map((c) => parseInt(c))
            .sort((a, b) => a - b);

        let globalMinimum = Number.MAX_SAFE_INTEGER;

        for (let i = crabPositions[0]; i < crabPositions[crabPositions.length - 1]; i++) {
            const fuelSum = crabPositions.reduce((sum, pos) => sum + getGaussSum(Math.abs(pos - i)), 0);
            if (fuelSum < globalMinimum) globalMinimum = fuelSum;
        }
        setSolution(globalMinimum);

        setDialogOpen(false);
    }

    const getGaussSum = (number: number): number => (Math.pow(number, 2) + number) / 2;

    return (
        <>
            <Typography align="center" variant="h1" component="div" gutterBottom>
                Treacherous Whale
            </Typography>

            <Typography align="center" variant="h2" component="div" gutterBottom>
                Fuel Calculator
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
