import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncatetext'
})
export class TruncateTextPipe implements PipeTransform {

    transform(value: string, length: number): string {
        const biggestWord: number = 50;
        const elipses: string = '...';

        if (typeof value === 'undefined') return value;
        if (value.length <= length) return value;

        let truncatedText: string = value.slice(0, length + biggestWord);

        while (truncatedText.length > length - elipses.length) {
            const lastSpace: number = truncatedText.lastIndexOf(' ');
            if (lastSpace === -1) break;
            truncatedText = truncatedText.slice(0, lastSpace).replace(/[!,.?;:]$/, '');
        }

        return truncatedText + elipses;
    }

}
