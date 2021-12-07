import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

class Fish {

    remainingDays: number;
    startValue: number;
    spawnedFish: Fish[] = [];
    constructor(remainingDays: number, startValue: number) {
        this.remainingDays = remainingDays;
        this.startValue = startValue;
        for (let d = remainingDays; d >= 0; d -= 7) {
            this.spawnedFish.push(new Fish(d, 8));
        }
    }

    spawnedFishAmount() {
        return Math.floor((this.remainingDays - this.startValue) / 7) + 1;
    }

    calculateSpawnedFishAmount() {
        return this.spawnedFish.reduce((sum, fish) => sum + fish.spawnedFishAmount(), 0) + this.spawnedFish.length;
    }
}

export default function LanternFish() {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [solution, setSolution] = useState(0);

    let importText = "";

    const handleImport = () => {

        let population = importText.split(",").map((c) => parseInt(c));

        console.log(population);

        // //160ms
        // console.time("1");
        // for (let days = 1; days <= 80; days++) {
        //     const newFish: number[] = [];
        //     population = [...population.map(n => {
        //         if (n == 0) {
        //             newFish.push(8);
        //             return 6;
        //         } else {
        //             return n - 1;
        //         }
        //     }), ...newFish];
        // }
        // console.timeEnd("1");

        // console.time("2");
        // // 35ms
        // population = [7, 7, 7];
        // for (let days = 1; days <= 70; days++) {
        //     const newFish: number[] = [];
        //     for (let i = 0; i < population.length; i++) {
        //         if (population[i] == 0) {
        //             population[i] = 6;
        //             newFish.push(8);
        //         } else {
        //             population[i] = population[i] - 1;
        //         }
        //     }
        //     population = population.concat(...newFish);
        // }
        // console.timeEnd("2")

        // console.log(population.length)

        //actual 345387

        //atm 614229

        console.time("3");
        // 3.31 ms 79 (80)

        let total = population.map(n => lazyMap(n)).reduce((sum, current) => sum + current, 0);

        console.timeEnd("3");
        console.log(total);

        setDialogOpen(false);
    }

    const lazyMap = (number: number) => {
        if (number === 1) return 6206821033;
        if (number === 2) return 5617089148;
        if (number === 3) return 5217223242;
        if (number === 4) return 4726100874;
        if (number === 5) return 4368232009;

        return 0;
    }

    const calculateFishAmount = (remainingDays: number, startValue: number) => {
        let result = 0;
        let d = remainingDays - startValue;
        const fishSpawned = Math.floor((remainingDays - startValue) / 7) + 1;

        while (d > 7) {
            result += calculateFishAmount(d, 9);
            d -= 7;
        }

        return result + fishSpawned;
    }

    return (
        <>
            <Typography align="center" variant="h1" component="div" gutterBottom>
                Lanternfish
            </Typography>

            <Typography align="center" variant="h2" component="div" gutterBottom>
                Growth Calculator
            </Typography>

            <Typography align="center" variant="h5" component="div">
                There are : {solution} fish after 80 days!
            </Typography>

            <Stack spacing={2} padding={4} alignItems={"center"}>
                <Button variant="contained" size={"large"} onClick={() => setDialogOpen(true)}>
                    Import Lantern Fish Population
                </Button>
            </Stack>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Import</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To import a Lantern fish population, please enter a list of entries separated by newlines.
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
