import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CalendarModule } from 'primeng/calendar';
import { BeerService } from '../../../services/beer.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';
import { Beer } from '../../../models/beer';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-new-beer',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, InputTextModule, InputTextareaModule, FloatLabelModule, CalendarModule, ConfirmDialogModule, ToastModule],
  templateUrl: './new-beer.component.html',
  styleUrl: './new-beer.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class NewBeerComponent implements OnInit {
  @ViewChild('knockoutIframe') iframe!: ElementRef;
  constructor(
    private readonly router: Router,
    private readonly beerService: BeerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ){}

  ngOnInit(): void {    
    window.addEventListener('message', this.receiveMessage.bind(this), false);
  }  

  sendMessageToIframe() {
    const iframeWindow = this.iframe.nativeElement.contentWindow;
    const message = { action: 'updateData', data: { key: 'value' } };
    if (iframeWindow) {
      iframeWindow.postMessage(message, '*');
    }
  }

  receiveMessage(event: MessageEvent) {
    if(event.data.status){
      if(event.data.beer){
        this.handleSuccess(event.data.beer);
      }
      else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'There was an error with your request'});
      }
    }
  }

  handleSuccess(beer: Beer){
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Beer added to the database successfully!' });
    this.confirmationService.confirm({
      header: 'Add to collection?',
      message: 'Do you want to add this new beer to your collection ?',
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      accept: () => {
        this.beerService.addToCollection(beer.id);
        this.router.navigate(['/my-collection']);
      },
      reject: () => {
        this.router.navigate(['/']);
      }
    });
  }
}
