import { Component, input } from "@angular/core";

@Component({
  selector: "validation-formgroup-error",
  standalone: true,
  imports: [],
  templateUrl: "./validation-formgroup-error.html",
})
export class ValidationFormgroupError {
  errors = input.required<string[]>();
}
