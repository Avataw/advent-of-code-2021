import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import BlockIcon from '@mui/icons-material/Block';
import { Stack, TextField } from "@mui/material";
import { useState } from "react";

interface DepthMeasurementProps {
    id: number,
    startValue: number,
    previousDepthMeasurementValue: number | null,
    depthMeasurementUpdated: (id: number, newDepth: number) => void
}

export const DepthMeasurement = ({ id, startValue, previousDepthMeasurementValue, depthMeasurementUpdated }: DepthMeasurementProps) => {

    const [value, setValue] = useState<number>(startValue);

    const handleValueChanged = (newValue: number) => {
        setValue(newValue);
        depthMeasurementUpdated(id, newValue);
    }

    return (
        <Stack direction="row" spacing={2} alignItems="center">
            <TextField
                label={"Depth Nº " + id}
                type="number"
                variant="filled"
                value={value}
                onChange={(e) => handleValueChanged(parseInt(e.target.value))}
            />
            <DepthMeasurementIcon value={value} previousValue={previousDepthMeasurementValue} />
        </Stack>
    )
}

interface DepthMeasurementIconProps {
    value: number,
    previousValue: number | null
}
const DepthMeasurementIcon = ({ value, previousValue }: DepthMeasurementIconProps) => {

    if (previousValue == null || value == previousValue) return <BlockIcon fontSize="large" />;

    return value > previousValue
        ? <ArrowCircleUpIcon fontSize="large" color="success" />
        : <ArrowCircleDownIcon fontSize="large" color="error" />

}