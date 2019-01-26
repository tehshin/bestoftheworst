import { TruncateTextPipe } from './truncate-text.pipe';

describe('TruncateTextPipe', () => {
    it('create an instance', () => {
        const pipe: TruncateTextPipe = new TruncateTextPipe();
        expect(pipe).toBeTruthy();
    });
});
