import React from 'react';
import './InfoBox.css'
import { Card, CardContent, Typography } from "@mui/material";

function InfoBox({ title, cases, active, isRed, isBlack, total, ...props}) {
  return (
    <Card onClick={props.onClick} className={`infoBox ${active ? 'infoBox-selected' : ""} ${isRed ? 'infoBox-red' : ""} ${isBlack ? 'infoBox-black' : ""}`}>
        <CardContent>

          {/* Title */}
            <Typography className="infoBox_title" color="textSecondary">{title}</Typography>

          {/* Number of cases */}
          <h2 className={`infoBox_cases ${!isRed ? 'infoBox_cases-green' : ""} ${isBlack ? 'infoBox_cases-black' : ""}`}>{cases}</h2>

          {/* Total */}
          <Typography className="infoBox_total" color="textSecondary">{total} Total</Typography>

        </CardContent>
    </Card>
  );
}

export default InfoBox;
