import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from 'src/app/services/surveys/survey.service';
import { ROUTERS } from 'src/app/shared/constants/router.const';

@Component({
  selector: 'vt-survey-detail',
  templateUrl: './survey-detail.component.html',
  styleUrls: ['./survey-detail.component.scss']
})
export class SurveyDetailComponent implements OnInit {
  paramId:any;
  dtSurveyForm:any;
  dtQuestion:any
  constructor(private surveyService: SurveyService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.paramId =  this.route.snapshot.params['id'];
    this.surveyService.detail(this.paramId).subscribe((dt:any) => {
      if(dt){
        this.dtSurveyForm = dt;
        this.dtQuestion = dt.listSection;
      }
    })
  }
  onBack(){
    this.router.navigate([`${ROUTERS.SURVEY_MODULE}/${ROUTERS.SURVEY}`])
  }
}
