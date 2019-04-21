import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MovieService } from "./movie.service";
import { CoreModule } from "@botw/core";

@NgModule({
    imports: [
        CommonModule,
        CoreModule
    ],
    exports: [MovieService]
})
export class MoviedbModule {}
