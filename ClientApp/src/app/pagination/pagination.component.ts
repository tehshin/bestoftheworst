import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { PageInfo } from '../models/page-info';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {

    @Input() page: number = 1;
    @Input() totalPages: number = 1;

    @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();

    pages: PageInfo[];

    faAngleLeft: object = faAngleLeft;
    faAngleRight: object = faAngleRight;

    constructor() { }

    ngOnChanges(): void {
        this.generatePages(this.page);
    }

    generatePages(page: number): void {
        if (!page) page = 1;

        let prevPage: number = page - 1;
        let nextPage: number = page + 1;

        if (prevPage < 1) prevPage = 1;
        if (nextPage > this.totalPages) nextPage = this.totalPages ? this.totalPages : 1;

        this.pages = [];

        this.pages.push(new PageInfo({
            text: '1',
            pageIndex: 1
        }));

        if (prevPage >= 3) {
            this.pages.push(new PageInfo({
                text: '...',
                clickable: false
            }));
        }

        if (prevPage < page && prevPage > 1) {
            this.pages.push(new PageInfo({
                text: prevPage.toString(),
                pageIndex: prevPage
            }));
        }

        if (this.page !== 1 && this.page !== this.totalPages) {
            this.pages.push(new PageInfo({
                text: page.toString(),
                pageIndex: page
            }));
        }

        if (nextPage < this.totalPages) {
            this.pages.push(new PageInfo({
                text: nextPage.toString(),
                pageIndex: nextPage
            }));
        }

        if (nextPage < (this.totalPages - 1)) {
            this.pages.push(new PageInfo({
                text: '...',
                clickable: false
            }));
        }

        if (this.totalPages > 1) {
            this.pages.push(new PageInfo({
                text: this.totalPages ? this.totalPages.toString() : '1',
                pageIndex: this.totalPages
            }));
        }
    }

    changePage(page: number): void {
        this.generatePages(page);
        this.pageChanged.emit(page);
    }

    hasPrevious(): boolean {
        return this.page > 1;
    }

    hasNext(): boolean {
        return this.page < this.totalPages;
    }

    isCurrentPage(page: number): boolean {
        return this.page === page;
    }

    goToPrevious(): void {
        this.changePage(this.page - 1);
    }

    goToNext(): void {
        this.changePage(this.page + 1);
    }
}
