import { computed, inject, signal } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { ValidationType, ValidationValidator, ValidationValidators } from "../interfaces/validation-form-group";
import { ObjectArray } from "../types/object-array";

/**
 * Initialize this inside the constructor
 */
export class ValidationFormGroup {
    private readonly formBuilder = inject(FormBuilder);

    private object!: ValidationValidators;
    private keys!: string[];

    public group!: FormGroup;
    public errors = signal<ObjectArray<string, string[]>>({ });
    public get value() { return this.group.value; }

    constructor(object: ValidationValidators) {
        this.keys = Object.keys(object);
        this.object = object;

        const group: ObjectArray<string, [ValidationType, ValidatorFn[]]> = { };
        this.keys.forEach((key: string) => {
            const defaultValue: ValidationType = object[key][0];
            const validators = object[key][1].map((value: ValidationValidator) => value.validator);
            group[key] = [defaultValue, validators];
        });
        
        this.group = this.formBuilder.group(group);
        this.setErrorTemplate();
    }

    public validate() {
        this.setErrorTemplate();
        if (!this.group.invalid)
            return true;

        this.keys.forEach((key: string) => {
            const control = this.group.get(key) as FormControl;
            if (control.invalid) {
                const errors = Object.keys((control.errors ?? { }) as ValidationErrors);
                if (errors.includes("required")) {
                    const validator = this.object[key][1].find(x => x.validator.name == "required");
                    this.logError(key, validator?.message ?? `The ${key} must be filled in.`);
                }

                if (errors.includes("email")) {
                    const validator = this.object[key][1].find(x => x.validator.name == "email");
                    this.logError(key, validator?.message ?? `The ${key} must be an valid email address.`);
                }

                if (errors.includes("pattern")) {
                    const validator = this.object[key][1].find(x => x.validator.name == "pattern" || x.type == "pattern");
                    const pattern = control.errors?.["pattern"]?.requiredPattern ?? "N/A";
                    this.logError(key, validator?.message ?? `The ${key} must follow the pattern (${pattern}).`);
                }

                if (errors.includes("minlength")) {
                    const validator = this.object[key][1].find(x => x.validator.name == "minlength");
                    const length = control.errors?.['minlength']?.requiredLength ?? "N/A";
                    this.logError(key, validator?.message ?? `The ${key} must be at least ${length} characters long.`);
                }
            }
        });

        return false;
    }

    public logError(key: string, error: string = "An unexpected error has occurred.") {
        this.errors.update((value) => ({
            ...value,
            [key]: [...(value[key] ?? []), error]
        }));
    }

    public logLaravelErrors(errors: ObjectArray<string, string[]>) {
        Object.keys(errors).forEach((key: string) => {
          errors[key].forEach((error: string) => {
            this.logError(key, error);
          });
        });
    }

    private setErrorTemplate() {
        const template: ObjectArray<string, string[]> = { };
        this.keys.forEach((key: string) => template[key] = []);
        this.errors.set(template);
    }
}