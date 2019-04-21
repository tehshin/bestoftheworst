import { async, TestBed } from "@angular/core/testing";
import { MoviedbModule } from "./moviedb.module";

describe("MoviedbModule", () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MoviedbModule]
        }).compileComponents();
    }));

    it("should create", () => {
        expect(MoviedbModule).toBeDefined();
    });
});
