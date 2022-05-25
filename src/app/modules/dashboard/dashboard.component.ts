import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/shared/dialogs/dialog.service';

@Component({
  selector: 'vt-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
  }

  onClickMe() {
    this.dialogService.openDialogConfirm()
  }
}
