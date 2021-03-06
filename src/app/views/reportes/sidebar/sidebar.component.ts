import {Component, OnInit, ViewChild} from '@angular/core';
import {IListado} from '../../../models/listareportes.interface';
import {ReporteService} from '../../../services/reportes/reporte.service';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import {MatDialog, MatSidenav} from '@angular/material';
import {Subscription} from 'rxjs/Subscription';
import {MailComposeComponent} from '../../app-inbox/mail-compose.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {IReportes} from '../../../models/campos.interfaces';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [ReporteService]
})
export class SidebarComponent implements OnInit {
  reportes: IListado[];
  filters: IReportes[];
  isMobile;
  isSidenavOpen: Boolean = true;
  @ViewChild(MatSidenav) private sideNave: MatSidenav;
  screenSizeWatcher: Subscription;
  selectToggleFlag = false;
  reporteSelected: IListado;
  FiltersForm: FormGroup;

  constructor(private reporteService: ReporteService,
              private media: ObservableMedia,
              public composeDialog: MatDialog) {

  }

  ngOnInit() {
    this.SideNavInit();

    this.reporteService.getListado().subscribe((data) => {
      this.reportes = data;
    });


    this.FiltersForm = new FormGroup({
      search: new FormControl('', [
        Validators.minLength(4),
        Validators.maxLength(9)
      ])
    });

  }

  openComposeDialog() {
    const dialogRef = this.composeDialog.open(MailComposeComponent);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  selectToggleAll() {
    this.selectToggleFlag = !this.selectToggleFlag;
  }

  updateSidenav() {
    const self = this;
    setTimeout(() => {
      self.isSidenavOpen = !self.isMobile;
      self.sideNave.mode = self.isMobile ? 'over' : 'side';
    });
  }

  SideNavInit() {
    this.isMobile = this.media.isActive('xs') || this.media.isActive('sm');
    this.updateSidenav();
    this.screenSizeWatcher = this.media.subscribe((change: MediaChange) => {
      this.isMobile = (change.mqAlias == 'xs') || (change.mqAlias == 'sm');
      this.updateSidenav();
    });
  }

  listItemActive(val) {
    this.reporteService.getListadoProperties(val.id).subscribe((data) => {
      this.filters = data;
      console.log(this.filters);
    });
  }

}
