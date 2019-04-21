import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HttpService } from "./http.service";

@NgModule({
  imports: [CommonModule],
  exports: [HttpService]
})
export class CoreModule {}
