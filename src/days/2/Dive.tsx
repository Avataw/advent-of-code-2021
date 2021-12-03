import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, TextField, Typography } from "@mui/material";
import { useState } from "react";

enum Direction {
    FORWARD,
    UP,
    DOWN,
    NONE
}

interface DivePosition {
    horizontal: number,
    depth: number,
    aim: number
}

interface Update {
    direction: Direction,
    amount: number
}

export default function Dive() {

    const [divePosition, setDivePosition] = useState<DivePosition>({ horizontal: 0, depth: 0, aim: 0 })
    const [positionUpdate, setPositionUpdate] = useState(0);
    const [direction, setDirection] = useState<Direction>(Direction.FORWARD);
    const [snackOpen, setSnackOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    let importText = "";

    const handleSubmit = () => {

        setDivePosition(updatePosition(divePosition, { direction: direction, amount: positionUpdate }));
        setPositionUpdate(0);
        setSnackOpen(true);
    }

    const parseToDirection = (s: string) => {
        switch (s) {
            case "forward": return Direction.FORWARD;
            case "down": return Direction.DOWN;
            case "up": return Direction.UP;
            default: return Direction.DOWN;
        }
    }

    const handleImport = () => {
        const updateDivePosition = importText
            .split(/\r?\n/)
            .map(s => {
                const directionAndAmount = s.split(" ");
                return {
                    direction: parseToDirection(directionAndAmount[0]),
                    amount: parseInt(directionAndAmount[1])
                }
            }).reduce((finalPosition, currentUpdate) => updatePosition(finalPosition, currentUpdate), divePosition);

        setDivePosition(updateDivePosition);
        setDialogOpen(false);
    }

    const updatePosition = (previousPosition: DivePosition, update: Update) => {
        console.log(update)
        switch (update.direction) {
            case Direction.FORWARD:
                return ({
                    horizontal: previousPosition.horizontal + update.amount,
                    depth: previousPosition.depth + previousPosition.aim * update.amount,
                    aim: previousPosition.aim
                });
            case Direction.UP:
                return ({
                    horizontal: previousPosition.horizontal,
                    depth: previousPosition.depth,
                    aim: previousPosition.aim - update.amount
                });
            case Direction.DOWN:
                return ({
                    horizontal: previousPosition.horizontal,
                    depth: previousPosition.depth,
                    aim: previousPosition.aim + update.amount
                });
            default: return previousPosition
        }
    }

    return (
        <>
            <Typography align="center" variant="h1" component="div" gutterBottom>
                Dive
            </Typography>

            <Typography align="center" variant="h2" component="div" gutterBottom>
                Position Tracker

            </Typography>

            <Typography align="center" variant="h5" component="div">
                Current Horizontal Position : {divePosition.horizontal}
            </Typography>

            <Typography align="center" variant="h5" component="div">
                Current Depth : {divePosition.depth}
            </Typography>

            <Typography align="center" variant="h5" component="div">
                Current Aim : {divePosition.aim}
            </Typography>

            <Typography align="center" variant="h5" component="div">
                Useful Multiplication : {divePosition.horizontal * divePosition.depth}
            </Typography>




            <Grid container spacing={2} padding={6}
                justifyContent="center"
                alignItems="center">
                <Grid item>
                    <FormControl>
                        <TextField
                            id="positionUpdate"
                            label="Position Update"
                            type="number"
                            value={positionUpdate}
                            onChange={(e) => setPositionUpdate(parseInt(e.target.value))}
                        />
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl sx={{ minWidth: "10rem" }}>
                        <InputLabel id="direction-label">Direction</InputLabel>
                        <Select
                            labelId="direction-label"
                            id="direction-select"
                            value={direction}
                            label="Direction"
                            onChange={(e) => setDirection(e.target.value as Direction)}
                        >
                            <MenuItem value={Direction.FORWARD}>Forward</MenuItem>
                            <MenuItem value={Direction.UP}>Up</MenuItem>
                            <MenuItem value={Direction.DOWN}>Down</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Button variant={"contained"} onClick={handleSubmit}>
                        Submit
                    </Button>
                </Grid>

                <Grid item>
                    <Button variant="contained" onClick={() => setDialogOpen(true)}>Import</Button>
                </Grid>
            </Grid>

            <Snackbar open={snackOpen} autoHideDuration={6000} onClose={() => setSnackOpen(false)}>
                <Alert onClose={() => setSnackOpen(false)} severity="success" sx={{ width: '100%' }}>
                    Position update was successfully tracked!
                </Alert>
            </Snackbar>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Import</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To import multiple position updates, please enter a list of updates separated by newlines.
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
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleImport}>Confirm import</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

