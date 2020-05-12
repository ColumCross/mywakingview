import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { stringify } from 'querystring';

// Here is the tutorial to get the timelapse to work:
// https://ng-bootstrap.github.io/#/components/carousel/examples

export interface TimeGraphData {
  times: []
}

@Component({
  selector: 'app-time-graph',
  templateUrl: './time-graph.component.html',
  styleUrls: ['./time-graph.component.less']
})
export class TimeGraphComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Hour I Woke Up',
        fontSize: 20,
        fontColor: "white"
      }
    }], 
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Frequency',
        fontSize: 20,
        fontColor: "white"
      }
    }] },
    legend: {
      labels: {
        fontColor: "white"
      }
    }
  }
  
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: TimeGraphData) { 
    var hours = [];
    data.times.forEach(time => {
      
        const parts = String(time).split(":");
        var hour  = parseInt(parts[0]);

        try {
          // If the hour was entered in 12-hour time and is in the afternoon, change it to 24-hour time.
          if(parts[1].split("").reverse()[1] == "p" && hour < 12) hour += 12;
          // If the hour was entered in 12-hour time and is midnight, change it to 0
          if(parts[1].split("").reverse()[1] == "a" && hour == 12) hour = 0;

          // // Change all hours to 12-hour, because it's easy to read
          // if(hour == 0) {
          //   hour = "12am";
          // } else if(hour < 12) {
          //   hour = hour + "am";
          // } else if(hour > 12) {
          //   hour -= 12;
          //   hour = hour + "pm";
          // } else if(hour == 12) {
          //   hour = hour + "pm";
          // }

          if(hours[hour]) {
            hours[hour]++;
          } else {
            hours[hour] = 1;
          }
        } catch(e) {
          // console.log(parts);
        }


    });

    this.barChartLabels = Object.keys(hours);
    this.barChartData = [
      { data: Object.values(hours), label: 'Times I woke up at this hour' }
    ];
    
  }

  ngOnInit(): void {
  }



}
