import { Button, Dialog, Stack, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography, duration } from "@mui/material";
import { useState } from "react";

export default function BinaryDiagnostic() {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [gamma, setGamma] = useState(0);
    const [epsilon, setEpsilon] = useState(0);
    const [oxygen, setOxygen] = useState(0);
    const [co2, setCo2] = useState(0);

    let importText = "";

    const handleImport = () => {
        const digits: number[][] = [];


        const splittedImportText = importText.split(/\r?\n/);

        while (digits.length < splittedImportText[0].length) {
            digits.push([])
        }

        splittedImportText.forEach(binary => binary.split("")
            .forEach((digit, index) => digits[index].push(parseInt(digit))
            )
        );

        const binaryString = mapToHighestOccurence(digits);

        let oxygenDigits: string[] = splittedImportText;
        let co2scrubberDigits: string[] = splittedImportText;

        for (let i = 0; i < binaryString.length; i++) {

            if (oxygenDigits.length !== 1) {
                const highestOccurenceByIndex = mapToHighestOccurenceByPosition(oxygenDigits, i);
                oxygenDigits = oxygenDigits.filter(d => d[i] === highestOccurenceByIndex.toString());
            }

            if (co2scrubberDigits.length !== 1) {
                const highestOccurenceByIndex = mapToHighestOccurenceByPosition(co2scrubberDigits, i);
                co2scrubberDigits = co2scrubberDigits.filter(d => d[i] !== highestOccurenceByIndex.toString())

            }
        }

        const gammaDecimal = parseInt(binaryString.join(""), 2)
        setGamma(gammaDecimal);

        const epsilonDecimal = parseInt(binaryString.map(d => d === 0 ? 1 : 0).join(""), 2);
        setEpsilon(epsilonDecimal);

        setOxygen(parseInt(oxygenDigits[0], 2))
        setCo2(parseInt(co2scrubberDigits[0], 2))

        setDialogOpen(false);

    }

    const mapToHighestOccurence = (digits: number[][]) => digits
        .flatMap(digitList =>
            digitList.filter(d => d === 1).length >= digitList.filter(d => d === 0).length
                ? 1
                : 0
        )

    const mapToHighestOccurenceByPosition = (digits: string[], index: number) => {
        console.log("index: " + index, digits);
        const digitsForIndex = digits
            .flatMap(d => parseInt(d.split("")[index]));

        console.log(digitsForIndex);

        return digitsForIndex.filter(d => d === 1).length >= digitsForIndex.filter(d => d === 0).length
            ? 1
            : 0
    }

    return (
        <>
            <Typography align="center" variant="h1" component="div" gutterBottom>
                Binary Diagnostic
            </Typography>

            <Typography align="center" variant="h2" component="div" gutterBottom>
                Gamma and epsilon rate calculator
            </Typography>

            <Typography align="center" variant="h5" component="div">
                Current gamma rate : {gamma}
            </Typography>

            <Typography align="center" variant="h5" component="div">
                Current epsilon rate : {epsilon}
            </Typography>

            <Typography align="center" variant="h5" component="div">
                Totally useful multiplication : {epsilon * gamma}
            </Typography>


            <Typography align="center" variant="h5" component="div">
                Current oxygen rate : {oxygen}
            </Typography>

            <Typography align="center" variant="h5" component="div">
                Current co2 rate : {co2}
            </Typography>

            <Typography align="center" variant="h5" component="div">
                Totally useful multiplication numero dos : {oxygen * co2}
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
