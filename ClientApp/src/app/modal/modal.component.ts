import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { trigger, transition, query, style, animate, animateChild } from '@angular/animations';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    animations: [
        trigger('showModalBackground', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('150ms ease', style({ opacity: 1 })),
                query('@showModal', animateChild())
            ]),
            transition(':leave', [
                query('@showModal', animateChild()),
                style({ opacity: 1 }),
                animate('300ms ease', style({ opacity: 0 }))
            ])
        ]),
        trigger('showModal', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(.7)' }),
                animate('300ms ease', style({ opacity: 1, transform: 'scale(1)' }))
            ]),
            transition(':leave', [
                style({ opacity: 1, transform: 'scale(1)' }),
                animate('300ms ease', style({ opacity: 0, transform: 'scale(.7)' }))
            ])
        ])
    ]
})
export class ModalComponent implements OnInit {

    @Input() title: string = '';
    @Input() showDialog: boolean = false;

    @Output() modalClosed: EventEmitter<any> = new EventEmitter();

    faTimes: object = faTimes;

    constructor() { }

    ngOnInit(): void {
    }

    close(): void {
        this.modalClosed.emit();
    }

}
