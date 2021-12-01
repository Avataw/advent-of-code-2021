import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { DepthMeasurement } from "./DepthMeasurement";

interface Depth {
    id: number,
    depth: number,
}

function SonarSweep() {

    const [depths, setDepths] = useState<Depth[]>([{
        id: 0,
        depth: 0,
    }]);

    let importText = ""

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (id: number, newDepth: number) => {
        const index = depths.findIndex(d => d.id === id);
        const newDepths = [...depths];
        newDepths[index].depth = newDepth;
        setDepths(newDepths);
    }

    const handleAddDepth = () => {
        const newDepths = [...depths, { id: depths.length, depth: 0 }]
        setDepths(newDepths);
    }

    const handleImport = () => {

        const importedDepthValues = importText
            .split(/\r?\n/)
            .map((i, index) => ({ id: index, depth: parseInt(i) }));

        setDepths(importedDepthValues)

        handleClose();
    }

    const calculateHigherThanPreviousCount = () => depths
        .filter((d, index) => index > 0 && d.depth > depths[index - 1].depth)
        .length


    const calculateThreeMeasurementCount = () => {

        const threeMeasurementDepths: number[] = [];

        depths.forEach((d, index) => {
            if (index < depths.length - 2) {
                threeMeasurementDepths.push(d.depth + depths[index + 1].depth + depths[index + 2].depth)
            }
        });

        return threeMeasurementDepths
            .filter((d, index) => index > 0 && d > threeMeasurementDepths[index - 1])
            .length
    }

    return (
        <div>
            <Typography align="center" variant="h1" component="div" gutterBottom>
                Sonar Sweep
            </Typography>

            <Typography align="center" variant="h2" component="div">
                Depth measurement Tool
            </Typography>

            <Stack spacing={2} padding={4} alignItems={"center"}>
                {depths.map((d, index) => <DepthMeasurement id={index} startValue={d.depth}
                    previousDepthMeasurementValue={index > 0 ? depths[index - 1].depth : null}
                    depthMeasurementUpdated={handleChange}
                />)}
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={handleClickOpen}>Import Depths</Button>
                    <Button variant="contained" onClick={handleAddDepth}>Add new depth</Button>
                </Stack>
            </Stack>

            <Typography align="center" variant="h5" component="div">
                Higher measurement count: {calculateHigherThanPreviousCount()}
            </Typography>

            <Typography align="center" variant="h5" component="div">
                Higher measurement in three measurement count: {calculateThreeMeasurementCount()}
            </Typography>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Import</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To import multiple depths, please enter a list of depths separated by newlines.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        multiline
                        onChange={(e) => importText = e.target.value}
                        id="importDepths"
                        label="Depths to import"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleImport}>Confirm import</Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default SonarSweep
